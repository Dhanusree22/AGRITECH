import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { LanguageCode } from '../types';
import { LANGUAGES, translations } from '../i18n/translations';
import { PHRASE_DICTIONARY } from '../i18n/dictionary';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  languages: typeof LANGUAGES;
  currentLanguageConfig: typeof LANGUAGES[0];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Store original English texts for DOM nodes to avoid lossy double-translations
const nodeOriginalTextMap = new WeakMap<Node, string>();
const elementOriginalPlaceholders = new WeakMap<Element, string>();
const elementOriginalTitles = new WeakMap<Element, string>();

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('agritech_lang') as LanguageCode;
    return saved && translations[saved] ? saved : 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('agritech_lang', lang);
  };

  // Compile combined dictionary lookup map for current language
  const activeDictionary = useMemo(() => {
    const combined: Record<string, string> = {};
    
    // 1. Base key translations
    if (translations[language]) {
      Object.assign(combined, translations[language]);
    }
    
    // 2. Phrase dictionary
    if (PHRASE_DICTIONARY[language]) {
      Object.assign(combined, PHRASE_DICTIONARY[language]);
    }

    // 3. Reverse map English keys from translations.en -> language translations
    if (translations.en && translations[language]) {
      Object.entries(translations.en).forEach(([k, enVal]) => {
        if (translations[language][k]) {
          combined[enVal] = translations[language][k];
          combined[enVal.toLowerCase()] = translations[language][k];
        }
      });
    }

    // 4. Reverse map English phrases from PHRASE_DICTIONARY.en -> language
    if (PHRASE_DICTIONARY.en && PHRASE_DICTIONARY[language]) {
      Object.entries(PHRASE_DICTIONARY.en).forEach(([enKey, enVal]) => {
        if (PHRASE_DICTIONARY[language][enKey]) {
          combined[enVal] = PHRASE_DICTIONARY[language][enKey];
          combined[enVal.toLowerCase()] = PHRASE_DICTIONARY[language][enKey];
        }
      });
    }

    return combined;
  }, [language]);

  // Primary translation function
  const t = useCallback(
    (keyOrPhrase: string, fallback?: string): string => {
      if (!keyOrPhrase) return fallback || '';
      const trimmed = keyOrPhrase.trim();

      // Direct match
      if (activeDictionary[keyOrPhrase]) {
        return activeDictionary[keyOrPhrase];
      }
      if (activeDictionary[trimmed]) {
        return activeDictionary[trimmed];
      }

      // Check lowercase
      const lower = trimmed.toLowerCase();
      if (activeDictionary[lower]) {
        return activeDictionary[lower];
      }

      // If English, return original or fallback
      if (language === 'en') {
        return fallback || keyOrPhrase;
      }

      // Smart phrase & unit substitution for common agricultural metrics
      let result = trimmed;
      let replaced = false;

      // Common word replacements in Kannada & other languages
      const wordReplacements: [RegExp, string][] = language === 'kn' ? [
        [/\/kg\b/gi, '/ಕೆ.ಜಿ.'],
        [/\bper kg\b/gi, 'ಪ್ರತಿ ಕೆ.ಜಿ.'],
        [/\bTons\b/gi, 'ಟನ್‌ಗಳು'],
        [/\bTon\b/gi, 'ಟನ್'],
        [/\bQuintal\b/gi, 'ಕ್ವಿಂಟಾಲ್'],
        [/\bQuintals\b/gi, 'ಕ್ವಿಂಟಾಲ್‌ಗಳು'],
        [/\bGrade A\b/gi, 'ಗ್ರೇಡ್ ಎ'],
        [/\bGrade B\b/gi, 'ಗ್ರೇಡ್ ಬಿ'],
        [/\bGrade C\b/gi, 'ಗ್ರೇಡ್ ಸಿ'],
        [/\bOrganic\b/gi, 'ಸಾವಯವ'],
        [/\bVerified\b/gi, 'ದೃಢೀಕರಿಸಲಾಗಿದೆ'],
        [/\bPending\b/gi, 'ಬಾಕಿ ಉಳಿದಿದೆ'],
        [/\bApproved\b/gi, 'ಅನುಮೋದಿಸಲಾಗಿದೆ'],
        [/\bRejected\b/gi, 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ'],
        [/\bCompleted\b/gi, 'ಪೂರ್ಣಗೊಂಡಿದೆ'],
        [/\bActive\b/gi, 'ಸಕ್ರಿಯ'],
        [/\bFarmer\b/gi, 'ರೈತ'],
        [/\bBuyer\b/gi, 'ಖರೀದಿದಾರ'],
        [/\bAdmin\b/gi, 'ಆಡಳಿತಾಧಿಕಾರಿ'],
        [/\bMandi\b/gi, 'ಮಂಡಿ'],
        [/\bScore\b/gi, 'ಅಂಕ'],
        [/\bPrice\b/gi, 'ಬೆಲೆ'],
        [/\bQuantity\b/gi, 'ಪ್ರಮಾಣ'],
        [/\bStatus\b/gi, 'ಸ್ಥಿತಿ'],
        [/\bTotal\b/gi, 'ಒಟ್ಟು'],
      ] : language === 'hi' ? [
        [/\/kg\b/gi, '/कि.ग्रा.'],
        [/\bper kg\b/gi, 'प्रति कि.ग्रा.'],
        [/\bTons\b/gi, 'टन'],
        [/\bQuintal\b/gi, 'क्विंटल'],
        [/\bGrade A\b/gi, 'ग्रेड ए'],
        [/\bGrade B\b/gi, 'ग्रेड बी'],
        [/\bGrade C\b/gi, 'ग्रेड सी'],
        [/\bOrganic\b/gi, 'जैविक'],
        [/\bVerified\b/gi, 'सत्यापित'],
        [/\bPending\b/gi, 'लंबित'],
        [/\bApproved\b/gi, 'स्वीकृत'],
        [/\bFarmer\b/gi, 'किसान'],
        [/\bBuyer\b/gi, 'खरीदार'],
      ] : [];

      for (const [pattern, replacement] of wordReplacements) {
        if (pattern.test(result)) {
          result = result.replace(pattern, replacement);
          replaced = true;
        }
      }

      if (replaced) {
        return result;
      }

      return fallback || keyOrPhrase;
    },
    [activeDictionary, language]
  );

  const currentLanguageConfig = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  // Dynamic DOM-level translation observer for 100% complete coverage of every single text node
  useEffect(() => {
    document.documentElement.lang = language;

    if (typeof window === 'undefined') return;

    // Helper to translate single text content
    const translateString = (str: string): string => {
      if (!str || str.trim().length === 0) return str;
      const trimmed = str.trim();

      // Check direct dictionary match
      if (activeDictionary[trimmed]) {
        return str.replace(trimmed, String(activeDictionary[trimmed]));
      }

      // Check phrase dictionary entries
      for (const [enKey, localizedVal] of Object.entries(activeDictionary)) {
        if (enKey.length > 2 && typeof localizedVal === 'string' && trimmed.includes(enKey)) {
          return str.replace(enKey, localizedVal);
        }
      }

      return t(trimmed, str);
    };

    // Recursive node walker
    const processNode = (node: Node) => {
      // Skip scripts, styles, pre, code, and active editable text areas
      const parent = node.parentElement;
      if (
        parent &&
        (parent.tagName === 'SCRIPT' ||
          parent.tagName === 'STYLE' ||
          parent.tagName === 'NOSCRIPT' ||
          parent.isContentEditable ||
          (parent.tagName === 'INPUT' && (parent as HTMLInputElement).type !== 'button' && (parent as HTMLInputElement).type !== 'submit'))
      ) {
        return;
      }

      // Text Nodes
      if (node.nodeType === Node.TEXT_NODE) {
        let original = nodeOriginalTextMap.get(node);
        if (original === undefined) {
          original = node.nodeValue || '';
          nodeOriginalTextMap.set(node, original);
        }

        if (language === 'en') {
          if (node.nodeValue !== original) {
            node.nodeValue = original;
          }
        } else {
          const translated = translateString(original);
          if (translated !== node.nodeValue && translated !== original) {
            node.nodeValue = translated;
          }
        }
      }

      // Element Attributes (placeholders, titles, option values)
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;

        // Placeholders
        if (el.hasAttribute('placeholder')) {
          let origPlaceholder = elementOriginalPlaceholders.get(el);
          if (origPlaceholder === undefined) {
            origPlaceholder = el.getAttribute('placeholder') || '';
            elementOriginalPlaceholders.set(el, origPlaceholder);
          }
          if (language === 'en') {
            el.setAttribute('placeholder', origPlaceholder);
          } else {
            const trans = translateString(origPlaceholder);
            if (trans !== origPlaceholder) {
              el.setAttribute('placeholder', trans);
            }
          }
        }

        // Titles
        if (el.hasAttribute('title')) {
          let origTitle = elementOriginalTitles.get(el);
          if (origTitle === undefined) {
            origTitle = el.getAttribute('title') || '';
            elementOriginalTitles.set(el, origTitle);
          }
          if (language === 'en') {
            el.setAttribute('title', origTitle);
          } else {
            const trans = translateString(origTitle);
            if (trans !== origTitle) {
              el.setAttribute('title', trans);
            }
          }
        }
      }
    };

    // Process entire body once
    const walkTree = (root: Node) => {
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        null
      );
      let currentNode = walker.nextNode();
      while (currentNode) {
        processNode(currentNode);
        currentNode = walker.nextNode();
      }
    };

    walkTree(document.body);

    // Observe future dynamic DOM changes (modals, dropdowns, async data, tab switches)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((added) => walkTree(added));
        } else if (mutation.type === 'characterData' && mutation.target) {
          processNode(mutation.target);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [language, activeDictionary, t]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages: LANGUAGES,
        currentLanguageConfig,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

