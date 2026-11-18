import { GoogleGenAI } from '@google/genai';

const LANG_NAME_MAP: Record<string, string> = {
  en: 'English',
  kn: 'Kannada (ಕನ್ನಡ)',
  hi: 'Hindi (हिन्दी)',
  te: 'Telugu (తెలుగు)',
  ta: 'Tamil (தமிழ்)',
  ml: 'Malayalam (മലയാളം)',
  mr: 'Marathi (मराठी)',
  bn: 'Bengali (বাংলা)',
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { audioBase64 = '', mimeType = 'audio/webm', language = 'en' } = req.body || {};
    const cleanBase64 = String(audioBase64).replace(/^data:audio\/[a-zA-Z0-9.+-]+;base64,/, '').trim();

    if (!cleanBase64 || cleanBase64.length < 100) {
      return res.status(400).json({ success: false, error: 'empty_audio' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.status(503).json({ success: false, error: 'transcription_unavailable' });
    }

    const normalizedMime = String(mimeType).split(';')[0].trim() || 'audio/webm';
    const langLabel = LANG_NAME_MAP[String(language).toLowerCase()] || 'English';

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const audioPart = {
      inlineData: {
        mimeType: normalizedMime,
        data: cleanBase64,
      },
    };

    const promptText = `Transcribe the spoken agricultural question in this audio accurately.
Target language hint: ${langLabel}.
Output ONLY the exact transcribed words in the spoken language script (if no intelligible speech is present or only silence/noise, return an empty string). Do not add commentary or quotes.`;

    const modelsToTry = ['gemini-3.5-transcribe', 'gemini-4-hydrogen', 'gemini-2.5-flash'];
    let lastErrorMsg = '';
    for (const model of modelsToTry) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Transcribe timeout')), 8000)
        );
        const aiPromise = ai.models.generateContent({
          model,
          contents: { parts: [audioPart, { text: promptText }] },
        });
        const response = await Promise.race([aiPromise, timeoutPromise]);
        const transcript = (response.text || '').trim().replace(/^["']|["']$/g, '');
        return res.status(200).json({
          success: true,
          transcript,
          language,
        });
      } catch (modelErr: any) {
        lastErrorMsg = `${model}: ${modelErr?.status || ''} ${modelErr?.message || String(modelErr)}`.trim();
        console.warn('[Vercel Transcribe] Model attempt failed:', lastErrorMsg);
        if (
          modelErr?.status === 403 ||
          String(modelErr?.message || '').includes('403') ||
          String(modelErr?.message || '').includes('PERMISSION_DENIED')
        ) {
          return res.status(503).json({ success: false, error: 'transcription_unavailable', detail: lastErrorMsg });
        }
      }
    }

    return res.status(502).json({ success: false, error: 'transcription_failed', detail: lastErrorMsg });
  } catch (err: any) {
    console.error('Vercel Transcribe Error:', err);
    return res.status(500).json({ success: false, error: 'transcription_error' });
  }
}
