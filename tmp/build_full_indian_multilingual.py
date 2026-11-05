import json
import re
import sys

# Load base datasets
with open("/tmp/all_ui_strings.json", "r", encoding="utf-8") as f:
    all_strings = json.load(f)
with open("/tmp/all_ui_words.json", "r", encoding="utf-8") as f:
    all_words = json.load(f)
with open("/tmp/kn_all_968_words.json", "r", encoding="utf-8") as f:
    kn_words = json.load(f)

sys.path.insert(0, "./tmp")
sys.path.insert(0, "/tmp")
from create_all_translations import kn_phrases
from phrases_all_langs import PHRASES
from add_remaining_phrases import REMAINING_PHRASES
from final_69_phrases import FINAL_PHRASES

# Build Master Phrases for all languages
MASTER_PHRASES = {"en": {}, "kn": dict(kn_phrases), "hi": {}, "te": {}, "ta": {}, "ml": {}, "mr": {}, "bn": {}}

# Helper to load existing translations from locales and dictionary
def extract_locale_and_dict(lang):
    res = {}
    try:
        with open("src/i18n/locales/en.ts") as f:
            en_txt = f.read()
        with open(f"src/i18n/locales/{lang}.ts") as f:
            l_txt = f.read()
        en_dict = dict(re.findall(r'(\w+):\s*[\'\"]([^\'\"]+)[\'\"]', en_txt))
        l_dict = dict(re.findall(r'(\w+):\s*[\'\"]([^\'\"]+)[\'\"]', l_txt))
        for k, v in en_dict.items():
            if k in l_dict:
                res[v] = l_dict[k]
                res[v.strip()] = l_dict[k]
    except Exception as e:
        pass

    try:
        with open("src/i18n/dictionary.ts") as f:
            txt = f.read()
        m = re.search(r'\b' + lang + r':\s*\{([^}]+)\}', txt)
        if m:
            for k, v in re.findall(r'[\'\"]([^\'\"]+)[\'\"]\s*:\s*[\'\"]([^\'\"]+)[\'\"]', m.group(1)):
                res[k] = v
                res[k.strip()] = v
    except Exception as e:
        pass

    try:
        with open("src/i18n/comprehensiveDictionary.ts") as f:
            txt = f.read()
        m = re.search(r'\b' + lang + r':\s*\{([^}]+)\}', txt)
        if m:
            for k, v in re.findall(r'[\'\"]([^\'\"]+)[\'\"]\s*:\s*[\'\"]([^\'\"]+)[\'\"]', m.group(1)):
                res[k] = v
                res[k.strip()] = v
    except Exception as e:
        pass

    return res

# Extra specific translations for 3 missing in te, ta, ml, mr, bn
extra_specific = {
    "Spices": {
        "hi": "मसाले", "te": "మసాలా దినుసులు", "ta": "மசாலா பொருட்கள்", "ml": "സുഗന്ധവ്യഞ്ജനങ്ങൾ", "mr": "मसाले", "bn": "মশলা"
    },
    "Price: Low to High": {
        "hi": "मूल्य: कम से ज्यादा", "te": "ధర: తక్కువ నుండి ఎక్కువ", "ta": "விலை: குறைந்தது முதல் அதிகம்",
        "ml": "വില: കുറഞ്ഞത് മുതൽ കൂടിയത് വരെ", "mr": "किंमत: कमी ते जास्त", "bn": "দাম: কম থেকে বেশি"
    },
    "Price: High to Low": {
        "hi": "मूल्य: ज्यादा से कम", "te": "ధర: ఎక్కువ నుండి తక్కువ", "ta": "விலை: அதிகம் முதல் குறைந்தது",
        "ml": "വില: കൂടിയത് മുതൽ കുറഞ്ഞത് വരെ", "mr": "किंमत: जास्त ते कमी", "bn": "দাম: বেশি থেকে কম"
    },
    "Selected": {
        "hi": "चयनित", "te": "ఎంపిక చేయబడింది", "ta": "தேர்ந்தெடுக்கப்பட்டது", "ml": "തിരഞ്ഞെടുത്തു", "mr": "निवडले", "bn": "নির্বাচিত"
    },
    "Select Language": {
        "hi": "भाषा चुनें", "te": "భాషను ఎంచుకోండి", "ta": "மொழியைத் தேர்ந்தெடுக்கவும்", "ml": "ഭാഷ തിരഞ്ഞെടുക്കുക", "mr": "भाषा निवडा", "bn": "ভাষা নির্বাচন করুন"
    },
    "Select Language (8)": {
        "hi": "भाषा चुनें (8)", "te": "భాషను ఎంచుకోండి (8)", "ta": "மொழியைத் தேர்ந்தெடுக்கவும் (8)", "ml": "ഭാഷ തിരഞ്ഞെടുക്കുക (8)", "mr": "भाषा निवडा (8)", "bn": "ভাষা নির্বাচন করুন (8)"
    },
    "Languages": {
        "hi": "भाषाएं", "te": "భాషలు", "ta": "மொழிகள்", "ml": "ഭാഷകൾ", "mr": "भाषा", "bn": "ভাষাগুলি"
    },
    "Farmer Demo": {
        "hi": "किसान डेमो", "te": "రైతు డెమో", "ta": "விவசாயி டெமோ", "ml": "കർഷക ഡെമോ", "mr": "शेतकरी डेमो", "bn": "কৃষক ডেমো"
    },
    "Buyer Demo": {
        "hi": "खरीदार डेमो", "te": "కొనుగోలుదారు డెమో", "ta": "வாங்குபவர் டெமோ", "ml": "വാങ്ങുന്നയാൾ ഡെമോ", "mr": "खरेदीदार डेमो", "bn": "ক্রেতা ডেমো"
    },
    "Admin Demo": {
        "hi": "प्रशासक डेमो", "te": "అడ్మిన్ డెమో", "ta": "நிர்வாகி டெமோ", "ml": "അഡ്മിൻ ഡെമോ", "mr": "प्रशासक डेमो", "bn": "প্রশাসক ডেমো"
    },
    "Bullish Uptrend (+12.4%)": {
        "hi": "तेजी का रुख (+12.4%)", "te": "వృద్ధి ధోరణి (+12.4%)", "ta": "ஏறுமுகப் போக்கு (+12.4%)", "ml": "വർദ്ധന പ്രവണത (+12.4%)", "mr": "तेजीचा कल (+12.4%)", "bn": "ঊর্ধ্বমুখী প্রবণতা (+১২.৪%)"
    },
    "Harvest Advisory:": {
        "hi": "कटाई सलाह:", "te": "కోత సలహా:", "ta": "அறுவடை ஆலோசனை:", "ml": "വിളവെടുപ്പ് ഉപദേശം:", "mr": "कापणी सल्ला:", "bn": "ফসল তোলার পরামর্শ:"
    },
    "Browse Full Commodity Market": {
        "hi": "संपूर्ण कमोडिटी बाज़ार ब्राउज़ करें", "te": "పూర్తి కమోడిటీ మార్కెట్‌ను బ్రౌజ్ చేయండి", "ta": "முழு பொருட்கள் சந்தையையும் உலாவவும்", "ml": "മുഴുവൻ ചരക്ക് വിപണിയും ബ്രൗസ് ചെയ്യുക", "mr": "पूर्ण कमोडिटी बाजार ब्राउझ करा", "bn": "সম্পূর্ণ পণ্য বাজার ব্রাউজ করুন"
    },
    "100% Escrow Secured": {
        "hi": "100% एस्क्रो सुरक्षित", "te": "100% ఎస్క్రో సురక్షితం", "ta": "100% எஸ்க்ரோ பாதுகாப்பானது", "ml": "100% എസ്ക്രോ സുരക്ഷിതം", "mr": "100% एस्क्रो सुरक्षित", "bn": "১০০% এসক্রো সুরক্ষিত"
    },
    "Voice AI (8 Languages)": {
        "hi": "वॉइस एआई (8 भाषाएं)", "te": "వాయిస్ AI (8 భాషలు)", "ta": "குரல் AI (8 மொழிகள்)", "ml": "വോയ്‌സ് AI (8 ഭാഷകൾ)", "mr": "व्हॉईस एआय (8 भाषा)", "bn": "ভয়েস এআই (৮টি ভাষা)"
    },
    "Wholesale Buyer Portal": {
        "kn": "ಸಗಟು ಖರೀದಿದಾರರ ಪೋರ್ಟಲ್", "hi": "थोक खरीदार पोर्टल", "te": "హోల్‌సేల్ కొనుగోలుదారు పోర్టల్", "ta": "மொத்த வாங்குபவர் போர்ட்டல்", "ml": "മൊത്തവ്യാപാര പോർട്ടൽ", "mr": "घाऊक खरेदीदार पोर्टल", "bn": "পাইকারি ক্রেতা পোর্টাল"
    },
    "Administrator Command": {
        "kn": "ಆಡಳಿತಾಧಿಕಾರಿ ಕಮಾಂಡ್", "hi": "प्रशासक कमान", "te": "అడ్మినిస్ట్రేటర్ కమాండ్", "ta": "நிர்வாகக் கட்டளை", "ml": "അഡ്മിനിസ്ട്രേറ്റർ കമാൻഡ്", "mr": "प्रशासक कमांड", "bn": "প্রশাসক কমান্ড"
    },
    "Crop Commodity": {
        "kn": "ಬೆಳೆ ಸರಕು", "hi": "फसल वस्तु", "te": "పంట కమోడిటీ", "ta": "பயிர் பொருள்", "ml": "വിള ചരക്ക്", "mr": "पीक कमोडिटी", "bn": "ফসল পণ্য"
    },
    "Benchmark APMC Mandi": {
        "kn": "ಮಾನದಂಡ ಎಪಿಎಂಸಿ ಮಂಡಿ", "hi": "बेंचमार्क एपीएमसी मंडी", "te": "బెంచ్‌మార్క్ APMC మండి", "ta": "அளவுகோல் APMC மண்டி", "ml": "ബെഞ്ച്മാർക്ക് APMC മണ്ടി", "mr": "बेंचमार्क APMC मंडी", "bn": "বেঞ্চমার্ক APMC মান্ডি"
    },
    "Benchmark APMC": {
        "kn": "ಮಾನದಂಡ ಎಪಿಎಂಸಿ", "hi": "बेंचमार्क एपीएमसी", "te": "బెంచ్‌మార్క్ APMC", "ta": "அளவுகோல் APMC", "ml": "ബെഞ്ച്മാർക്ക് APMC", "mr": "बेंचमार्क APMC", "bn": "বেঞ্চমার্ক APMC"
    },
    "100% Escrow Protection": {
        "kn": "100% ಎಸ್ಕ್ರೋ ರಕ್ಷಣೆ", "hi": "100% एस्क्रो सुरक्षा", "te": "100% ఎస్క్రో రక్షణ", "ta": "100% எஸ்க்ரோ பாதுகாப்பு", "ml": "100% എസ്ക്രോ സംരക്ഷണം", "mr": "100% एस्क्रो संरक्षण", "bn": "১০০% এসক্রো সুরক্ষা"
    },
    "AI Disease Diagnostics": {
        "kn": "ಎಐ ಬೆಳೆ ರೋಗ ಪತ್ತೆ", "hi": "एआई फसल रोग निदान", "te": "AI పంట వ్యాధి నిర్ధారణ", "ta": "AI பயிர் நோய் கண்டறிதல்", "ml": "AI വിള രോഗനിർണയം", "mr": "एआय पीक रोग निदान", "bn": "এআই ফসল রোগ নির্ণয়"
    },
    "1-Click Fast Demo Login": {
        "kn": "1-ಕ್ಲಿಕ್ ತ್ವರಿತ ಡೆಮೊ ಲಾಗಿನ್", "hi": "1-क्लिक तेज़ डेमो लॉगिन", "te": "1-క్లిక్ వేగవంతమైన డెమో లాగిన్", "ta": "1-கிளிக் விரைவான டெமோ உள்நுழைவு", "ml": "1-ക്ലിക്ക് വേഗതയേറിയ ഡെമോ ലോഗിൻ", "mr": "1-ക്लिक जलद डेमो लॉगिन", "bn": "১-ক্লিক দ্রুত ডেমো লগইন"
    },
    "Farmer Demo": {
        "kn": "ರೈತ ಡೆಮೊ", "hi": "किसान डेमो", "te": "రైతు డెమో", "ta": "விவசாயி டெமோ", "ml": "കർഷക ഡെമോ", "mr": "शेतकरी डेमो", "bn": "কৃষক ডেমো"
    },
    "Buyer Demo": {
        "kn": "ಖರೀದಿದಾರ ಡೆಮೊ", "hi": "खरीदार डेमो", "te": "కొనుగోలుదారు డెమో", "ta": "வாங்குபவர் டெமோ", "ml": "வாങ്ങുന്നയാൾ ഡെമോ", "mr": "खरेदीदार डेमो", "bn": "ক্রেতা ডেমো"
    },
    "Admin Demo": {
        "kn": "ಅಡ್ಮಿನ್ ಡೆಮೊ", "hi": "प्रशासक डेमो", "te": "అడ్మిన్ డెమో", "ta": "நிர்வாகி டெமோ", "ml": "അഡ്മിൻ ഡെമോ", "mr": "प्रशासक डेमो", "bn": "প্রশাসক ডেমো"
    },
    "Sign In": {
        "kn": "ಸೈನ್ ಇನ್", "hi": "साइन इन करें", "te": "సైన్ ఇన్ చేయండి", "ta": "உள்நுழைக", "ml": "സൈൻ ഇൻ ചെയ്യുക", "mr": "साइन इन करा", "bn": "সাইন ইন করুন"
    },
    "Farmer Portal": {
        "kn": "ರೈತ ಪೋರ್ಟಲ್", "hi": "किसान पोर्टल", "te": "రైతు పోర్టల్", "ta": "விவசாயி போர்ட்டல்", "ml": "കർഷക പോർട്ടൽ", "mr": "शेतकरी पोर्टल", "bn": "কৃষক পোর্টাল"
    }
}

# Populate phrases for each language
all_phrase_sources = {**PHRASES, **REMAINING_PHRASES, **FINAL_PHRASES, **extra_specific}

for lang in ["kn", "hi", "te", "ta", "ml", "mr", "bn"]:
    extracted = extract_locale_and_dict(lang)
    lang_dict = dict(MASTER_PHRASES[lang])
    
    # 1. From all_phrase_sources
    for phrase, lang_map in all_phrase_sources.items():
        if lang in lang_map:
            lang_dict[phrase] = lang_map[lang]
            lang_dict[phrase.strip()] = lang_map[lang]

    # 2. From extracted
    for k, v in extracted.items():
        if k not in lang_dict:
            lang_dict[k] = v

    # 3. Add to MASTER_PHRASES
    MASTER_PHRASES[lang] = lang_dict
    print(f"Master phrases for {lang}: {len(lang_dict)}")

print("Phrases compiled successfully.")
