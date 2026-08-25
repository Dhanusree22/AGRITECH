import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mic, Sparkles } from 'lucide-react';
import { VoiceAssistantModal } from './VoiceAssistantModal';
import { useLanguage } from '../../context/LanguageContext';

export const GlobalVoiceButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguageConfig } = useLanguage();

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2"
      >
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-2xl shadow-emerald-700/50 flex items-center justify-center border-2 border-white/20"
          title="AgriAI Voice Assistant (Multilingual)"
        >
          {/* Pulsing ring animation */}
          <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-40 animate-ping -z-10" />
          <Mic className="w-6 h-6 group-hover:scale-110 transition-transform" />

          {/* Language Flag Badge */}
          <span className="absolute -top-1 -right-1 text-xs bg-slate-900 border border-emerald-400/50 rounded-full px-1.5 py-0.5 shadow-md">
            {currentLanguageConfig.flag}
          </span>
        </motion.button>
      </motion.div>

      <VoiceAssistantModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
