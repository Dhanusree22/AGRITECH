import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { enLocale } from './locales/en';
import { knLocale } from './locales/kn';
import { hiLocale } from './locales/hi';
import { taLocale } from './locales/ta';
import { teLocale } from './locales/te';
import { mlLocale } from './locales/ml';
import { mrLocale } from './locales/mr';
import { bnLocale } from './locales/bn';
import { SupportedLanguageCode, SUPPORTED_LANGUAGES } from './languageConfig';

export const resources = {
  en: enLocale,
  kn: knLocale,
  hi: hiLocale,
  ta: taLocale,
  te: teLocale,
  ml: mlLocale,
  mr: mrLocale,
  bn: bnLocale,
};

const savedLanguage = (typeof window !== 'undefined' ? localStorage.getItem('agritech_lang') : null) as SupportedLanguageCode | null;
const initialLanguage = savedLanguage && ['en', 'kn', 'hi', 'ta', 'te', 'ml', 'mr', 'bn'].includes(savedLanguage)
  ? savedLanguage
  : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'home', 'auth', 'farmer', 'buyer', 'admin', 'chatbot', 'voice', 'reports', 'validation'],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });

export interface AuditReport {
  languageCode: SupportedLanguageCode;
  languageName: string;
  nativeName: string;
  totalBaseKeys: number;
  translatedKeys: number;
  missingKeys: string[];
  completenessPercentage: number;
}

export function runLocalizationAudit(): {
  totalBaseKeys: number;
  reports: AuditReport[];
  overallCompleteness: number;
} {
  const baseLocale = enLocale;
  const namespaces = Object.keys(baseLocale) as Array<keyof typeof enLocale>;

  // Collect all base keys in dot notation: "namespace.key"
  const allBaseKeyPaths: string[] = [];
  namespaces.forEach((ns) => {
    const nsObj = baseLocale[ns] as Record<string, string>;
    Object.keys(nsObj).forEach((k) => {
      allBaseKeyPaths.push(`${String(ns)}.${k}`);
    });
  });

  const totalBaseKeys = allBaseKeyPaths.length;

  const reports: AuditReport[] = SUPPORTED_LANGUAGES.map((lang) => {
    const langLocale = resources[lang.code as SupportedLanguageCode];
    let translatedCount = 0;
    const missingKeys: string[] = [];

    allBaseKeyPaths.forEach((path) => {
      const [ns, key] = path.split('.') as [keyof typeof enLocale, string];
      const targetNsObj = langLocale ? (langLocale[ns] as Record<string, string> | undefined) : undefined;
      const targetVal = targetNsObj ? targetNsObj[key] : undefined;

      if (targetVal && typeof targetVal === 'string' && targetVal.trim().length > 0) {
        translatedCount++;
      } else {
        missingKeys.push(path);
      }
    });

    const completenessPercentage = totalBaseKeys > 0
      ? Math.round((translatedCount / totalBaseKeys) * 1000) / 10
      : 100;

    return {
      languageCode: lang.code,
      languageName: lang.label,
      nativeName: lang.nativeName,
      totalBaseKeys,
      translatedKeys: translatedCount,
      missingKeys,
      completenessPercentage,
    };
  });

  const avgCompleteness = reports.reduce((acc, r) => acc + r.completenessPercentage, 0) / reports.length;

  return {
    totalBaseKeys,
    reports,
    overallCompleteness: Math.round(avgCompleteness * 10) / 10,
  };
}

export default i18n;
