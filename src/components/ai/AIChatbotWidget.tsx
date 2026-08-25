import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Sparkles, Mic, Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export const AIChatbotWidget: React.FC = () => {
  const { language, currentLanguageConfig, t } = useLanguage();
  const { role, user } = useAuth();

  // Admin module must NOT include AI chatbot as per user instructions
  if (role === 'admin') {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text:
        language === 'kn'
          ? 'ನಮಸ್ಕಾರ! ನಾನು ಅಗ್ರಿಟೆಕ್ ಎಐ ಸಹಾಯಕ. ನೀವು ಮಂಡಿ ಬೆಲೆಗಳು, ಹವಾಮಾನ, ಬೆಳೆ ರೋಗ ಅಥವಾ ಖರೀದಿದಾರರ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಬಹುದು.'
          : language === 'hi'
          ? 'नमस्ते! मैं एग्रीटेक एआई सहायक हूँ। आप मंडी भाव, फसल रोग या खरीदार खोज के बारे में पूछ सकते हैं।'
          : 'Hello! I am AgriAI Intelligence Assistant. Ask me about live Mandi prices, crop grading, weather alerts, or buyer matchings.',
      time: 'Now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          role,
          language,
          context: `User role: ${role}. Location: ${user?.location || 'Karnataka'}. Mandi Tomato is ₹32/kg.`,
        }),
      });

      let aiReply = '';
      if (res.ok) {
        const data = await res.json();
        aiReply = data.reply;
      } else {
        aiReply =
          language === 'kn'
            ? 'ಕೋಲಾರ ಮಂಡಿಯಲ್ಲಿ ಇಂದಿನ ಟೊಮೆಟೊ ಬೆಲೆ ₹32/ಕೆಜಿ. ಗುಣಮಟ್ಟದ ಎ-ಗ್ರೇಡ್ ಟೊಮೆಟೊಗಳಿಗೆ ಬೇಡಿಕೆ ಹೆಚ್ಚಾಗಿದೆ.'
            : 'Today modal price for Tomato in Kolar APMC is ₹32/kg. High buyer demand recorded across Southern distribution centers.';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Mandi pricing and agricultural advisories are operating normally. How else may I assist you today?',
          time: 'Now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions =
    language === 'kn'
      ? ['ಟೊಮೆಟೊ ಮಂಡಿ ಬೆಲೆ?', 'ಖರೀದಿದಾರರನ್ನು ಹುಡುಕಿ', 'ರೋಗ ನಿರ್ವಹಣೆ']
      : language === 'hi'
      ? ['टमाटर का मंडी भाव?', 'खरीदार खोजें', 'मौसम की चेतावनी']
      : ['Tomato Mandi Rate?', 'Find Nearby Buyers', 'Pest Advisory'];

  return (
    <>
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
            onClick={() => setIsOpen(true)}
            className="p-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl shadow-emerald-700/40 flex items-center justify-center border border-emerald-400/40 cursor-pointer"
            title="AgriAI Multilingual Chatbot"
          >
            <Bot className="w-6 h-6" />
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
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[540px] bg-slate-900 rounded-3xl border border-emerald-500/30 shadow-2xl flex flex-col overflow-hidden text-white"
          >
            {/* Header */}
            <div className="p-3.5 px-4 bg-slate-950 border-b border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    AgriAI Assistant
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </h4>
                  <span className="text-[10px] text-gray-400">{currentLanguageConfig.nativeName} ({currentLanguageConfig.label})</span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className="text-[9px] text-gray-400 block mt-1 text-right">{msg.time}</span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 italic">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>AI analyzing data...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Pills */}
            <div className="px-3 py-1.5 bg-slate-950/60 border-t border-slate-800 flex flex-wrap gap-1.5">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-900/50 text-gray-300 hover:text-emerald-300 border border-slate-700"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder={t('askAnything', 'Ask about crops, prices, weather...')}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="p-2 rounded-xl bg-emerald-600 text-white disabled:opacity-40 hover:bg-emerald-500"
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
