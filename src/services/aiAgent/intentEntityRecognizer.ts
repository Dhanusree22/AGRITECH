// Multilingual Intent & Entity Recognition Engine for AGRITECH AI Agent
// Supports: English, Kannada, Hindi, Telugu, Tamil, Malayalam, Marathi, Bengali

import { AgentIntent, ExtractedEntities } from './types';
import { CROP_MASTER_LIST, SUPPORTED_MANDIS } from '../mandiPredictionEngine';

// Multilingual Crop Aliases Mapping to Canonical Crop Name
const CROP_ALIASES: Record<string, string[]> = {
  'Tomato': [
    'tomato', 'tomatoes', 'tamatar',
    'ಟೊಮೆಟೊ', 'ಟೊಮ್ಯಾಟೊ', 'ಟೊಮ್ಯಾಟೋ',
    'टमाटर',
    'టమాటా', 'టమాట', 'టమోటా',
    'தக்காளி',
    'തക്കാളി',
    'टोमॅटो',
    'টমেটো',
  ],
  'Red Onion': [
    'onion', 'onions', 'red onion', 'pyaz', 'kanda', 'savala',
    'ಈರುಳ್ಳಿ', 'ಕೆಂಪು ಈರುಳ್ಳಿ', 'ಉಳ್ಳಾಗಡ್ಡಿ',
    'प्याज', 'लाल प्याज',
    'ఉల్లిపాయ', 'ఉల్లి', 'ఎర్రగడ్డలు',
    'வெங்காயம்', 'சின்ன வெங்காயம்',
    'സവാള', 'ഉള്ളി',
    'कांदा', 'लाल कांदा',
    'পেঁয়াজ', 'লাল পেঁয়াজ',
  ],
  'Potato': [
    'potato', 'potatoes', 'aloo', 'alu', 'batata',
    'ಆಲೂಗಡ್ಡೆ', 'ಆಲೂ', 'ಬಟಾಟೆ',
    'आलू', 'बटाटा',
    'బంగాళాదుంప', 'ఆలుగడ్డ',
    'உருளைக்கிழங்கு',
    'ഉരുളക്കിഴങ്ങ്',
    'बटाटा',
    'আলু',
  ],
  'Paddy / Sona Masoori Rice': [
    'paddy', 'rice', 'sona masoori', 'chawal', 'dhan', 'bhatta', 'akki',
    'ಭತ್ತ', 'ಅಕ್ಕಿ', 'ಸೋನಾ ಮಸೂರಿ',
    'धान', 'चावल', 'सोना मसूरी',
    'వరి', 'వరి ధాన్యం', 'బియ్యం',
    'நெல்', 'அரிசி',
    'നെല്ല്', 'അരി',
    'भात', 'तांदूळ',
    'ধান', 'চাল',
  ],
  'Wheat': [
    'wheat', 'gehu', 'godhi',
    'ಗೋಧಿ',
    'गेहूं', 'कनक',
    'గోధుమలు', 'గోధుమ',
    'கோதுமை',
    'ഗോതമ്പ്',
    'गहू',
    'গম',
  ],
  'Maize': [
    'maize', 'corn', 'makka', 'musukina jola',
    'ಮೆಕ್ಕೆಜೋಳ', 'ಜೋಳ',
    'मक्का', 'भुट्टा',
    'మొక్కజొన్న',
    'மக்காச்சோளம்', 'சோளம்',
    'മക്കച്ചോളം',
    'मका',
    'ভুট্টা',
  ],
  'Cotton': [
    'cotton', 'kapas', 'hatti',
    'ಹತ್ತಿ',
    'कपास', 'रूई',
    'పత్తి',
    'பருத்தி',
    'പരുത്തി',
    'कापूस',
    'তুলা',
  ],
  'Green Chilli': [
    'chilli', 'green chilli', 'chili', 'mirchi', 'menasinakai',
    'ಮೆಣಸಿನಕಾಯಿ', 'ಹಸಿರು ಮೆಣಸಿನಕಾಯಿ',
    'मिर्च', 'हरी मिर्च',
    'మిరపకాయ', 'పచ్చిమిర్చి',
    'மிளகாய்', 'பச்சை மிளகாய்',
    'മുളക്', 'പച്ചമുളക്',
    'मिरची', 'हिरवी मिरची',
    'লঙ্কা', 'কাঁচা লঙ্কা',
  ],
  'Turmeric': [
    'turmeric', 'haldi', 'arishina', 'pasupu', 'manjal',
    'ಅರಿಶಿನ', 'ಅರಿಷಿಣ',
    'हल्दी',
    'పసుపు',
    'மஞ்சள்',
    'മഞ്ഞൾ',
    'हळद',
    'হলুদ',
  ],
  'Ginger': [
    'ginger', 'adrak', 'shunti', 'allam', 'inji',
    'ಶುಂಠಿ',
    'अदरक', 'आदी',
    'అల్లం',
    'இஞ்சி',
    'ഇഞ്ചി',
    'आले',
    'আদা',
  ],
  'Garlic': [
    'garlic', 'lahsun', 'bellulli', 'vellulli', 'poondu',
    'ಬೆಳ್ಳುಳ್ಳಿ',
    'लहसुन',
    'వెల్లుల్లి',
    'பூண்டு',
    'വെളുത്തുള്ളി',
    'लसूण',
    'রসুন',
  ],
  'Mustard': [
    'mustard', 'sarson', 'sasive', 'aavalu', 'kadugu',
    'ಸಾಸಿವೆ',
    'सरसों', 'राई',
    'ఆవాలు',
    'கடுகு',
    'കടുക്',
    'मोहरी',
    'সরিষা',
  ],
  'Green Capsicum': [
    'capsicum', 'shimla mirch', 'dappa menasinakai', 'bell pepper',
    'ಕ್ಯಾಪ್ಸಿಕಂ', 'ದಪ್ಪ ಮೆಣಸಿನಕಾಯಿ',
    'शिमला मिर्च', 'कैप्सिकम',
    'క్యాప్సికం', 'బుట్ట మిరప',
    'குடைமிளகாய்',
    'ക്യാപ്സിക്കം',
    'ढोबळी मिरची',
    'ক্যাপসিকাম',
  ],
  'Groundnut': [
    'groundnut', 'peanut', 'mungfali', 'kadalekayi', 'verusenaga',
    'ಕಡಲೆಕಾಯಿ', 'ಶೇಂಗಾ',
    'मूंगफली',
    'వేరుశనగ', 'పల్లీలు',
    'வேர்க்கடலை', 'மணிலா பயறு',
    'നിലക്കടല',
    'भुईमूग', 'शेंगदाणा',
    'চিনাবাদাম',
  ],
  'Sugarcane': [
    'sugarcane', 'ganna', 'kabbu', 'cheruku', 'karumbu',
    'ಕಬ್ಬು',
    'गन्ना',
    'చెరకు',
    'கரும்பு',
    'കരിമ്പ്',
    'ऊस',
    'আখ',
  ],
  'Banana': [
    'banana', 'kela', 'bale hannu', 'arati', 'vazhai',
    'ಬಾಳೆಹಣ್ಣು', 'ಬಾಳೆ',
    'केला',
    'అరటిపండు', 'అరటి',
    'வாழைப்பழம்',
    'വാഴപ്പഴം',
    'केळे',
    'কলা',
  ],
  'Mango': [
    'mango', 'aam', 'mavinahannu', 'mamidi', 'maangai',
    'ಮಾವಿನಹಣ್ಣು', 'ಮಾವಿನ',
    'आम',
    'మామిడిపండు', 'మామిడి',
    'மாம்பழம்',
    'മാമ്പഴം',
    'आंबा',
    'আম',
  ],
};

// Multilingual Mandi Aliases Mapping
const MANDI_ALIASES: Record<string, string[]> = {
  'Kolar APMC Market': [
    'kolar', 'ಕೋಲಾರ', 'कोलार', 'కోలార్', 'கோலார்', 'കോലാർ',
  ],
  'Yeshwanthpur APMC (Bengaluru)': [
    'bengaluru', 'bangalore', 'yeshwanthpur', 'yeshwantpur',
    'ಬೆಂಗಳೂರು', 'ಯಶವಂತಪುರ',
    'बैंगलोर', 'बेंगलुरु', 'यशवंतपुर',
    'బెంగళూరు', 'యశ్వంత్‌పూర్',
    'பெங்களூரு',
    'ബാംഗ്ലൂർ',
    'बंगळुरू',
  ],
  'Mysuru APMC (Bandipalya)': [
    'mysuru', 'mysore', 'bandipalya',
    'ಮೈಸೂರು', 'ಬಂಡಿಪಾಳ್ಯ',
    'मैसूर', 'मैसुरु',
    'మైసూర్',
    'மைசூர்',
  ],
  'Hubballi APMC (Amargol)': [
    'hubballi', 'hubli', 'amargol',
    'ಹುಬ್ಬಳ್ಳಿ', 'ಹುಬ್ಳಿ', 'ಅಮರಗೋಳ',
    'हुबली', 'हुबल्ली',
    'హుబ్లీ',
  ],
  'Belagavi Mandi': [
    'belagavi', 'belgaum',
    'ಬೆಳಗಾವಿ', 'ಬೆಳಗಾಂ',
    'बेलगाम', 'बेलगावी',
  ],
  'Raichur Grain Market': [
    'raichur', 'ರಾಯಚೂರು', 'रायचूर', 'రాయచూర్',
  ],
  'Chitradurga APMC': [
    'chitradurga', 'ಚಿತ್ರದುರ್ಗ', 'चित्रदुर्ग',
  ],
  'Davanagere APMC': [
    'davanagere', 'davangere', 'ದಾವಣಗೆರೆ', 'दावणगेरे',
  ],
  'Azadpur Mandi (Delhi)': [
    'azadpur', 'delhi', 'ಆಜಾದ್‌ಪುರ', 'ದೆಹಲಿ', 'आज़ादपुर', 'दिल्ली', 'ఆజాద్‌పూర్', 'தில்லி',
  ],
  'Pune Gultekdi Mandi': [
    'pune', 'gultekdi', 'ಪುಣೆ', 'पुणे', 'గుల్టేక్డి',
  ],
  'Nashik APMC (Lasalgaon/Pimpalgaon)': [
    'nashik', 'lasalgaon', 'pimpalgaon', 'ನಾಸಿಕ್', 'ಲಾಸಲ್‌ಗಾಂವ್', 'नासिक', 'लासलगांव',
  ],
  'Guntur Mirchi Yard': [
    'guntur', 'mirchi yard', 'ಗುಂಟೂರು', 'गुंटूर', 'గుంటూరు', 'குண்டூர்',
  ],
  'Salem APMC': [
    'salem', 'ಸೇಲಂ', 'सेलम', 'சேலம்',
  ],
  'Bharatpur Mandi': [
    'bharatpur', 'ಭರತ್‌ಪುರ', 'भरतपुर',
  ],
};

// Recognize Crop Entity from message with word-boundary awareness
export function extractCropEntity(message: string): string | undefined {
  const lower = message.toLowerCase();

  for (const [canonicalCrop, aliases] of Object.entries(CROP_ALIASES)) {
    for (const alias of aliases) {
      const aliasLower = alias.toLowerCase();
      // If Latin string of length <= 4, require whole-word boundary
      if (/^[a-z0-9]+$/.test(aliasLower) && aliasLower.length <= 4) {
        const wordRegex = new RegExp(`(^|[^a-z0-9])${aliasLower}([^a-z0-9]|$)`, 'i');
        if (wordRegex.test(lower)) {
          return canonicalCrop;
        }
      } else {
        if (lower.includes(aliasLower)) {
          return canonicalCrop;
        }
      }
    }
  }

  // Also match against master list
  for (const cropDef of CROP_MASTER_LIST) {
    if (lower.includes(cropDef.name.toLowerCase())) {
      return cropDef.name;
    }
  }

  return undefined;
}

// Recognize Mandi Entity from message
export function extractMandiEntity(message: string): string | undefined {
  const lower = message.toLowerCase();

  for (const [canonicalMandi, aliases] of Object.entries(MANDI_ALIASES)) {
    for (const alias of aliases) {
      if (lower.includes(alias.toLowerCase())) {
        return canonicalMandi;
      }
    }
  }

  // Match against supported mandis
  for (const mandiMeta of SUPPORTED_MANDIS) {
    if (lower.includes(mandiMeta.mandi.toLowerCase()) || lower.includes(mandiMeta.district.toLowerCase())) {
      return mandiMeta.mandi;
    }
  }

  return undefined;
}

// Extract Timeframe or Horizon
export function extractTimeframeEntity(message: string): {
  timeframe: 'today' | 'tomorrow' | '7days' | '15days' | '30days' | 'season';
  horizonDays: number;
} {
  const lower = message.toLowerCase();

  if (
    lower.includes('tomorrow') ||
    lower.includes('ನಾಳೆ') ||
    lower.includes('कल') ||
    lower.includes('రేపు') ||
    lower.includes('நாளை') ||
    lower.includes('day 1') ||
    lower.includes('1 day')
  ) {
    return { timeframe: 'tomorrow', horizonDays: 1 };
  }

  if (
    lower.includes('90 days') ||
    lower.includes('3 months') ||
    lower.includes('90 ದಿನ') ||
    lower.includes('3 ತಿಂಗಳು') ||
    lower.includes('९० दिन') ||
    lower.includes('३ महीने')
  ) {
    return { timeframe: '30days', horizonDays: 90 };
  }

  if (
    lower.includes('60 days') ||
    lower.includes('2 months') ||
    lower.includes('60 ದಿನ') ||
    lower.includes('2 ತಿಂಗಳು')
  ) {
    return { timeframe: '30days', horizonDays: 60 };
  }

  if (
    lower.includes('30 days') ||
    lower.includes('1 month') ||
    lower.includes('month') ||
    lower.includes('next month') ||
    lower.includes('30 ದಿನ') ||
    lower.includes('ಮುಂದಿನ ತಿಂಗಳು') ||
    lower.includes('महीना') ||
    lower.includes('अगले महीने') ||
    lower.includes('నెల')
  ) {
    return { timeframe: '30days', horizonDays: 30 };
  }

  if (
    lower.includes('15 days') ||
    lower.includes('2 weeks') ||
    lower.includes('15 ದಿನ') ||
    lower.includes('15 दिन')
  ) {
    return { timeframe: '15days', horizonDays: 15 };
  }

  if (
    lower.includes('7 days') ||
    lower.includes('week') ||
    lower.includes('next week') ||
    lower.includes('7 ದಿನ') ||
    lower.includes('ಮುಂದಿನ ವಾರ') ||
    lower.includes('हफ्ता') ||
    lower.includes('अगले हफ्ते') ||
    lower.includes('వారం')
  ) {
    return { timeframe: '7days', horizonDays: 7 };
  }

  return { timeframe: 'today', horizonDays: 0 };
}

// Multilingual Intent Classification
export function classifyIntent(message: string, contextCrop?: string): AgentIntent {
  const lower = message.toLowerCase();

  // 1. AI Market Price Prediction Explanation (Must precede generic predict checks)
  if (
    lower.includes('how does ai predict') ||
    lower.includes('how ai predict') ||
    lower.includes('how does prediction work') ||
    lower.includes('how do you predict') ||
    lower.includes('explain ai prediction') ||
    lower.includes('prediction algorithm') ||
    lower.includes('how is price predicted') ||
    lower.includes('how do you calculate prediction') ||
    lower.includes('how does the prediction engine work') ||
    lower.includes('ai ಮುನ್ಸೂಚನೆ ಹೇಗೆ') ||
    lower.includes('ai ಹೇಗೆ ಊಹಿಸುತ್ತದೆ') ||
    lower.includes('ai ಹೇಗೆ ಬೆಲೆ') ||
    lower.includes('ai ಹೇಗೆ ಕೆಲಸ') ||
    lower.includes('ai कैसे पूर्वानुमान') ||
    lower.includes('ai कैसे भाव') ||
    lower.includes('ai ఎలా అంచనా') ||
    lower.includes('ai எப்படி கணிக்கிறது') ||
    lower.includes('ai എങ്ങനെ പ്രവചിക്കുന്നു') ||
    lower.includes('ai कसे अंदाज लावते') ||
    lower.includes('ai কিভাবে পূর্বাভাস')
  ) {
    return 'AI_EXPLANATION';
  }

  // 2. Weather, Rain, Temperature, Harvesting Weather (Must precede generic forecast checks)
  if (
    lower.includes('weather') ||
    lower.includes('rain') ||
    lower.includes('raining') ||
    lower.includes('rainfall') ||
    lower.includes('temperature') ||
    lower.includes('weather forecast') ||
    lower.includes('harvest weather') ||
    lower.includes('climate') ||
    lower.includes('ಹವಾಮಾನ') ||
    lower.includes('ಮಳೆ') ||
    lower.includes('ಉಷ್ಣಾಂಶ') ||
    lower.includes('ಬಿಸಿಲು') ||
    lower.includes('मौसम') ||
    lower.includes('बारिश') ||
    lower.includes('तापमान') ||
    lower.includes('వాతావరణం') ||
    lower.includes('వర్షం') ||
    lower.includes('வானிலை') ||
    lower.includes('மழை') ||
    lower.includes('കാലാവസ്ഥ') ||
    lower.includes('আবহাওয়া')
  ) {
    return 'WEATHER_FORECAST';
  }

  // 3. Highest / Lowest Mandi / Mandi comparison
  if (
    lower.includes('highest') ||
    lower.includes('lowest') ||
    lower.includes('maximum') ||
    lower.includes('minimum') ||
    lower.includes('ಗರಿಷ್ಠ') ||
    lower.includes('ಕನಿಷ್ಠ') ||
    lower.includes('ಹೆಚ್ಚಿನ ಬೆಲೆ') ||
    lower.includes('ಹೆಚ್ಚು ಬೆಲೆ') ||
    lower.includes('ಉತ್ತಮ ಬೆಲೆ') ||
    lower.includes('ಯಾವ ಮಂಡಿ') ||
    lower.includes('अधिकतम भाव') ||
    lower.includes('सबसे ज्यादा') ||
    lower.includes('सबसे ज्यादा भाव') ||
    lower.includes('किस मंडी') ||
    lower.includes('ఎక్కువ ధర') ||
    lower.includes('ఏ మండీ') ||
    lower.includes('அதிக விலை') ||
    lower.includes('எந்த மண்டி')
  ) {
    return 'HIGHEST_LOWEST_MANDI';
  }

  // 2. Comparison across Mandis
  if (
    lower.includes('compare') ||
    lower.includes('comparison') ||
    lower.includes('difference') ||
    lower.includes('vs') ||
    lower.includes('spread') ||
    lower.includes('ಹೋಲಿಕೆ') ||
    lower.includes('ಹೋಲಿಸಿ') ||
    lower.includes('ವ್ಯತ್ಯಾಸ') ||
    lower.includes('तुलना') ||
    lower.includes('अंतर') ||
    lower.includes('పోల్చండి') ||
    lower.includes('ఒప్పீடு')
  ) {
    return 'MANDI_COMPARISON';
  }

  // 3. Price Prediction / Forecasting / Best time to sell
  if (
    lower.includes('predict') ||
    lower.includes('prediction') ||
    lower.includes('forecast') ||
    lower.includes('future') ||
    lower.includes('tomorrow') ||
    lower.includes('next week') ||
    lower.includes('next month') ||
    lower.includes('best time to sell') ||
    lower.includes('when to sell') ||
    lower.includes('when should i sell') ||
    lower.includes('will it increase') ||
    lower.includes('increasing or decreasing') ||
    lower.includes('ಮುನ್ಸೂಚನೆ') ||
    lower.includes('ಅಂದಾಜು') ||
    lower.includes('ಮುಂದಿನ') ||
    lower.includes('ನಾಳೆ ಬೆಲೆ') ||
    lower.includes('ಮಾರಲು ಸೂಕ್ತ ಸಮಯ') ||
    lower.includes('ಯಾವಾಗ ಮಾರಬೇಕು') ||
    lower.includes('ಬೆಲೆ ಏರುತ್ತದೆಯೇ') ||
    lower.includes('पूर्वानुमान') ||
    lower.includes('भविष्य') ||
    lower.includes('कल का भाव') ||
    lower.includes('कब बेचना') ||
    lower.includes('बेचने का सही समय') ||
    lower.includes('भाव बढ़ेगा या घटेगा') ||
    lower.includes('అంచనా') ||
    lower.includes('రేపటి ధర') ||
    lower.includes('ఎప్పుడు అమ్మాలి') ||
    lower.includes('முன்னறிவிப்பு') ||
    lower.includes('நாளை விலை')
  ) {
    return 'PRICE_PREDICTION';
  }

  // 4. Market Price / Today's Rate
  if (
    lower.includes('price') ||
    lower.includes('rate') ||
    lower.includes('modal') ||
    lower.includes('mandi price') ||
    lower.includes('cost') ||
    lower.includes('how much') ||
    lower.includes('ಬೆಲೆ') ||
    lower.includes('ದರ') ||
    lower.includes('ಧಾರಣೆ') ||
    lower.includes('ಎಷ್ಟು') ||
    lower.includes('भाव') ||
    lower.includes('दाम') ||
    lower.includes('रेट') ||
    lower.includes('ధర') ||
    lower.includes('రేటు') ||
    lower.includes('விலை') ||
    lower.includes('നിരക്ക്')
  ) {
    return 'MARKET_PRICE';
  }

  // 5. Crop Disease, Pest, Fungus, Medicine, Treatment
  if (
    lower.includes('disease') ||
    lower.includes('pest') ||
    lower.includes('blight') ||
    lower.includes('wilt') ||
    lower.includes('curl') ||
    lower.includes('rot') ||
    lower.includes('fungus') ||
    lower.includes('borer') ||
    lower.includes('thrips') ||
    lower.includes('spray') ||
    lower.includes('medicine') ||
    lower.includes('pesticide') ||
    lower.includes('fungicide') ||
    lower.includes('ರೋಗ') ||
    lower.includes('ಕೀಟ') ||
    lower.includes('ಮಚ್ಚೆ') ||
    lower.includes('ಔಷಧ') ||
    lower.includes('ಸಿಂಪಡಣೆ') ||
    lower.includes('ಹುಳು') ||
    lower.includes('ಬಾಧೆ') ||
    lower.includes('रोग') ||
    lower.includes('दवा') ||
    lower.includes('कीट') ||
    lower.includes('झुलसा') ||
    lower.includes('छिड़काव') ||
    lower.includes('తెగులు') ||
    lower.includes('పురుగు') ||
    lower.includes('మందు') ||
    lower.includes('நோய்') ||
    lower.includes('பூச்சி') ||
    lower.includes('மருந்து')
  ) {
    return 'DISEASE_PEST_MANAGEMENT';
  }

  // 6. Fertilizer, NPK, Soil, Compost, Manure
  if (
    lower.includes('fertilizer') ||
    lower.includes('soil') ||
    lower.includes('npk') ||
    lower.includes('urea') ||
    lower.includes('dap') ||
    lower.includes('compost') ||
    lower.includes('manure') ||
    lower.includes('nutrient') ||
    lower.includes('ಗೊಬ್ಬರ') ||
    lower.includes('ಮಣ್ಣು') ||
    lower.includes('ರಸಗೊಬ್ಬರ') ||
    lower.includes('ಖತ') ||
    lower.includes('खाद') ||
    lower.includes('उर्वरक') ||
    lower.includes('मिट्टी') ||
    lower.includes('ఎరువు') ||
    lower.includes('మట్టి') ||
    lower.includes('உரம்') ||
    lower.includes('மண்')
  ) {
    return 'FERTILIZER_SOIL';
  }

  // 7. Crop Cultivation, Yield, Production, Farming Practices
  if (
    lower.includes('yield') ||
    lower.includes('production') ||
    lower.includes('cultivation') ||
    lower.includes('improve yield') ||
    lower.includes('how to grow') ||
    lower.includes('planting') ||
    lower.includes('spacing') ||
    lower.includes('suitable crop') ||
    lower.includes('season crop') ||
    lower.includes('ಇಳುವರಿ') ||
    lower.includes('ಬೆಳೆಯುವುದು ಹೇಗೆ') ||
    lower.includes('ಬೇಸಾಯ') ||
    lower.includes('ಉತ್ಪಾದನೆ ಹೆಚ್ಚಿಸಲು') ||
    lower.includes('पैदावार') ||
    lower.includes('उपज') ||
    lower.includes('खेती') ||
    lower.includes('उत्पादन कैसे बढ़ाएं') ||
    lower.includes('దిగుబడి') ||
    lower.includes('సాగు') ||
    lower.includes('விளைச்சல்') ||
    lower.includes('சாகுபடி')
  ) {
    return 'CROP_CULTIVATION';
  }

  // 8. Weather, Rain, Temperature, Harvesting Weather
  if (
    lower.includes('weather') ||
    lower.includes('rain') ||
    lower.includes('raining') ||
    lower.includes('rainfall') ||
    lower.includes('temperature') ||
    lower.includes('forecast') && (lower.includes('rain') || lower.includes('cloud')) ||
    lower.includes('harvest weather') ||
    lower.includes('climate') ||
    lower.includes('ಹವಾಮಾನ') ||
    lower.includes('ಮಳೆ') ||
    lower.includes('ಉಷ್ಣಾಂಶ') ||
    lower.includes('ಬಿಸಿಲು') ||
    lower.includes('मौसम') ||
    lower.includes('बारिश') ||
    lower.includes('तापमान') ||
    lower.includes('వాతావరణం') ||
    lower.includes('వర్షం') ||
    lower.includes('வானிலை') ||
    lower.includes('மழை')
  ) {
    return 'WEATHER_FORECAST';
  }

  // 9. Harvesting, Storage, Shelf Life, Packing
  if (
    lower.includes('harvest') ||
    lower.includes('harvesting') ||
    lower.includes('storage') ||
    lower.includes('shelf life') ||
    lower.includes('curing') ||
    lower.includes('packhouse') ||
    lower.includes('ಕಟಾವು') ||
    lower.includes('ಕೊಯ್ಲು') ||
    lower.includes('ದಾಸ್ತಾನು') ||
    lower.includes('ಸಂಗ್ರಹ') ||
    lower.includes('कटाई') ||
    lower.includes('भंडारण') ||
    lower.includes('कोత') ||
    lower.includes('నిల్వ') ||
    lower.includes('அறுவடை')
  ) {
    return 'HARVEST_STORAGE';
  }

  // 10. Trading, Selling, Finding Buyers, Contracts
  if (
    lower.includes('sell') ||
    lower.includes('buyer') ||
    lower.includes('buyers') ||
    lower.includes('wholesaler') ||
    lower.includes('procurement') ||
    lower.includes('trade') ||
    lower.includes('find buyers') ||
    lower.includes('ಖರೀದಿದಾರ') ||
    lower.includes('ಮಾರಾಟ') ||
    lower.includes('ಮಾರಲು') ||
    lower.includes('ವ್ಯಾಪಾರ') ||
    lower.includes('ಸಗಟು') ||
    lower.includes('खरीदार') ||
    lower.includes('बेचना') ||
    lower.includes('व्यापारी') ||
    lower.includes('కొనుగోలుదారు') ||
    lower.includes('అమ్మకం') ||
    lower.includes('வாங்குபவர்') ||
    lower.includes('விற்பனை')
  ) {
    return 'TRADING_BUYERS';
  }

  // 11. Escrow, Payment, Bank Transfer, Security
  if (
    lower.includes('escrow') ||
    lower.includes('payment') ||
    lower.includes('money') ||
    lower.includes('bank') ||
    lower.includes('upi') ||
    lower.includes('safe payment') ||
    lower.includes('ಎಸ್ಕ್ರೋ') ||
    lower.includes('ಹಣ') ||
    lower.includes('ಪಾವತಿ') ||
    lower.includes('ಬ್ಯಾಂಕ್') ||
    lower.includes('सुरक्षित भुगतान') ||
    lower.includes('एस्क्रो') ||
    lower.includes('భుగతాన్') ||
    lower.includes('చెల్లింపు') ||
    lower.includes('பணம்')
  ) {
    return 'ESCROW_PAYMENT';
  }

  // 12. AI Market Price Prediction Explanation
  if (
    lower.includes('how does ai predict') ||
    lower.includes('how ai predict') ||
    lower.includes('how does prediction work') ||
    lower.includes('how do you predict') ||
    lower.includes('explain ai prediction') ||
    lower.includes('prediction algorithm') ||
    lower.includes('how is price predicted') ||
    lower.includes('how do you calculate prediction') ||
    lower.includes('how does the prediction engine work') ||
    lower.includes('ai ಮುನ್ಸೂಚನೆ ಹೇಗೆ') ||
    lower.includes('ai ಹೇಗೆ ಊಹಿಸುತ್ತದೆ') ||
    lower.includes('ai ಹೇಗೆ ಬೆಲೆ') ||
    lower.includes('ai ಹೇಗೆ ಕೆಲಸ') ||
    lower.includes('ai कैसे पूर्वानुमान') ||
    lower.includes('ai कैसे भाव') ||
    lower.includes('ai ఎలా అంచనా') ||
    lower.includes('ai எப்படி கணிக்கிறது') ||
    lower.includes('ai എങ്ങനെ പ്രവചിക്കുന്നു') ||
    lower.includes('ai कसे अंदाज लावते') ||
    lower.includes('ai কিভাবে পূর্বাভাস')
  ) {
    return 'AI_EXPLANATION';
  }

  // 13. Application Guidance / Help
  if (
    lower.includes('how does agritech work') ||
    lower.includes('how agritech works') ||
    lower.includes('how to register') ||
    lower.includes('how to use') ||
    lower.includes('help') ||
    lower.includes('register as farmer') ||
    lower.includes('register as buyer') ||
    lower.includes('quality grading tool') ||
    lower.includes('prediction tool') ||
    lower.includes('ಅಗ್ರಿಟೆಕ್ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ') ||
    lower.includes('ನೋಂದಣಿ ಹೇಗೆ') ||
    lower.includes('ಸಹಾಯ') ||
    lower.includes('एग्रीटेक कैसे काम करता है') ||
    lower.includes('पंजीकरण कैसे करें')
  ) {
    return 'APP_HELP';
  }

  // 13. Greeting
  if (
    lower === 'hi' ||
    lower === 'hello' ||
    lower === 'hey' ||
    lower.startsWith('hello ') ||
    lower.includes('ನಮಸ್ಕಾರ') ||
    lower.includes('नमस्ते') ||
    lower.includes('నమస్కారం') ||
    lower.includes('வணக்கம்') ||
    lower.includes('നമസ്കാരം') ||
    lower.includes('नमस्कार') ||
    lower.includes('নমস্কার')
  ) {
    return 'GENERAL_GREETING';
  }

  // If message mentions a crop alone (e.g. "Tomato"), default to MARKET_PRICE
  if (extractCropEntity(message)) {
    return 'MARKET_PRICE';
  }

  return 'CLARIFICATION_NEEDED';
}

// Complete NLU parser combining intent, entities, and anaphora resolution
export function parseUserQuery(
  message: string,
  sessionContext?: {
    activeCrop?: string;
    activeMandi?: string;
    lastIntent?: AgentIntent;
  }
): {
  intent: AgentIntent;
  entities: ExtractedEntities;
  isFollowUp: boolean;
} {
  const directCrop = extractCropEntity(message);
  const directMandi = extractMandiEntity(message);
  const timeframe = extractTimeframeEntity(message);

  const lower = message.toLowerCase();
  const isFollowUpPattern =
    lower.includes('what about') ||
    lower.includes('and in') ||
    lower.includes('compare with') ||
    lower.includes('which one') ||
    (lower.includes('tomorrow') && !directCrop) ||
    (lower.includes('next week') && !directCrop) ||
    lower.includes('ಅದರ') ||
    lower.includes('ನಾಳೆ?') ||
    lower.includes('ಇನ್ನೊಂದು') ||
    lower.includes('कल?') ||
    lower.includes('तुलना करो') ||
    lower.includes('ఎలా ఉంటుంది');

  // Resolved entities: prioritize direct crop in query; only fall back to session if follow-up pattern and no direct crop
  const resolvedCrop = directCrop || (isFollowUpPattern && sessionContext?.activeCrop ? sessionContext.activeCrop : undefined);
  const resolvedMandi = directMandi || (isFollowUpPattern && sessionContext?.activeMandi ? sessionContext.activeMandi : undefined);

  let intent = classifyIntent(message, resolvedCrop);

  // If follow-up "what about tomorrow?", it's a prediction intent on the active crop
  if (isFollowUpPattern && (timeframe.timeframe === 'tomorrow' || timeframe.horizonDays >= 1) && (intent === 'CLARIFICATION_NEEDED' || intent === 'MARKET_PRICE')) {
    intent = 'PRICE_PREDICTION';
  }

  // If follow-up "compare with Bengaluru", it's a mandi comparison
  if (isFollowUpPattern && directMandi && sessionContext?.activeMandi && directMandi !== sessionContext.activeMandi) {
    intent = 'MANDI_COMPARISON';
  }

  // If "which one is better", it's comparing or highest mandi
  if (lower.includes('which one is better') || lower.includes('which is better') || lower.includes('ಯಾವುದು ಉತ್ತಮ')) {
    intent = 'HIGHEST_LOWEST_MANDI';
  }

  const entities: ExtractedEntities = {
    crop: resolvedCrop,
    mandi: resolvedMandi,
    horizonDays: timeframe.horizonDays,
    timeframe: timeframe.timeframe,
    isComparison: intent === 'MANDI_COMPARISON' || intent === 'HIGHEST_LOWEST_MANDI',
    comparisonMandi: directMandi && sessionContext?.activeMandi && directMandi !== sessionContext.activeMandi ? directMandi : undefined,
  };

  return {
    intent,
    entities,
    isFollowUp: Boolean(isFollowUpPattern && (sessionContext?.activeCrop || sessionContext?.activeMandi)),
  };
}
