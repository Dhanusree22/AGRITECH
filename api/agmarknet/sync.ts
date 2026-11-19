import {
  syncAgmarknetLiveFeed,
  AGMARKNET_RESOURCE_ID,
} from '../../src/services/marketData/agmarknetLiveClient';
import { marketDataRepository } from '../../src/services/marketData/historicalMarketDatabase';
import { getLiveMandiPricesList } from '../../src/services/mandiPredictionEngine';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const body = req.body || {};
    const syncResult = await syncAgmarknetLiveFeed({
      commodity: body.commodity,
      state: body.state,
      market: body.market,
      forceRefresh: true,
    });

    const prices = getLiveMandiPricesList();
    const status = marketDataRepository.getStatus();

    return res.status(200).json({
      success: true,
      liveApiReachable: syncResult.liveApiReachable,
      message: syncResult.message,
      fetchedCount: syncResult.fetchedCount,
      ingestedCount: syncResult.ingestedCount,
      availableCrops: marketDataRepository.getAvailableCrops(),
      availableMandis: marketDataRepository.getAvailableMandis(),
      prices,
      syncConfig: {
        apiKey: 'SERVER-CONFIGURED',
        source: syncResult.source,
        lastSyncedAt: syncResult.lastSyncedAt,
        status: 'Connected',
        totalRecordsLoaded: status.liveRecordsCount > 0 ? status.liveRecordsCount : prices.length,
        resourceId: body.resourceId || AGMARKNET_RESOURCE_ID,
      },
    });
  } catch (err: any) {
    console.error('Vercel /api/agmarknet/sync Error:', err);
    return res.status(500).json({ error: err?.message || 'Agmarknet sync failed' });
  }
}
