import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  Send,
  Bot,
  Check,
  RotateCcw,
  Sliders,
  Globe,
  Radio,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { LanguageCode } from '../../types';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, languages, currentLanguageConfig, t } = useLanguage();
  const { role, user } = useAuth();

  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState('');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [voiceEngine, setVoiceEngine] = useState<'cloud' | 'browser'>('cloud');
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [inputText, setInputText] = useState('');
  const [micErrorMessage, setMicErrorMessage] = useState<string>('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const getInitialGreeting = useCallback((lang: LanguageCode) => {
    switch (lang) {
      case 'kn':
        return 'ನಮಸ್ಕಾರ! ನಾನು ಅಗ್ರಿಟೆಕ್ ಕೃಷಿ AI ಧ್ವನಿ ಸಹಾಯಕ. ನೀವು ಮಂಡಿ ದರಗಳು, ನಾಳೆಯ ಬೆಲೆ ಮುನ್ಸೂಚನೆ, ಹವಾಮಾನ, ಬೆಳೆ ರೋಗಗಳ ನಿವಾರಣೆ ಅಥವಾ ಖರೀದಿದಾರರ ಬಗ್ಗೆ ಕನ್ನಡದಲ್ಲೇ ಮಾತನಾಡಿ ಕೇಳಬಹುದು.';
      case 'hi':
        return 'नमस्ते! मैं एग्रीटेक कृषि AI वॉइस असिस्टेंट हूँ। आप मंडी भाव, कल का मूल्य पूर्वानुमान, मौसम, फसल सुरक्षा या थोक खरीदारों के बारे में हिंदी में पूछ सकते हैं।';
      case 'te':
        return 'నమస్కారం! నేను అగ్రిటెక్ వ్యవసాయ AI వాయిస్ అసిస్టెంట్. మార్కెట్ ధరలు, వాతావరణం ಮತ್ತು కొనుగోలుదారుల గురించి తెలుగులో అడగండి.';
      case 'ta':
        return 'வணக்கம்! நான் அக்ரிடெக் குரல் உதவியாளர். மண்டி விலைகள், பயிர் பாதுகாப்பு மற்றும் வாங்குபவர்கள் பற்றி தமிழில் கேளுங்கள்.';
      case 'ml':
        return 'നമസ്കാരം! ഞാൻ അഗ്രിടെക് കാർഷിക AI സഹായി. വിപണി വിലകളും കാലാവസ്ഥയും സംബന്ധിച്ച് മലയാളത്തിൽ ചോദിക്കാം.';
      case 'mr':
        return 'नमस्कार! मी एग्रीटेक कृषी AI व्हॉईस असिस्टंट आहे. बाजारभाव, पीक रोग आणि हवामानाबद्दल विचारा.';
      case 'bn':
        return 'নমস্কার! আমি এগ্রিটেক কৃষি এআই ভয়েস সহকারী। মান্ডি দর, আবহাওয়া এবং ফসল সম্পর্কে বাংলায় প্রশ্ন করুন।';
      default:
        return 'Hello! I am AgriAI Voice Assistant. Ask anything about live APMC mandi rates, AI price predictions, crop diseases, institutional buyers, or weather in your language.';
    }
  }, []);

  const [messages, setMessages] = useState<Array<{ id: string; sender: 'user' | 'ai'; text: string; time: string }>>(() => [
    {
      id: 'msg-init',
      sender: 'ai',
      text: getInitialGreeting(language),
      time: 'Now',
    },
  ]);

  // Prime audio to unlock browser autoplay
  const primeAudio = () => {
    try {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.load();
      }
    } catch {
      // ignore
    }
  };

  // Stop any active speech or audio
  const stopAllAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingMessageId(null);
  };

  // Load and match SpeechSynthesis voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);

        const speechCode = currentLanguageConfig.speechCode.toLowerCase();
        const langShort = currentLanguageConfig.code.toLowerCase();

        const matched = voices.find(
          (v) =>
            v.lang.toLowerCase() === speechCode ||
            v.lang.toLowerCase().replace('_', '-').startsWith(langShort) ||
            v.name.toLowerCase().includes(currentLanguageConfig.label.toLowerCase())
        );

        if (matched) {
          setSelectedVoiceURI(matched.voiceURI);
        } else if (voices.length > 0) {
          setSelectedVoiceURI(voices[0].voiceURI);
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      stopAllAudio();
    };
  }, [currentLanguageConfig]);

  // When language is switched in modal, update messages greeting and speak if autoSpeak
  const handleLanguageChange = (newLang: LanguageCode) => {
    primeAudio();
    setLanguage(newLang);
    stopAllAudio();
    setMicErrorMessage('');
    const greeting = getInitialGreeting(newLang);

    setMessages((prev) => [
      ...prev,
      {
        id: `lang-sw-${Date.now()}`,
        sender: 'ai',
        text: greeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    if (autoSpeak) {
      setTimeout(() => {
        speakText(greeting, newLang);
      }, 200);
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const cleanTextForSpeech = (text: string): string => {
    return text
      .replace(/[*#_`~[\]()]/g, '')
      .replace(/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const speakBrowserUtterance = (cleaned: string, targetLangConfig: any) => {
    if (!synthRef.current) {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      return;
    }
    try {
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = targetLangConfig.speechCode;
      utterance.rate = speechSpeed;
      utterance.pitch = 1.0;

      const voices = synthRef.current.getVoices();
      const targetCode = targetLangConfig.speechCode.toLowerCase();
      const langShort = targetLangConfig.code.toLowerCase();

      let voiceToUse = voices.find((v) => v.voiceURI === selectedVoiceURI);
      if (!voiceToUse) {
        voiceToUse = voices.find(
          (v) =>
            v.lang.toLowerCase() === targetCode ||
            v.lang.toLowerCase().replace('_', '-').startsWith(langShort) ||
            v.name.toLowerCase().includes(targetLangConfig.label.toLowerCase())
        );
      }

      if (voiceToUse) {
        utterance.voice = voiceToUse;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      };

      synthRef.current.speak(utterance);
    } catch {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    }
  };

  const speakText = (text: string, overrideLang?: LanguageCode, messageId?: string) => {
    stopAllAudio();
    primeAudio();

    const cleaned = cleanTextForSpeech(text);
    if (!cleaned) return;

    if (messageId) {
      setSpeakingMessageId(messageId);
    }
    setIsSpeaking(true);

    const targetLangCode = overrideLang || language;
    const targetLangConfig = languages.find((l) => l.code === targetLangCode) || currentLanguageConfig;

    if (voiceEngine === 'cloud') {
      try {
        const audioUrl = `/api/tts?text=${encodeURIComponent(cleaned)}&lang=${encodeURIComponent(targetLangCode)}`;

        if (audioPlayerRef.current) {
          audioPlayerRef.current.src = audioUrl;
          audioPlayerRef.current.playbackRate = speechSpeed;

          audioPlayerRef.current.onplay = () => setIsSpeaking(true);
          audioPlayerRef.current.onended = () => {
            setIsSpeaking(false);
            setSpeakingMessageId(null);
          };
          audioPlayerRef.current.onerror = () => {
            // Cloud audio fallback to browser synthesis
            speakBrowserUtterance(cleaned, targetLangConfig);
          };

          audioPlayerRef.current.play().catch(() => {
            speakBrowserUtterance(cleaned, targetLangConfig);
          });
        } else {
          speakBrowserUtterance(cleaned, targetLangConfig);
        }
      } catch {
        speakBrowserUtterance(cleaned, targetLangConfig);
      }
    } else {
      speakBrowserUtterance(cleaned, targetLangConfig);
    }
  };

  // Toggle Speech Recognition with Permission Check & Error Guidance
  const toggleListening = async () => {
    primeAudio();
    stopAllAudio();
    setMicErrorMessage('');

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      return;
    }

    setTranscript('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicErrorMessage(
        language === 'kn'
          ? 'ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮೈಕ್ರೊಫೋನ್ ಗುರುತಿಸುವಿಕೆ ಬೆಂಬಲಿಸುವುದಿಲ್ಲ. ಕೆಳಗಿನ ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳನ್ನು ಬಳಸಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.'
          : 'Speech recognition is not supported in this browser. Please use quick prompts below or type your question.'
      );
      return;
    }

    // Try requesting user media permission
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (permErr: any) {
        console.warn('Microphone permission check failed:', permErr);
        if (permErr.name === 'NotAllowedError' || permErr.name === 'PermissionDeniedError') {
          setMicErrorMessage(
            language === 'kn'
              ? 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್ ಅಡ್ರೆಸ್ ಬಾರ್‌ನಲ್ಲಿ ಮೈಕ್ ಐಕಾನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ಅನುಮತಿಸಿ.'
              : 'Microphone permission blocked. Please allow microphone access in your browser address bar.'
          );
          return;
        }
      }
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentLanguageConfig.speechCode;

      recognition.onstart = () => {
        setIsListening(true);
        setMicErrorMessage('');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        const textToShow = final || interim;
        setTranscript(textToShow);

        if (final.trim()) {
          try {
            recognition.stop();
          } catch {
            // ignore
          }
          setIsListening(false);
          handleUserQuery(final.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setMicErrorMessage(
            language === 'kn'
              ? 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್ ಅಡ್ರೆಸ್ ಬಾರ್‌ನಲ್ಲಿ ಮೈಕ್ ಆನ್ ಮಾಡಿ ಅಥವಾ ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳನ್ನು ಒತ್ತಿ.'
              : 'Microphone permission denied. Allow mic access in address bar or tap quick questions.'
          );
        } else if (event.error === 'network') {
          setMicErrorMessage(
            language === 'kn'
              ? 'ನೆಟ್‌ವರ್ಕ್ ಮೈಕ್ರೊಫೋನ್ ಲಭ್ಯವಿಲ್ಲ. ಕೆಳಗಿನ ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.'
              : 'Speech recognition network timeout. Please tap one of the quick prompts below.'
          );
        } else if (event.error === 'no-speech') {
          setMicErrorMessage(
            language === 'kn'
              ? 'ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮೈಕ್ ಹತ್ತಿರ ಮಾತನಾಡಿ ಅಥವಾ ಕೆಳಗಿನ ಆಯ್ಕೆಗಳನ್ನು ಒತ್ತಿ.'
              : 'No voice was detected. Please speak closer to microphone or tap quick prompts.'
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('Error starting speech recognition:', err);
      setIsListening(false);
      setMicErrorMessage(
        language === 'kn'
          ? 'ಮೈಕ್ರೊಫೋನ್ ಪ್ರಾರಂಭಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಕೆಳಗಿನ ತ್ವರಿತ ಧ್ವನಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಒತ್ತಿ.'
          : 'Could not activate microphone. Tap one of the suggested prompts below.'
      );
    }
  };

  const handleUserQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    primeAudio();
    stopAllAudio();
    setMicErrorMessage('');

    const userMsgId = `user-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user' as const,
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setTranscript('');
    setInputText('');
    setIsProcessing(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          role,
          language,
          context: `User selected language: ${currentLanguageConfig.label} (${language}). Location: ${
            user?.location || 'Karnataka, India'
          }. Mandi Tomato is ₹32/kg, Onion is ₹28/kg. Escrow active.`,
        }),
      });

      let aiReply = '';
      if (res.ok) {
        const data = await res.json();
        aiReply = data.reply;
      } else {
        aiReply =
          language === 'kn'
            ? 'ಕೋಲಾರ ಮಂಡಿಯಲ್ಲಿ ಇಂದಿನ ಟೊಮೆಟೊ ಬೆಲೆ ₹32/ಕೆಜಿ (+8.4% ಏರಿಕೆ). ಬೇಡಿಕೆ ಹೆಚ್ಚಾಗಿದ್ದು, ಮುಂದಿನ 7 ದಿನಗಳಲ್ಲಿ ಬೆಲೆ ₹35 ರಿಂದ ₹38 ರವರೆಗೆ ಏರುವ ಸಾಧ್ಯತೆಯಿದೆ.'
            : language === 'hi'
            ? 'कोलार मंडी में आज टमाटर का भाव ₹32/किलो है (+8.4% वृद्धि)। अगले 7 दिनों में भाव ₹35-₹38 तक जाने का अनुमान है।'
            : 'Live APMC rate for Tomato is ₹32/kg (up 8.4%). AI predicts an upward price trend of 10-14% over the next 7 days.';
      }

      const aiMsgId = `ai-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      if (autoSpeak) {
        setTimeout(() => {
          speakText(aiReply, undefined, aiMsgId);
        }, 150);
      }
    } catch {
      const fallbackMsg =
        language === 'kn'
          ? 'ಕೋಲಾರ ಮಂಡಿ ದರ: ಟೊಮೆಟೊ ₹32/ಕೆಜಿ, ಈರುಳ್ಳಿ ₹28/ಕೆಜಿ. ಹವಾಮಾನ: ಸಾಧಾರಣ ಬಿಸಿಲು ಮತ್ತು ಉತ್ತಮ ಕಟಾವು ಸಮಯ.'
          : 'Live mandi rate: Tomato ₹32/kg, Onion ₹28/kg. Weather: optimal harvest window.';

      const fallbackId = `ai-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: fallbackId,
          sender: 'ai',
          text: fallbackMsg,
          time: 'Now',
        },
      ]);
      if (autoSpeak) {
        speakText(fallbackMsg, undefined, fallbackId);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const sampleVoicePrompts: Record<LanguageCode, string[]> = {
    kn: [
      'ಕೋಲಾರ ಮಂಡಿಯಲ್ಲಿ ಟೊಮೆಟೊ ದರ ಎಷ್ಟು?',
      'ನಾಳೆಯ ಟೊಮೆಟೊ ಬೆಲೆ ಮುನ್ಸೂಚನೆ ತಿಳಿಸಿ',
      'ನನ್ನ ಬಳಿ 2 ಟನ್ ಈರುಳ್ಳಿ ಇದೆ, ಖರೀದಿದಾರರನ್ನು ಹುಡುಕಿ',
      'ಟೊಮೆಟೊ ಎಲೆ ಮಚ್ಚೆ ರೋಗಕ್ಕೆ ಔಷಧಿ ಏನು?',
      'ಆಲೂಗಡ್ಡೆ ಬೆಲೆ ಹೆಚ್ಚಾಗುತ್ತದೆಯೇ?',
    ],
    hi: [
      'आज टमाटर का मंडी भाव क्या है?',
      'टमाटर का कल का मूल्य पूर्वानुमान बताएं',
      'मेरे पास 2 टन प्याज है, थोक खरीदार खोजें',
      'टमाटर की फसल में झुलसा रोग का उपचार बताएं',
    ],
    te: [
      'ఈరోజు మార్కెట్లో టమాటా ధర ఎంత?',
      'రేపటి టమాటా ధర అంచనా తెలపండి',
      'నా వద్ద 2 టన్నుల ఉల్లిపాయలు ఉన్నాయి, కొనుగోలుదారులను చూపించండి',
    ],
    ta: [
      'இன்றைய தக்காளி மண்டி விலை என்ன?',
      'நாளைய தக்காளி விலை கணிப்பு என்ன?',
      '2 டன் வெங்காயத்திற்கு வாங்குபவர்களைக் கண்டறியவும்',
    ],
    ml: [
      'ഇന്നത്തെ തക്കാളി വിപണി വില എത്രയാണ്?',
      'നാളെ തക്കാളി വില കൂടുമോ?',
      'വിള രോഗങ്ങൾക്കുള്ള പ്രതിവിധി എന്താണ്?',
    ],
    mr: [
      'आज टोमॅटोचा बाजारभाव काय आहे?',
      'उद्या टोमॅटोचे भाव काय असतील?',
      'माझ्याकडे २ टन कांदा आहे, व्यापारी शोधा',
    ],
    bn: [
      'আজকে টমেটোর মান্ডি দর কত?',
      'আগামীকালের টমেটোর দামের পূর্বাভাস কি?',
      'ফসলের রোগ নিরাময়ের উপায় কি?',
    ],
    en: [
      'What is today tomato mandi price in Kolar?',
      'Show tomorrow price prediction for Tomato',
      'Find verified buyers for 2 tons of onions',
      'How to treat early blight on tomato leaves?',
    ],
  };

  const currentPrompts = sampleVoicePrompts[language] || sampleVoicePrompts.en;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/70 backdrop-blur-md">
        {/* Hidden persistent audio element for clean playback */}
        <audio ref={audioPlayerRef} playsInline className="hidden" />

        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          className="w-full max-w-2xl bg-white rounded-3xl border border-[#064e3b25] shadow-2xl overflow-hidden flex flex-col h-[670px] max-h-[92vh] text-[#064e3b]"
        >
          {/* Header with Title & Controls */}
          <div className="p-4 px-6 border-b border-[#064e3b15] bg-[#f1f5f2] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#064e3b]">AgriAI Voice Assistant</h3>
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-[#064e3b] font-bold">
                    <span>{currentLanguageConfig.flag}</span>
                    <span>{currentLanguageConfig.nativeName}</span>
                  </span>
                </div>
                <p className="text-xs text-[#064e3b80]">
                  {language === 'kn' ? 'ಕನ್ನಡದಲ್ಲೇ ಧ್ವನಿ ಸಹಾಯಕ (ಮಾತನಾಡಿ & ಆಲಿಸಿ)' : `Speaks & Listens natively in ${currentLanguageConfig.label}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {isSpeaking && (
                <button
                  onClick={stopAllAudio}
                  className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300 transition-all text-xs flex items-center gap-1.5 font-bold animate-pulse cursor-pointer shadow-xs"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>{language === 'kn' ? 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ' : 'Stop Voice'}</span>
                </button>
              )}

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  showSettings
                    ? 'bg-emerald-100 border-emerald-300 text-[#064e3b]'
                    : 'bg-white/80 border-[#064e3b20] text-[#064e3b80] hover:text-[#064e3b]'
                }`}
                title="Voice Settings & Audio Speed"
              >
                <Sliders className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  stopAllAudio();
                  if (isListening && recognitionRef.current) {
                    recognitionRef.current.stop();
                    setIsListening(false);
                  }
                  onClose();
                }}
                className="p-2 rounded-full text-[#064e3b70] hover:text-[#064e3b] hover:bg-emerald-100/60 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 🌐 Native Language Selector Bar */}
          <div className="px-5 py-2 bg-emerald-50/80 border-b border-[#064e3b15] flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-[#064e3b] flex items-center gap-1 shrink-0">
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'kn' ? 'ಧ್ವನಿ ಭಾಷೆ:' : 'Language:'}</span>
            </span>
            <div className="flex items-center gap-1.5">
              {languages.map((lang) => {
                const isActive = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-[#064e3b] text-white shadow-md shadow-[#064e3b30] ring-2 ring-emerald-400'
                        : 'bg-white text-[#064e3b] hover:bg-emerald-100/70 border border-[#064e3b20]'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                    {isActive && <Check className="w-3 h-3 text-emerald-300 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mic Error Banner with guidance */}
          {micErrorMessage && (
            <div className="p-2.5 px-5 bg-amber-50 border-b border-amber-300 text-xs text-amber-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{micErrorMessage}</span>
              </div>
              <button
                onClick={() => setMicErrorMessage('')}
                className="text-amber-700 hover:text-amber-950 font-bold px-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* Voice Settings Drawer */}
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-3.5 px-6 bg-emerald-100/60 border-b border-[#064e3b20] text-xs flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 font-bold text-[#064e3b] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSpeak}
                    onChange={(e) => setAutoSpeak(e.target.checked)}
                    className="rounded text-[#064e3b]"
                  />
                  <span>🔊 {language === 'kn' ? 'ಸ್ವಯಂ ಧ್ವನಿ ಉತ್ತರ (Auto-Speak)' : 'Auto-Speak Answers'}</span>
                </label>

                <div className="flex items-center gap-1.5 bg-white/90 px-2.5 py-1 rounded-lg border border-[#064e3b20]">
                  <span className="font-bold text-[#064e3b]">Engine:</span>
                  <button
                    onClick={() => setVoiceEngine('cloud')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                      voiceEngine === 'cloud'
                        ? 'bg-[#064e3b] text-white'
                        : 'text-[#064e3b80] hover:text-[#064e3b]'
                    }`}
                  >
                    ✨ {language === 'kn' ? 'ಕನ್ನಡ ಧ್ವನಿ (HD)' : `HD Native (${currentLanguageConfig.label})`}
                  </button>
                  <button
                    onClick={() => setVoiceEngine('browser')}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                      voiceEngine === 'browser'
                        ? 'bg-[#064e3b] text-white'
                        : 'text-[#064e3b80] hover:text-[#064e3b]'
                    }`}
                  >
                    💻 Device Voice
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#064e3b]">Speed:</span>
                {[
                  { label: '0.85x', val: 0.85 },
                  { label: '1.0x', val: 1.0 },
                  { label: '1.15x', val: 1.15 },
                ].map((s) => (
                  <button
                    key={s.val}
                    onClick={() => setSpeechSpeed(s.val)}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer transition-all ${
                      speechSpeed === s.val
                        ? 'bg-[#064e3b] text-white'
                        : 'bg-white border border-[#064e3b20] text-[#064e3b]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#f8faf8]">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed relative group ${
                    msg.sender === 'user'
                      ? 'bg-[#064e3b] text-white rounded-tr-none shadow-sm'
                      : 'bg-white border border-[#064e3b15] text-[#064e3b] rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 gap-2">
                    <span
                      className={`text-[10px] ${
                        msg.sender === 'user' ? 'text-emerald-200' : 'text-[#064e3b60]'
                      }`}
                    >
                      {msg.time}
                    </span>

                    {msg.sender === 'ai' && (
                      <button
                        onClick={() => {
                          if (speakingMessageId === msg.id && isSpeaking) {
                            stopAllAudio();
                          } else {
                            speakText(msg.text, undefined, msg.id);
                          }
                        }}
                        className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full font-bold border transition-all cursor-pointer ${
                          speakingMessageId === msg.id && isSpeaking
                            ? 'bg-emerald-600 text-white border-emerald-700 animate-pulse'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] border-emerald-300'
                        }`}
                        title="Listen to this answer in spoken voice"
                      >
                        {speakingMessageId === msg.id && isSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>{language === 'kn' ? 'ನಿಲ್ಲಿಸಿ' : 'Stop'}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{language === 'kn' ? 'ಧ್ವನಿ ಕೇಳಿ' : 'Listen'}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-3 text-[#064e3b] text-sm font-semibold p-3 bg-emerald-50 rounded-2xl border border-emerald-200 w-fit">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center animate-spin">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>
                  {language === 'kn'
                    ? 'ಅಗ್ರಿಟೆಕ್ ಎಐ ಕನ್ನಡದಲ್ಲಿ ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...'
                    : 'AgriAI is analyzing mandi prices and agricultural records...'}
                </span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Voice Prompt Chips in Selected Language */}
          <div className="px-5 py-2.5 flex flex-wrap gap-2 border-t border-[#064e3b15] bg-[#f1f5f2]/90">
            <span className="text-[11px] font-bold text-[#064e3b] flex items-center gap-1 w-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>
                {language === 'kn'
                  ? 'ಸೂಚಿಸಲಾದ ಕನ್ನಡ ಪ್ರಶ್ನೆಗಳು (ಸ್ಪರ್ಶಿಸಿ ಕೇಳಿ):'
                  : 'Suggested Questions (Tap to Ask):'}
              </span>
            </span>
            {currentPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleUserQuery(prompt)}
                className="text-xs px-3.5 py-1.5 rounded-full bg-white hover:bg-emerald-100/90 border border-[#064e3b20] text-[#064e3b] font-semibold transition-all text-left truncate max-w-full shadow-xs cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <Radio className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>&quot;{prompt}&quot;</span>
              </button>
            ))}
          </div>

          {/* Audio Wave Visualizer & Microphone Action Area */}
          <div className="p-4 px-6 border-t border-[#064e3b15] bg-white flex flex-col items-center gap-3">
            {/* Live Listening Waveform */}
            {isListening && (
              <div className="flex items-center justify-center gap-1.5 h-7">
                {[40, 80, 100, 60, 95, 50, 85, 65, 90, 45, 75].map((height, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [`${height * 0.2}%`, `${height}%`, `${height * 0.3}%`] }}
                    transition={{ repeat: Infinity, duration: 0.5 + i * 0.05, ease: 'easeInOut' }}
                    className="w-1.5 bg-[#064e3b] rounded-full"
                  />
                ))}
                <span className="ml-3 text-xs font-bold text-[#064e3b] animate-pulse">
                  {language === 'kn'
                    ? `ಕನ್ನಡದಲ್ಲಿ ಆಲಿಸಲಾಗುತ್ತಿದೆ... (${currentLanguageConfig.speechCode})`
                    : `Listening in ${currentLanguageConfig.nativeName}...`}
                </span>
              </div>
            )}

            {transcript && (
              <p className="text-xs text-amber-950 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-300 font-medium">
                &quot;{transcript}&quot;
              </p>
            )}

            {/* Input & Big Microphone Button */}
            <div className="flex items-center gap-3 w-full">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUserQuery(inputText);
                  }}
                  placeholder={
                    language === 'kn'
                      ? 'ಮಂಡಿ ಬೆಲೆ, ಹವಾಮಾನ, ರೋಗಗಳ ಬಗ್ಗೆ ಕೇಳಿ...'
                      : 'Ask about mandi prices, weather, crop diseases, buyers...'
                  }
                  className="w-full pl-4 pr-11 py-3 rounded-full bg-emerald-50/50 border border-[#064e3b20] focus:border-[#064e3b] focus:bg-white focus:outline-none text-[#064e3b] placeholder:text-[#064e3b50] text-sm font-medium transition-all"
                />
                <button
                  onClick={() => handleUserQuery(inputText)}
                  disabled={!inputText.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#064e3b] text-white disabled:opacity-30 hover:bg-emerald-800 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Large Microphone Action Button */}
              <button
                onClick={toggleListening}
                className={`relative p-3.5 sm:p-4 rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer shrink-0 ${
                  isListening
                    ? 'bg-rose-600 text-white shadow-rose-600/40 scale-105 animate-pulse'
                    : 'bg-[#064e3b] hover:bg-emerald-800 text-white shadow-emerald-950/20'
                }`}
                title={
                  isListening
                    ? 'Click to stop listening'
                    : language === 'kn'
                    ? 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಲು ಮೈಕ್ ಕ್ಲಿಕ್ ಮಾಡಿ'
                    : `Click to speak in ${currentLanguageConfig.nativeName}`
                }
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
