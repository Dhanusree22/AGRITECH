// Vercel Serverless Function for Multilingual High-Fidelity Text-to-Speech (TTS)
// Supports Kannada (kn), Hindi (hi), Telugu (te), Tamil (ta), Malayalam (ml), Marathi (mr), Bengali (bn), and English (en)

const ALLOWED_LANGS = new Set(['en', 'kn', 'hi', 'te', 'ta', 'ml', 'mr', 'bn']);

function normalizeLang(rawLang: string): string {
  const short = (rawLang || 'en').toLowerCase().split('-')[0].trim();
  return ALLOWED_LANGS.has(short) ? short : 'en';
}

function splitTextIntoChunks(text: string, maxLen = 180): string[] {
  const cleanText = text
    .replace(/[*#_`~[\]()]/g, '')
    .replace(/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) return [];

  const chunks: string[] = [];
  const sentenceRegex = /[^.!?।|\n]+[.!?।|\n]*/g;
  const rawSentences = cleanText.match(sentenceRegex) || [cleanText];
  let currentChunk = '';

  for (const raw of rawSentences) {
    const sentence = raw.trim();
    if (!sentence) continue;

    if ((currentChunk + ' ' + sentence).trim().length <= maxLen) {
      currentChunk = (currentChunk + ' ' + sentence).trim();
    } else {
      if (currentChunk) chunks.push(currentChunk);

      if (sentence.length > maxLen) {
        const words = sentence.split(/\s+/);
        let sub = '';
        for (const w of words) {
          if ((sub + ' ' + w).trim().length <= maxLen) {
            sub = (sub + ' ' + w).trim();
          } else {
            if (sub) chunks.push(sub);
            if (w.length > maxLen) {
              for (let i = 0; i < w.length; i += maxLen) {
                chunks.push(w.slice(i, i + maxLen));
              }
              sub = '';
            } else {
              sub = w;
            }
          }
        }
        currentChunk = sub;
      } else {
        currentChunk = sentence;
      }
    }
  }
  if (currentChunk) chunks.push(currentChunk);

  return (chunks.length > 0 ? chunks : [cleanText.slice(0, maxLen)]).slice(0, 12);
}

async function fetchGoogleTtsChunk(chunkText: string, lang: string): Promise<Buffer | null> {
  const candidates = [
    `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunkText)}&tl=${encodeURIComponent(lang)}&client=tw-ob`,
    `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunkText)}&tl=${encodeURIComponent(lang)}&client=gtx`,
    `https://clients5.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunkText)}&tl=${encodeURIComponent(lang)}&client=dict-chrome-ex`,
  ];

  for (const ttsUrl of candidates) {
    try {
      const upstream = await fetch(ttsUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Referer: 'https://translate.google.com/',
          Accept: 'audio/mpeg, audio/*;q=0.9, */*;q=0.8',
        },
      });
      if (!upstream.ok) continue;
      const contentType = (upstream.headers.get('content-type') || '').toLowerCase();
      if (!contentType.includes('audio') && !contentType.includes('octet-stream')) {
        continue;
      }
      const arr = await upstream.arrayBuffer();
      if (arr.byteLength > 64) {
        return Buffer.from(arr);
      }
    } catch {
      // try next candidate
    }
  }
  return null;
}

function getParam(val: unknown): string {
  if (Array.isArray(val)) return String(val[0] || '');
  return typeof val === 'string' ? val : val != null ? String(val) : '';
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const rawText = req.method === 'POST' ? getParam(req.body?.text) : getParam(req.query?.text);
    const rawLang = req.method === 'POST' ? getParam(req.body?.lang) : getParam(req.query?.lang);

    const text = rawText.trim();
    const lang = normalizeLang(rawLang || 'en');

    if (!text) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    const targetChunks = splitTextIntoChunks(text, 180);
    if (targetChunks.length === 0) {
      return res.status(400).json({ error: 'No speakable text provided' });
    }

    const results = await Promise.all(targetChunks.map((chunk) => fetchGoogleTtsChunk(chunk, lang)));
    const audioBuffers = results.filter((b): b is Buffer => Boolean(b));

    if (audioBuffers.length === 0) {
      return res.status(502).json({ error: 'Upstream TTS unavailable' });
    }

    const combinedAudio = Buffer.concat(audioBuffers);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', String(combinedAudio.length));
    res.setHeader('X-TTS-Lang', lang);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    return res.status(200).send(combinedAudio);
  } catch (err: any) {
    console.error('Vercel TTS Error:', err);
    return res.status(500).json({ error: 'TTS processing failed' });
  }
}
