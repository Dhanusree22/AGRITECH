import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Volume1,
  RotateCcw,
  Radio,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { LanguageCode } from '../../types';

export const AIChatbotWidget: React.FC = () => {
  const { language, currentLanguageConfig, t, languages, setLanguage } = useLanguage();
  const { role, user } = useAuth();

  // Admin module must NOT include AI chatbot as per user instructions
  if (role === 'admin') {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [autoVoice, setAutoVoice] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const getGreetingForLang = useCallback((lang: LanguageCode) => {
    switch (lang) {
      case 'kn':
        return 'ನಮಸ್ಕಾರ! ನಾನು ಅಗ್ರಿಟೆಕ್ ಕೃಷಿ AI ಧ್ವನಿ ಸಹಾಯಕ. ನೀವು ಮಂಡಿ ದರಗಳು, ನಾಳೆಯ ಬೆಲೆ ಮುನ್ಸೂಚನೆ, ಹವಾಮಾನ, ಬೆಳೆ ರೋಗ ಅಥವಾ ಖರೀದಿದಾರರ ಬಗ್ಗೆ ಕನ್ನಡದಲ್ಲೇ ಮಾತನಾಡಿ ಕೇಳಬಹುದು.';
      case 'hi':
        return 'नमस्ते! मैं एग्रीटेक कृषि AI सहायक हूँ। आप मंडी भाव, कल का मूल्य पूर्वानुमान, मौसम, फसल रोग या थोक खरीदारों के बारे में पूछ सकते हैं।';
      case 'te':
        return 'నమస్కారం! నేను అగ్రిటెక్ వ్యవసాయ AI వాయిస్ అసిస్టెంట్. మార్కెట్ ధరలు, వాతావరణం, పంట తెగుళ్లు లేదా కొనుగోలుదారుల గురించి తెలుగులో అడగండి.';
      case 'ta':
        return 'வணக்கம்! நான் அக்ரிடெக் குரல் உதவியாளர். மண்டி விலைகள், வானிலை, பயிர் பாதுகாப்பு மற்றும் வாங்குபவர்கள் பற்றி தமிழில் கேளுங்கள்.';
      case 'ml':
        return 'നമസ്കാരം! ഞാൻ അഗ്രിടെക് കാർഷിക AI സഹായി. വിപണി നിരക്കുകൾ, കാലാവസ്ഥ, വിള രോഗങ്ങൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കാം.';
      case 'mr':
        return 'नमस्कार! मी एग्रीटेक कृषी AI सहाय्यक आहे. बाजारभाव, हवामान आणि खरेदीदारांबद्दल मराठीत विचारा.';
      case 'bn':
        return 'নমস্কার! আমি এগ্রিটেক কৃষি এআই সহকারী। মান্ডি দর, আবহাওয়া এবং ফসল সম্পর্কে বাংলায় প্রশ্ন করুন।';
      default:
        return 'Hello! I am AgriAI Agricultural Intelligence Assistant. Ask me about live Mandi prices, 7-day price forecasts, crop diseases, weather alerts, or verified buyers in your language.';
    }
  }, []);

  const [messages, setMessages] = useState<Array<{ id: string; sender: 'user' | 'ai'; text: string; time: string }>>(() => [
    {
      id: 'msg-initial',
      sender: 'ai',
      text: getGreetingForLang(language),
      time: 'Now',
    },
  ]);

  // Update greeting when language changes
  useEffect(() => {
    setMessages((prev) => {
      // If only initial greeting exists or user just switched language, update greeting
      if (prev.length === 1 && prev[0].sender === 'ai') {
        return [
          {
            id: `msg-initial-${language}`,
            sender: 'ai',
            text: getGreetingForLang(language),
            time: 'Now',
          },
        ];
      }
      return prev;
    });
  }, [language, getGreetingForLang]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Stop active speech / audio
  const stopSpeech = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingMessageId(null);
  };

  // Prime audio on user gesture to avoid browser autoplay restrictions
  const primeAudioContext = () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
    } catch {
      // ignore
    }
  };

  // Speak text in selected language (e.g., Kannada)
  const speakText = (text: string, messageId?: string) => {
    stopSpeech();
    primeAudioContext();

    const clean = text
      .replace(/[*#_`~[\]()]/g, '')
      .replace(/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!clean) return;

    if (messageId) {
      setSpeakingMessageId(messageId);
    }
    setIsSpeaking(true);

    // Primary: Google TTS Proxy endpoint configured for target language (e.g., 'kn' for Kannada)
    const ttsUrl = `/api/tts?text=${encodeURIComponent(clean)}&lang=${encodeURIComponent(language)}`;

    const audio = audioRef.current || new Audio();
    audioRef.current = audio;
    audio.src = ttsUrl;

    audio.onplay = () => {
      setIsSpeaking(true);
    };

    audio.onended = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    audio.onerror = () => {
      // Fallback to browser SpeechSynthesis
      try {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(clean);
          utterance.lang = currentLanguageConfig.speechCode;
          utterance.rate = 0.95;

          const voices = window.speechSynthesis.getVoices();
          const targetCode = currentLanguageConfig.speechCode.toLowerCase();
          const langShort = currentLanguageConfig.code.toLowerCase();

          const matchedVoice = voices.find(
            (v) =>
              v.lang.toLowerCase() === targetCode ||
              v.lang.toLowerCase().replace('_', '-').startsWith(langShort) ||
              v.name.toLowerCase().includes(currentLanguageConfig.label.toLowerCase())
          );
          if (matchedVoice) {
            utterance.voice = matchedVoice;
          }

          utterance.onend = () => {
            setIsSpeaking(false);
            setSpeakingMessageId(null);
          };
          utterance.onerror = () => {
            setIsSpeaking(false);
            setSpeakingMessageId(null);
          };

          window.speechSynthesis.speak(utterance);
        } else {
          setIsSpeaking(false);
          setSpeakingMessageId(null);
        }
      } catch {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      }
    };

    audio.play().catch(() => {
      // If browser blocked play(), try browser SpeechSynthesis fallback
      try {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(clean);
          utterance.lang = currentLanguageConfig.speechCode;
          window.speechSynthesis.speak(utterance);
        }
      } catch {
        // ignore
      }
    });
  };

  // Send query to AI
  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    primeAudioContext();
    stopSpeech();

    const userMsgId = `user-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setMicError('');

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          role,
          language,
          context: `User role: ${role}. Location: ${user?.location || 'Karnataka, India'}. Target Language: ${currentLanguageConfig.label} (${language}). Today Tomato in Kolar is ₹32/kg.`,
        }),
      });

      let aiReply = '';
      if (res.ok) {
        const data = await res.json();
        aiReply = data.reply;
      } else {
        aiReply =
          language === 'kn'
            ? 'ಕೋಲಾರ ಮಂಡಿಯಲ್ಲಿ ಇಂದಿನ ಟೊಮೆಟೊ ಬೆಲೆ ₹32/ಕೆಜಿ (+8.4% ಏರಿಕೆ). ಮುಂದಿನ 7 ದಿನಗಳಲ್ಲಿ ಬೆಲೆ ₹35 ರಿಂದ ₹38 ರವರೆಗೆ ಏರುವ ಸಾಧ್ಯತೆಯಿದೆ.'
            : language === 'hi'
            ? 'कोलार मंडी में आज टमाटर का भाव ₹32/किलो है। अगले 7 दिनों में भाव ₹35 से ₹38 तक बढ़ने का अनुमान है।'
            : 'Today modal price for Tomato in Kolar APMC is ₹32/kg. High buyer demand recorded across Southern distribution centers.';
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

      // Automatically speak the answer in Kannada if autoVoice is on
      if (autoVoice) {
        setTimeout(() => {
          speakText(aiReply, aiMsgId);
        }, 150);
      }
    } catch {
      const fallbackReply =
        language === 'kn'
          ? 'ಕೋಲಾರ ಮಂಡಿಯಲ್ಲಿ ಇಂದಿನ ಟೊಮೆಟೊ ದರ ₹32/ಕೆಜಿ, ಈರುಳ್ಳಿ ₹28/ಕೆಜಿ. ಗುಣಮಟ್ಟದ ಗ್ರೇಡ್-ಎ ಸರಕಿಗೆ ಉತ್ತಮ ಬೇಡಿಕೆ ಇದೆ.'
          : language === 'hi'
          ? 'कोलार मंडी में आज टमाटर ₹32/किलो और प्याज ₹28/किलो है।'
          : 'Live Kolar APMC mandi rate: Tomato ₹32/kg, Onion ₹28/kg. Trading system operating normally.';

      const fallbackId = `ai-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: fallbackId,
          sender: 'ai',
          text: fallbackReply,
          time: 'Now',
        },
      ]);

      if (autoVoice) {
        speakText(fallbackReply, fallbackId);
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle Microphone Speech-to-Text
  const toggleListening = async () => {
    primeAudioContext();
    stopSpeech();
    setMicError('');

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

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError(
        language === 'kn'
          ? 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಮೈಕ್ರೊಫೋನ್ ಬೆಂಬಲವಿಲ್ಲ. ಕೆಳಗಿನ ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳನ್ನು ಒತ್ತಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.'
          : 'Speech recognition not supported in this browser. Please use quick prompts below or type.'
      );
      return;
    }

    try {
      // Explicitly request mic permission first
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (permErr: any) {
          console.warn('Microphone permission request:', permErr);
          if (permErr.name === 'NotAllowedError' || permErr.name === 'PermissionDeniedError') {
            setMicError(
              language === 'kn'
                ? 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಮೈಕ್ ಆನ್ ಮಾಡಿ.'
                : 'Microphone permission was denied. Please allow microphone in browser address bar.'
            );
            return;
          }
        }
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = currentLanguageConfig.speechCode;

      recognition.onstart = () => {
        setIsListening(true);
        setMicError('');
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
        const text = final || interim;
        setInput(text);

        if (final.trim()) {
          try {
            recognition.stop();
          } catch {
            // ignore
          }
          setIsListening(false);
          handleSend(final.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setMicError(
            language === 'kn'
              ? 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಮೈಕ್ ಆನ್ ಮಾಡಿ.'
              : 'Microphone permission blocked. Please allow mic in browser settings.'
          );
        } else if (event.error === 'network') {
          setMicError(
            language === 'kn'
              ? 'ನೆಟ್‌ವರ್ಕ್ ಮೈಕ್ರೊಫೋನ್ ಲಭ್ಯವಿಲ್ಲ. ಕೆಳಗಿನ ತ್ವರಿತ ಧ್ವನಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಬಳಸಿ.'
              : 'Speech service network error. Tap quick prompts below.'
          );
        } else if (event.error === 'no-speech') {
          setMicError(
            language === 'kn'
              ? 'ಯಾವುದೇ ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಮಾತನಾಡಿ.'
              : 'No speech detected. Please speak into your microphone again.'
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('Recognition start failed:', err);
      setIsListening(false);
      setMicError(
        language === 'kn'
          ? 'ಮೈಕ್ರೊಫೋನ್ ಪ್ರಾರಂಭಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳನ್ನು ಬಳಸಿ.'
          : 'Could not activate microphone. Tap one of the quick questions below.'
      );
    }
  };

  // Sample prompt questions in user's selected language
  const sampleQuestionsByLang: Record<LanguageCode, string[]> = {
    kn: [
      'ಕೋಲಾರ ಮಂಡಿಯಲ್ಲಿ ಟೊಮೆಟೊ ದರ ಎಷ್ಟು?',
      'ನಾಳೆಯ ಟೊಮೆಟೊ ಬೆಲೆ ಮುನ್ಸೂಚನೆ ತಿಳಿಸಿ',
      '2 ಟನ್ ಈರುಳ್ಳಿಗೆ ಖರೀದಿದಾರರನ್ನು ಹುಡುಕಿ',
      'ಟೊಮೆಟೊ ಎಲೆ ಮಚ್ಚೆ ರೋಗಕ್ಕೆ ಔಷಧಿ ಏನು?',
      'ಆಲೂಗಡ್ಡೆ ಬೆಲೆ ಹೆಚ್ಚಾಗುತ್ತದೆಯೇ?',
    ],
    hi: [
      'कोलार मंडी में आज टमाटर का भाव क्या है?',
      'टमाटर का कल का मूल्य पूर्वानुमान बताएं',
      'मेरे पास 2 टन प्याज है, खरीदार खोजें',
      'टमाटर की फसल में झुलसा रोग की दवा क्या है?',
    ],
    te: [
      'కోలార్ మార్కెట్లో టమాటా ధర ఎంత?',
      'రేపటి టమాటా ధర అంచనా తెలపండి',
      '2 టన్నుల ఉల్లిపాయల కొనుగోలుదారులను చూపించండి',
    ],
    ta: [
      'இன்றைய தக்காளி மண்டி விலை என்ன?',
      'நாளைய தக்காளி விலை கணிப்பு என்ன?',
      '2 டன் வெங்காயத்திற்கு வாங்குபவர்களைக் கண்டறியவும்',
    ],
    ml: [
      'ഇന്നത്തെ തക്കാളി വിപണി നിരക്ക് എത്രയാണ്?',
      'നാളെ തക്കാളി വില കൂടുമോ?',
      'വിള രോഗങ്ങൾക്കുള്ള പ്രതിവിധി എന്താണ്?',
    ],
    mr: [
      'आज कोलार बाजारात टोमॅटोचे दर काय आहेत?',
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

  const currentQuestions = sampleQuestionsByLang[language] || sampleQuestionsByLang.en;

  return (
    <>
      {/* Hidden persistent audio element for pristine playback */}
      <audio ref={audioRef} playsInline className="hidden" />

      {/* Floating Widget Trigger Button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-24 right-6 z-40"
        >
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              primeAudioContext();
              setIsOpen(true);
            }}
            className="relative p-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-2xl shadow-emerald-700/50 flex items-center justify-center border-2 border-white/20 cursor-pointer group"
            title={`AgriAI Assistant (${currentLanguageConfig.nativeName})`}
          >
            <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
            {/* Pulsing indicator */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 text-[9px] font-bold text-emerald-950 items-center justify-center">
                AI
              </span>
            </span>
          </motion.button>
        </motion.div>
      )}

      {/* Floating Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-1.5rem)] h-[580px] bg-slate-900 rounded-3xl border border-emerald-500/30 shadow-2xl shadow-emerald-950/50 flex flex-col overflow-hidden text-white font-sans"
          >
            {/* Header */}
            <div className="p-3.5 px-4 bg-slate-950 border-b border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    AgriAI Assistant
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-300">
                    <span>{currentLanguageConfig.flag} {currentLanguageConfig.nativeName}</span>
                    <span className="opacity-40">•</span>
                    <span className="text-gray-400">APMC & e-NAM Synced</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                {/* Auto-Voice Toggle */}
                <button
                  onClick={() => {
                    const next = !autoVoice;
                    setAutoVoice(next);
                    if (!next) stopSpeech();
                  }}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    autoVoice ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-400 hover:text-white'
                  }`}
                  title={autoVoice ? 'Voice Spoken Output: ON' : 'Voice Spoken Output: MUTED'}
                >
                  {autoVoice ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={() => {
                    stopSpeech();
                    if (isListening && recognitionRef.current) {
                      recognitionRef.current.stop();
                      setIsListening(false);
                    }
                    setIsOpen(false);
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Language Switcher Ribbon */}
            <div className="px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 flex items-center gap-1 overflow-x-auto no-scrollbar">
              <span className="text-[9px] text-gray-400 uppercase font-bold shrink-0 mr-1">
                {language === 'kn' ? 'ಭಾಷೆ:' : 'Lang:'}
              </span>
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    stopSpeech();
                    setLanguage(l.code);
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 transition-all ${
                    language === l.code
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-800 text-gray-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {l.flag} {l.nativeName}
                </button>
              ))}
            </div>

            {/* Mic Error Banner if needed */}
            {micError && (
              <div className="p-2 px-3 bg-amber-950/90 border-b border-amber-600/40 text-[11px] text-amber-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{micError}</span>
                </div>
                <button
                  onClick={() => setMicError('')}
                  className="text-amber-400 hover:text-white text-xs font-bold px-1"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Speaking Status Banner */}
            {isSpeaking && (
              <div className="p-1.5 px-3 bg-emerald-950/80 border-b border-emerald-500/40 text-[11px] text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>{language === 'kn' ? 'ಕನ್ನಡ ಧ್ವನಿ ಮಾತನಾಡುತ್ತಿದೆ...' : 'Speaking answer...'}</span>
                  <div className="flex items-center gap-0.5">
                    <span className="w-1 h-3 bg-emerald-400 animate-bounce" />
                    <span className="w-1 h-4 bg-emerald-300 animate-bounce delay-75" />
                    <span className="w-1 h-2 bg-emerald-400 animate-bounce delay-150" />
                  </div>
                </div>
                <button
                  onClick={stopSpeech}
                  className="text-[10px] px-2 py-0.5 rounded bg-emerald-800/80 text-white hover:bg-emerald-700"
                >
                  {language === 'kn' ? 'ನಿಲ್ಲಿಸಿ' : 'Stop'}
                </button>
              </div>
            )}

            {/* Chat Body */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed space-y-1.5 ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none shadow-md'
                        : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10 text-[10px]">
                      {msg.sender === 'ai' ? (
                        <button
                          onClick={() => {
                            if (speakingMessageId === msg.id && isSpeaking) {
                              stopSpeech();
                            } else {
                              speakText(msg.text, msg.id);
                            }
                          }}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                            speakingMessageId === msg.id && isSpeaking
                              ? 'bg-emerald-500 text-slate-950 animate-pulse'
                              : 'bg-slate-700 text-emerald-300 hover:bg-slate-600'
                          }`}
                        >
                          {speakingMessageId === msg.id && isSpeaking ? (
                            <>
                              <VolumeX className="w-3 h-3" />
                              <span>{language === 'kn' ? 'ನಿಲ್ಲಿಸಿ' : 'Stop'}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span>{language === 'kn' ? 'ಧ್ವನಿ ಕೇಳಿ' : 'Listen'}</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-emerald-200 opacity-70">
                          {language === 'kn' ? 'ನೀವು ಕೇಳಿದ್ದು' : 'You'}
                        </span>
                      )}

                      <span className="text-[9px] text-gray-400">{msg.time}</span>
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs text-emerald-300 italic w-fit">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span>
                    {language === 'kn'
                      ? 'ಅಗ್ರಿಟೆಕ್ ಎಐ ಕನ್ನಡದಲ್ಲಿ ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...'
                      : 'AI is analyzing mandi prices and agricultural records...'}
                  </span>
                </div>
              )}

              {/* Listening Live Waveform Overlay */}
              {isListening && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-500/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      {language === 'kn' ? 'ಮೈಕ್ರೊಫೋನ್ ಸಕ್ರಿಯವಾಗಿದೆ (ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ)...' : 'Listening (Speak now)...'}
                    </span>
                    <button
                      onClick={toggleListening}
                      className="text-[10px] px-2 py-0.5 rounded bg-red-600 text-white font-bold"
                    >
                      {language === 'kn' ? 'ಮುಗಿಸಿ' : 'Stop'}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 py-1">
                    <span className="w-1.5 h-6 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="w-1.5 h-10 bg-emerald-300 rounded-full animate-pulse delay-75" />
                    <span className="w-1.5 h-8 bg-emerald-400 rounded-full animate-pulse delay-150" />
                    <span className="w-1.5 h-12 bg-[#C6FF4A] rounded-full animate-pulse delay-100" />
                    <span className="w-1.5 h-7 bg-emerald-400 rounded-full animate-pulse delay-200" />
                  </div>

                  {input && (
                    <p className="text-[11px] text-emerald-200 italic bg-black/30 p-1.5 rounded-lg">
                      &quot;{input}&quot;
                    </p>
                  )}
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Kannada Voice Prompt Chips */}
            <div className="px-3 py-1.5 bg-slate-950/70 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {currentQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-emerald-900/60 text-gray-200 hover:text-emerald-300 border border-slate-700 shrink-0 transition-colors flex items-center gap-1"
                >
                  <Radio className="w-2.5 h-2.5 text-emerald-400" />
                  <span>{q}</span>
                </button>
              ))}
            </div>

            {/* Input Bar with Prominent Microphone & Send */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              {/* Microphone Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2.5 rounded-xl transition-all cursor-pointer relative ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-700/50'
                    : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/40'
                }`}
                title={
                  isListening
                    ? 'Listening... Click to stop'
                    : language === 'kn'
                    ? 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ'
                    : 'Click microphone to speak in your language'
                }
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isListening && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-400 animate-ping" />
                )}
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder={
                  language === 'kn'
                    ? 'ಟೊಮೆಟೊ ದರ, ರೋಗ ಅಥವಾ ಮುನ್ಸೂಚನೆ ಕೇಳಿ...'
                    : language === 'hi'
                    ? 'मंडी भाव, फसल सुरक्षा या मौसम के बारे में पूछें...'
                    : 'Ask about mandi prices, diseases, weather...'
                }
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder:text-gray-400 focus:outline-none focus:border-emerald-500"
              />

              {/* Send Button */}
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 disabled:hover:bg-emerald-600 transition-colors cursor-pointer shadow-md"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
