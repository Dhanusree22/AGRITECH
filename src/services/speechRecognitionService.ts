// Unified Multilingual Speech-to-Text Service for AGRITECH
// Synchronous Web Speech launch, gesture-unlocked shared AudioContext,
// race-free raw Intel SST / stereo fallback, and live mic telemetry.

import { LanguageCode } from '../types';
import { LanguageInfo } from '../i18n/languageConfig';

export type MicListeningPhase = 'starting' | 'listening' | 'hearing_sound' | 'transcribing';

export interface MicDeviceInfo {
  deviceId: string;
  label: string;
}

export interface MicDiagnosticResult {
  ok: boolean;
  reason:
    | 'ok'
    | 'permission_denied'
    | 'no_device'
    | 'busy'
    | 'hardware_muted'
    | 'silent_device'
    | 'unsupported'
    | 'context_suspended';
  peakLevel: number;
  trackMuted: boolean;
  activeDeviceLabel: string;
  devices: MicDeviceInfo[];
  workingDeviceId?: string;
  workingDeviceLabel?: string;
  lastSpeechError?: string;
}

export interface SpeechListenOptions {
  langConfig: LanguageInfo;
  preferredDeviceId?: string;
  ttsWasPlaying?: boolean;
  onStart?: () => void;
  onPhaseChange?: (phase: MicListeningPhase) => void;
  onAudioLevel?: (level: number) => void;
  onInterimTranscript?: (text: string) => void;
  onFinalTranscript: (text: string) => void;
  onError?: (message: string) => void;
  onEnd?: () => void;
}

type MicMsgKey =
  | 'permission_denied'
  | 'no_mic_hardware'
  | 'mic_busy'
  | 'hardware_muted'
  | 'no_voice'
  | 'not_supported'
  | 'network_fallback_failed'
  | 'transcription_unavailable'
  | 'timed_out';

const LOCALIZED_MIC_MESSAGES: Record<MicMsgKey, Record<LanguageCode, string>> = {
  permission_denied: {
    en: 'Microphone permission was denied. Click the lock/mic icon in your browser address bar and allow microphone access.',
    kn: 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್ ಅಡ್ರೆಸ್ ಬಾರ್‌ನಲ್ಲಿ ಮೈಕ್ ಅನುಮತಿಸಿ.',
    hi: 'माइक्रोफ़ोन अनुमति अस्वीकृत है। ब्राउज़र एड्रेस बार में माइक की अनुमति दें।',
    te: 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. బ్రౌజర్ అడ್ರెస్ బార్‌లో మైక్ అనుమతించండి.',
    ta: 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. உலாவி முகவரிப் பட்டியில் மைக்கை அனுமதிக்கவும்.',
    ml: 'മൈക്രോഫോൺ അനുമതി നിരസിച്ചു. ബ്രൗസർ അഡ്രസ് ബാറിൽ മൈക്ക് അനുവദിക്കുക.',
    mr: 'मायक्रोफोन परवानगी नाकारली आहे. ब्राउझर ॲड्रेस बारमध्ये माइकला परवानगी द्या.',
    bn: 'মাইক্রোফোন অনুমতি প্রত্যাখ্যাত হয়েছে। ব্রাউজার অ্যাড্রেস বারে মাইক অনুমতি দিন।',
  },
  no_mic_hardware: {
    en: 'No microphone hardware was detected by your browser. Connect a microphone or tap a quick prompt below.',
    kn: 'ಬ್ರೌಸರ್‌ಗೆ ಯಾವುದೇ ಮೈಕ್ರೊಫೋನ್ ಸಾಧನ ಕಂಡುಬಂದಿಲ್ಲ. ಮೈಕ್ ಸಂಪರ್ಕಿಸಿ ಅಥವಾ ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳನ್ನು ಒತ್ತಿ.',
    hi: 'ब्राउज़र को कोई माइक्रोफ़ोन नहीं मिला। माइक कनेक्ट करें या नीचे दिए गए प्रश्न चुनें।',
    te: 'మైక్రోఫోన్ పరికరం కనుగొనబడలేదు. మైక్ కనెక్ట్ చేయండి లేదా దిగువ ప్రశ్నలను నొక్కండి.',
    ta: 'மைக்ரோஃபோன் சாதனம் கண்டறியப்படவில்லை. மைக்கை இணைக்கவும் அல்லது கீழே உள்ள கேள்விகளைத் தட்டவும்.',
    ml: 'മൈക്രോഫോൺ ഉപകരണം കണ്ടെത്തിയില്ല. മൈക്ക് ഘടിപ്പിക്കുക അല്ലെങ്കിൽ താഴെയുള്ള ചോദ്യങ്ങൾ തിരഞ്ഞെടുക്കുക.',
    mr: 'ब्राउझरला कोणतेही मायक्रोफोन सापडले नाही. माइक जोडा किंवा खालील प्रश्न निवडा.',
    bn: 'ব্রাউজারে কোনো মাইক্রোফোন পাওয়া যায়নি। মাইক সংযোগ করুন অথবা নিচের প্রশ্ন চাপুন।',
  },
  mic_busy: {
    en: 'Your microphone is in use by another app or tab. Close other audio apps and tap the mic again.',
    kn: 'ಮೈಕ್ರೊಫೋನ್ ಬೇರೆ ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ಬಳಕೆಯಲ್ಲಿದೆ. ದಯವಿಟ್ಟು ಅದನ್ನು ಮುಚ್ಚಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    hi: 'आपका माइक्रोफ़ोन किसी अन्य ऐप में व्यस्त है। अन्य ऐप बंद करके फिर से कोशिश करें।',
    te: 'మీ మైక్రోఫోన్ వేరే యాప్‌లో ఉపయోగించబడుతోంది. దాన్ని మూసి మళ్లీ ప్రయత్నించండి.',
    ta: 'உங்கள் மைக்ரோஃபோன் வேறு பயன்பாட்டில் உள்ளது. அதை மூடிவிட்டு மீண்டும் முயற்சிக்கவும்.',
    ml: 'നിങ്ങളുടെ മൈക്രോഫോൺ മറ്റൊരു ആപ്പിൽ ഉപയോഗത്തിലാണ്. അത് അടച്ച് വീണ്ടും ശ്രമിക്കുക.',
    mr: 'तुमचा मायक्रोफोन दुसऱ्या ॲपमध्ये वापरला जात आहे. इतर ॲप बंद करून पुन्हा प्रयत्न करा.',
    bn: 'আপনার মাইক্রোফোন অন্য অ্যাপে ব্যবহৃত হচ্ছে। সেটি বন্ধ করে আবার চেষ্টা করুন।',
  },
  hardware_muted: {
    en: 'Your microphone track is muted by your OS or laptop hardware mic-mute key. Unmute your mic (or check Windows Sound -> Input volume) and retry.',
    kn: 'ನಿಮ್ಮ ಸಾಧನ ಅಥವಾ ಕೀಬೋರ್ಡ್‌ನಿಂದ ಮೈಕ್ ಮ್ಯೂಟ್ ಆಗಿದೆ. ದಯವಿಟ್ಟು ಅನ್‌ಮ್ಯೂಟ್ ಮಾಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    hi: 'आपका माइक सिस्टम या कीबोर्ड से म्यूट है। कृपया अनम्यूट करें और फिर से प्रयास करें।',
    te: 'మీ మైక్రోఫోన్ సిస్టమ్ లేదా కీబోర్డ్ ద్వారా మ్యూట్ చేయబడింది. అన్‌మ్యూట్ చేసి మళ్లీ ప్రయత్నించండి.',
    ta: 'உங்கள் மைக்ரோஃபோன் கணினி அல்லது கீபோர்டால் முடக்கப்பட்டுள்ளது. அன்மியூட் செய்து மீண்டும் முயற்சிக்கவும்.',
    ml: 'നിങ്ങളുടെ മൈക്രോഫോൺ സിസ്റ്റത്തിൽ മ്യൂട്ട് ചെയ്തിരിക്കുന്നു. അൺമ്യൂട്ട് ചെയ്ത് വീണ്ടും ശ്രമിക്കുക.',
    mr: 'तुमचा माइक सिस्टीम किंवा कीबोर्डवरून म्यूट आहे. कृपया अनम्यूट करून पुन्हा प्रयत्न करा.',
    bn: 'আপনার মাইক্রোফোন সিস্টেম বা কীবোর্ড থেকে মিউট করা আছে। আনমিউট করে আবার চেষ্টা করুন।',
  },
  no_voice: {
    en: 'No audio signal reached the microphone. Check your browser/OS mic privacy & input level, or tap a quick prompt below.',
    kn: 'ಮೈಕ್ರೊಫೋನ್‌ಗೆ ಧ್ವನಿ ತಲುಪಲಿಲ್ಲ. ಬ್ರೌಸರ್/ಸಾಧನದ ಮೈಕ್ ಸೆಟ್ಟಿಂಗ್ಸ್ ಪರಿಶೀಲಿಸಿ ಅಥವಾ ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳನ್ನು ಒತ್ತಿ.',
    hi: 'माइक्रोफ़ोन तक आवाज़ नहीं पहुँची। ब्राउज़र/डिवाइस की माइक सेटिंग जाँचें या नीचे दिए गए प्रश्न चुनें।',
    te: 'మైక్రోఫోన్‌కు శబ్దం అందలేదు. బ్రౌజర్/డివైజ్ మైక్ సెట్టింగ్‌లను తనిఖీ చేయండి లేదా దిగువ ప్రశ్నలను నొక్కండి.',
    ta: 'மைக்ரோஃபோனுக்கு ஒலி செல்லவில்லை. உலாவி/சாதன மைக் அமைப்பைச் சரிபார்க்கவும்.',
    ml: 'മൈക്രോഫോണിലേക്ക് ശബ്ദം എത്തിയില്ല. ബ്രൗസർ/ഉപകരണ മൈക്ക് ക്രമീകരണം പരിശോധിക്കുക.',
    mr: 'मायक्रोफोनपर्यंत आवाज पोहोचला नाही. ब्राउझर/डिव्हाइस माइक सेटिंग तपासा किंवा खालील प्रश्न निवडा.',
    bn: 'মাইক্রোফোনে কোনো শব্দ পৌঁছায়নি। ব্রাউজার/ডিভাইস মাইক সেটিংস পরীক্ষা করুন অথবা নিচের প্রশ্ন চাপুন।',
  },
  not_supported: {
    en: 'Voice input is unavailable in this browser. Please use Chrome/Edge/Safari, or type/tap a quick prompt below.',
    kn: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಕೆಳಗಿನ ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳನ್ನು ಒತ್ತಿ.',
    hi: 'इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। कृपया टाइप करें या नीचे दिए गए त्वरित प्रश्न चुनें।',
    te: 'ఈ బ్రౌజర్‌లో వాయిస్ ఇన్‌పుట్ అందుబాటులో లేదు. దయచేసి టైప్ చేయండి లేదా దిగువ ప్రశ్నలను నొక్కండి.',
    ta: 'இந்த உலாவியில் குரல் உள்ளீடு இல்லை. தயவுசெய்து தட்டச்சு செய்யவும் அல்லது கீழே உள்ள கேள்விகளைத் தட்டவும்.',
    ml: 'ഈ ബ്രൗസറിൽ വോയിസ് ഇൻപുട്ട് ലഭ്യമല്ല. ദയവായി ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ താഴെയുള്ള ചോദ്യങ്ങൾ തിരഞ്ഞെടുക്കുക.',
    mr: 'या ब्राउझरमध्ये व्हॉईस इनपुट उपलब्ध नाही. कृपया टाइप करा किंवा खालील प्रश्न निवडा.',
    bn: 'এই ব্রাউজারে ভয়েস ইনপট উপলব্ধ নয়। অনুগ্রহ করে টাইপ করুন অথবা নিচের প্রশ্ন চাপুন।',
  },
  network_fallback_failed: {
    en: 'Could not transcribe voice right now. Please tap the mic and speak clearly again, or tap a quick prompt below.',
    kn: 'ಧ್ವನಿಯನ್ನು ಪಠ್ಯಕ್ಕೆ ಪರಿವರ್ತಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಮಾತನಾಡಿ ಅಥವಾ ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳನ್ನು ಒತ್ತಿ.',
    hi: 'आवाज़ को टेक्स्ट में बदला नहीं जा सका। कृपया फिर से बोलें या नीचे दिए गए प्रश्न चुनें।',
    te: 'స్వరాన్ని టెక్స్ట్‌గా మార్చడం సాధ్యం కాలేదు. దయచేసి మళ్లీ మాట్లాడండి లేదా దిగువ ప్రశ్నలను నొక్కండి.',
    ta: 'குரலை உரையாக மாற்ற முடியவில்லை. மீண்டும் பேசவும் அல்லது கீழே உள்ள கேள்விகளைத் தட்டவும்.',
    ml: 'ശബ്ദം ടെക്സ്റ്റാക്കാൻ കഴിഞ്ഞില്ല. വീണ്ടും സംസാരിക്കുക അല്ലെങ്കിൽ താഴെയുള്ള ചോദ്യങ്ങൾ തിരഞ്ഞെടുക്കുക.',
    mr: 'आवाजाचे मजकुरात रूपांतर करता आले नाही. कृपया पुन्हा बोला किंवा खालील प्रश्न निवडा.',
    bn: 'ভয়েস টেক্সটে রূপান্তর করা যায়নি। অনুগ্রহ করে আবার বলুন অথবা নিচের প্রশ্ন চাপুন।',
  },
  transcription_unavailable: {
    en: 'Microphone audio was captured, but browser speech recognition could not connect or match words. Try Google Chrome (non-incognito) or tap a quick prompt below.',
    kn: 'ಮೈಕ್ ಧ್ವನಿಯನ್ನು ಗ್ರಹಿಸಿದೆ, ಆದರೆ ಬ್ರೌಸರ್ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಸಂಪರ್ಕಗೊಳ್ಳಲಿಲ್ಲ. ದಯವಿಟ್ಟು Google Chrome ಬಳಸಿ ಅಥವಾ ಕೆಳಗಿನ ಪ್ರಶ್ನೆಗಳನ್ನು ಒತ್ತಿ.',
    hi: 'माइक ने आवाज़ सुनी, लेकिन ब्राउज़र स्पीच सेवा शब्दों को पहचान नहीं सकी। Google Chrome का उपयोग करें या नीचे दिए गए प्रश्न चुनें।',
    te: 'మైక్ శబ్దాన్ని గుర్తించింది, కానీ బ్రౌజర్ స్పీచ్ సర్వీస్ పదాలను గుర్తించలేకపోయింది. Google Chrome ఉపయోగించండి లేదా దిగువ ప్రశ్నలను నొక్కండి.',
    ta: 'மைக் ஒலியைப் பெற்றது, ஆனால் உலாவி பேச்சு சேவை இணைக்க முடியவில்லை. Google Chrome பயன்படுத்தவும் அல்லது கீழே உள்ள கேள்விகளைத் தட்டவும்.',
    ml: 'മൈക്ക് ശബ്ദം പിടിച്ചെടുത്തു, പക്ഷേ ബ്രൗസർ സ്പീച്ച് സേവനത്തിന് വാക്കുകൾ തിരിച്ചറിയാനായില്ല. Google Chrome ഉപയോഗിക്കുക.',
    mr: 'माइकने आवाज टिपला, परंतु ब्राउझर स्पीच सेवेला शब्द ओळखता आले नाहीत. Google Chrome वापरा किंवा खालील प्रश्न निवडा.',
    bn: 'মাইক শব্দ ধরেছে, কিন্তু ব্রাউজার স্পিচ সার্ভিস শব্দ শনাক্ত করতে পারেনি। অনুগ্রহ করে Google Chrome ব্যবহার করুন অথবা নিচের প্রশ্ন চাপুন।',
  },
  timed_out: {
    en: 'Listening ended before speech was captured. Tap the mic and speak clearly right away, or tap a quick prompt below.',
    kn: 'ಮಾತು ಗ್ರಹಿಸುವ ಮೊದಲು ಆಲಿಸುವಿಕೆ ಮುಕ್ತಾಯವಾಯಿತು. ಮೈಕ್ ಒತ್ತಿ ತಕ್ಷಣ ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ.',
    hi: 'आवाज़ सुने जाने से पहले सुनना समाप्त हो गया। माइक दबाकर तुरंत स्पष्ट बोलें या नीचे दिए गए प्रश्न चुनें।',
    te: 'మాటలు వినబడకముందే సమయం ముగిసింది. మైక్ నొక్కి వెంటనే స్పష్టంగా మాట్లాడండి.',
    ta: 'பேசுவதற்கு முன் கேட்பது முடிந்துவிட்டது. மைக்கைத் தட்டி உடனே தெளிவாகப் பேசவும்.',
    ml: 'സംസാരിക്കുന്നതിന് മുമ്പ് സമയം അവസാനിച്ചു. മൈക്ക് അമർത്തി ഉടൻ വ്യക്തമായി സംസാരിക്കുക.',
    mr: 'बोलण्यापूर्वी ऐकणे थांबले. माइक दाबून लगेच स्पष्ट बोला किंवा खालील प्रश्न निवडा.',
    bn: 'কথা বলার আগেই শোনা বন্ধ হয়ে গেছে। মাইক চেপে সাথে সাথে স্পষ্ট বলুন অথবা নিচের প্রশ্ন চাপুন।',
  },
};

export function getMicMsg(key: MicMsgKey, lang: LanguageCode): string {
  return LOCALIZED_MIC_MESSAGES[key][lang] || LOCALIZED_MIC_MESSAGES[key].en;
}

function getSupportedRecorderMimeType(): string {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return '';
  }
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/ogg',
  ];
  return candidates.find((m) => MediaRecorder.isTypeSupported(m)) || '';
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error || new Error('Failed to read recorded audio'));
    reader.readAsDataURL(blob);
  });
}

type StreamOpenStrategy = 'raw_mono' | 'raw_stereo' | 'browser_default';

async function openAudioStreamWithStrategy(
  preferredDeviceId: string | undefined,
  strategy: StreamOpenStrategy
): Promise<MediaStream> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    throw new Error('getUserMedia_unsupported');
  }

  const deviceConstraint =
    preferredDeviceId && preferredDeviceId !== 'default'
      ? { deviceId: { exact: preferredDeviceId } }
      : {};

  const attempts: MediaStreamConstraints[] =
    strategy === 'raw_stereo'
      ? [
          {
            audio: {
              ...deviceConstraint,
              channelCount: { ideal: 2 },
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false,
            },
          },
          {
            audio: {
              ...deviceConstraint,
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false,
            },
          },
          { audio: Object.keys(deviceConstraint).length ? deviceConstraint : true },
        ]
      : strategy === 'raw_mono'
      ? [
          {
            audio: {
              ...deviceConstraint,
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false,
            },
          },
          { audio: Object.keys(deviceConstraint).length ? deviceConstraint : true },
        ]
      : [
          { audio: Object.keys(deviceConstraint).length ? deviceConstraint : true },
          {
            audio: {
              ...deviceConstraint,
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false,
            },
          },
        ];

  let lastErr: any = null;
  for (const constraints of attempts) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err: any) {
      lastErr = err;
      if (
        err?.name === 'NotAllowedError' ||
        err?.name === 'PermissionDeniedError' ||
        err?.name === 'NotFoundError' ||
        err?.name === 'DevicesNotFoundError'
      ) {
        throw err;
      }
    }
  }
  throw lastErr || new Error('getUserMedia_failed');
}

export async function listAudioInputDevices(): Promise<MicDeviceInfo[]> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) {
    return [];
  }
  try {
    const all = await navigator.mediaDevices.enumerateDevices();
    return all
      .filter((d) => d.kind === 'audioinput')
      .map((d, idx) => ({
        deviceId: d.deviceId,
        label: d.label || `Microphone ${idx + 1}`,
      }));
  } catch {
    return [];
  }
}

class MultilingualSpeechRecognitionController {
  private sessionId = 0;
  private activeListening = false;
  private submitted = false;
  private aborted = false;

  private recognition: any = null;
  private latestTranscript = '';
  private silenceTimer: ReturnType<typeof setTimeout> | null = null;
  private startDelayTimer: ReturnType<typeof setTimeout> | null = null;

  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private sharedAudioCtx: AudioContext | null = null;
  private activeSourceNode: MediaStreamAudioSourceNode | null = null;
  private activeAnalyserNode: AnalyserNode | null = null;
  private activeSilentGain: GainNode | null = null;
  private vadInterval: ReturnType<typeof setInterval> | null = null;
  private maxRecordTimer: ReturnType<typeof setTimeout> | null = null;
  private manualStopRequested = false;

  private unlockedPermissionInSession = false;
  private cloudTranscribeBlockedUntil = 0;
  private lastWebSpeechError = '';
  private activeOptions: SpeechListenOptions | null = null;

  public isListening(): boolean {
    return this.activeListening;
  }

  private ensureSharedAudioContextSync(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;

    try {
      if (!this.sharedAudioCtx || this.sharedAudioCtx.state === 'closed') {
        this.sharedAudioCtx = new AudioCtx();
      }
      if (this.sharedAudioCtx.state === 'suspended') {
        void this.sharedAudioCtx.resume().catch(() => {});
      }
      return this.sharedAudioCtx;
    } catch {
      return null;
    }
  }

  private attachAnalyserToSharedContext(stream: MediaStream): {
    audioCtx: AudioContext;
    analyser: AnalyserNode;
    dataArray: Float32Array<ArrayBuffer>;
  } | null {
    const audioCtx = this.ensureSharedAudioContextSync();
    if (!audioCtx) return null;

    this.detachAnalyserNodes();

    try {
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;

      const silentGain = audioCtx.createGain();
      silentGain.gain.value = 0;

      source.connect(analyser);
      analyser.connect(silentGain);
      silentGain.connect(audioCtx.destination);

      this.activeSourceNode = source;
      this.activeAnalyserNode = analyser;
      this.activeSilentGain = silentGain;

      const dataArray = new Float32Array(new ArrayBuffer(analyser.fftSize * 4));
      return { audioCtx, analyser, dataArray };
    } catch {
      return null;
    }
  }

  private detachAnalyserNodes(): void {
    try {
      this.activeSourceNode?.disconnect();
    } catch {
      // ignore
    }
    try {
      this.activeAnalyserNode?.disconnect();
    } catch {
      // ignore
    }
    try {
      this.activeSilentGain?.disconnect();
    } catch {
      // ignore
    }
    this.activeSourceNode = null;
    this.activeAnalyserNode = null;
    this.activeSilentGain = null;
  }

  private async sampleStreamRms(
    stream: MediaStream,
    sampleMs: number,
    onLiveLevel?: (level: number) => void
  ): Promise<{ peakRms: number; verifiedRunning: boolean; trackMuted: boolean }> {
    const track = stream.getAudioTracks()[0];
    const trackMuted = Boolean(track?.muted);
    const graph = this.attachAnalyserToSharedContext(stream);
    if (!graph) {
      return { peakRms: 0, verifiedRunning: false, trackMuted };
    }

    if (graph.audioCtx.state === 'suspended') {
      await graph.audioCtx.resume().catch(() => {});
    }

    const initialTime = graph.audioCtx.currentTime;
    let peakRms = 0;
    let runningFrames = 0;

    await new Promise<void>((resolve) => {
      const started = Date.now();
      const timer = setInterval(() => {
        if (graph.audioCtx.state === 'running') {
          graph.analyser.getFloatTimeDomainData(graph.dataArray);
          let sumSq = 0;
          for (let i = 0; i < graph.dataArray.length; i++) {
            sumSq += graph.dataArray[i] * graph.dataArray[i];
          }
          const rms = Math.sqrt(sumSq / graph.dataArray.length);
          if (rms > peakRms) peakRms = rms;
          runningFrames += 1;
          onLiveLevel?.(Math.min(1, rms * 18));
        }
        if (Date.now() - started >= sampleMs) {
          clearInterval(timer);
          resolve();
        }
      }, 60);
    });

    const verifiedRunning =
      graph.audioCtx.state === 'running' &&
      runningFrames >= 3 &&
      (graph.audioCtx.currentTime > initialTime || peakRms > 0);

    this.detachAnalyserNodes();
    onLiveLevel?.(0);
    return { peakRms, verifiedRunning, trackMuted: Boolean(track?.muted) };
  }

  public async testMicrophone(
    preferredDeviceId?: string,
    sampleMs = 1500,
    onLiveLevel?: (level: number) => void
  ): Promise<MicDiagnosticResult> {
    this.ensureSharedAudioContextSync();

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return {
        ok: false,
        reason: 'unsupported',
        peakLevel: 0,
        trackMuted: false,
        activeDeviceLabel: '',
        devices: [],
        lastSpeechError: this.lastWebSpeechError || undefined,
      };
    }

    let stream: MediaStream | null = null;
    try {
      // Open cleanly in raw_mono directly so Intel SST hardware APO doesn't collide with WebRTC AEC
      stream = await openAudioStreamWithStrategy(preferredDeviceId, 'raw_mono');
      const track = stream.getAudioTracks()[0];
      const activeLabel = track?.label || 'Default Microphone';
      const devices = await listAudioInputDevices();

      const firstSample = await this.sampleStreamRms(stream, sampleMs, onLiveLevel);
      stream.getTracks().forEach((t) => t.stop());
      stream = null;

      if (!firstSample.verifiedRunning) {
        return {
          ok: false,
          reason: 'context_suspended',
          peakLevel: Math.min(1, firstSample.peakRms * 18),
          trackMuted: firstSample.trackMuted,
          activeDeviceLabel: activeLabel,
          devices,
          lastSpeechError: this.lastWebSpeechError || undefined,
        };
      }

      if (firstSample.peakRms >= 0.00035) {
        return {
          ok: true,
          reason: 'ok',
          peakLevel: Math.min(1, firstSample.peakRms * 18),
          trackMuted: firstSample.trackMuted,
          activeDeviceLabel: activeLabel,
          devices,
          lastSpeechError: this.lastWebSpeechError || undefined,
        };
      }

      // If raw_mono measured zero, wait 300ms for WASAPI release and try raw_stereo (2ch Intel SST array)
      await new Promise((r) => setTimeout(r, 300));
      let stereoSample = { peakRms: 0, verifiedRunning: false, trackMuted: firstSample.trackMuted };
      try {
        const stereoStream = await openAudioStreamWithStrategy(preferredDeviceId, 'raw_stereo');
        stereoSample = await this.sampleStreamRms(stereoStream, 850, onLiveLevel);
        stereoStream.getTracks().forEach((t) => t.stop());
        if (stereoSample.verifiedRunning && stereoSample.peakRms >= 0.00035) {
          return {
            ok: true,
            reason: 'ok',
            peakLevel: Math.min(1, stereoSample.peakRms * 18),
            trackMuted: stereoSample.trackMuted,
            activeDeviceLabel: activeLabel,
            devices,
            lastSpeechError: this.lastWebSpeechError || undefined,
          };
        }
      } catch {
        // ignore stereo probe error
      }

      // Scan alternate microphones in enumerateDevices()
      const alternates = devices.filter(
        (d) =>
          d.deviceId &&
          d.deviceId !== 'default' &&
          d.deviceId !== 'communications' &&
          d.deviceId !== preferredDeviceId &&
          !/virtual|stereo mix|cable output/i.test(d.label)
      );

      for (const alt of alternates.slice(0, 4)) {
        try {
          await new Promise((r) => setTimeout(r, 250));
          const altStream = await openAudioStreamWithStrategy(alt.deviceId, 'raw_stereo');
          const altSample = await this.sampleStreamRms(altStream, 700, onLiveLevel);
          altStream.getTracks().forEach((tr) => tr.stop());
          if (altSample.verifiedRunning && altSample.peakRms >= 0.0004) {
            return {
              ok: false,
              reason: 'silent_device',
              peakLevel: Math.min(1, Math.max(firstSample.peakRms, stereoSample.peakRms) * 18),
              trackMuted: firstSample.trackMuted || stereoSample.trackMuted,
              activeDeviceLabel: activeLabel,
              devices,
              workingDeviceId: alt.deviceId,
              workingDeviceLabel: alt.label,
              lastSpeechError: this.lastWebSpeechError || undefined,
            };
          }
        } catch {
          // ignore failing alternate device
        }
      }

      const anyMuted = firstSample.trackMuted || stereoSample.trackMuted;
      return {
        ok: false,
        reason: anyMuted ? 'hardware_muted' : 'silent_device',
        peakLevel: Math.min(1, Math.max(firstSample.peakRms, stereoSample.peakRms) * 18),
        trackMuted: anyMuted,
        activeDeviceLabel: activeLabel,
        devices,
        lastSpeechError: this.lastWebSpeechError || undefined,
      };
    } catch (err: any) {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      const devices = await listAudioInputDevices();
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        return {
          ok: false,
          reason: 'permission_denied',
          peakLevel: 0,
          trackMuted: false,
          activeDeviceLabel: '',
          devices,
          lastSpeechError: this.lastWebSpeechError || undefined,
        };
      }
      if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
        return {
          ok: false,
          reason: 'no_device',
          peakLevel: 0,
          trackMuted: false,
          activeDeviceLabel: '',
          devices,
          lastSpeechError: this.lastWebSpeechError || undefined,
        };
      }
      return {
        ok: false,
        reason: 'busy',
        peakLevel: 0,
        trackMuted: false,
        activeDeviceLabel: '',
        devices,
        lastSpeechError: this.lastWebSpeechError || undefined,
      };
    }
  }

  public startListening(options: SpeechListenOptions): void {
    this.stopListening(false);

    this.ensureSharedAudioContextSync();

    this.sessionId += 1;
    const mySessionId = this.sessionId;
    this.activeListening = true;
    this.submitted = false;
    this.aborted = false;
    this.latestTranscript = '';
    this.manualStopRequested = false;
    this.unlockedPermissionInSession = false;
    this.lastWebSpeechError = '';
    this.activeOptions = options;

    options.onPhaseChange?.('starting');

    const SpeechRecognition =
      typeof window !== 'undefined' &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

    if (!SpeechRecognition) {
      void this.startMediaRecorderFallback(options, mySessionId);
      return;
    }

    if (options.ttsWasPlaying) {
      this.startDelayTimer = setTimeout(() => {
        if (mySessionId === this.sessionId && !this.aborted) {
          this.startWebSpeech(SpeechRecognition, options, mySessionId, 0);
        }
      }, 180);
      return;
    }

    this.startWebSpeech(SpeechRecognition, options, mySessionId, 0);
  }

  public stopListening(submitCaptured = true): void {
    if (!this.activeListening && !this.recognition && !this.mediaRecorder && !this.startDelayTimer) {
      return;
    }

    const opts = this.activeOptions;
    this.clearTimers();

    if (!submitCaptured) {
      this.aborted = true;
      this.sessionId += 1;
    } else {
      this.manualStopRequested = true;
    }

    if (submitCaptured && this.recognition && !this.submitted && this.latestTranscript.trim()) {
      const captured = this.latestTranscript.trim();
      this.submitted = true;
      this.cleanupWebSpeech();
      this.activeListening = false;
      opts?.onAudioLevel?.(0);
      opts?.onEnd?.();
      opts?.onFinalTranscript(captured);
      return;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch {
        this.cleanupMediaFallback();
        this.activeListening = false;
        opts?.onAudioLevel?.(0);
        opts?.onEnd?.();
      }
      return;
    }

    this.cleanupWebSpeech();
    this.cleanupMediaFallback();
    this.activeListening = false;
    opts?.onAudioLevel?.(0);
    opts?.onEnd?.();
  }

  private clearTimers(): void {
    if (this.startDelayTimer) {
      clearTimeout(this.startDelayTimer);
      this.startDelayTimer = null;
    }
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    if (this.vadInterval) {
      clearInterval(this.vadInterval);
      this.vadInterval = null;
    }
    if (this.maxRecordTimer) {
      clearTimeout(this.maxRecordTimer);
      this.maxRecordTimer = null;
    }
  }

  private cleanupWebSpeech(): void {
    if (this.recognition) {
      this.recognition.onstart = null;
      this.recognition.onaudiostart = null;
      this.recognition.onsoundstart = null;
      this.recognition.onspeechstart = null;
      this.recognition.onresult = null;
      this.recognition.onerror = null;
      this.recognition.onend = null;
      try {
        this.recognition.abort();
      } catch {
        try {
          this.recognition.stop();
        } catch {
          // ignore
        }
      }
      this.recognition = null;
    }
  }

  private cleanupMediaFallback(): void {
    this.clearTimers();
    this.detachAnalyserNodes();
    if (this.mediaRecorder) {
      this.mediaRecorder.ondataavailable = null;
      this.mediaRecorder.onstop = null;
      this.mediaRecorder.onerror = null;
      if (this.mediaRecorder.state !== 'inactive') {
        try {
          this.mediaRecorder.stop();
        } catch {
          // ignore
        }
      }
      this.mediaRecorder = null;
    }
    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach((t) => t.stop());
      } catch {
        // ignore
      }
      this.mediaStream = null;
    }
  }

  private finishWithError(options: SpeechListenOptions, msg: string): void {
    this.activeListening = false;
    options.onAudioLevel?.(0);
    options.onEnd?.();
    options.onError?.(msg);
  }

  private startWebSpeech(
    SpeechRecognitionCtor: any,
    options: SpeechListenOptions,
    mySessionId: number,
    retryCount: number,
    overrideLang?: string
  ): void {
    if (mySessionId !== this.sessionId || this.aborted) return;

    try {
      const recognition = new SpeechRecognitionCtor();
      const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent || '');
      recognition.continuous = retryCount > 0 && !isAndroid;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;
      recognition.lang = overrideLang || options.langConfig.speechCode;

      const attemptStartedAt = Date.now();
      let startedNotified = retryCount > 0;
      let sawAudioStart = false;
      let sawResultInAttempt = false;
      let sawSoundInAttempt = false;

      recognition.onstart = () => {
        if (mySessionId !== this.sessionId || this.aborted) return;
        this.activeListening = true;
        if (!startedNotified) {
          startedNotified = true;
          options.onStart?.();
        }
        options.onPhaseChange?.('listening');
      };

      recognition.onaudiostart = () => {
        sawAudioStart = true;
      };

      recognition.onsoundstart = () => {
        if (mySessionId !== this.sessionId || this.aborted) return;
        sawSoundInAttempt = true;
        options.onPhaseChange?.('hearing_sound');
        options.onAudioLevel?.(0.65);
      };

      recognition.onspeechstart = () => {
        if (mySessionId !== this.sessionId || this.aborted) return;
        sawSoundInAttempt = true;
        options.onPhaseChange?.('hearing_sound');
        options.onAudioLevel?.(0.85);
      };

      recognition.onresult = (event: any) => {
        if (mySessionId !== this.sessionId || this.aborted || this.submitted) return;

        const finalParts: string[] = [];
        const interimParts: string[] = [];

        for (let i = 0; i < event.results.length; i++) {
          const piece = (event.results[i][0]?.transcript || '').trim();
          if (!piece) continue;
          if (event.results[i].isFinal) {
            if (finalParts[finalParts.length - 1] !== piece) {
              finalParts.push(piece);
            }
          } else {
            interimParts.push(piece);
          }
        }

        const finalStr = finalParts.join(' ').trim();
        const interimStr = interimParts.join(' ').trim();
        const combined = `${finalStr} ${interimStr}`.trim();
        if (!combined) return;

        sawResultInAttempt = true;
        sawSoundInAttempt = true;
        this.latestTranscript = combined;
        options.onPhaseChange?.('hearing_sound');
        options.onAudioLevel?.(0.9);
        options.onInterimTranscript?.(combined);

        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
        }

        const waitMs = !recognition.continuous && finalStr && !interimStr
          ? 160
          : finalStr && !interimStr
          ? 650
          : 1400;

        this.silenceTimer = setTimeout(() => {
          if (mySessionId !== this.sessionId || this.aborted || this.submitted) return;
          const textToSubmit = this.latestTranscript.trim();
          if (textToSubmit) {
            this.submitted = true;
            this.cleanupWebSpeech();
            this.activeListening = false;
            options.onAudioLevel?.(0);
            options.onEnd?.();
            options.onFinalTranscript(textToSubmit);
          }
        }, waitMs);
      };

      recognition.onerror = (event: any) => {
        if (mySessionId !== this.sessionId || this.aborted || this.submitted) return;

        const errType = String(event?.error || 'unknown');
        this.lastWebSpeechError = errType;
        const elapsedMs = Date.now() - attemptStartedAt;
        this.clearTimers();
        this.cleanupWebSpeech();

        if (errType === 'aborted') {
          this.activeListening = false;
          options.onAudioLevel?.(0);
          options.onEnd?.();
          return;
        }

        if (errType === 'not-allowed' || errType === 'service-not-allowed') {
          if (!this.unlockedPermissionInSession && typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
            this.unlockedPermissionInSession = true;
            navigator.mediaDevices
              .getUserMedia({ audio: true })
              .then((stream) => {
                stream.getTracks().forEach((t) => t.stop());
                if (mySessionId !== this.sessionId || this.aborted) return;
                setTimeout(() => {
                  if (mySessionId === this.sessionId && !this.aborted && !this.submitted) {
                    this.startWebSpeech(SpeechRecognitionCtor, options, mySessionId, retryCount);
                  }
                }, 250);
              })
              .catch((err: any) => {
                if (mySessionId !== this.sessionId || this.aborted) return;
                if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
                  this.finishWithError(options, getMicMsg('permission_denied', options.langConfig.code));
                } else {
                  void this.handleWebSpeechNoInput(options, mySessionId, startedNotified, sawSoundInAttempt);
                }
              });
            return;
          }
          this.finishWithError(options, getMicMsg('permission_denied', options.langConfig.code));
          return;
        }

        if (this.latestTranscript.trim()) {
          const captured = this.latestTranscript.trim();
          this.submitted = true;
          this.activeListening = false;
          options.onAudioLevel?.(0);
          options.onEnd?.();
          options.onFinalTranscript(captured);
          return;
        }

        if (errType === 'language-not-supported' && options.langConfig.code === 'en' && recognition.lang !== 'en-US') {
          this.startWebSpeech(SpeechRecognitionCtor, options, mySessionId, retryCount + 1, 'en-US');
          return;
        }

        if (errType === 'no-speech' && retryCount === 0 && (!sawAudioStart || elapsedMs < 3500)) {
          const nextLang =
            options.langConfig.code === 'en' && recognition.lang === 'en-IN' ? 'en-US' : overrideLang;
          setTimeout(() => {
            if (mySessionId === this.sessionId && !this.aborted && !this.submitted) {
              this.startWebSpeech(SpeechRecognitionCtor, options, mySessionId, retryCount + 1, nextLang);
            }
          }, 250);
          return;
        }

        if (errType === 'network' || errType === 'language-not-supported') {
          void this.handleWebSpeechNoInput(options, mySessionId, startedNotified, sawSoundInAttempt);
          return;
        }

        if (errType === 'no-speech' || errType === 'audio-capture') {
          void this.handleWebSpeechNoInput(options, mySessionId, startedNotified, sawSoundInAttempt);
          return;
        }

        this.finishWithError(options, getMicMsg('timed_out', options.langConfig.code));
      };

      recognition.onend = () => {
        if (mySessionId !== this.sessionId || this.aborted || this.submitted) return;
        if (this.recognition !== recognition) return;

        const elapsedMs = Date.now() - attemptStartedAt;
        this.clearTimers();
        this.recognition = null;

        if (this.latestTranscript.trim()) {
          const captured = this.latestTranscript.trim();
          this.submitted = true;
          this.activeListening = false;
          options.onAudioLevel?.(0);
          options.onEnd?.();
          options.onFinalTranscript(captured);
          return;
        }

        if (this.manualStopRequested) {
          this.activeListening = false;
          options.onAudioLevel?.(0);
          options.onEnd?.();
          return;
        }

        if (!sawResultInAttempt && retryCount === 0 && elapsedMs < 3500) {
          setTimeout(() => {
            if (mySessionId === this.sessionId && !this.aborted && !this.submitted) {
              this.startWebSpeech(SpeechRecognitionCtor, options, mySessionId, retryCount + 1, overrideLang);
            }
          }, 250);
          return;
        }

        void this.handleWebSpeechNoInput(options, mySessionId, startedNotified, sawSoundInAttempt);
      };

      this.recognition = recognition;
      recognition.start();
    } catch {
      this.cleanupWebSpeech();
      void this.startMediaRecorderFallback(options, mySessionId);
    }
  }

  private async handleWebSpeechNoInput(
    options: SpeechListenOptions,
    mySessionId: number,
    alreadyNotifiedStart: boolean,
    priorSoundDetected: boolean
  ): Promise<void> {
    if (mySessionId !== this.sessionId || this.aborted || this.submitted) return;

    // Wait 320ms so Windows Intel SST / WASAPI fully releases the Web Speech audio handle
    await new Promise((r) => setTimeout(r, 320));
    if (mySessionId !== this.sessionId || this.aborted || this.submitted) return;

    if (Date.now() < this.cloudTranscribeBlockedUntil) {
      const diag = await this.testMicrophone(options.preferredDeviceId, 950, options.onAudioLevel);
      if (mySessionId !== this.sessionId || this.aborted || this.submitted) return;

      if (diag.reason === 'permission_denied') {
        this.finishWithError(options, getMicMsg('permission_denied', options.langConfig.code));
        return;
      }
      if (diag.reason === 'no_device') {
        this.finishWithError(options, getMicMsg('no_mic_hardware', options.langConfig.code));
        return;
      }
      if (diag.reason === 'busy') {
        this.finishWithError(options, getMicMsg('mic_busy', options.langConfig.code));
        return;
      }
      if (diag.reason === 'hardware_muted') {
        this.finishWithError(
          options,
          `${getMicMsg('hardware_muted', options.langConfig.code)} (Input: "${diag.activeDeviceLabel}").`
        );
        return;
      }
      if (diag.reason === 'silent_device' && !priorSoundDetected) {
        const altHint = diag.workingDeviceLabel
          ? ` Found working mic: "${diag.workingDeviceLabel}".`
          : '';
        const errHint = this.lastWebSpeechError ? ` [Speech API: ${this.lastWebSpeechError}]` : '';
        this.finishWithError(
          options,
          `${getMicMsg('no_voice', options.langConfig.code)} (Input: "${diag.activeDeviceLabel}", level: 0%).${altHint}${errHint}`
        );
        return;
      }

      const errHint = this.lastWebSpeechError ? ` [Speech API: ${this.lastWebSpeechError}]` : '';
      this.finishWithError(
        options,
        priorSoundDetected || diag.ok || diag.reason === 'context_suspended'
          ? `${getMicMsg('transcription_unavailable', options.langConfig.code)}${errHint}`
          : getMicMsg('timed_out', options.langConfig.code)
      );
      return;
    }

    await this.startMediaRecorderFallback(options, mySessionId, alreadyNotifiedStart, priorSoundDetected);
  }

  private async startMediaRecorderFallback(
    options: SpeechListenOptions,
    mySessionId: number,
    alreadyNotifiedStart = false,
    priorSoundDetected = false
  ): Promise<void> {
    if (mySessionId !== this.sessionId || this.aborted || this.submitted) return;

    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === 'undefined'
    ) {
      this.finishWithError(options, getMicMsg('not_supported', options.langConfig.code));
      return;
    }

    try {
      // Open raw_mono directly in ONE clean call (avoids stop->reopen WASAPI race on Intel SST)
      const stream = await openAudioStreamWithStrategy(options.preferredDeviceId, 'raw_mono');
      const track = stream.getAudioTracks()[0];
      const trackLabel = track?.label || 'Default Microphone';
      const trackMuted = Boolean(track?.muted);

      if (mySessionId !== this.sessionId || this.aborted || this.submitted) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      this.mediaStream = stream;

      const mimeType = getSupportedRecorderMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      this.mediaRecorder = recorder;

      const chunks: BlobPart[] = [];
      let peakRms = 0;
      let verifiedRunningFrames = 0;
      let hadSpeech = priorSoundDetected;
      let lastSpeechAt = Date.now();
      const startedAt = Date.now();

      const graph = this.attachAnalyserToSharedContext(stream);
      const initialCtxTime = graph?.audioCtx.currentTime || 0;

      if (graph) {
        if (graph.audioCtx.state === 'suspended') {
          await graph.audioCtx.resume().catch(() => {});
        }
        if (mySessionId !== this.sessionId || this.aborted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        this.vadInterval = setInterval(() => {
          if (mySessionId !== this.sessionId || this.aborted) return;

          const isRunning =
            graph.audioCtx.state === 'running' && graph.audioCtx.currentTime > initialCtxTime;
          if (!isRunning) {
            return;
          }

          graph.analyser.getFloatTimeDomainData(graph.dataArray);
          let sumSq = 0;
          for (let i = 0; i < graph.dataArray.length; i++) {
            sumSq += graph.dataArray[i] * graph.dataArray[i];
          }
          const rms = Math.sqrt(sumSq / graph.dataArray.length);
          verifiedRunningFrames += 1;
          if (rms > peakRms) peakRms = rms;

          const level = Math.min(1, rms * 18);
          options.onAudioLevel?.(level);

          if (rms > 0.002) {
            if (!hadSpeech) {
              options.onPhaseChange?.('hearing_sound');
            }
            hadSpeech = true;
            lastSpeechAt = Date.now();
          } else if (hadSpeech && Date.now() - lastSpeechAt > 1300) {
            if (recorder.state !== 'inactive') {
              recorder.stop();
            }
          }
        }, 80);
      }

      recorder.ondataavailable = (ev: BlobEvent) => {
        if (ev.data && ev.data.size > 0) {
          chunks.push(ev.data);
        }
      };

      recorder.onstop = async () => {
        const wasAborted = this.aborted || mySessionId !== this.sessionId;
        const durationMs = Date.now() - startedAt;
        const userClickedStop = this.manualStopRequested;
        const finalMuted = trackMuted || Boolean(track?.muted);
        this.cleanupMediaFallback();
        options.onAudioLevel?.(0);

        if (wasAborted || this.submitted) {
          this.activeListening = false;
          options.onEnd?.();
          return;
        }

        const recordedType = recorder.mimeType || mimeType || 'audio/webm';
        const blob = new Blob(chunks, { type: recordedType });

        // If hardware track is literally muted by OS/keyboard, tell the user accurately
        if (finalMuted && !hadSpeech && peakRms < 0.00015) {
          this.finishWithError(
            options,
            `${getMicMsg('hardware_muted', options.langConfig.code)} (Input: "${trackLabel}").`
          );
          return;
        }

        // Only reject as empty/silent if MediaRecorder itself produced <350 bytes OR verified-running context saw pure zero + tiny blob
        const confirmedDeadMic =
          verifiedRunningFrames >= 12 &&
          !hadSpeech &&
          peakRms < 0.0001 &&
          !userClickedStop &&
          durationMs >= 1500 &&
          blob.size < 1200;

        if (blob.size < 350 || confirmedDeadMic) {
          const errHint = this.lastWebSpeechError ? ` [Speech API: ${this.lastWebSpeechError}]` : '';
          this.finishWithError(
            options,
            `${getMicMsg('no_voice', options.langConfig.code)} (Input: "${trackLabel}").${errHint}`
          );
          return;
        }

        options.onPhaseChange?.('transcribing');

        try {
          const base64 = await blobToBase64(blob);
          if (this.aborted || mySessionId !== this.sessionId) return;

          const response = await fetch('/api/gemini/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioBase64: base64,
              mimeType: recordedType.split(';')[0].trim(),
              language: options.langConfig.code,
            }),
          });

          if (this.aborted || mySessionId !== this.sessionId) return;

          const contentType = (response.headers.get('content-type') || '').toLowerCase();
          let errCode = '';
          if (contentType.includes('application/json')) {
            const data = await response.json();
            if (this.aborted || mySessionId !== this.sessionId) return;
            const transcript = String(data?.transcript || '').trim();
            if (response.ok && transcript) {
              this.submitted = true;
              this.activeListening = false;
              options.onEnd?.();
              options.onFinalTranscript(transcript);
              return;
            }
            errCode = String(data?.error || '');
          }

          if (this.aborted || mySessionId !== this.sessionId) return;

          if (errCode === 'transcription_unavailable' || response.status === 503) {
            this.cloudTranscribeBlockedUntil = Date.now() + 60_000;
            // Distinguish accurately: if audio WAS non-zero OR blob was substantial, say transcription_unavailable;
            // only if verified-running context measured zero signal, report accurate 0% input diagnostic.
            if (verifiedRunningFrames >= 12 && !hadSpeech && peakRms < 0.00015 && !userClickedStop) {
              const errHint = this.lastWebSpeechError ? ` [Speech API: ${this.lastWebSpeechError}]` : '';
              this.finishWithError(
                options,
                `${getMicMsg('no_voice', options.langConfig.code)} (Input: "${trackLabel}", level: 0%).${errHint}`
              );
            } else {
              const reasonHint = this.lastWebSpeechError
                ? ` [Speech API: ${this.lastWebSpeechError}]`
                : '';
              this.finishWithError(
                options,
                `${getMicMsg('transcription_unavailable', options.langConfig.code)}${reasonHint}`
              );
            }
          } else {
            this.finishWithError(options, getMicMsg('network_fallback_failed', options.langConfig.code));
          }
        } catch {
          if (this.aborted || mySessionId !== this.sessionId) return;
          this.finishWithError(options, getMicMsg('network_fallback_failed', options.langConfig.code));
        }
      };

      recorder.onerror = () => {
        this.cleanupMediaFallback();
        this.finishWithError(options, getMicMsg('mic_busy', options.langConfig.code));
      };

      this.activeListening = true;
      if (!alreadyNotifiedStart) {
        options.onStart?.();
      }
      options.onPhaseChange?.(priorSoundDetected ? 'hearing_sound' : 'listening');
      recorder.start(250);

      this.maxRecordTimer = setTimeout(() => {
        if (recorder.state !== 'inactive') {
          recorder.stop();
        }
      }, 5000);
    } catch (err: any) {
      this.cleanupMediaFallback();
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        this.finishWithError(options, getMicMsg('permission_denied', options.langConfig.code));
      } else if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
        this.finishWithError(options, getMicMsg('no_mic_hardware', options.langConfig.code));
      } else if (err?.name === 'NotReadableError' || err?.name === 'TrackStartError' || err?.name === 'AbortError') {
        this.finishWithError(options, getMicMsg('mic_busy', options.langConfig.code));
      } else {
        this.finishWithError(options, getMicMsg('no_voice', options.langConfig.code));
      }
    }
  }
}

export const voiceRecognitionController = new MultilingualSpeechRecognitionController();
