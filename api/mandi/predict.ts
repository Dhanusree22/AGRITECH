import { syncAgmarknetLiveFeed } from '../../src/services/marketData/agmarknetLiveClient';
import { calculateRealtimePrediction } from '../../src/services/mandiPredictionEngine';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const body = req.body || {};
    const {
      crop = 'Tomato',
      mandi = 'Kolar APMC Market',
      state = 'Karnataka',
      todayPrice,
      season = 'Current',
      weatherFactor = 'Optimal',
      holidayImpact = 'None',
      horizon = '7days',
      horizonDays,
      language = 'en',
    } = body;

    await syncAgmarknetLiveFeed({ commodity: crop, state, market: mandi });

    const result = calculateRealtimePrediction({
      crop,
      mandi,
      state,
      todayPrice: Number(todayPrice) > 0 ? Number(todayPrice) : undefined,
      season,
      weatherFactor,
      holidayImpact,
      horizon,
      horizonDays: Number(horizonDays) ? (Number(horizonDays) as any) : undefined,
      language,
    });

    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Vercel /api/mandi/predict Error:', err);
    return res.status(500).json({ error: err?.message || 'Price prediction failed' });
  }
}
