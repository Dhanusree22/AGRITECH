import { syncAgmarknetLiveFeed } from '../../src/services/marketData/agmarknetLiveClient';
import { marketDataRepository } from '../../src/services/marketData/historicalMarketDatabase';
import { getLiveMandiPricesList } from '../../src/services/mandiPredictionEngine';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const syncStatus = await syncAgmarknetLiveFeed({
      commodity: typeof req.query?.crop === 'string' ? req.query.crop : undefined,
      state: typeof req.query?.state === 'string' ? req.query.state : undefined,
    });
    const prices = getLiveMandiPricesList();
    return res.status(200).json({
      success: true,
      total: prices.length,
      liveApiReachable: syncStatus.liveApiReachable,
      availableCrops: marketDataRepository.getAvailableCrops(),
      availableMandis: marketDataRepository.getAvailableMandis(),
      source: syncStatus.source,
      lastSyncedAt: syncStatus.lastSyncedAt,
      prices,
    });
  } catch (err: any) {
    console.error('Vercel /api/mandi/prices Error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to fetch mandi prices' });
  }
}
