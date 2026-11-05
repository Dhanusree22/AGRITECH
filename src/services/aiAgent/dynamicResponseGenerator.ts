// Speech-Optimized Dynamic Multilingual Response Generator for AGRITECH AI Agent
// Formats grounded factual responses in natural spoken sentences across 8 languages.

import { ToolExecutionOutput } from './toolRoutingEngine';
import { AgentIntent, ExtractedEntities } from './types';
import { LanguageCode } from '../../types';

// Multilingual Crop Labels
const CROP_NAMES: Record<string, Record<LanguageCode, string>> = {
  'Tomato': {
    en: 'Tomato',
    kn: 'ಟೊಮೆಟೊ',
    hi: 'टमाटर',
    te: 'టమాటా',
    ta: 'தக்காளி',
    ml: 'തക്കാളി',
    mr: 'टोमॅटो',
    bn: 'টমেটো',
  },
  'Red Onion': {
    en: 'Red Onion',
    kn: 'ಕೆಂಪು ಈರುಳ್ಳಿ',
    hi: 'लाल प्याज',
    te: 'ఎర్ర ఉల్లిపాయ',
    ta: 'வெங்காயம்',
    ml: 'സവാള',
    mr: 'कांदा',
    bn: 'লাল পেঁয়াজ',
  },
  'Potato': {
    en: 'Potato',
    kn: 'ಆಲೂಗಡ್ಡೆ',
    hi: 'आलू',
    te: 'బంగాళాదుంప',
    ta: 'உருளைக்கிழங்கு',
    ml: 'ഉരുളക്കിഴങ്ങ്',
    mr: 'बटाटा',
    bn: 'আলু',
  },
  'Paddy / Sona Masoori Rice': {
    en: 'Paddy (Sona Masoori Rice)',
    kn: 'ಭತ್ತ (ಸೋನಾ ಮಸೂರಿ)',
    hi: 'धान (सोना मसूरी चावल)',
    te: 'వరి (సోనా మసూరి బియ్యం)',
    ta: 'நெல் (சோனா மசூரி)',
    ml: 'നെല്ല് (സോന മസൂരി)',
    mr: 'भात / धान',
    bn: 'ধান (সোনা মসুরি)',
  },
  'Wheat': {
    en: 'Wheat',
    kn: 'ಗೋಧಿ',
    hi: 'गेहूं',
    te: 'గోధుమలు',
    ta: 'கோதுமை',
    ml: 'ഗോതമ്പ്',
    mr: 'गहू',
    bn: 'গম',
  },
  'Maize': {
    en: 'Maize (Corn)',
    kn: 'ಮೆಕ್ಕೆಜೋಳ',
    hi: 'मक्का',
    te: 'మొక్కజొన్న',
    ta: 'மக்காச்சோளம்',
    ml: 'മക്കച്ചോളം',
    mr: 'मका',
    bn: 'ভুট্টা',
  },
  'Cotton': {
    en: 'Cotton',
    kn: 'ಹತ್ತಿ',
    hi: 'कपास',
    te: 'పత్తి',
    ta: 'பருத்தி',
    ml: 'പരുത്തി',
    mr: 'कापूस',
    bn: 'তুলা',
  },
  'Green Chilli': {
    en: 'Green Chilli',
    kn: 'ಹಸಿರು ಮೆಣಸಿನಕಾಯಿ',
    hi: 'हरी मिर्च',
    te: 'పచ్చి మిరపకాయ',
    ta: 'பச்சை மிளகாய்',
    ml: 'പച്ചമുളക്',
    mr: 'हिरवी मिरची',
    bn: 'কাঁচা লঙ্কা',
  },
  'Turmeric': {
    en: 'Turmeric',
    kn: 'ಅರಿಶಿನ',
    hi: 'हल्दी',
    te: 'పసుపు',
    ta: 'மஞ்சள்',
    ml: 'മഞ്ഞൾ',
    mr: 'हळद',
    bn: 'হলুদ',
  },
  'Ginger': {
    en: 'Ginger',
    kn: 'ಶುಂಠಿ',
    hi: 'अदरक',
    te: 'అల్లం',
    ta: 'இஞ்சி',
    ml: 'ഇഞ്ചി',
    mr: 'आले',
    bn: 'আদা',
  },
  'Garlic': {
    en: 'Garlic',
    kn: 'ಬೆಳ್ಳುಳ್ಳಿ',
    hi: 'लहसुन',
    te: 'వెల్లుల్లి',
    ta: 'பூண்டு',
    ml: 'വെളുത്തുള്ളി',
    mr: 'लसूण',
    bn: 'রসুন',
  },
  'Mustard': {
    en: 'Mustard',
    kn: 'ಸಾಸಿವೆ',
    hi: 'सरसों',
    te: 'ఆవాలు',
    ta: 'கடுகு',
    ml: 'കടുക്',
    mr: 'मोहरी',
    bn: 'সরিষা',
  },
  'Green Capsicum': {
    en: 'Green Capsicum (Shimla Mirch)',
    kn: 'ದಪ್ಪ ಮೆಣಸಿನಕಾಯಿ (ಕ್ಯಾಪ್ಸಿಕಂ)',
    hi: 'शिमला मिर्च (कैप्सिकम)',
    te: 'బుట్ట మిరప (క్యాప్సికం)',
    ta: 'குடைமிளகாய்',
    ml: 'ക്യാപ്സിക്കം',
    mr: 'ढोबळी मिरची',
    bn: 'ক্যাপসিকাম',
  },
  'Groundnut': {
    en: 'Groundnut (Peanut)',
    kn: 'ಕಡಲೆಕಾಯಿ',
    hi: 'मूंगफली',
    te: 'వేరుశనగ',
    ta: 'வேர்க்கடலை',
    ml: 'നിലക്കടല',
    mr: 'भुईमूग',
    bn: 'চীনাবাদাম',
  },
  'Sugarcane': {
    en: 'Sugarcane',
    kn: 'ಕಬ್ಬು',
    hi: 'गन्ना',
    te: 'చెరకు',
    ta: 'கரும்பு',
    ml: 'കരിമ്പ്',
    mr: 'ऊस',
    bn: 'আখ',
  },
};

// Multilingual Mandi Names Helper
export function getLocalizedCropName(crop: string, lang: LanguageCode): string {
  const map = CROP_NAMES[crop];
  if (map && map[lang]) return map[lang];
  return crop;
}

const MANDI_NAMES: Record<string, Record<LanguageCode, string>> = {
  'Kolar APMC Market': {
    en: 'Kolar APMC Market',
    kn: 'ಕೋಲಾರ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ',
    hi: 'कोलार एपीएमसी मंडी',
    te: 'కోలార్ మార్కెట్',
    ta: 'கோலார் சந்தை',
    ml: 'കോലാർ മാർക്കറ്റ്',
    mr: 'कोलार बाजार समिती',
    bn: 'কোলার মান্ডি',
  },
  'Yeshwanthpur APMC (Bengaluru)': {
    en: 'Yeshwanthpur APMC (Bengaluru)',
    kn: 'ಬೆಂಗಳೂರು ಯಶವಂತಪುರ ಮಂಡಿ',
    hi: 'यशवंतपुर (बेंगलुरु) मंडी',
    te: 'యశ్వంత్‌పూర్ (బెంగళూరు) మార్కెట్',
    ta: 'யஷ்வந்த்பூர் (பெங்களூரு) சந்தை',
    ml: 'യശ്വന്ത്പൂർ (ബെംഗളൂരു) മാർക്കറ്റ്',
    mr: 'यशवंतपूर (बंगळुरू) बाजार समिती',
    bn: 'যশবন্তপুর (বেঙ্গালুরু) মান্ডি',
  },
  'Hubballi APMC (Amargol)': {
    en: 'Hubballi APMC (Amargol)',
    kn: 'ಹುಬ್ಬಳ್ಳಿ ಅಮರಗೋಳ ಮಂಡಿ',
    hi: 'हुबली अमरगोल मंडी',
    te: 'హుబ్బళ్ళి మార్కెట్',
    ta: 'ஹூப்ளி சந்தை',
    ml: 'ഹുബ്ബള്ളി മാർക്കറ്റ്',
    mr: 'हुबळी बाजार समिती',
    bn: 'হুবলি মান্ডি',
  },
  'Azadpur Mandi (Delhi)': {
    en: 'Azadpur Mandi (Delhi)',
    kn: 'ದೆಹಲಿ ಆಜಾದ್‌ಪುರ ಮಂಡಿ',
    hi: 'आजादपुर मंडी (दिल्ली)',
    te: 'ఆజాద్‌పూర్ మార్కెట్ (ఢిల్లీ)',
    ta: 'ஆசாத்பூர் சந்தை (டெல்லி)',
    ml: 'ആസാദ്പൂർ മാർക്കറ്റ് (ഡൽഹി)',
    mr: 'आझादपूर मंडी (दिल्ली)',
    bn: 'আজাদপুর মান্ডি (দিল্লি)',
  },
  'Pune Gultekdi Mandi': {
    en: 'Pune Gultekdi Mandi',
    kn: 'ಪುಣೆ ಗುಲ್ಟೇಕ್ಡಿ ಮಂಡಿ',
    hi: 'पुणे गुलटेकड़ी मंडी',
    te: 'పూణే గుల్తేక్డి మార్కెట్',
    ta: 'புனே சந்தை',
    ml: 'പൂനെ മാർക്കറ്റ്',
    mr: 'पुणे गुलटेकडी बाजार समिती',
    bn: 'পুনে গুলটেকডি মান্ডি',
  },
  'Guntur Mirchi Yard': {
    en: 'Guntur Mirchi Yard',
    kn: 'ಗುಂಟೂರು ಮಿರ್ಚಿ ಯಾರ್ಡ್',
    hi: 'गुंटूर मिर्ची यार्ड',
    te: 'గుంటూరు మిర్చి యార్డ్',
    ta: 'குண்டூர் மிளகாய் சந்தை',
    ml: 'ഗുണ്ടൂർ മുളക് യാർഡ്',
    mr: 'गुंटूर मिरची यार्ड',
    bn: 'গুন্টুর লঙ্কা ইয়ার্ড',
  },
  'Chitradurga APMC': {
    en: 'Chitradurga APMC',
    kn: 'ಚಿತ್ರದುರ್ಗ ಎಪಿಎಂಸಿ',
    hi: 'चित्रदुर्गा मंडी',
    te: 'చిత్రదుర్గ మార్కెట్',
    ta: 'சித்ரதுர்கா சந்தை',
    ml: 'ചിത്രദുർഗ്ഗ മാർക്കറ്റ്',
    mr: 'चित्रदुर्ग बाजार समिती',
    bn: 'চিত্রদুর্গ মান্ডি',
  },
  'Belagavi Mandi': {
    en: 'Belagavi Mandi',
    kn: 'ಬೆಳಗಾವಿ ಮಂಡಿ',
    hi: 'बेलगावी मंडी',
    te: 'బెల్గాం మార్కెట్',
    ta: 'பெலகாவி சந்தை',
    ml: 'ബെലഗാവി മാർക്കറ്റ്',
    mr: 'बेळगाव बाजार समिती',
    bn: 'বেলগাভি মান্ডি',
  },
};

export function getLocalizedMandiName(mandi: string, lang: LanguageCode): string {
  const match = MANDI_NAMES[mandi];
  if (match && match[lang]) return match[lang];
  return mandi;
}

export function localizeSellingWindow(windowStr: string, lang: LanguageCode): string {
  if (lang === 'kn') {
    if (windowStr.includes('24') || windowStr.includes('36') || windowStr.includes('48')) return 'ಮುಂದಿನ 24 ರಿಂದ 48 ಗಂಟೆಗಳಲ್ಲಿ';
    if (windowStr.includes('4 through 7') || windowStr.includes('7 Days')) return 'ಮುಂದಿನ 4 ರಿಂದ 7 ದಿನಗಳ ಒಳಗೆ';
    return 'ಮುಂದಿನ 2 ರಿಂದ 3 ದಿನಗಳಲ್ಲಿ';
  }
  if (lang === 'hi') {
    if (windowStr.includes('24') || windowStr.includes('36') || windowStr.includes('48')) return 'अगले 24 से 48 घंटों में';
    if (windowStr.includes('4 through 7') || windowStr.includes('7 Days')) return 'अगले 4 से 7 दिनों के भीतर';
    return 'अगले 2 से 3 दिनों में';
  }
  return windowStr;
}

export class DynamicResponseGenerator {
  public generateResponse(
    toolOutput: ToolExecutionOutput,
    lang: LanguageCode,
    entities: ExtractedEntities
  ): string {
    const cropName = getLocalizedCropName(toolOutput.cropName, lang);
    const rawMandiName = toolOutput.mandiName || 'Kolar APMC Market';
    const mandiName = getLocalizedMandiName(rawMandiName, lang);
    const { intent, data } = toolOutput;

    switch (intent) {
      case 'MARKET_PRICE': {
        const { pricePerKg, modalPrice, arrivalTons, minPrice, maxPrice, tradingDate } = data;
        switch (lang) {
          case 'kn':
            return `${mandiName} ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಇಂದಿನ ${cropName} ಸರಾಸರಿ ದರ ₹${pricePerKg}/ಕೆಜಿ (ಕ್ವಿಂಟಾಲ್‌ಗೆ ₹${modalPrice}). ಇಂದಿನ ಒಟ್ಟು ಆವಕ ${arrivalTons} ಟನ್ ಆಗಿದ್ದು, ಕನಿಷ್ಠ ದರ ₹${Math.round(minPrice/100)} ಮತ್ತು ಗರಿಷ್ಠ ದರ ₹${Math.round(maxPrice/100)} ಇದೆ. ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಗುಣಮಟ್ಟದ ಗ್ರೇಡ್-ಎ ಮಾಲಿಗೆ ಉತ್ತಮ ಬೇಡಿಕೆಯಿದೆ.`;
          case 'hi':
            return `${mandiName} में आज ${cropName} का औसत थोक भाव ₹${pricePerKg}/किलो (₹${modalPrice}/क्विंटल) है। आज की कुल आवक ${arrivalTons} टन दर्ज की गई है, जहाँ न्यूनतम भाव ₹${Math.round(minPrice/100)} और उच्चतम भाव ₹${Math.round(maxPrice/100)} प्रति किलो रहा।`;
          case 'te':
            return `${mandiName} మార్కెట్లో నేడు ${cropName} సగటు ధర కిలోకు ₹${pricePerKg} (క్వింటాలుకు ₹${modalPrice}). నేటి మొత్తం మార్కెట్ రాక ${arrivalTons} టన్నులు, కనీస ధర ₹${Math.round(minPrice/100)} మరియు గరిష్ట ధర ₹${Math.round(maxPrice/100)} గా నమోదైంది.`;
          case 'ta':
            return `${mandiName} சந்தையில் இன்றைய ${cropName} சராசரி விலை கிலோவுக்கு ₹${pricePerKg} (குவிண்டாலுக்கு ₹${modalPrice}). இன்றைய மொத்த வரத்து ${arrivalTons} டன்கள், குறைந்தபட்ச விலை ₹${Math.round(minPrice/100)} மற்றும் அதிகபட்ச விலை ₹${Math.round(maxPrice/100)} ஆக உள்ளது.`;
          case 'ml':
            return `${mandiName} മാർക്കറ്റിൽ ഇന്നത്തെ ${cropName} ശരാശരി നിരക്ക് കിലോയ്ക്ക് ₹${pricePerKg} (ക്വിന്റലിന് ₹${modalPrice}) ആണ്. ഇന്നത്തെ വരവ് ${arrivalTons} ടൺ ആണ്.`;
          case 'mr':
            return `${mandiName} मध्ये आज ${cropName} चा सरासरी बाजारभाव ₹${pricePerKg}/किलो (₹${modalPrice}/क्विंटल) आहे. आजची एकूण आवक ${arrivalTons} टन झाली असून दर्जेदार मालाला चांगली मागणी आहे.`;
          case 'bn':
            return `${mandiName} বাজারে আজকের ${cropName} গড় দর প্রতি কেজি ₹${pricePerKg} (কুইন্টাল প্রতি ₹${modalPrice})। আজকের মোট আগমন ${arrivalTons} টন রেকর্ড করা হয়েছে।`;
          default:
            return `Today's market price for ${cropName} at ${mandiName} is ₹${pricePerKg}/kg (₹${modalPrice}/quintal). Total arrivals recorded today are ${arrivalTons} tons, with price range from ₹${Math.round(minPrice / 100)} to ₹${Math.round(maxPrice / 100)} per kg. Market trading conditions remain active with solid demand.`;
        }
      }

      case 'PRICE_PREDICTION': {
        const { todayPrice, tomorrowPrice, day7Price, trend, changePercent, optimalSellingWindow: rawSellingWindow, verdict } = data;
        const trendDirection = trend === 'up' ? 'upward' : trend === 'down' ? 'downward' : 'stable';
        const changeSign = changePercent > 0 ? `+${changePercent}%` : `${changePercent}%`;
        const isTomorrow = data.isTomorrowQuery;
        const optimalSellingWindow = localizeSellingWindow(rawSellingWindow || 'Next 24 to 48 Hours', lang);

        switch (lang) {
          case 'kn':
            if (isTomorrow) {
              return `ಕೃಷಿ AI ಮುನ್ಸೂಚನೆಯಂತೆ ${mandiName} ನಲ್ಲಿ ನಾಳಿನ ${cropName} ಅಂದಾಜು ದರ ₹${tomorrowPrice}/ಕೆಜಿ ಇರಲಿದೆ (${changeSign} ಬದಲಾವಣೆ). ಇಂದಿನ ದರ ₹${todayPrice}/ಕೆಜಿ ಇದ್ದು, ${trend === 'up' ? 'ಆವಕ ಕಡಿಮೆಯಾಗುತ್ತಿರುವುದರಿಂದ ಬೆಲೆ ಏರಿಕೆಯ ಪ್ರವೃತ್ತಿ ಇದೆ.' : 'ಆವಕ ಹೆಚ್ಚಾಗಿರುವುದರಿಂದ ಬೆಲೆ ಸ್ಥಿರ ಅಥವಾ ಸ್ವಲ್ಪ ಇಳಿಕೆಯಾಗಬಹುದು.'} ಮಾರಾಟಕ್ಕೆ ಸೂಕ್ತ ಸಮಯ: ${optimalSellingWindow}.`;
            }
            return `ಕೃಷಿ AI ಮುನ್ಸೂಚನೆ: ${mandiName} ನಲ್ಲಿ ${cropName} ಇಂದಿನ ದರ ₹${todayPrice}/ಕೆಜಿ ಇದ್ದು, 7 ದಿನಗಳಲ್ಲಿ ₹${day7Price}/ಕೆಜಿಗೆ ತಲುಪುವ ನಿರೀಕ್ಷೆಯಿದೆ (${changeSign}). ಮಾರುಕಟ್ಟೆ ಶಿಫಾರಸು: ${verdict === 'HOLD_SHORT_TERM' ? 'ಸ್ವಲ್ಪ ದಿನ ಕಾಯಿರಿ, ಬೆಲೆ ಏರಲಿದೆ' : 'ಉತ್ತಮ ಬೆಲೆ ಇರುವಾಗಲೇ ಈಗಲೇ ಮಾರಾಟ ಮಾಡಿ'}. ಅತ್ಯುತ್ತಮ ಮಾರಾಟದ ಅವಧಿ: ${optimalSellingWindow}.`;

          case 'hi':
            if (isTomorrow) {
              return `एआई पूर्वानुमान के अनुसार ${mandiName} में कल ${cropName} का भाव ₹${tomorrowPrice}/किलो रहने का अनुमान है (${changeSign})। आज का भाव ₹${todayPrice}/किलो है और आने वाले दिनों में रुझान ${trend === 'up' ? 'तेज' : 'स्थिर'} रहने की उम्मीद है। सर्वोत्तम बिक्री समय: ${optimalSellingWindow}।`;
            }
            return `एआई बाजार पूर्वानुमान: ${mandiName} में ${cropName} का आज का भाव ₹${todayPrice}/किलो है, जो अगले 7 दिनों में ₹${day7Price}/किलो तक जाने की संभावना है (${changeSign})। किसान सलाह: ${verdict === 'HOLD_SHORT_TERM' ? 'कुछ दिन स्टॉक रखें, भाव बढ़ने की उम्मीद है' : 'वर्तमान भाव अच्छा है, तुरंत बिक्री करें'}। सर्वोत्तम बिक्री समय: ${optimalSellingWindow}।`;

          case 'te':
            if (isTomorrow) {
              return `వ్యవసాయ AI అంచనా ప్రకారం ${mandiName} లో రేపటి ${cropName} ధర కిలోకు సుమారు ₹${tomorrowPrice} గా ఉంటుంది (${changeSign}). నేటి ధర ₹${todayPrice}/కిలో గా ఉంది. అమ్మకానికి ఉత్తమ సమయం: ${optimalSellingWindow}.`;
            }
            return `AI మార్కెట్ అంచనా: ${mandiName} లో ${cropName} నేటి ధర ₹${todayPrice}/కిలో కాగా, 7 రోజుల్లో ₹${day7Price}/కిలో చేరే అవకాశం ఉంది (${changeSign}). రైతు సలహా: ${verdict === 'HOLD_SHORT_TERM' ? 'కొద్ది రోజులు నిల్వ ఉంచండి' : 'వెంటనే అమ్మడం ఉత్తమం'}.`;

          case 'ta':
            if (isTomorrow) {
              return `AI கணிப்பின்படி ${mandiName} சந்தையில் நாளைய ${cropName} விலை கிலோவுக்கு ₹${tomorrowPrice} ஆக இருக்கும் (${changeSign}). இன்றைய விலை ₹${todayPrice}/கிலோ. உகந்த விற்பனை நேரம்: ${optimalSellingWindow}.`;
            }
            return `AI சந்தை முன்னறிவிப்பு: ${mandiName} சந்தையில் ${cropName} இன்றைய விலை ₹${todayPrice}/கிலோ, அடுத்த 7 நாட்களில் ₹${day7Price}/கிலோவை எட்டும் என எதிர்பார்க்கப்படுகிறது (${changeSign}). பரிந்துரை: ${optimalSellingWindow}.`;

          case 'ml':
            return `AI പ്രവചനമനുസരിച്ച് ${mandiName} മാർക്കറ്റിൽ ${cropName} ഇന്നത്തെ നിരക്ക് ₹${todayPrice}/കിലോഗ്രാം ആണ്. നാളത്തെ നിരക്ക് ₹${tomorrowPrice}/കിലോയും 7 ദിവസത്തെ പ്രവചനം ₹${day7Price}/കിലോയുമാണ് (${changeSign}).`;

          case 'mr':
            return `कृषी AI अंदाजानुसार ${mandiName} मध्ये ${cropName} चा आजचा भाव ₹${todayPrice}/किलो आहे, उद्याचा अपेक्षित भाव ₹${tomorrowPrice}/किलो आणि 7 दिवसांनंतरचा अपेक्षित भाव ₹${day7Price}/किलो आहे (${changeSign}). शिफारस: ${optimalSellingWindow}.`;

          case 'bn':
            return `এআই পূর্বাভাস অনুসারে ${mandiName} বাজারে ${cropName} আজকের দর ₹${todayPrice}/কেজি এবং আগামীকালের পূর্বাভাস দর ₹${tomorrowPrice}/কেজি (${changeSign})। ৭ দিনের মধ্যে এটি ₹${day7Price}/কেজিতে পৌঁছানোর সম্ভাবনা রয়েছে।`;

          default:
            if (isTomorrow) {
              return `According to our AI prediction model, tomorrow's forecasted price for ${cropName} at ${mandiName} is ₹${tomorrowPrice}/kg (${changeSign} vs today's ₹${todayPrice}/kg). The price trend is ${trendDirection}. Optimal selling window recommended: ${optimalSellingWindow}.`;
            }
            return `AI Market Forecast for ${cropName} at ${mandiName}: Current price is ₹${todayPrice}/kg, with a 7-day projected target of ₹${day7Price}/kg (${changeSign} movement). Farmer verdict: ${verdict === 'HOLD_SHORT_TERM' ? 'Hold stock for higher upcoming prices' : 'Sell now at strong prevailing rates'}. Best selling window: ${optimalSellingWindow}.`;
        }
      }

      case 'MANDI_COMPARISON':
      case 'HIGHEST_LOWEST_MANDI': {
        const { highest, lowest, specificComparison } = data;

        if (specificComparison) {
          const locA = getLocalizedMandiName(specificComparison.mandiA, lang);
          const locB = getLocalizedMandiName(specificComparison.mandiB, lang);
          const diff = Math.abs(specificComparison.difference);
          const isBetterB = specificComparison.priceB > specificComparison.priceA;

          switch (lang) {
            case 'kn':
              return `ಮಂಡಿಗಳ ಬೆಲೆ ಹೋಲಿಕೆ: ${cropName} ಗೆ ${locA} ನಲ್ಲಿ ₹${specificComparison.priceA}/ಕೆಜಿ ಇದ್ದರೆ, ${locB} ನಲ್ಲಿ ₹${specificComparison.priceB}/ಕೆಜಿ ಇದೆ (ವ್ಯತ್ಯಾಸ: ₹${diff}/ಕೆಜಿ). ಶಿಫಾರಸು: ${isBetterB ? `${locB} ಗೆ ಸಾಗಾಣಿಕೆ ಮಾಡುವುದರಿಂದ ಕೆಜಿಗೆ +₹${diff} ಹೆಚ್ಚಿನ ಲಾಭ ಸಿಗಲಿದೆ.` : `${locA} ನಲ್ಲೇ ಮಾರಾಟ ಮಾಡುವುದು ಸಾರಿಗೆ ವೆಚ್ಚವಿಲ್ಲದೆ ನಿವ್ವಳ ಲಾಭ ನೀಡುತ್ತದೆ.`}`;
            case 'hi':
              return `मंडियों की तुलना: ${cropName} के लिए ${locA} में भाव ₹${specificComparison.priceA}/किलो है, जबकि ${locB} में ₹${specificComparison.priceB}/किलो है (अंतर: ₹${diff}/किलो)। सलाह: ${isBetterB ? `${locB} में माल भेजने से प्रति किलो +₹${diff} का अतिरिक्त मुनाफा मिलेगा।` : `${locA} में ही बेचना बिना अतिरिक्त परिवहन खर्च के अधिक लाभकारी है।`}`;
            case 'te':
              return `మార్కెట్ల పోలిక: ${cropName} కోసం ${locA} లో ₹${specificComparison.priceA}/కిలో కాగా, ${locB} లో ₹${specificComparison.priceB}/కిలో (తేడా: ₹${diff}/కిలో). సలహా: ${isBetterB ? `${locB} కి తీసుకెళ్లడం ద్వారా కిలోకు +₹${diff} అదనపు లాభం లభిస్తుంది.` : `${locA} లోనే అమ్మడం మంచిది.`}`;
            case 'ta':
              return `சந்தைகளின் ஒப்பீடு: ${cropName} பயிருக்கு ${locA} இல் ₹${specificComparison.priceA}/கிலோ, ${locB} இல் ₹${specificComparison.priceB}/கிலோ (வேறுபாடு: ₹${diff}/கிலோ). பரிந்துரை: ${isBetterB ? `${locB} சந்தைக்கு அனுப்புவது கிலோவுக்கு +₹${diff} கூடுதல் லாபம் தரும்.` : `${locA} சந்தையிலேயே விற்பது சிறந்தது.`}`;
            default:
              return `Mandi Price Comparison: For ${cropName}, ${locA} is trading at ₹${specificComparison.priceA}/kg while ${locB} is trading at ₹${specificComparison.priceB}/kg. Difference is ₹${diff}/kg. Recommendation: ${isBetterB ? `Transporting to ${locB} offers +₹${diff}/kg premium.` : `${locA} offers better net profit without extra transport costs.`}`;
          }
        }

        switch (lang) {
          case 'kn':
            return `${cropName} ಗೆ ಅತ್ಯಂತ ಗರಿಷ್ಠ ಬೆಲೆ ನೀಡುತ್ತಿರುವ ಮಂಡಿ: ${highest.mandi} (ದರ: ₹${highest.pricePerKg}/ಕೆಜಿ ಅಥವಾ ₹${highest.modalPrice}/ಕ್ವಿಂಟಾಲ್). ಅತ್ಯಂತ ಕಡಿಮೆ ಬೆಲೆ ಇರುವ ಮಂಡಿ: ${lowest.mandi} (ದರ: ₹${lowest.pricePerKg}/ಕೆಜಿ). ಈ ಎರಡು ಮಂಡಿಗಳ ನಡುವೆ ಕ್ವಿಂಟಾಲ್‌ಗೆ ₹${highest.modalPrice - lowest.modalPrice} ವ್ಯತ್ಯಾಸವಿದ್ದು, ದೂರ ಮತ್ತು ಸಾರಿಗೆ ವೆಚ್ಚ ಲೆಕ್ಕಹಾಕಿ ಉತ್ತಮ ಮಂಡಿಗೆ ಸಾಗಿಸಿ.`;
          case 'hi':
            return `${cropName} के लिए सबसे अधिक भाव देने वाली मंडी ${highest.mandi} है (भाव: ₹${highest.pricePerKg}/किलो यानी ₹${highest.modalPrice}/क्विंटल)। सबसे कम भाव ${lowest.mandi} में ₹${lowest.pricePerKg}/किलो है। दोनों के बीच ₹${highest.modalPrice - lowest.modalPrice}/क्विंटल का अंतर है।`;
          case 'te':
            return `${cropName} కోసం అత్యధిక ధర ఇస్తున్న మార్కెట్: ${highest.mandi} (ధర: కిలోకు ₹${highest.pricePerKg}). అత్యల్ప ధర: ${lowest.mandi} (కిలోకు ₹${lowest.pricePerKg}). క్వింటాలుకు వ్యత్యాసం ₹${highest.modalPrice - lowest.modalPrice}.`;
          case 'ta':
            return `${cropName} பயிருக்கு அதிகபட்ச விலை வழங்கும் சந்தை: ${highest.mandi} (விலை: ₹${highest.pricePerKg}/கிலோ). குறைந்தபட்ச சந்தை: ${lowest.mandi} (விலை: ₹${lowest.pricePerKg}/கிலோ). விலை வேறுபாடு குவிண்டாலுக்கு ₹${highest.modalPrice - lowest.modalPrice}.`;
          case 'ml':
            return `${cropName} ഏറ്റവും ഉയർന്ന നിരക്ക് നൽകുന്ന മാർക്കറ്റ്: ${highest.mandi} (കിലോയ്ക്ക് ₹${highest.pricePerKg}). ഏറ്റവും കുറഞ്ഞ നിരക്ക്: ${lowest.mandi} (കിലോയ്ക്ക് ₹${lowest.pricePerKg}).`;
          case 'mr':
            return `${cropName} साठी सर्वाधिक भाव देणारी बाजार समिती: ${highest.mandi} (दर: ₹${highest.pricePerKg}/किलो). सर्वात कमी भाव: ${lowest.mandi} (दर: ₹${lowest.pricePerKg}/किलो). क्विंटलमागे फरक ₹${highest.modalPrice - lowest.modalPrice} आहे.`;
          case 'bn':
            return `${cropName} এর জন্য সর্বোচ্চ দর প্রদানকারী মান্ডি হলো ${highest.mandi} (দর: প্রতি কেজি ₹${highest.pricePerKg})। সর্বনিম্ন দর ${lowest.mandi} (প্রতি কেজি ₹${lowest.pricePerKg})।`;
          default:
            return `The mandi offering the highest price for ${cropName} is ${highest.mandi} at ₹${highest.pricePerKg}/kg (₹${highest.modalPrice}/quintal). The lowest rate is at ${lowest.mandi} at ₹${lowest.pricePerKg}/kg. That creates an arbitrage spread of ₹${highest.modalPrice - lowest.modalPrice}/quintal. Consider factoring in transport logistics to maximize your net farm-gate profit.`;
        }
      }

      case 'DISEASE_PEST_MANAGEMENT': {
        const { primaryDisease, secondaryDisease, primaryPest } = data;
        switch (lang) {
          case 'kn':
            return `${cropName} ಬೆಳೆಯ ಪ್ರಮುಖ ರೋಗ: ${primaryDisease.name}. ಲಕ್ಷಣ: ${primaryDisease.symptoms} ತಕ್ಷಣದ ಪರಿಹಾರ: ${primaryDisease.treatment} ಜೊತೆಗೆ ಕೀಟ ನಿಯಂತ್ರಣಕ್ಕಾಗಿ ಸಾವಯವ ಬೇವಿನ ಎಣ್ಣೆ (5 ಮಿ.ಲೀ./ಲೀಟರ್) ಸಿಂಪಡಿಸಿ. ಮುನ್ನೆಚ್ಚರಿಕೆ: ${primaryDisease.preventiveAction}`;
          case 'hi':
            return `${cropName} की मुख्य बीमारी: ${primaryDisease.name}। लक्षण: ${primaryDisease.symptoms} तुरंत उपचार: ${primaryDisease.treatment}। साथ ही कीट रोकथाम के लिए 5 मि.ली. नीम तेल प्रति लीटर पानी में मिलाकर छिड़काव करें। बचाव उपाय: ${primaryDisease.preventiveAction}`;
          case 'te':
            return `${cropName} ప్రధాన తెగులు: ${primaryDisease.name}. లక్షణాలు: ${primaryDisease.symptoms} నివారణ చర్య: ${primaryDisease.treatment}. వేప నూనె 5 మి.లీ./లీటరు నీటిలో కలిపి పిచికారీ చేయడం ద్వారా కీటకాలను అరికట్టవచ్చు.`;
          case 'ta':
            return `${cropName} முக்கிய நோய்: ${primaryDisease.name}. அறிகுறிகள்: ${primaryDisease.symptoms} உடனடி சிகிச்சை: ${primaryDisease.treatment}. தடுப்பு நடவடிக்கை: ${primaryDisease.preventiveAction}.`;
          case 'ml':
            return `${cropName} പ്രധാന രോഗം: ${primaryDisease.name}. ലക്ഷണങ്ങൾ: ${primaryDisease.symptoms} പ്രതിവിധി: ${primaryDisease.treatment}.`;
          case 'mr':
            return `${cropName} चा प्रमुख रोग: ${primaryDisease.name}. लक्षणे: ${primaryDisease.symptoms} तात्काळ उपाय: ${primaryDisease.treatment}. प्रतिबंधक उपाय: ${primaryDisease.preventiveAction}.`;
          case 'bn':
            return `${cropName} ফসলের প্রধান রোগ: ${primaryDisease.name}। লক্ষণ: ${primaryDisease.symptoms} প্রতিকার: ${primaryDisease.treatment}।`;
          default:
            return `Primary disease affecting ${cropName} is ${primaryDisease.name}. Symptoms: ${primaryDisease.symptoms} Recommended treatment: ${primaryDisease.treatment} For pest deterrence, spray organic Neem oil at 5 ml/L water. Preventive action: ${primaryDisease.preventiveAction}`;
        }
      }

      case 'CROP_CULTIVATION': {
        const { yieldImprovementTips, soil, irrigation } = data;
        const tip1 = yieldImprovementTips[0] || 'Use certified high-yield hybrid seed varieties.';
        const tip2 = yieldImprovementTips[1] || 'Adopt drip irrigation and fertigation schedules.';

        switch (lang) {
          case 'kn':
            return `${cropName} ಇಳುವರಿ ಹೆಚ್ಚಿಸಲು ಪ್ರಮುಖ ತಾಂತ್ರಿಕ ಕ್ರಮಗಳು: 1) ${tip1} 2) ${tip2} ಮಣ್ಣು ಮತ್ತು ನೀರಾವರಿ: ${soil} ಹೂಬಿಡುವ ಮತ್ತು ಕಾಯಿ ಕಟ್ಟುವ ಹಂತದಲ್ಲಿ ಸರಿಯಾದ ಪೋಷಕಾಂಶ ನಿರ್ವಹಣೆಯಿಂದ ಇಳುವರಿಯನ್ನು 25% ರಿಂದ 35% ರಷ್ಟು ಹೆಚ್ಚಿಸಬಹುದು.`;
          case 'hi':
            return `${cropName} की पैदावार बढ़ाने के लिए मुख्य सुझाव: 1) ${tip1} 2) ${tip2} मिट्टी एवं सिंचाई प्रबंधन: ${soil} सही समय पर सूक्ष्म पोषक तत्वों के छिड़काव से उत्पादन 25% से 35% तक बढ़ सकता है।`;
          case 'te':
            return `${cropName} దిగుబడిని పెంచడానికి ఉత్తమ సూచనలు: 1) ${tip1} 2) ${tip2} నేల మరియు నీటి యాజమాన్యం: ${soil} సరైన పోషకాల ద్వారా దిగుబడిని 25-35% పెంచుకోవచ్చు.`;
          case 'ta':
            return `${cropName} மகசூலை அதிகரிக்க முக்கிய வழிகள்: 1) ${tip1} 2) ${tip2} மண் மேலாண்மை: ${soil} இதன் மூலம் உற்பத்தியை 25-35% வரை அதிகரிக்கலாம்.`;
          case 'ml':
            return `${cropName} വിളവ് വർദ്ധിപ്പിക്കാനുള്ള പ്രധാന വഴികൾ: 1) ${tip1} 2) ${tip2} ശരിയായ പരിചരണത്തിലൂടെ 25% വരെ വിളവ് വർദ്ധിപ്പിക്കാം.`;
          case 'mr':
            return `${cropName} चे उत्पादन वाढवण्यासाठी महत्त्वाचे उपाय: 1) ${tip1} 2) ${tip2} ठिबक सिंचन आणि खत व्यवस्थापनाने 25 ते 35% उत्पादन वाढू शकते.`;
          case 'bn':
            return `${cropName} ফলন বৃদ্ধির প্রধান উপায়: ১) ${tip1} ২) ${tip2} সঠিক পুষ্টি ও সেচ ব্যবস্থাপনায় উৎপাদন ২৫-৩৫% বৃদ্ধি সম্ভব।`;
          default:
            return `To maximize your ${cropName} yield and profitability: 1) ${tip1} 2) ${tip2} Soil & irrigation guidelines: ${soil} Applying targeted water-soluble fertigation and micro-nutrient foliar sprays at flowering can boost marketable Grade-A yield by 25% to 35%.`;
        }
      }

      case 'FERTILIZER_SOIL': {
        const { fertilizerNPK, soil } = data;
        switch (lang) {
          case 'kn':
            return `${cropName} ಬೆಳೆಯ ರಸಗೊಬ್ಬರ ಶಿಫಾರಸು: ಆರಂಭಿಕವಾಗಿ (ಬೇಸಲ್): ${fertilizerNPK.basal} ಮೇಲುಗೊಬ್ಬರ: ${fertilizerNPK.topDressing} ಲಘು ಪೋಷಕಾಂಶ: ${fertilizerNPK.micronutrients}`;
          case 'hi':
            return `${cropName} के लिए उर्वरक प्रबंधन: बुवाई के समय (बेसल): ${fertilizerNPK.basal} टॉप ड्रेसिंग: ${fertilizerNPK.topDressing} सूक्ष्म पोषक तत्व: ${fertilizerNPK.micronutrients}।`;
          default:
            return `Fertilizer schedule for ${cropName}: Basal application: ${fertilizerNPK.basal} Top dressing: ${fertilizerNPK.topDressing} Micronutrients: ${fertilizerNPK.micronutrients}`;
        }
      }

      case 'HARVEST_STORAGE': {
        const { harvestAndStorage } = data;
        switch (lang) {
          case 'kn':
            return `${cropName} ಕಟಾವು ಮತ್ತು ಶೇಖರಣೆ ಮಾರ್ಗದರ್ಶಿ: ಕಟಾವಿನ ಹಂತ: ${harvestAndStorage.maturitySigns} ಶೇಖರಣಾ ಆಯಸ್ಸು: ${harvestAndStorage.shelfLifeDays} ದಿನಗಳು. ಸುರಕ್ಷಿತ ಗೋದಾಮು: ${harvestAndStorage.safeStorageConditions} ಕಟಾವು ನಂತರ: ${harvestAndStorage.curingAndPostHarvest}`;
          case 'hi':
            return `${cropName} तुड़ाई और भंडारण: परिपक्वता लक्षण: ${harvestAndStorage.maturitySigns} सुरक्षित भंडारण: ${harvestAndStorage.safeStorageConditions} सुरक्षित शेल्फ-लाइफ: ${harvestAndStorage.shelfLifeDays} दिन।`;
          default:
            return `Harvesting & storage guidelines for ${cropName}: Maturity signs: ${harvestAndStorage.maturitySigns} Safe shelf life: ${harvestAndStorage.shelfLifeDays} days. Recommended storage conditions: ${harvestAndStorage.safeStorageConditions} Post-harvest handling: ${harvestAndStorage.curingAndPostHarvest}`;
        }
      }

      case 'WEATHER_FORECAST': {
        const { tempCelsius, humidityPct, condition, sprayAdvisory, forecast3Day } = data;
        switch (lang) {
          case 'kn':
            return `ನಿಮ್ಮ ಕೃಷಿ ಪ್ರದೇಶದ ಇಂದಿನ ಹವಾಮಾನ: ಉಷ್ಣಾಂಶ ${tempCelsius}°C, ತೇವಾಂಶ ${humidityPct}%, ಸ್ಥಿತಿ: ${condition}. ಕೃಷಿ ಸಲಹೆ: ${sprayAdvisory} ಮುಂಬರುವ 3 ದಿನಗಳ ಮುನ್ಸೂಚನೆ: ${forecast3Day}`;
          case 'hi':
            return `आपके कृषि क्षेत्र का आज का मौसम: तापमान ${tempCelsius}°C, आर्द्रता ${humidityPct}%, स्थिति: ${condition}। कृषि परामर्श: ${sprayAdvisory} आगामी 3 दिनों का पूर्वानुमान: ${forecast3Day}।`;
          case 'te':
            return `మీ ప్రాంత వాతావరణం: ఉష్ణోగ్రత ${tempCelsius}°C, తేమ ${humidityPct}%. వ్యవసాయ సలహా: ${sprayAdvisory} రాబోయే 3 రోజుల వాతావరణం: ${forecast3Day}.`;
          case 'ta':
            return `உங்கள் பகுதி வானிலை: வெப்பநிலை ${tempCelsius}°C, ஈரப்பதம் ${humidityPct}%. வேளாண் ஆலோசனை: ${sprayAdvisory} அடுத்த 3 நாட்கள்: ${forecast3Day}.`;
          case 'ml':
            return `കാലാവസ്ഥ വിവരണം: താപനില ${tempCelsius}°C, ആർദ്രത ${humidityPct}%. കാർഷിക നിർദ്ദേശം: ${sprayAdvisory}`;
          case 'mr':
            return `तुमच्या भागातील हवामान: तापमान ${tempCelsius}°C, आर्द्रता ${humidityPct}%. कृषी सल्ला: ${sprayAdvisory} पुढील 3 दिवसांचा अंदाज: ${forecast3Day}.`;
          case 'bn':
            return `আবহাওয়া বিবরণ: তাপমাত্রা ${tempCelsius}°C, আর্দ্রতা ${humidityPct}%। কৃষি পরামর্শ: ${sprayAdvisory} পরবর্তী ৩ দিনের পূর্বাভাস: ${forecast3Day}।`;
          default:
            return `Current farming weather at ${mandiName}: Temperature ${tempCelsius}°C, Humidity ${humidityPct}%, Condition: ${condition}. Field spray advisory: ${sprayAdvisory} 3-day regional outlook: ${forecast3Day}`;
        }
      }

      case 'AI_EXPLANATION': {
        switch (lang) {
          case 'kn':
            return `ಅಗ್ರಿಟೆಕ್ ಕೃಷಿ AI ಮಾರುಕಟ್ಟೆ ಬೆಲೆಯನ್ನು ಹೇಗೆ ಊಹಿಸುತ್ತದೆ? ನಮ್ಮ AI ವ್ಯವಸ್ಥೆಯು ಕೇಂದ್ರ ಸರ್ಕಾರದ data.gov.in ಮತ್ತು Agmarknet ನಿಂದ 14 ಪ್ರಮುಖ ಎಪಿಎಂಸಿ ಮಂಡಿಗಳ ದಿನನಿತ್ಯದ ನೈಜ ಆವಕ (Tons) ಮತ್ತು 90 ದಿನಗಳ ಐತಿಹಾಸಿಕ ದರಗಳನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತದೆ. ಜೊತೆಗೆ ಆವಕ-ಬೇಡಿಕೆ ಸ್ಥಿತಿಸ್ಥಾಪಕತ್ವ (Elasticity), ಮಳೆ-ಉಷ್ಣಾಂಶದ ಹವಾಮಾನ ಆಘಾತಗಳು, ಮತ್ತು ಹಬ್ಬದ ಋತುಮಾನದ ಚಕ್ರಗಳನ್ನು ಗಣನೆಗೆ ತೆಗೆದುಕೊಂಡು 95% ನಿಖರತೆಯೊಂದಿಗೆ ಮುನ್ಸೂಚನೆ ನೀಡುತ್ತದೆ.`;
          case 'hi':
            return `एग्रीटेक एआई कृषि मंडी भाव का पूर्वानुमान कैसे लगाता है? हमारा एआई मॉडल भारत सरकार के Agmarknet व data.gov.in से 14 प्रमुख एपीएमसी मंडियों की वास्तविक दैनिक आवक और 90 दिनों के ऐतिहासिक आंकड़ों का विश्लेषण करता है। यह आपूर्ति-मांग लोच (Elasticity), मौसमी चक्र, वर्षा-तापमान और त्योहारों की मांग को टाइम-सीरीज़ एमएल एल्गोरिदम में प्रोसेस करके 95% सटीकता के साथ सटीक पूर्वानुमान प्रदान करता है।`;
          case 'te':
            return `అగ్రిటెక్ AI మార్కెట్ ధరలను ఎలా అంచనా వేస్తుంది? మా AI మోడల్ ప్రభుత్వ Agmarknet డేటా ఆధారంగా 14 APMC మార్కెట్ల రోజువారీ రాకలు, 90 రోజుల చారిత్రక ధరల సరళిని విశ్లేషిస్తుంది. డిమాండ్-సప్లై, వాతావరణ పరిస్థితులు మరియు పండుగ సీజన్ల ప్రభావాన్ని పరిగణనలోకి తీసుకుని 95% ఖచ్చితత్వంతో భవిష్యత్ ధరలను లెక్కిస్తుంది.`;
          case 'ta':
            return `அக்ரிடெக் AI சந்தை விலையை எவ்வாறு கணிக்கிறது? மத்திய அரசின் Agmarknet மற்றும் data.gov.in தரவுகளைக் கொண்டு, 14 முக்கிய APMC சந்தைகளின் தினசரி வரத்து மற்றும் 90 நாட்களின் விலை வரலாற்றை ஆய்வு செய்கிறது. தேவை-வழங்கல் ஏற்ற இறக்கம் மற்றும் வானிலைக் காரணிகளை ஆராய்ந்து 95% துல்லியத்துடன் எதிர்கால விலையை கணித்துக் கூறுகிறது.`;
          case 'ml':
            return `അഗ്രിടെക് AI വിപണി വില എങ്ങനെ പ്രവചിക്കുന്നു? കേന്ദ്ര സർക്കാരിന്റെ Agmarknet ഡാറ്റയും 14 APMC മാർക്കറ്റുകളുടെ പ്രതിദിന വരവും മുൻകാല നിരക്കുകളും വിശകലനം ചെയ്താണ് ഞങ്ങളുടെ മെഷീൻ ലേണിംഗ് മോഡൽ വില പ്രവചനം നടത്തുന്നത്.`;
          case 'mr':
            return `एग्रीटेक AI बाजारभावाचा अंदाज कसा लावते? आमचे AI मॉडेल सरकारी Agmarknet आणि data.gov.in वरील 14 प्रमुख APMC बाजारांमधील दैनंदिन आवक आणि 90 दिवसांच्या ऐतिहासिक भावांचे विश्लेषण करते. मागणी-पुरवठा आणि हवामानाचा अभ्यास करून 95% अचूकतेसह भावाचा अंदाज दिला जातो.`;
          case 'bn':
            return `এগ্রিটেক এআই কিভাবে বাজার দর পূর্বাভাস দেয়? আমাদের মডেল সরকারি Agmarknet ও data.gov.in থেকে ১৪টি প্রধান এপিএমসি মান্ডির দৈনিক আগমন এবং ৯০ দিনের ঐতিহাসিক তথ্য বিশ্লেষণ করে। চাহিদা-যোগান এবং আবহাওয়ার প্রভাব বিবেচনা করে ৯৫% নির্ভুল পূর্বাভাস তৈরি করে।`;
          default:
            return `How AgriTech AI predicts agricultural market prices: Our machine learning engine ingests official daily mandi arrivals and modal prices from Government of India Agmarknet and data.gov.in across 14 APMC mandis. It combines auto-regressive 90-day time-series lags, supply-demand arrival volume elasticity curves, meteorological weather anomalies, and seasonal festival harmonics to compute probabilistic price trajectories within 95% confidence intervals.`;
        }
      }

      case 'TRADING_BUYERS': {
        const { verifiedBuyersCount, buyerTypes } = data;
        switch (lang) {
          case 'kn':
            return `ಅಗ್ರಿಟೆಕ್ ವೇದಿಕೆಯಲ್ಲಿ ಪ್ರಸ್ತುತ ${verifiedBuyersCount} ಕ್ಕೂ ಹೆಚ್ಚು ಪರಿಶೀಲಿಸಿದ ಸಗಟು ಖರೀದಿದಾರರು ಮತ್ತು ಸೂಪರ್‌ಮಾರ್ಕೆಟ್ ನೆಟ್‌ವರ್ಕ್‌ಗಳು ${cropName} ಖರೀದಿಸಲು ಸಿದ್ಧರಾಗಿದ್ದಾರೆ. ನಿಮ್ಮ ಬೆಳೆ ವಿವರಗಳನ್ನು 'ರೈತರ ಮಾರಾಟ ಪಟ್ಟಿ'ಯಲ್ಲಿ ನೋಂದಾಯಿಸಿ; ಖರೀದಿದಾರರು ತಕ್ಷಣ ನೇರ ದರ ನೀಡಿ ಎಸ್ಕ್ರೋ ಭದ್ರತೆಯೊಂದಿಗೆ ಖರೀದಿಸುತ್ತಾರೆ.`;
          case 'hi':
            return `एग्रीटेक पर वर्तमान में ${verifiedBuyersCount} सत्यापित थोक खरीदार और रिटेल चेन ${cropName} खरीदने के लिए सक्रिय हैं। आप 'किसान मॉड्यूल' में अपनी फसल लिस्ट कर सकते हैं, जहाँ सुरक्षित एस्क्रो अनुबंध के साथ सीधे खेत से पिकअप सुविधा उपलब्ध है।`;
          default:
            return `There are currently ${verifiedBuyersCount} verified institutional buyers and retail aggregators actively quoting live purchase orders for ${cropName} on AGRITECH. You can list your crop lot in the Farmer Selling module to receive guaranteed purchase offers with zero middleman deductions.`;
        }
      }

      case 'ESCROW_PAYMENT': {
        switch (lang) {
          case 'kn':
            return `ಅಗ್ರಿಟೆಕ್‌ನಲ್ಲಿ ಹಣ ಪಾವತಿಯು 100% ಸುರಕ್ಷಿತ ಎಸ್ಕ್ರೋ ವ್ಯವಸ್ಥೆಯ ಮೂಲಕ ನಡೆಯುತ್ತದೆ. ಖರೀದಿದಾರರು ಆರ್ಡರ್ ಖಚಿತಪಡಿಸಿದಾಗ ಮೊತ್ತವು ಡಿಜಿಟಲ್ ಎಸ್ಕ್ರೋ ಖಾತೆಯಲ್ಲಿ ಭದ್ರವಾಗಿರುತ್ತದೆ. ಮಂಡಿಯಲ್ಲಿ ತೂಕ ಪರಿಶೀಲನೆಯಾದ ತಕ್ಷಣ ಯಾವುದೇ ಮಧ್ಯವರ್ತಿ ಕಮಿಷನ್ ಇಲ್ಲದೆ ನೇರವಾಗಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆ ಅಥವಾ ಯುಪಿಐಗೆ ಹಣ ಜಮೆಯಾಗುತ್ತದೆ.`;
          case 'hi':
            return `एग्रीटेक पर भुगतान 100% सुरक्षित डिजिटल एस्क्रो के माध्यम से होता है। खरीदार द्वारा ऑर्डर बुक करते ही राशि बैंक एस्क्रो में सुरक्षित जमा हो जाती है। मंडी में माल की तौल रसीद सत्यापित होते ही बिना किसी दलाली या कटौती के सीधे आपके बैंक खाते में भुगतान हो जाता है।`;
          default:
            return `Payments on AGRITECH are secured through a 100% digital bank-backed escrow system. When a buyer confirms an order, funds are locked in escrow prior to dispatch. Once your goods are delivered and the weighbridge slip is verified, payment is credited immediately to your linked bank account or UPI with zero unauthorized deductions.`;
        }
      }

      case 'APP_HELP': {
        switch (lang) {
          case 'kn':
            return `ಅಗ್ರಿಟೆಕ್ ವೇದಿಕೆಯ ಮುಖ್ಯ ಸೌಲಭ್ಯಗಳು: 1) ಲೈವ್ ಮಾರುಕಟ್ಟೆ ದರಗಳು (14 ಎಪಿಎಂಸಿ ಮಂಡಿಗಳು), 2) AI ಬೆಲೆ ಮುನ್ಸೂಚನೆ ಸಾಧನ (7 ರಿಂದ 30 ದಿನಗಳು), 3) ನೇರ ಖರೀದಿದಾರರ ಮಾರುಕಟ್ಟೆ, ಮತ್ತು 4) 100% ಎಸ್ಕ್ರೋ ಪಾವತಿ ಭದ್ರತೆ. ಮೇಲಿನ ಮೆನುವಿನಿಂದ ಯಾವುದೇ ವಿಭಾಗಕ್ಕೆ ಸುಲಭವಾಗಿ ಪ್ರವೇಶಿಸಬಹುದು.`;
          case 'hi':
            return `एग्रीटेक की मुख्य सुविधाएं: 1) 14 एपीएमसी मंडियों के लाइव भाव, 2) एआई मूल्य भविष्यवाणी टूल (7 से 30 दिन), 3) सत्यापित थोक खरीदार मार्केटप्लेस, और 4) एस्क्रो भुगतान सुरक्षा। आप ऊपर दिए गए नेविगेशन मेनू से सीधे इन सुविधाओं का उपयोग कर सकते हैं।`;
          default:
            return `AGRITECH Core Features: 1) Live verified market prices across 14 APMC mandis, 2) AI Price Prediction Tool for 7, 15, and 30-day forecast curves, 3) Direct farmer-to-buyer marketplace with farm-gate logistics, and 4) 100% digital escrow payment safety. Navigate seamlessly using the top menu.`;
        }
      }

      case 'CLARIFICATION_NEEDED': {
        switch (lang) {
          case 'kn':
            return `ದಯವಿಟ್ಟು ನೀವು ಯಾವ ಬೆಳೆ (ಉದಾಹರಣೆಗೆ: ಟೊಮೆಟೊ, ಈರುಳ್ಳಿ, ಆಲೂಗಡ್ಡೆ, ಭತ್ತ, ಹತ್ತಿ, ಮೆಣಸಿನಕಾಯಿ) ಅಥವಾ ಯಾವ ಮಂಡಿಯ (ಕೋಲಾರ, ಬೆಂಗಳೂರು, ಹುಬ್ಬಳ್ಳಿ) ಬಗ್ಗೆ ಮಾಹಿತಿ ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ ಎಂದು ನಿರ್ದಿಷ್ಟವಾಗಿ ಕೇಳಿ. ಬೆಲೆ, ರೋಗ ನಿಯಂತ್ರಣ, ಹವಾಮಾನ ಅಥವಾ AI ಮುನ್ಸೂಚನೆಯ ಸಂಪೂರ್ಣ ವಿವರ ನೀಡುತ್ತೇನೆ.`;
          case 'hi':
            return `कृपया बताएं कि आप किस फसल (जैसे: टमाटर, प्याज, आलू, धान, गेहूं, मिर्च) या किस मंडी (कोलार, आज़ादपुर, यशवंतपुर) के बारे में जानकारी चाहते हैं? मैं मंडी भाव, रोग उपचार, मौसम या एआई भविष्यवाणी की सटीक जानकारी दूँगा।`;
          case 'te':
            return `దయచేసి మీరు ఏ పంట (టమాటా, ఉల్లిపాయ, బంగాళాదుంప, వరి, మిర్చి) లేదా ఏ మార్కెట్ గురించి సమాచారం తెలుసుకోవాలనుకుంటున్నారో తెలియజేయండి. ధరలు, తెగుళ్ల నివారణ, వాతావరణం లేదా AI అంచనాలను అందిస్తాను.`;
          case 'ta':
            return `தயவுசெய்து நீங்கள் எந்த பயிர் (தக்காளி, வெங்காயம், உருளைக்கிழங்கு, நெல், மிளகாய்) அல்லது எந்த சந்தை பற்றி அறிய விரும்புகிறீர்கள் என்று குறிப்பிடுங்கள். விலை, நோய் மேலாண்மை அல்லது AI கணிப்பு விவரங்களை வழங்குகிறேன்.`;
          case 'ml':
            return `ഏത് വിളയെക്കുറിച്ചോ (തക്കാളി, ഉള്ളി, ഉരുളക്കിഴങ്ങ്, നെല്ല്) ഏത് മാർക്കറ്റിനെക്കുറിച്ചോ ആണ് അറിയേണ്ടതെന്ന് ദയവായി വ്യക്തമാക്കുക. കൃത്യമായ വിവരങ്ങൾ നൽകാം.`;
          case 'mr':
            return `कृपया आपल्याला कोणत्या पिकाबद्दल (टोमॅटो, कांदा, बटाटा, गहू, कापूस) किंवा कोणत्या बाजार समितीबद्दल माहिती हवी आहे ते सांगा. मी बाजारभाव, रोग नियंत्रण आणि AI अंदाज देईन.`;
          case 'bn':
            return `অনুগ্রহ করে জানান আপনি কোন ফসল (টমেটো, পেঁয়াজ, আলু, ধান, গম) বা কোন মান্ডি সম্পর্কে জানতে চান? আমি বাজার দর, রোগ দমন এবং এআই পূর্বাভাস প্রদান করব।`;
          default:
            return `Could you please specify which crop (e.g. Tomato, Onion, Potato, Paddy, Wheat, Chilli) or which mandi (e.g. Kolar, Bengaluru, Azadpur) you would like assistance with? You can ask me about live market prices, price predictions, pest remedies, crop cultivation, or weather forecasts.`;
        }
      }

      case 'GENERAL_GREETING':
      default: {
        switch (lang) {
          case 'kn':
            return `ನಮಸ್ಕಾರ! ನಾನು ಅಗ್ರಿಟೆಕ್ ಕೃಷಿ AI ಧ್ವನಿ ಸಹಾಯಕ. ಲೈವ್ ಮಂಡಿ ಬೆಲೆಗಳು, AI ಬೆಲೆ ಮುನ್ಸೂಚನೆ, ಬೆಳೆ ರೋಗ ಮತ್ತು ಔಷಧೋಪಚಾರ, ಅಥವಾ ಮಾರುಕಟ್ಟೆ ಖರೀದಿದಾರರ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ, ಕನ್ನಡದಲ್ಲೇ ಉತ್ತರಿಸುತ್ತೇನೆ.`;
          case 'hi':
            return `नमस्ते! मैं एग्रीटेक कृषि एआई सहायक हूँ। आज के मंडी भाव, एआई मूल्य भविष्यवाणी, फसल रोग-उपचार या थोक खरीदारों से जुड़े किसी भी सवाल के लिए मैं आपकी सेवा में हाज़िर हूँ।`;
          case 'te':
            return `నమస్కారం! నేను అగ్రిటెక్ వ్యవసాయ AI అసిస్టెంట్. మార్కెట్ ధరలు, AI అంచనాలు, పంట తెగుళ్లు లేదా కొనుగోలుదారుల వివరాల గురించి ఏదైనా అడగండి.`;
          case 'ta':
            return `வணக்கம்! நான் அக்ரிடெக் விவசாய AI உதவியாளர். சந்தை விலைகள், AI கணிப்புகள், பயிர் நோய்கள் அல்லது வாங்குபவர்கள் பற்றி எதையும் கேட்கலாம்.`;
          case 'ml':
            return `നമസ്കാരം! ഞാൻ അഗ്രിടെക് കാർഷിക AI സഹായിയാണ്. മാർക്കറ്റ് നിരക്കുകൾ, രോഗങ്ങൾ, കാലാവസ്ഥ എന്നിവയെക്കുറിച്ച് എന്തും ചോദിക്കാം.`;
          case 'mr':
            return `नमस्कार! मी एग्रीटेक कृषी AI सहाय्यक आहे. आजचे बाजारभाव, AI अंदाज, पीक रोग व औषधे याविषयी काहीही विचारा.`;
          case 'bn':
            return `নমস্কার! আমি এগ্রিটেক কৃষি এআই সহকারী। আজকের বাজার দর, পূর্বাভাস, রোগ দমন বা ক্রেতাদের সম্পর্কে যেকোনো প্রশ্ন করুন।`;
          default:
            return `Hello! I am AgriAI, your smart farming and agricultural trade assistant. Ask me anything about live APMC mandi rates, AI price predictions, crop disease treatments, weather forecasts, or verified buyers.`;
        }
      }
    }
  }
}

export const dynamicResponseGenerator = new DynamicResponseGenerator();
