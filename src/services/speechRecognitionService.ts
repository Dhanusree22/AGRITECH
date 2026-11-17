// Unified Multilingual Speech-to-Text Service for AGRITECH
// Fixes Web Speech API `no-speech` mic-lock bugs and adds automatic MediaRecorder + RMS VAD + AI transcription fallback.

import { LanguageCode } from '../types';
import { LanguageInfo } from '../i18n/languageConfig';

export interface SpeechListenOptions {
  langConfig: LanguageInfo;
  onStart?: () => void;
  onInterimTranscript?: (text: string) => void;
  onFinalTranscript: (text: string) => void;
  onError?: (message: string) => void;
  onEnd?: () => void;
}

const LOCALIZED_MIC_MESSAGES: Record<
  'permission_denied' | 'no_voice' | 'not_supported' | 'network_fallback_failed',
  Record<LanguageCode, string>
> = {
  permission_denied: {
    en: 'Microphone permission was denied. Please allow microphone access in your browser address bar.',
    kn: 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್ ಅಡ್ರೆಸ್ ಬಾರ್‌ನಲ್ಲಿ ಮೈಕ್ ಅನುಮತಿಸಿ.',
    hi: 'माइक्रोफ़ोन अनुमति अस्वीकृत है। कृपया ब्राउज़र एड्रेस बार में माइक की अनुमति दें।',
    te: 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. దయచేసి బ్రౌజర్ అడ్రెస్ బార్‌లో మైక్ అనుమతించండి.',
    ta: 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. உலாவி முகவரிப் பட்டியில் மைக்கை அனுமதிக்கவும்.',
    ml: 'മൈക്രോഫോൺ അനുമതി നിരസിച്ചു. ബ്രൗസർ അഡ്രസ് ബാറിൽ മൈക്ക് അനുവദിക്കുക.',
    mr: 'मायक्रोफोन परवानगी नाकारली आहे. कृपया ब्राउझर ॲड्रेस बारमध्ये माइकला परवानगी द्या.',
    bn: 'মাইক্রোফোন অনুমতি প্রত্যাখ্যাত হয়েছে। ব্রাউজার অ্যাড্রেস বারে মাইক অনুমতি দিন।',
  },
  no_voice: {
    en: 'No voice was detected. Check that your microphone is unmuted and speak clearly, or tap a quick prompt below.',
    kn: 'ಯಾವುದೇ ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ನಿಮ್ಮ ಮೈಕ್ ಆನ್ ಆಗಿದೆಯೇ ಪರಿಶೀಲಿಸಿ ಮಾತನಾಡಿ ಅಥವಾ ಕೆಳಗಿನ ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳನ್ನು ಒತ್ತಿ.',
    hi: 'कोई आवाज़ नहीं सुनाई दी। जांचें कि माइक्रोफ़ोन म्यूट नहीं है और स्पष्ट बोलें, या नीचे दिए गए त्वरित प्रश्न चुनें।',
    te: 'ఎటువంటి స్వరం వినిపించలేదు. మీ మైక్ ఆన్‌లో ఉందో లేదో తనిఖీ చేసి మాట్లాడండి లేదా దిగువ ప్రశ్నలను ఎంచుకోండి.',
    ta: 'குரல் எதுவும் கேட்கவில்லை. மைக்ரோஃபோன் ஆன் செய்யப்பட்டுள்ளதா எனச் சரிபார்த்துப் பேசவும் அல்லது கீழே உள்ள கேள்விகளைத் தட்டவும்.',
    ml: 'ശബ്ദമൊന്നും കേട്ടില്ല. മൈക്രോഫോൺ മ്യൂട്ട് അല്ലെന്ന് ഉറപ്പാക്കി സംസാരിക്കുക അല്ലെങ്കിൽ താഴെയുള്ള ചോദ്യങ്ങൾ തിരഞ്ഞെടുക്കുക.',
    mr: 'आवाज ऐकू आला नाही. तुमचा माइक सुरू असल्याचे तपासून बोला किंवा खालील त्वरित प्रश्न निवडा.',
    bn: 'কোনো কণ্ঠস্বর শোনা যায়নি। আপনার মাইক আনমিউট আছে কিনা দেখে কথা বলুন অথবা নিচের প্রশ্নগুলো চাপুন।',
  },
  not_supported: {
    en: 'Voice input is unavailable in this browser. Please type your question or tap a quick prompt below.',
    kn: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಕೆಳಗಿನ ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳನ್ನು ಒತ್ತಿ.',
    hi: 'इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। कृपया टाइप करें या नीचे दिए गए त्वरित प्रश्न चुनें।',
    te: 'ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు. దయచేసి టైప్ చేయండి లేదా దిగువ ప్రశ్నలను నొక్కండి.',
    ta: 'இந்த உலாவியில் குரல் உள்ளீடு இல்லை. தயவுசெய்து தட்டச்சு செய்யவும் அல்லது கீழே உள்ள கேள்விகளைத் தட்டவும்.',
    ml: 'ഈ ബ്രൗസറിൽ വോയിസ് ഇൻപുട്ട് ലഭ്യമല്ല. ദയവായി ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ താഴെയുള്ള ചോദ്യങ്ങൾ തിരഞ്ഞെടുക്കുക.',
    mr: 'या ब्राउझरमध्ये व्हॉईस इनपुट उपलब्ध नाही. कृपया टाइप करा किंवा खालील प्रश्न निवडा.',
    bn: 'এই ব্রাউজারে ভয়েস ইনপুট উপলব্ধ নয়। অনুগ্রহ করে টাইপ করুন অথবা নিচের প্রশ্ন চাপুন।',
  },
  network_fallback_failed: {
    en: 'Could not transcribe voice over the network. Please speak again or tap a quick prompt below.',
    kn: 'ಧ್ವನಿಯನ್ನು ಗುರುತಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಮಾತನಾಡಿ ಅಥವಾ ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳನ್ನು ಒತ್ತಿ.',
    hi: 'आवाज़ को टेक्स्ट में बदला नहीं जा सका। कृपया फिर से बोलें या नीचे दिए गए प्रश्न चुनें।',
    te: 'స్వరాన్ని గుర్తించడం సాధ్యం కాలేదు. దయచేసి మళ్లీ మాట్లాడండి లేదా దిగువ ప్రశ్నలను నొక్కండి.',
    ta: 'குரலை அடையாளம் காண முடியவில்லை. மீண்டும் பேசவும் அல்லது கீழே உள்ள கேள்விகளைத் தட்டவும்.',
    ml: 'ശബ്ദം തിരിച്ചറിയാൻ കഴിഞ്ഞില്ല. വീണ്ടും സംസാരിക്കുക അല്ലെങ്കിൽ താഴെയുള്ള ചോദ്യങ്ങൾ തിരഞ്ഞെടുക്കുക.',
    mr: 'आवाज ओळखता आला नाही. कृपया पुन्हा बोला किंवा खालील प्रश्न निवडा.',
    bn: 'ভয়েস শনাক্ত করা যায়নি। অনুগ্রহ করে আবার বলুন অথবা নিচের প্রশ্ন চাপুন।',
  },
};

function getMicMsg(
  key: keyof typeof LOCALIZED_MIC_MESSAGES,
  lang: LanguageCode
): string {
  return LOCALIZED_MIC_MESSAGES[key][lang] || LOCALIZED_MIC_MESSAGES[key].en;
}

function getSupportedRecorderMimeType(): string {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return '';
  }
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/ogg',
  ];
  return candidates.find((m) => MediaRecorder.isTypeSupported(m)) || '';
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error || new Error('Failed to read recorded audio'));
    reader.readAsDataURL(blob);
  });
}

class MultilingualSpeechRecognitionController {
  private sessionId = 0;
  private activeListening = false;
  private submitted = false;
  private aborted = false;

  private recognition: any = null;
  private latestTranscript = '';
  private silenceTimer: ReturnType<typeof setTimeout> | null = null;

  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private vadInterval: ReturnType<typeof setInterval> | null = null;
  private maxRecordTimer: ReturnType<typeof setTimeout> | null = null;
  private manualStopRequested = false;

  private activeOptions: SpeechListenOptions | null = null;

  public isListening(): boolean {
    return this.activeListening;
  }

  public startListening(options: SpeechListenOptions): void {
    this.stopListening(false);

    this.sessionId += 1;
    const mySessionId = this.sessionId;
    this.activeListening = true;
    this.submitted = false;
    this.aborted = false;
    this.latestTranscript = '';
    this.manualStopRequested = false;
    this.activeOptions = options;

    const SpeechRecognition =
      typeof window !== 'undefined' &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

    if (SpeechRecognition) {
      this.startWebSpeech(SpeechRecognition, options, mySessionId, 0);
    } else {
      void this.startMediaRecorderFallback(options, mySessionId);
    }
  }

  public stopListening(submitCaptured = true): void {
    if (!this.activeListening && !this.recognition && !this.mediaRecorder) {
      return;
    }

    const opts = this.activeOptions;
    this.clearTimers();

    if (!submitCaptured) {
      this.aborted = true;
      this.sessionId += 1;
    } else {
      this.manualStopRequested = true;
    }

    // If stopping Web Speech and we already captured interim words, submit them cleanly
    if (submitCaptured && this.recognition && !this.submitted && this.latestTranscript.trim()) {
      const captured = this.latestTranscript.trim();
      this.submitted = true;
      this.cleanupWebSpeech();
      this.activeListening = false;
      opts?.onEnd?.();
      opts?.onFinalTranscript(captured);
      return;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch {
        this.cleanupMediaFallback();
        this.activeListening = false;
        opts?.onEnd?.();
      }
      return;
    }

    this.cleanupWebSpeech();
    this.cleanupMediaFallback();
    this.activeListening = false;
    opts?.onEnd?.();
  }

  private clearTimers(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    if (this.vadInterval) {
      clearInterval(this.vadInterval);
      this.vadInterval = null;
    }
    if (this.maxRecordTimer) {
      clearTimeout(this.maxRecordTimer);
      this.maxRecordTimer = null;
    }
  }

  private cleanupWebSpeech(): void {
    if (this.recognition) {
      this.recognition.onstart = null;
      this.recognition.onresult = null;
      this.recognition.onerror = null;
      this.recognition.onend = null;
      try {
        this.recognition.abort();
      } catch {
        try {
          this.recognition.stop();
        } catch {
          // ignore
        }
      }
      this.recognition = null;
    }
  }

  private cleanupMediaFallback(): void {
    this.clearTimers();
    if (this.mediaRecorder) {
      this.mediaRecorder.ondataavailable = null;
      this.mediaRecorder.onstop = null;
      this.mediaRecorder.onerror = null;
      if (this.mediaRecorder.state !== 'inactive') {
        try {
          this.mediaRecorder.stop();
        } catch {
          // ignore
        }
      }
      this.mediaRecorder = null;
    }
    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach((t) => t.stop());
      } catch {
        // ignore
      }
      this.mediaStream = null;
    }
    if (this.audioContext) {
      try {
        void this.audioContext.close();
      } catch {
        // ignore
      }
      this.audioContext = null;
    }
  }

  private startWebSpeech(
    SpeechRecognitionCtor: any,
    options: SpeechListenOptions,
    mySessionId: number,
    retryCount: number
  ): void {
    if (mySessionId !== this.sessionId || this.aborted) return;

    try {
      const recognition = new SpeechRecognitionCtor();
      // continuous = true prevents Chrome/Edge's ~2s aggressive single-shot `no-speech` aborts
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;
      recognition.lang = options.langConfig.speechCode;

      let startedNotified = retryCount > 0;
      let sawResultInAttempt = false;

      recognition.onstart = () => {
        if (mySessionId !== this.sessionId || this.aborted) return;
        this.activeListening = true;
        if (!startedNotified) {
          startedNotified = true;
          options.onStart?.();
        }
      };

      recognition.onresult = (event: any) => {
        if (mySessionId !== this.sessionId || this.aborted || this.submitted) return;

        let finalStr = '';
        let interimStr = '';
        for (let i = 0; i < event.results.length; i++) {
          const piece = event.results[i][0]?.transcript || '';
          if (event.results[i].isFinal) {
            finalStr += (finalStr ? ' ' : '') + piece.trim();
          } else {
            interimStr += (interimStr ? ' ' : '') + piece.trim();
          }
        }

        const combined = `${finalStr} ${interimStr}`.trim();
        if (!combined) return;

        sawResultInAttempt = true;
        this.latestTranscript = combined;
        options.onInterimTranscript?.(combined);

        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
        }

        // Submit promptly after speaker pauses (shorter wait if chunk is already finalized)
        const waitMs = finalStr && !interimStr ? 850 : 1650;
        this.silenceTimer = setTimeout(() => {
          if (mySessionId !== this.sessionId || this.aborted || this.submitted) return;
          const textToSubmit = this.latestTranscript.trim();
          if (textToSubmit) {
            this.submitted = true;
            this.cleanupWebSpeech();
            this.activeListening = false;
            options.onEnd?.();
            options.onFinalTranscript(textToSubmit);
          }
        }, waitMs);
      };

      recognition.onerror = (event: any) => {
        if (mySessionId !== this.sessionId || this.aborted || this.submitted) return;

        const errType = event?.error || 'unknown';
        this.clearTimers();
        this.cleanupWebSpeech();

        if (errType === 'aborted') {
          this.activeListening = false;
          options.onEnd?.();
          return;
        }

        if (errType === 'not-allowed' || errType === 'service-not-allowed') {
          this.activeListening = false;
          options.onEnd?.();
          options.onError?.(getMicMsg('permission_denied', options.langConfig.code));
          return;
        }

        // If we already captured words before an error, submit them rather than losing user's speech
        if (this.latestTranscript.trim()) {
          const captured = this.latestTranscript.trim();
          this.submitted = true;
          this.activeListening = false;
          options.onEnd?.();
          options.onFinalTranscript(captured);
          return;
        }

        // On transient `no-speech`, silently retry once cleanly before falling back to MediaRecorder
        if (errType === 'no-speech' && retryCount < 1) {
          setTimeout(() => {
            if (mySessionId === this.sessionId && !this.aborted && !this.submitted) {
              this.startWebSpeech(SpeechRecognitionCtor, options, mySessionId, retryCount + 1);
            }
          }, 150);
          return;
        }

        // Persistent `no-speech`, `network`, `audio-capture`, or `language-not-supported`:
        // transition seamlessly to MediaRecorder + RMS Voice Activity Detection + AI transcription fallback
        if (
          errType === 'no-speech' ||
          errType === 'network' ||
          errType === 'audio-capture' ||
          errType === 'language-not-supported'
        ) {
          void this.startMediaRecorderFallback(options, mySessionId, startedNotified);
          return;
        }

        this.activeListening = false;
        options.onEnd?.();
        options.onError?.(getMicMsg('no_voice', options.langConfig.code));
      };

      recognition.onend = () => {
        if (mySessionId !== this.sessionId || this.aborted || this.submitted) return;
        // If `recognition` was replaced by retry or MediaRecorder fallback, skip
        if (this.recognition !== recognition) return;

        this.clearTimers();
        this.recognition = null;

        if (this.latestTranscript.trim()) {
          const captured = this.latestTranscript.trim();
          this.submitted = true;
          this.activeListening = false;
          options.onEnd?.();
          options.onFinalTranscript(captured);
          return;
        }

        if (!sawResultInAttempt && retryCount < 1) {
          setTimeout(() => {
            if (mySessionId === this.sessionId && !this.aborted && !this.submitted) {
              this.startWebSpeech(SpeechRecognitionCtor, options, mySessionId, retryCount + 1);
            }
          }, 150);
          return;
        }

        void this.startMediaRecorderFallback(options, mySessionId, startedNotified);
      };

      this.recognition = recognition;
      recognition.start();
    } catch {
      this.cleanupWebSpeech();
      void this.startMediaRecorderFallback(options, mySessionId);
    }
  }

  private async startMediaRecorderFallback(
    options: SpeechListenOptions,
    mySessionId: number,
    alreadyNotifiedStart = false
  ): Promise<void> {
    if (mySessionId !== this.sessionId || this.aborted || this.submitted) return;

    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === 'undefined'
    ) {
      this.activeListening = false;
      options.onEnd?.();
      options.onError?.(getMicMsg('not_supported', options.langConfig.code));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      if (mySessionId !== this.sessionId || this.aborted || this.submitted) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      this.mediaStream = stream;

      const mimeType = getSupportedRecorderMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      this.mediaRecorder = recorder;

      const chunks: BlobPart[] = [];
      let peakRms = 0;
      let hadSpeech = false;
      let lastSpeechAt = Date.now();
      const startedAt = Date.now();

      // Voice activity level monitor using Web Audio AnalyserNode
      try {
        const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx: AudioContext = new AudioCtx();
          this.audioContext = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 512;
          source.connect(analyser);

          const dataArray = new Float32Array(analyser.fftSize);
          this.vadInterval = setInterval(() => {
            if (mySessionId !== this.sessionId || this.aborted) return;
            analyser.getFloatTimeDomainData(dataArray);
            let sumSq = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sumSq += dataArray[i] * dataArray[i];
            }
            const rms = Math.sqrt(sumSq / dataArray.length);
            if (rms > peakRms) peakRms = rms;

            if (rms > 0.008) {
              hadSpeech = true;
              lastSpeechAt = Date.now();
            } else if (hadSpeech && Date.now() - lastSpeechAt > 1600) {
              if (recorder.state !== 'inactive') {
                recorder.stop();
              }
            }
          }, 100);
        }
      } catch {
        // Proceed with MediaRecorder even if Web Audio analyser isn't available
      }

      recorder.ondataavailable = (ev: BlobEvent) => {
        if (ev.data && ev.data.size > 0) {
          chunks.push(ev.data);
        }
      };

      recorder.onstop = async () => {
        const wasAborted = this.aborted || mySessionId !== this.sessionId;
        const durationMs = Date.now() - startedAt;
        const userClickedStop = this.manualStopRequested;
        this.cleanupMediaFallback();

        if (wasAborted || this.submitted) {
          this.activeListening = false;
          options.onEnd?.();
          return;
        }

        const recordedType = recorder.mimeType || mimeType || 'audio/webm';
        const blob = new Blob(chunks, { type: recordedType });

        // Detect genuine hardware-muted/zero-signal microphones
        if (!hadSpeech && peakRms < 0.002 && (!userClickedStop || durationMs < 700)) {
          this.activeListening = false;
          options.onEnd?.();
          options.onError?.(getMicMsg('no_voice', options.langConfig.code));
          return;
        }

        if (blob.size < 400) {
          this.activeListening = false;
          options.onEnd?.();
          options.onError?.(getMicMsg('no_voice', options.langConfig.code));
          return;
        }

        try {
          const base64 = await blobToBase64(blob);
          if (this.aborted || mySessionId !== this.sessionId) return;

          const response = await fetch('/api/gemini/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioBase64: base64,
              mimeType: recordedType.split(';')[0].trim(),
              language: options.langConfig.code,
            }),
          });

          if (this.aborted || mySessionId !== this.sessionId) return;

          const contentType = (response.headers.get('content-type') || '').toLowerCase();
          if (response.ok && contentType.includes('application/json')) {
            const data = await response.json();
            if (this.aborted || mySessionId !== this.sessionId) return;
            const transcript = String(data?.transcript || '').trim();
            if (transcript) {
              this.submitted = true;
              this.activeListening = false;
              options.onEnd?.();
              options.onFinalTranscript(transcript);
              return;
            }
          }

          if (this.aborted || mySessionId !== this.sessionId) return;
          this.activeListening = false;
          options.onEnd?.();
          options.onError?.(
            hadSpeech
              ? getMicMsg('network_fallback_failed', options.langConfig.code)
              : getMicMsg('no_voice', options.langConfig.code)
          );
        } catch {
          if (this.aborted || mySessionId !== this.sessionId) return;
          this.activeListening = false;
          options.onEnd?.();
          options.onError?.(getMicMsg('network_fallback_failed', options.langConfig.code));
        }
      };

      recorder.onerror = () => {
        this.cleanupMediaFallback();
        this.activeListening = false;
        options.onEnd?.();
        options.onError?.(getMicMsg('no_voice', options.langConfig.code));
      };

      this.activeListening = true;
      if (!alreadyNotifiedStart) {
        options.onStart?.();
      }
      recorder.start(250);

      // Maximum single capture window (8 seconds) before transcribing automatically
      this.maxRecordTimer = setTimeout(() => {
        if (recorder.state !== 'inactive') {
          recorder.stop();
        }
      }, 8000);
    } catch (err: any) {
      this.cleanupMediaFallback();
      this.activeListening = false;
      options.onEnd?.();
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        options.onError?.(getMicMsg('permission_denied', options.langConfig.code));
      } else {
        options.onError?.(getMicMsg('no_voice', options.langConfig.code));
      }
    }
  }
}

export const voiceRecognitionController = new MultilingualSpeechRecognitionController();
