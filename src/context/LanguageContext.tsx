import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { LanguageCode } from '../types';
import { LANGUAGES, translations } from '../i18n/translations';
import { PHRASE_DICTIONARY } from '../i18n/dictionary';
import { COMPREHENSIVE_PHRASES, WORD_DICTIONARY } from '../i18n/comprehensiveDictionary';

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

    // 1. Base key translations from translations.ts
    if (translations[language]) {
      Object.assign(combined, translations[language]);
    }

    // 2. Phrase dictionary from dictionary.ts
    if (PHRASE_DICTIONARY[language]) {
      Object.assign(combined, PHRASE_DICTIONARY[language]);
    }

    // 3. Comprehensive phrases from comprehensiveDictionary.ts
    if (COMPREHENSIVE_PHRASES[language]) {
      Object.assign(combined, COMPREHENSIVE_PHRASES[language]);
    }

    // 4. Reverse map English keys from translations.en -> language translations
    if (translations.en && translations[language]) {
      Object.entries(translations.en).forEach(([k, enVal]) => {
        if (translations[language][k]) {
          combined[enVal] = translations[language][k];
          combined[enVal.toLowerCase()] = translations[language][k];
        }
      });
    }

    // 5. Reverse map English phrases from PHRASE_DICTIONARY.en -> language
    if (PHRASE_DICTIONARY.en && PHRASE_DICTIONARY[language]) {
      Object.entries(PHRASE_DICTIONARY.en).forEach(([enKey, enVal]) => {
        if (PHRASE_DICTIONARY[language][enKey]) {
          combined[enVal] = PHRASE_DICTIONARY[language][enKey];
          combined[enVal.toLowerCase()] = PHRASE_DICTIONARY[language][enKey];
        }
      });
    }

    // 6. Reverse map from COMPREHENSIVE_PHRASES.en -> language
    if (COMPREHENSIVE_PHRASES.en && COMPREHENSIVE_PHRASES[language]) {
      Object.entries(COMPREHENSIVE_PHRASES.en).forEach(([enKey, enVal]) => {
        if (COMPREHENSIVE_PHRASES[language][enKey]) {
          combined[enVal] = COMPREHENSIVE_PHRASES[language][enKey];
          combined[enVal.toLowerCase()] = COMPREHENSIVE_PHRASES[language][enKey];
        }
      });
    }

    // 7. Also make sure all direct English keys in COMPREHENSIVE_PHRASES[language] have lowercase entries
    if (COMPREHENSIVE_PHRASES[language]) {
      Object.entries(COMPREHENSIVE_PHRASES[language]).forEach(([enPhrase, localizedPhrase]) => {
        if (localizedPhrase) {
          combined[enPhrase] = String(localizedPhrase);
          combined[enPhrase.toLowerCase()] = String(localizedPhrase);
        }
      });
    }

    return combined;
  }, [language]);

  // Pre-sorted list of phrase keys (longest first) to prevent premature substrings from replacing first
  const sortedPhrases = useMemo(() => {
    return Object.keys(activeDictionary)
      .filter((k) => k && k.length > 1 && !/^[0-9\s.,/\\()\-:;%₹+]+$/.test(k))
      .sort((a, b) => b.length - a.length);
  }, [activeDictionary]);

  // Active single-word fallback dictionary
  const activeWordDictionary = useMemo(() => {
    return WORD_DICTIONARY[language] || {};
  }, [language]);

  // Primary translation engine function
  const translateString = useCallback(
    (str: string): string => {
      if (!str || str.trim().length === 0) return str;
      if (language === 'en') return str;

      const trimmed = str.trim();

      // 1. Exact match in combined dictionary
      if (activeDictionary[trimmed]) {
        return str.replace(trimmed, String(activeDictionary[trimmed]));
      }
      const lower = trimmed.toLowerCase();
      if (activeDictionary[lower]) {
        return str.replace(trimmed, String(activeDictionary[lower]));
      }

      // 2. Sequential multi-phrase replacement (from longest phrase to shortest)
      let result = str;
      let hasReplaced = false;

      for (const phraseKey of sortedPhrases) {
        if (phraseKey.length > 1 && result.includes(phraseKey)) {
          const localized = activeDictionary[phraseKey];
          if (localized && localized !== phraseKey) {
            result = result.split(phraseKey).join(localized);
            hasReplaced = true;
          }
        }
      }

      // 3. Smart metric & unit replacements (like /kg, per kg, Tons, etc.)
      const unitMap: [RegExp, string][] =
        language === 'kn'
          ? [
              [/\/kg\b/gi, '/ಕೆ.ಜಿ.'],
              [/\bper kg\b/gi, 'ಪ್ರತಿ ಕೆ.ಜಿ.'],
              [/\bTons\b/gi, 'ಟನ್‌ಗಳು'],
              [/\bTon\b/gi, 'ಟನ್'],
              [/\bQuintal\b/gi, 'ಕ್ವಿಂಟಾಲ್'],
              [/\bQuintals\b/gi, 'ಕ್ವಿಂಟಾಲ್‌ಗಳು'],
            ]
          : language === 'hi'
          ? [
              [/\/kg\b/gi, '/कि.ग्रा.'],
              [/\bper kg\b/gi, 'प्रति कि.ग्रा.'],
              [/\bTons\b/gi, 'टन'],
              [/\bQuintal\b/gi, 'क्विंटल'],
            ]
          : [];

      for (const [pattern, replacement] of unitMap) {
        if (pattern.test(result)) {
          result = result.replace(pattern, replacement);
          hasReplaced = true;
        }
      }

      // 4. Word-level token translation for any remaining English words
      result = result.replace(/\b[A-Za-z][A-Za-z0-9'-]*\b/g, (match) => {
        if (activeWordDictionary[match]) {
          hasReplaced = true;
          return activeWordDictionary[match];
        }
        const matchLower = match.toLowerCase();
        if (activeWordDictionary[matchLower]) {
          hasReplaced = true;
          return activeWordDictionary[matchLower];
        }
        const cap = match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
        if (activeWordDictionary[cap]) {
          hasReplaced = true;
          return activeWordDictionary[cap];
        }
        return match;
      });

      return hasReplaced ? result : str;
    },
    [activeDictionary, activeWordDictionary, language, sortedPhrases]
  );

  // Hook-level t() function
  const t = useCallback(
    (keyOrPhrase: string, fallback?: string): string => {
      if (!keyOrPhrase) return fallback || '';
      if (language === 'en') return fallback || keyOrPhrase;
      return translateString(keyOrPhrase) || fallback || keyOrPhrase;
    },
    [language, translateString]
  );

  const currentLanguageConfig = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  // Dynamic DOM-level translation observer for 100% complete coverage of every single text node
  useEffect(() => {
    document.documentElement.lang = language;

    if (typeof window === 'undefined') return;

    // Recursive node processor
    const processNode = (node: Node) => {
      const parent = node.parentElement;
      if (
        parent &&
        (parent.tagName === 'SCRIPT' ||
          parent.tagName === 'STYLE' ||
          parent.tagName === 'NOSCRIPT' ||
          parent.isContentEditable ||
          (parent.tagName === 'INPUT' &&
            (parent as HTMLInputElement).type !== 'button' &&
            (parent as HTMLInputElement).type !== 'submit'))
      ) {
        return;
      }

      // Text Nodes
      if (node.nodeType === Node.TEXT_NODE) {
        let original = nodeOriginalTextMap.get(node);
        if (original === undefined) {
          original = node.nodeValue || '';
          nodeOriginalTextMap.set(node, original);
        } else {
          // If the nodeValue changed dynamically by React and contains English
          const currentTrans = language === 'en' ? original : translateString(original);
          if (
            node.nodeValue !== currentTrans &&
            node.nodeValue !== original &&
            node.nodeValue &&
            node.nodeValue.trim().length > 0 &&
            /[A-Za-z]/.test(node.nodeValue)
          ) {
            original = node.nodeValue;
            nodeOriginalTextMap.set(node, original);
          }
        }

        if (language === 'en') {
          if (node.nodeValue !== original) {
            node.nodeValue = original;
          }
        } else {
          const translated = translateString(original);
          if (translated !== node.nodeValue) {
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
            if (el.getAttribute('placeholder') !== origPlaceholder) {
              el.setAttribute('placeholder', origPlaceholder);
            }
          } else {
            const trans = translateString(origPlaceholder);
            if (el.getAttribute('placeholder') !== trans) {
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
            if (el.getAttribute('title') !== origTitle) {
              el.setAttribute('title', origTitle);
            }
          } else {
            const trans = translateString(origTitle);
            if (el.getAttribute('title') !== trans) {
              el.setAttribute('title', trans);
            }
          }
        }

        // Button/Submit inputs
        if (
          el.tagName === 'INPUT' &&
          ((el as HTMLInputElement).type === 'button' || (el as HTMLInputElement).type === 'submit')
        ) {
          const inputEl = el as HTMLInputElement;
          const val = inputEl.value;
          if (val) {
            if (language === 'en') {
              // preserve
            } else {
              const trans = translateString(val);
              if (trans !== val) {
                inputEl.value = trans;
              }
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
  }, [language, translateString]);

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
