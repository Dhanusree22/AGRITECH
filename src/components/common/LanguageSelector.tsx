import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageCode } from '../../types';

interface LanguageSelectorProps {
  variant?: 'light' | 'dark' | 'compact';
  className?: string;
  onLanguageChange?: (lang: LanguageCode) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'light',
  className = '',
  onLanguageChange,
}) => {
  const { language, setLanguage, languages, currentLanguageConfig, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
    if (onLanguageChange) {
      onLanguageChange(code);
    }
  };

  const isDark = variant === 'dark';
  const isCompact = variant === 'compact';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer select-none ${
          isCompact
            ? 'px-2.5 py-1.5'
            : 'px-3.5 py-2'
        } ${
          isDark
            ? 'bg-emerald-950/80 border border-emerald-700/50 text-emerald-100 hover:border-[#C6FF4A] hover:bg-emerald-900/60'
            : 'bg-white/95 border border-[#123D2A]/15 text-[#123D2A] hover:border-[#10B981] hover:bg-emerald-50/50'
        }`}
        title={t('Select Language (8 Indian Languages)')}
      >
        <Globe className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#C6FF4A]' : 'text-[#10B981]'}`} />
        <span className="text-sm shrink-0">{currentLanguageConfig.flag}</span>
        <span className="truncate font-bold">{currentLanguageConfig.nativeName}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''} ${
            isDark ? 'text-emerald-400/80' : 'text-[#123D2A]/60'
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-56 rounded-2xl border shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 ${
            isDark
              ? 'bg-[#062419] border-emerald-700/60 text-emerald-100 shadow-emerald-950/80'
              : 'bg-white border-[#123D2A]/15 text-[#123D2A] shadow-2xl'
          }`}
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b mb-1 border-emerald-900/10">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isDark ? 'text-emerald-400' : 'text-[#123D2A]/60'
              }`}
            >
              {t('Select Language', 'Select Language')}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                isDark ? 'bg-emerald-900/60 text-[#C6FF4A]' : 'bg-emerald-50 text-[#10B981]'
              }`}
            >
              8 {t('Languages', 'Languages')}
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-1">
            {languages.map((l) => {
              const isSelected = language === l.code;
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleSelect(l.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? isDark
                        ? 'bg-emerald-800/80 text-[#C6FF4A] font-bold border border-[#C6FF4A]/40'
                        : 'bg-[#10B981]/15 text-[#123D2A] font-bold border border-[#10B981]/30'
                      : isDark
                      ? 'text-emerald-200 hover:bg-emerald-900/60'
                      : 'text-gray-700 hover:bg-emerald-50/70'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">{l.flag}</span>
                    <span className="font-bold text-xs">{l.nativeName}</span>
                  </span>
                  {isSelected && (
                    <Check
                      className={`w-3.5 h-3.5 ${isDark ? 'text-[#C6FF4A]' : 'text-[#10B981]'}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
