import { LanguageCode } from '../types';

export type SupportedLanguageCode = LanguageCode;

export interface LanguageInfo {
  code: LanguageCode;
  label: string;
  name?: string;
  nativeName: string;
  script: string;
  flag: string;
  speechCode: string;
  intlLocale: string;
  currency: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    label: 'English',
    nativeName: 'English',
    script: 'Latin',
    flag: '🇬🇧',
    speechCode: 'en-IN',
    intlLocale: 'en-IN',
    currency: 'INR',
  },
  {
    code: 'kn',
    label: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    flag: '🇮🇳',
    speechCode: 'kn-IN',
    intlLocale: 'kn-IN',
    currency: 'INR',
  },
  {
    code: 'hi',
    label: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    flag: '🇮🇳',
    speechCode: 'hi-IN',
    intlLocale: 'hi-IN',
    currency: 'INR',
  },
  {
    code: 'ta',
    label: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    flag: '🇮🇳',
    speechCode: 'ta-IN',
    intlLocale: 'ta-IN',
    currency: 'INR',
  },
  {
    code: 'te',
    label: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    flag: '🇮🇳',
    speechCode: 'te-IN',
    intlLocale: 'te-IN',
    currency: 'INR',
  },
  {
    code: 'ml',
    label: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    flag: '🇮🇳',
    speechCode: 'ml-IN',
    intlLocale: 'ml-IN',
    currency: 'INR',
  },
  {
    code: 'mr',
    label: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    flag: '🇮🇳',
    speechCode: 'mr-IN',
    intlLocale: 'mr-IN',
    currency: 'INR',
  },
  {
    code: 'bn',
    label: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    flag: '🇮🇳',
    speechCode: 'bn-IN',
    intlLocale: 'bn-IN',
    currency: 'INR',
  },
];

export const AGRICULTURAL_GLOSSARY: Record<
  string,
  Record<LanguageCode, string>
> = {
  crop: {
    en: 'Crop',
    kn: 'ಬೆಳೆ',
    hi: 'फसल',
    ta: 'பயிர்',
    te: 'పంట',
    ml: 'വിള',
    mr: 'पीक',
    bn: 'ফসল',
  },
  yield: {
    en: 'Yield',
    kn: 'ಇಳುವರಿ',
    hi: 'पैदावार',
    ta: 'விளைச்சல்',
    te: 'దిగుబడి',
    ml: 'വിളവ്',
    mr: 'उत्पादन',
    bn: 'ফলন',
  },
  harvest: {
    en: 'Harvest',
    kn: 'ಕೊಯ್ಲು',
    hi: 'कटाई',
    ta: 'அறுவடை',
    te: 'కోత',
    ml: 'വിളവെടുപ്പ്',
    mr: 'कापणी',
    bn: 'ফসল কাটা',
  },
  cultivation: {
    en: 'Cultivation',
    kn: 'ಕೃಷಿ',
    hi: 'खेती',
    ta: 'விவசாயம்',
    te: 'సాగు',
    ml: 'കൃഷി',
    mr: 'लागवड',
    bn: 'চাষাবাদ',
  },
  soil: {
    en: 'Soil',
    kn: 'ಮಣ್ಣು',
    hi: 'मिट्टी',
    ta: 'மண்',
    te: 'నేల',
    ml: 'മണ്ണ്',
    mr: 'माती',
    bn: 'মাটি',
  },
  irrigation: {
    en: 'Irrigation',
    kn: 'ನೀರಾವರಿ',
    hi: 'सिंचाई',
    ta: 'பாசனம்',
    te: 'నీటిపారుదల',
    ml: 'ജലസേചനം',
    mr: 'सिंचन',
    bn: 'সেচ',
  },
  fertilizer: {
    en: 'Fertilizer',
    kn: 'ಗೊಬ್ಬರ',
    hi: 'उर्वरक',
    ta: 'உரம்',
    te: 'ఎరువు',
    ml: 'വളം',
    mr: 'खत',
    bn: 'সার',
  },
  pesticide: {
    en: 'Pesticide',
    kn: 'ಕೀಟನಾಶಕ',
    hi: 'कीटनाशक',
    ta: 'பூச்சிக்கொல்லி',
    te: 'పురుగుమందు',
    ml: 'കീടനാശിനി',
    mr: 'कीटकनाशक',
    bn: 'কীটনাশক',
  },
  marketPrice: {
    en: 'Market Price',
    kn: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆ',
    hi: 'मंडी भाव',
    ta: 'சந்தை விலை',
    te: 'మార్కెట్ ధర',
    ml: 'വിപണി വില',
    mr: 'बाजारभाव',
    bn: 'বাজার দর',
  },
  mandi: {
    en: 'Mandi',
    kn: 'ಮಂಡಿ',
    hi: 'मंडी',
    ta: 'மண்டி',
    te: 'మండి',
    ml: 'മണ്ടി',
    mr: 'मंडी',
    bn: 'মান্ডি',
  },
  demand: {
    en: 'Demand',
    kn: 'ಬೇಡಿಕೆ',
    hi: 'मांग',
    ta: 'தேவை',
    te: 'డిమాండ్',
    ml: 'ഡിമാൻഡ്',
    mr: 'मागणी',
    bn: 'চাহিদা',
  },
  supply: {
    en: 'Supply',
    kn: 'ಪೂರೈಕೆ',
    hi: 'आपूर्ति',
    ta: 'வழங்கல்',
    te: 'సరఫరా',
    ml: 'വിതരണം',
    mr: 'पुरवठा',
    bn: 'সরবরাহ',
  },
  profit: {
    en: 'Profit',
    kn: 'ಲಾಭ',
    hi: 'लाभ',
    ta: 'லாபம்',
    te: 'లాభం',
    ml: 'ലാഭം',
    mr: 'नफा',
    bn: 'লাভ',
  },
  revenue: {
    en: 'Revenue',
    kn: 'ಆದಾಯ',
    hi: 'राजस्व',
    ta: 'வருவாய்',
    te: 'ఆదాయం',
    ml: 'വരുമാനം',
    mr: 'उत्पन्न',
    bn: 'আয়',
  },
  expenses: {
    en: 'Expenses',
    kn: 'ವೆಚ್ಚಗಳು',
    hi: 'खर्च',
    ta: 'செலவுகள்',
    te: 'ఖర్చులు',
    ml: 'ചെലവുകൾ',
    mr: 'खर्च',
    bn: 'ব্যয়',
  },
  weatherForecast: {
    en: 'Weather Forecast',
    kn: 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ',
    hi: 'मौसम पूर्वानुमान',
    ta: 'வானிலை முன்னறிவிப்பு',
    te: 'వాతావరణ సూచన',
    ml: 'കാലാവസ്ഥാ പ്രവചനം',
    mr: 'हवामान अंदाज',
    bn: 'আবহাওয়ার পূর্বাভাস',
  },
  cropDisease: {
    en: 'Crop Disease',
    kn: 'ಬೆಳೆ ರೋಗ',
    hi: 'फसल रोग',
    ta: 'பயிர் நோய்',
    te: 'పంట తెగులు',
    ml: 'വിള രോഗം',
    mr: 'पीक रोग',
    bn: 'ফসলের রোগ',
  },
  recommendations: {
    en: 'Agricultural Recommendations',
    kn: 'ಕೃಷಿ ಶಿಫಾರಸುಗಳು',
    hi: 'कृषि सिफारिशें',
    ta: 'விவசாய பரிந்துரைகள்',
    te: 'వ్యవసాయ సిఫార్సులు',
    ml: 'കാർഷിക നിർദ്ദേശങ്ങൾ',
    mr: 'कृषी शिफारसी',
    bn: 'কৃষি সুপারিশ',
  },
  purchaseOrder: {
    en: 'Purchase Order',
    kn: 'ಖರೀದಿ ಆರ್ಡರ್',
    hi: 'खरीद आदेश',
    ta: 'கொள்முதல் ஆணை',
    te: 'కొనుగోలు ఆర్డర్',
    ml: 'പർച്ചേസ് ഓർഡർ',
    mr: 'खरेदी आदेश',
    bn: 'ক্রয় আদেশ',
  },
  productListing: {
    en: 'Product Listing',
    kn: 'ಉತ್ಪನ್ನ ಪಟ್ಟಿ',
    hi: 'उत्पाद सूची',
    ta: 'தயாரிப்பு பட்டியல்',
    te: 'ఉత్పత్తి జాబితా',
    ml: 'ഉൽപ്പന്ന ലിസ്റ്റിംഗ്',
    mr: 'उत्पादन यादी',
    bn: 'পণ্য তালিকা',
  },
};

// Intl Formatting Utilities
export function formatCurrency(amount: number, lang: LanguageCode = 'en'): string {
  const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];
  try {
    return new Intl.NumberFormat(langConfig.intlLocale, {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount.toLocaleString()}`;
  }
}

export function formatNumber(num: number, lang: LanguageCode = 'en'): string {
  const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];
  try {
    return new Intl.NumberFormat(langConfig.intlLocale).format(num);
  } catch {
    return num.toLocaleString();
  }
}

export function formatDate(date: string | Date, lang: LanguageCode = 'en'): string {
  const langConfig = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(langConfig.intlLocale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return String(date);
  }
}

export function formatUnit(value: number, unit: string, lang: LanguageCode = 'en'): string {
  const numStr = formatNumber(value, lang);
  const unitMap: Record<string, Record<LanguageCode, string>> = {
    kg: {
      en: 'kg',
      kn: 'ಕೆ.ಜಿ.',
      hi: 'कि.ग्रा.',
      ta: 'கிலோ',
      te: 'కేజీ',
      ml: 'കി.ഗ്രാം',
      mr: 'कि.ग्रॅ.',
      bn: 'কেজি',
    },
    quintal: {
      en: 'Quintal',
      kn: 'ಕ್ವಿಂಟಾಲ್',
      hi: 'क्विंटल',
      ta: 'குவிண்டால்',
      te: 'క్వింటాల్',
      ml: 'ക്വിന്റൽ',
      mr: 'क्विंटल',
      bn: 'কুইন্টাল',
    },
    tons: {
      en: 'Tons',
      kn: 'ಟನ್‌ಗಳು',
      hi: 'टन',
      ta: 'டன்கள்',
      te: 'టన్నులు',
      ml: 'ടൺ',
      mr: 'टन',
      bn: 'টন',
    },
    acres: {
      en: 'Acres',
      kn: 'ಎಕರೆಗಳು',
      hi: 'एकड़',
      ta: 'ஏக்கர்',
      te: 'ఎకరాలు',
      ml: 'ഏക്കർ',
      mr: 'एकर',
      bn: 'একর',
    },
    hectares: {
      en: 'Hectares',
      kn: 'ಹೆಕ್ಟೇರ್‌ಗಳು',
      hi: 'हेक्टेयर',
      ta: 'ஹெக்டேர்',
      te: 'హెక్టార్లు',
      ml: 'ഹെക്ടർ',
      mr: 'हेक्टर',
      bn: 'হেক্টর',
    },
  };

  const localizedUnit = unitMap[unit.toLowerCase()]?.[lang] || unit;
  return `${numStr} ${localizedUnit}`;
}
