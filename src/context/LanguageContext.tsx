import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { LanguageCode } from '../types';
import { translations } from '../i18n/translations';
import { PHRASE_DICTIONARY } from '../i18n/dictionary';
import { COMPREHENSIVE_PHRASES, WORD_DICTIONARY } from '../i18n/comprehensiveDictionary';
import { MASTER_UI_PHRASES, MASTER_WORD_MAP } from '../i18n/masterTranslationDictionary';
import {
  SUPPORTED_LANGUAGES,
  LanguageInfo,
  formatCurrency as helperFormatCurrency,
  formatNumber as helperFormatNumber,
  formatDate as helperFormatDate,
  formatUnit as helperFormatUnit,
  AGRICULTURAL_GLOSSARY,
} from '../i18n/languageConfig';
import i18n, { resources } from '../i18n';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (keyOrPhrase: string, fallbackOrParams?: string | Record<string, any>) => string;
  languages: LanguageInfo[];
  currentLanguageConfig: LanguageInfo;
  formatCurrency: (amount: number) => string;
  formatNumber: (value: number) => string;
  formatDate: (date: Date | string) => string;
  formatUnit: (value: number, unit: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Store original English texts for DOM nodes to avoid lossy double-translations
const nodeOriginalTextMap = new WeakMap<Node, string>();
const elementOriginalPlaceholders = new WeakMap<Element, string>();
const elementOriginalTitles = new WeakMap<Element, string>();
const elementOriginalAriaLabels = new WeakMap<Element, string>();

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = (typeof window !== 'undefined' ? localStorage.getItem('agritech_lang') : null) as LanguageCode;
    return saved && ['en', 'kn', 'hi', 'te', 'ta', 'ml', 'mr', 'bn'].includes(saved) ? saved : 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agritech_lang', lang);
    }
    i18n.changeLanguage(lang);
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

    // 4. Master UI phrases from masterTranslationDictionary.ts (covering all 614 UI strings)
    if (MASTER_UI_PHRASES[language]) {
      Object.assign(combined, MASTER_UI_PHRASES[language]);
    }

    // 5. Agricultural Glossary
    Object.entries(AGRICULTURAL_GLOSSARY).forEach(([termKey, termLangs]) => {
      const enTerm = termLangs.en || termKey;
      const targetTerm = termLangs[language];
      if (targetTerm) {
        combined[termKey] = targetTerm;
        combined[enTerm] = targetTerm;
        combined[enTerm.toLowerCase()] = targetTerm;
      }
    });

    // 6. High-resolution locale resources from /src/i18n/locales
    const baseEnLocale = resources.en;
    const currentLocale = resources[language];

    if (baseEnLocale && currentLocale) {
      const namespaces = Object.keys(baseEnLocale) as Array<keyof typeof baseEnLocale>;
      namespaces.forEach((ns) => {
        const enNsObj = baseEnLocale[ns] as Record<string, string>;
        const curNsObj = (currentLocale[ns] as Record<string, string>) || {};

        Object.entries(enNsObj).forEach(([k, enVal]) => {
          const targetVal = curNsObj[k];
          if (targetVal) {
            combined[`${String(ns)}.${k}`] = targetVal;
            combined[k] = targetVal;
            combined[enVal] = targetVal;
            combined[enVal.toLowerCase()] = targetVal;
          }
        });
      });
    }

    // 7. Normalize all phrases: add lowercase, title case, and UPPERCASE variants
    const allKeys = Object.keys(combined);
    allKeys.forEach((k) => {
      const val = combined[k];
      if (val) {
        const trimmed = k.trim();
        combined[trimmed] = val;
        combined[trimmed.toLowerCase()] = val;
        combined[trimmed.toUpperCase()] = val;
      }
    });

    return combined;
  }, [language]);

  // Pre-sorted list of phrase keys (longest first) to prevent premature substrings from replacing first
  const sortedPhrases = useMemo(() => {
    return Object.keys(activeDictionary)
      .filter((k) => k && k.length > 2 && !/^[0-9\s.,/\\()\-:;%₹+]+$/.test(k))
      .sort((a, b) => b.length - a.length);
  }, [activeDictionary]);

  // Active single-word fallback dictionary (all 1,800+ words including agricultural terms)
  const activeWordDictionary = useMemo(() => {
    const wordMap: Record<string, string> = {};
    if (WORD_DICTIONARY[language]) {
      Object.assign(wordMap, WORD_DICTIONARY[language]);
    }
    if (MASTER_WORD_MAP[language]) {
      Object.assign(wordMap, MASTER_WORD_MAP[language]);
    }
    return wordMap;
  }, [language]);

  // Primary translation engine function
  const translateString = useCallback(
    (str: string): string => {
      if (!str || str.trim().length === 0) return str;
      if (language === 'en') return str;

      // Replace HTML entities
      const rawTrimmed = str.trim();
      const cleaned = rawTrimmed
        .replace(/&bull;/g, '•')
        .replace(/&middot;/g, '·')
        .replace(/&amp;/g, '&')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<');

      // 1. Exact match in combined dictionary
      if (activeDictionary[cleaned]) {
        return str.replace(rawTrimmed, String(activeDictionary[cleaned]));
      }
      const lower = cleaned.toLowerCase();
      if (activeDictionary[lower]) {
        return str.replace(rawTrimmed, String(activeDictionary[lower]));
      }
      const upper = cleaned.toUpperCase();
      if (activeDictionary[upper]) {
        return str.replace(rawTrimmed, String(activeDictionary[upper]));
      }

      // 2. Check stripped punctuation match (e.g., "Mandi:", "Rain: 0mm", "Humidity: 58%")
      const punctMatch = cleaned.match(/^([A-Za-z0-9\s]+)([:.!?,\-()%]+)$/);
      if (punctMatch) {
        const core = punctMatch[1].trim();
        const punct = punctMatch[2];
        if (activeDictionary[core]) {
          return str.replace(rawTrimmed, `${activeDictionary[core]}${punct}`);
        }
        if (activeDictionary[core.toLowerCase()]) {
          return str.replace(rawTrimmed, `${activeDictionary[core.toLowerCase()]}${punct}`);
        }
      }

      // 3. Sequential multi-phrase replacement (from longest phrase to shortest)
      let result = cleaned;
      let hasReplaced = false;

      for (const phraseKey of sortedPhrases) {
        if (phraseKey.length > 2 && result.toLowerCase().includes(phraseKey.toLowerCase())) {
          const localized = activeDictionary[phraseKey];
          if (localized && localized !== phraseKey) {
            // Check word boundaries for clean alphabetical words to avoid mangling larger words
            if (/^[A-Za-z0-9 ]+$/.test(phraseKey)) {
              const regex = new RegExp(`\\b${phraseKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
              if (regex.test(result)) {
                result = result.replace(regex, localized);
                hasReplaced = true;
              }
            } else if (result.includes(phraseKey)) {
              result = result.split(phraseKey).join(localized);
              hasReplaced = true;
            }
          }
        }
      }

      // 4. Word-level token translation for any remaining English words
      result = result.replace(/\b[A-Za-z][A-Za-z0-9'-]*\b/g, (match) => {
        // Direct match
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

        // Check if plural ending with 's' or 'es'
        if (matchLower.endsWith('s') && matchLower.length > 3) {
          const singular = matchLower.slice(0, -1);
          if (activeWordDictionary[singular]) {
            hasReplaced = true;
            return activeWordDictionary[singular];
          }
        }
        if (matchLower.endsWith('es') && matchLower.length > 4) {
          const singular = matchLower.slice(0, -2);
          if (activeWordDictionary[singular]) {
            hasReplaced = true;
            return activeWordDictionary[singular];
          }
        }

        // Check if verb ending with 'ing' or 'ed'
        if (matchLower.endsWith('ing') && matchLower.length > 5) {
          const base = matchLower.slice(0, -3);
          if (activeWordDictionary[base]) {
            hasReplaced = true;
            return activeWordDictionary[base];
          }
        }
        if (matchLower.endsWith('ed') && matchLower.length > 4) {
          const base = matchLower.slice(0, -2);
          if (activeWordDictionary[base]) {
            hasReplaced = true;
            return activeWordDictionary[base];
          }
        }

        return match;
      });

      return hasReplaced ? str.replace(rawTrimmed, result) : str;
    },
    [activeDictionary, activeWordDictionary, language, sortedPhrases]
  );

  // Hook-level t() function
  const t = useCallback(
    (keyOrPhrase: string, fallbackOrParams?: string | Record<string, any>): string => {
      if (!keyOrPhrase) return typeof fallbackOrParams === 'string' ? fallbackOrParams : '';

      let params: Record<string, any> | undefined = undefined;
      let fallback: string | undefined = undefined;
      if (typeof fallbackOrParams === 'object' && fallbackOrParams !== null) {
        params = fallbackOrParams;
      } else if (typeof fallbackOrParams === 'string') {
        fallback = fallbackOrParams;
      }

      let res = '';
      if (language === 'en') {
        res = fallback || keyOrPhrase;
      } else {
        // Check i18next first if dot notation (e.g., 'common.login')
        if (keyOrPhrase.includes('.')) {
          const i18nVal = i18n.t(keyOrPhrase);
          if (i18nVal && i18nVal !== keyOrPhrase) {
            res = i18nVal;
          }
        }
        if (!res) {
          res = translateString(keyOrPhrase) || fallback || keyOrPhrase;
        }
      }

      // Safe parameter interpolation: replaces {key} with value
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          res = res.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        });
      }

      return res;
    },
    [language, translateString]
  );

  const currentLanguageConfig = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  }, [language]);

  // Intl formatting helpers bound to active language
  const formatCurrency = useCallback(
    (amount: number) => helperFormatCurrency(amount, language),
    [language]
  );
  const formatNumber = useCallback(
    (value: number) => helperFormatNumber(value, language),
    [language]
  );
  const formatDate = useCallback(
    (date: Date | string) => helperFormatDate(date, language),
    [language]
  );
  const formatUnit = useCallback(
    (value: number, unit: string) => helperFormatUnit(value, unit, language),
    [language]
  );

  // Dynamic DOM-level translation observer for 100% complete coverage of every single text node
  useEffect(() => {
    document.documentElement.lang = language;

    if (typeof window === 'undefined') return;

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

        // Aria Labels
        if (el.hasAttribute('aria-label')) {
          let origAria = elementOriginalAriaLabels.get(el);
          if (origAria === undefined) {
            origAria = el.getAttribute('aria-label') || '';
            elementOriginalAriaLabels.set(el, origAria);
          }
          if (language === 'en') {
            if (el.getAttribute('aria-label') !== origAria) {
              el.setAttribute('aria-label', origAria);
            }
          } else {
            const trans = translateString(origAria);
            if (el.getAttribute('aria-label') !== trans) {
              el.setAttribute('aria-label', trans);
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

        // Option elements inside <select>
        if (el.tagName === 'OPTION') {
          const opt = el as HTMLOptionElement;
          let origOptText = nodeOriginalTextMap.get(opt);
          if (origOptText === undefined) {
            origOptText = opt.text || opt.innerText || '';
            nodeOriginalTextMap.set(opt, origOptText);
          }
          if (language === 'en') {
            if (opt.text !== origOptText) opt.text = origOptText;
          } else {
            const trans = translateString(origOptText);
            if (opt.text !== trans) {
              opt.text = trans;
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
        } else if (mutation.type === 'attributes' && mutation.target) {
          processNode(mutation.target);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['placeholder', 'title', 'aria-label', 'value'],
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
        languages: SUPPORTED_LANGUAGES,
        currentLanguageConfig,
        formatCurrency,
        formatNumber,
        formatDate,
        formatUnit,
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
