// Unified Glitch-Free Multilingual TTS Playback Service for AGRITECH
// Handles Cloud HD TTS (/api/tts with verified audio/mpeg MIME check) and strict language-matched Browser SpeechSynthesis fallback.

import { LanguageCode } from '../types';
import { LanguageInfo } from '../i18n/languageConfig';

const LANGUAGE_NAME_ALIASES: Record<LanguageCode, string[]> = {
  en: ['english', 'india', 'en-in', 'en-us', 'en-gb'],
  kn: ['kannada', 'ಕನ್ನಡ', 'kn-in'],
  hi: ['hindi', 'हिन्दी', 'हिंदी', 'hi-in'],
  te: ['telugu', 'తెలుగు', 'te-in'],
  ta: ['tamil', 'தமிழ்', 'ta-in'],
  ml: ['malayalam', 'മലയാളം', 'ml-in'],
  mr: ['marathi', 'मराठी', 'mr-in'],
  bn: ['bengali', 'bangla', 'বাংলা', 'bn-in', 'bn-bd'],
};

export function cleanTextForSpeech(text: string): string {
  return text
    .replace(/[*#_`~[\]()]/g, '')
    .replace(/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isVoiceMatchingLanguage(voice: SpeechSynthesisVoice, langConfig: LanguageInfo): boolean {
  const vLang = (voice.lang || '').toLowerCase().replace('_', '-');
  const vName = (voice.name || '').toLowerCase();
  const targetShort = langConfig.code.toLowerCase();
  const targetSpeech = langConfig.speechCode.toLowerCase();

  if (vLang === targetSpeech || vLang === targetShort || vLang.startsWith(`${targetShort}-`)) {
    return true;
  }

  const aliases = LANGUAGE_NAME_ALIASES[langConfig.code] || [langConfig.label.toLowerCase()];
  return aliases.some((alias) => vName.includes(alias));
}

export function findBestBrowserVoice(
  voices: SpeechSynthesisVoice[],
  langConfig: LanguageInfo,
  preferredVoiceURI?: string
): SpeechSynthesisVoice | undefined {
  if (!voices || voices.length === 0) return undefined;

  // Only honor preferredVoiceURI if it ACTUALLY matches the target language
  if (preferredVoiceURI) {
    const preferred = voices.find((v) => v.voiceURI === preferredVoiceURI);
    if (preferred && isVoiceMatchingLanguage(preferred, langConfig)) {
      return preferred;
    }
  }

  const targetSpeech = langConfig.speechCode.toLowerCase();
  const targetShort = langConfig.code.toLowerCase();

  // Prefer Google / Microsoft / Natural native voices matching exact speechCode first
  const matching = voices.filter((v) => isVoiceMatchingLanguage(v, langConfig));
  if (matching.length === 0) return undefined;

  return (
    matching.find((v) => v.lang.toLowerCase().replace('_', '-') === targetSpeech && v.name.toLowerCase().includes('google')) ||
    matching.find((v) => v.lang.toLowerCase().replace('_', '-') === targetSpeech) ||
    matching.find((v) => v.lang.toLowerCase().replace('_', '-').startsWith(`${targetShort}-`)) ||
    matching[0]
  );
}

function splitSpeechChunks(text: string, maxLen = 160): string[] {
  const clean = cleanTextForSpeech(text);
  if (!clean) return [];

  const sentenceRegex = /[^.!?।|\n]+[.!?।|\n]*/g;
  const sentences = clean.match(sentenceRegex) || [clean];
  const chunks: string[] = [];
  let current = '';

  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    if ((current + ' ' + trimmed).trim().length <= maxLen) {
      current = (current + ' ' + trimmed).trim();
    } else {
      if (current) chunks.push(current);
      if (trimmed.length > maxLen) {
        const words = trimmed.split(/\s+/);
        let sub = '';
        for (const w of words) {
          if ((sub + ' ' + w).trim().length <= maxLen) {
            sub = (sub + ' ' + w).trim();
          } else {
            if (sub) chunks.push(sub);
            sub = w;
          }
        }
        current = sub;
      } else {
        current = trimmed;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks.length > 0 ? chunks : [clean];
}

export interface SpeakOptions {
  text: string;
  langConfig: LanguageInfo;
  voiceEngine?: 'cloud' | 'browser';
  speechSpeed?: number;
  preferredVoiceURI?: string;
  audioElement?: HTMLAudioElement | null;
  onStart?: () => void;
  onEnd?: () => void;
}

class MultilingualTtsController {
  private sessionId = 0;
  private abortController: AbortController | null = null;
  private activeObjectUrl: string | null = null;
  private activeAudio: HTMLAudioElement | null = null;
  private cancelPendingPlay: (() => void) | null = null;

  public isSpeaking(): boolean {
    const audioPlaying = Boolean(this.activeAudio && !this.activeAudio.paused && !this.activeAudio.ended);
    const synthPlaying =
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      Boolean(window.speechSynthesis.speaking || window.speechSynthesis.pending);
    return audioPlaying || synthPlaying;
  }

  public stop(): void {
    this.sessionId += 1;

    if (this.abortController) {
      try {
        this.abortController.abort();
      } catch {
        // ignore
      }
      this.abortController = null;
    }

    if (this.cancelPendingPlay) {
      const resolvePending = this.cancelPendingPlay;
      this.cancelPendingPlay = null;
      resolvePending();
    }

    if (this.activeAudio) {
      this.activeAudio.onplay = null;
      this.activeAudio.onended = null;
      this.activeAudio.onerror = null;
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.activeAudio = null;
    }

    if (this.activeObjectUrl) {
      try {
        URL.revokeObjectURL(this.activeObjectUrl);
      } catch {
        // ignore
      }
      this.activeObjectUrl = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }

  public async speak(options: SpeakOptions): Promise<void> {
    const {
      text,
      langConfig,
      voiceEngine = 'cloud',
      speechSpeed = 1.0,
      preferredVoiceURI,
      audioElement,
      onStart,
      onEnd,
    } = options;

    this.stop();
    const mySessionId = this.sessionId;
    const cleaned = cleanTextForSpeech(text);

    if (!cleaned) {
      onEnd?.();
      return;
    }

    onStart?.();

    if (voiceEngine === 'cloud') {
      const playedCloud = await this.playCloudTts(
        cleaned,
        langConfig,
        speechSpeed,
        mySessionId,
        audioElement,
        onEnd
      );
      if (playedCloud || mySessionId !== this.sessionId) {
        return;
      }
    }

    // Fallback to strictly language-verified browser SpeechSynthesis
    this.playBrowserSynthesis(cleaned, langConfig, speechSpeed, preferredVoiceURI, mySessionId, onEnd);
  }

  private async playCloudTts(
    cleaned: string,
    langConfig: LanguageInfo,
    speechSpeed: number,
    mySessionId: number,
    providedAudio?: HTMLAudioElement | null,
    onEnd?: () => void
  ): Promise<boolean> {
    const controller = new AbortController();
    this.abortController = controller;

    // Timeout guard for slow networks so fallback or retry isn't stuck
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const ttsUrl = `/api/tts?text=${encodeURIComponent(cleaned)}&lang=${encodeURIComponent(langConfig.code)}`;
      const response = await fetch(ttsUrl, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (mySessionId !== this.sessionId) return true;

      if (!response.ok) {
        return false;
      }

      const contentType = (response.headers.get('content-type') || '').toLowerCase();
      // Crucial check: reject HTML rewrites (e.g., index.html) returned on static hosts
      if (!contentType.includes('audio') && !contentType.includes('octet-stream')) {
        return false;
      }

      const blob = await response.blob();
      if (mySessionId !== this.sessionId) return true;
      if (blob.size < 64) {
        return false;
      }

      const objectUrl = URL.createObjectURL(blob);
      this.activeObjectUrl = objectUrl;

      const audio = providedAudio || new Audio();
      this.activeAudio = audio;

      return await new Promise<boolean>((resolve) => {
        if (mySessionId !== this.sessionId) {
          resolve(true);
          return;
        }

        let settled = false;
        const finish = (result: boolean) => {
          if (settled) return;
          settled = true;
          if (this.cancelPendingPlay === onCancel) {
            this.cancelPendingPlay = null;
          }
          audio.onplay = null;
          audio.onended = null;
          audio.onerror = null;
          if (this.activeObjectUrl === objectUrl) {
            URL.revokeObjectURL(objectUrl);
            this.activeObjectUrl = null;
          }
          resolve(result);
        };

        const onCancel = () => finish(true);
        this.cancelPendingPlay = onCancel;

        audio.onended = () => {
          finish(true);
          if (mySessionId === this.sessionId) {
            onEnd?.();
          }
        };

        audio.onerror = () => {
          finish(false);
        };

        audio.src = objectUrl;
        audio.playbackRate = speechSpeed;
        audio
          .play()
          .then(() => {
            if (mySessionId === this.sessionId) {
              audio.playbackRate = speechSpeed;
            }
          })
          .catch(() => {
            finish(false);
          });
      });
    } catch {
      clearTimeout(timeoutId);
      return false;
    }
  }

  private playBrowserSynthesis(
    cleaned: string,
    langConfig: LanguageInfo,
    speechSpeed: number,
    preferredVoiceURI: string | undefined,
    mySessionId: number,
    onEnd?: () => void
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (mySessionId === this.sessionId) onEnd?.();
      return;
    }

    const synth = window.speechSynthesis;
    const chunks = splitSpeechChunks(cleaned, 150);

    const speakChunks = () => {
      if (mySessionId !== this.sessionId) return;

      const voices = synth.getVoices();
      // Strict language matching: NEVER attach an English voice to Kannada/regional text
      const matchedVoice = findBestBrowserVoice(voices, langConfig, preferredVoiceURI);

      let index = 0;

      const speakNext = () => {
        if (mySessionId !== this.sessionId) return;
        if (index >= chunks.length) {
          onEnd?.();
          return;
        }

        try {
          const utterance = new SpeechSynthesisUtterance(chunks[index]);
          utterance.lang = langConfig.speechCode;
          utterance.rate = speechSpeed;
          utterance.pitch = 1.0;

          if (matchedVoice) {
            utterance.voice = matchedVoice;
          }

          utterance.onend = () => {
            if (mySessionId !== this.sessionId) return;
            index += 1;
            speakNext();
          };

          utterance.onerror = () => {
            if (mySessionId !== this.sessionId) return;
            index += 1;
            if (index < chunks.length) {
              speakNext();
            } else {
              onEnd?.();
            }
          };

          synth.speak(utterance);
        } catch {
          if (mySessionId === this.sessionId) onEnd?.();
        }
      };

      speakNext();
    };

    // If voices aren't loaded yet on initial browser visit, wait briefly for onvoiceschanged
    if (synth.getVoices().length === 0) {
      let handled = false;
      const onVoices = () => {
        if (handled) return;
        handled = true;
        synth.removeEventListener('voiceschanged', onVoices);
        speakChunks();
      };
      synth.addEventListener('voiceschanged', onVoices);
      setTimeout(() => {
        if (!handled) {
          handled = true;
          synth.removeEventListener('voiceschanged', onVoices);
          speakChunks();
        }
      }, 250);
    } else {
      speakChunks();
    }
  }
}

export const ttsController = new MultilingualTtsController();
