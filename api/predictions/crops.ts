import { syncAgmarknetLiveFeed } from '../../src/services/marketData/agmarknetLiveClient';
import { marketDataRepository, CROP_MASTER_LIST } from '../../src/services/marketData/historicalMarketDatabase';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    await syncAgmarknetLiveFeed();
    return res.status(200).json({
      success: true,
      count: marketDataRepository.getAvailableCrops().length,
      availableCrops: marketDataRepository.getAvailableCrops(),
      crops: CROP_MASTER_LIST.map((c) => ({
        id: c.id,
        name: c.name,
        hindiName: c.hindiName,
        kannadaName: c.kannadaName,
        category: c.category,
        benchmarkMandi: c.benchmarkMandi,
        basePriceQuintal: c.baseModalPriceQuintal,
        basePricePerKg: +(c.baseModalPriceQuintal / 100).toFixed(1),
        perishabilityDays: c.perishabilityDays,
        seasonPeak: c.seasonPeak,
        weatherSensitivity: c.weatherSensitivity,
        holidayElasticity: c.holidayElasticity,
        volatilityRating: c.volatilityRating,
        varieties: c.typicalVarieties,
      })),
      mandis: marketDataRepository.getAvailableMandis(),
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Failed to load crops metadata' });
  }
}
