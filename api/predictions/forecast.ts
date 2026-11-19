import { syncAgmarknetLiveFeed } from '../../src/services/marketData/agmarknetLiveClient';
import { CROP_MASTER_LIST } from '../../src/services/marketData/historicalMarketDatabase';
import { executeCropMarketForecast } from '../../src/services/marketData/mlPredictionPipeline';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const q = req.query || {};
    const crop = typeof q.crop === 'string' && q.crop.trim() ? q.crop.trim() : 'Tomato';
    const cropId = typeof q.cropId === 'string' ? q.cropId : '';
    const mandi = typeof q.mandi === 'string' && q.mandi.trim() ? q.mandi.trim() : 'Kolar APMC Market';
    const state = typeof q.state === 'string' ? q.state : undefined;
    const district = typeof q.district === 'string' ? q.district : undefined;
    const variety = typeof q.variety === 'string' ? q.variety : undefined;
    const daysRaw = parseInt(String(q.days || '30'), 10);
    const todayPriceRaw = q.todayPrice ? Number(q.todayPrice) : undefined;
    const season = typeof q.season === 'string' ? q.season : 'Current';
    const weather = typeof q.weather === 'string' ? q.weather : 'Optimal';
    const holiday = typeof q.holiday === 'string' ? q.holiday : 'None';
    const language = typeof q.language === 'string' ? q.language : 'en';

    const targetCrop = cropId
      ? CROP_MASTER_LIST.find((c) => c.id.toLowerCase() === cropId.toLowerCase())?.name || crop
      : crop;

    const syncStatus = await syncAgmarknetLiveFeed({
      commodity: targetCrop,
      state,
      district,
      market: mandi,
      variety,
    });

    const horizonDays: 7 | 15 | 30 | 60 | 90 =
      daysRaw >= 90 ? 90 : daysRaw >= 60 ? 60 : daysRaw >= 30 ? 30 : daysRaw >= 15 ? 15 : 7;

    const forecast = executeCropMarketForecast({
      crop: targetCrop,
      mandi,
      state,
      todayPrice: todayPriceRaw && todayPriceRaw > 0 ? todayPriceRaw : undefined,
      horizonDays,
      season: season as any,
      weatherFactor: weather as any,
      holidayImpact: holiday as any,
      language: language as any,
    });

    return res.status(200).json({
      success: true,
      liveApiReachable: syncStatus.liveApiReachable,
      source: forecast.dataSource || syncStatus.source,
      forecast,
    });
  } catch (err: any) {
    console.error('Vercel /api/predictions/forecast Error:', err);
    return res.status(500).json({ error: err?.message || 'Forecast calculation failed' });
  }
}
