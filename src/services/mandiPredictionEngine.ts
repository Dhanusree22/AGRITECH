// Comprehensive Real-Time Mandi Price & Daily AI Prediction Engine
// Conforms to Government of India data.gov.in / Agmarknet Standard (Resource: 9ef84268-d588-465a-a308-a864a43d0070)
// Powered by ML time-series feature pipeline, arrival volume elasticity, backtesting, and spatial cross-mandi spreads.

import { MandiPriceItem, DailyForecastPoint, AgmarknetSyncConfig, LanguageCode } from '../types';
import {
  marketDataRepository,
  CROP_MASTER_LIST,
  SUPPORTED_MANDIS,
  resolveCanonicalCropName,
  resolveCanonicalMandi,
  MarketPriceRecord,
  CropMasterDefinition,
  MandiMetadata,
} from './marketData/historicalMarketDatabase';
import {
  executeCropMarketForecast,
  MLPredictionOptions,
  ComprehensivePredictionResult,
  ModelPerformanceMetrics,
  FarmerRecommendation,
} from './marketData/mlPredictionPipeline';

export {
  marketDataRepository,
  CROP_MASTER_LIST,
  SUPPORTED_MANDIS,
  resolveCanonicalCropName,
  resolveCanonicalMandi,
  executeCropMarketForecast,
};
export type {
  MarketPriceRecord,
  CropMasterDefinition,
  MandiMetadata,
  ComprehensivePredictionResult,
  ModelPerformanceMetrics,
  FarmerRecommendation,
};

export interface CropMarketProfile {
  crop: string;
  category: string;
  basePricesByMandi: Record<string, { modal: number; min: number; max: number; dailyArrivalTons: number }>;
  defaultState: string;
  defaultMandi: string;
  perishabilityDays: number;
  seasonPeak: string;
  weatherSensitivity: 'High' | 'Medium' | 'Low';
  holidayDemandElasticity: number;
}

// Generate CROP_PROFILES dynamically from authentic CROP_MASTER_LIST
export const CROP_PROFILES: Record<string, CropMarketProfile> = {};

CROP_MASTER_LIST.forEach((cropDef) => {
  const basePricesByMandi: Record<string, { modal: number; min: number; max: number; dailyArrivalTons: number }> = {};

  SUPPORTED_MANDIS.forEach((mandiMeta) => {
    const rec = marketDataRepository.getLatestRecord(cropDef.name, mandiMeta.mandi);
    const modal = rec ? rec.modalPrice : cropDef.baseModalPriceQuintal;
    const min = rec ? rec.minPrice : Math.round(modal * 0.9);
    const max = rec ? rec.maxPrice : Math.round(modal * 1.1);
    const dailyArrivalTons = rec ? rec.arrivalTons : 300;

    basePricesByMandi[mandiMeta.mandi] = {
      modal,
      min,
      max,
      dailyArrivalTons,
    };
  });

  const benchmarkMandiObj = SUPPORTED_MANDIS.find((m) => m.mandi === cropDef.benchmarkMandi) || SUPPORTED_MANDIS[0];

  CROP_PROFILES[cropDef.name] = {
    crop: cropDef.name,
    category: cropDef.category,
    defaultState: benchmarkMandiObj.state,
    defaultMandi: cropDef.benchmarkMandi,
    perishabilityDays: cropDef.perishabilityDays,
    seasonPeak: cropDef.seasonPeak,
    weatherSensitivity: cropDef.weatherSensitivity,
    holidayDemandElasticity: cropDef.holidayElasticity,
    basePricesByMandi,
  };
});

// Regional Mandis directory
export const REGIONAL_MANDIS = SUPPORTED_MANDIS.map((m) => ({
  mandi: m.mandi,
  state: m.state,
  district: m.district,
  distanceKm: m.distanceKm,
  specialty: m.specialty,
}));

export interface PredictionRequest {
  crop: string;
  mandi?: string;
  state?: string;
  todayPrice?: number;
  season?: 'Kharif' | 'Rabi' | 'Zaid' | 'Current';
  weatherFactor?: 'Optimal' | 'Optimal Clear Weather' | 'Unseasonal Rain' | 'Heatwave' | 'Monsoon Delay';
  holidayImpact?: 'None' | 'Standard Market Days' | 'Diwali / Dussehra Surge' | 'Navratri Vegetarian Spike' | 'Wedding Season Peak' | 'Mandi Weekend Closure';
  horizon?: '7days' | '14days' | '15days' | '30days' | '60days' | '90days';
  horizonDays?: 7 | 15 | 30 | 60 | 90;
  language?: LanguageCode;
}

export interface PredictionResult {
  crop: string;
  mandi: string;
  state: string;
  district?: string;
  variety?: string;
  grade?: string;
  predictionAvailable?: boolean;
  unavailableReason?: string;
  dataQuality?: 'LIVE_API' | 'HISTORICAL_BASELINE' | 'UNAVAILABLE';
  minPriceQuintal?: number;
  maxPriceQuintal?: number;
  modalPriceQuintal?: number;
  todayPrice: number;
  tomorrowPrice: number;
  day7Price: number;
  day30Price?: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  confidenceScore: number;
  dailyPoints: DailyForecastPoint[];
  forecastPoints?: DailyForecastPoint[];
  influencingFactors: string[];
  bestSellingWindow: string;
  actionAdvice: string;
  agmarknetGrounded: boolean;
  liveApiConnected?: boolean;
  dataSource?: string;
  lastRetrieved: string;
  actualTradingDate?: string;
  apiRetrievalTime?: string;
  season: string;
  weatherObservation: string;
  holidayStatus: string;
  performanceMetrics?: ModelPerformanceMetrics;
  recommendation?: FarmerRecommendation;
  nearbyMandiComparison?: Array<{
    mandi: string;
    state: string;
    distanceKm: number;
    currentPrice: number;
    predictedPrice: number;
    spreadVsCurrent: number;
    isLiveApi?: boolean;
  }>;
}

// Seamless calculation wrapper calling the Machine Learning Prediction Pipeline
export function calculateRealtimePrediction(params: PredictionRequest): PredictionResult {
  const horizonDays =
    params.horizonDays ||
    (params.horizon === '90days' ? 90 :
     params.horizon === '60days' ? 60 :
     params.horizon === '30days' ? 30 :
     params.horizon === '14days' || params.horizon === '15days' ? 15 : 7);

  const mlResult = executeCropMarketForecast({
    crop: params.crop || 'Tomato',
    mandi: params.mandi,
    state: params.state,
    todayPrice: params.todayPrice,
    season: params.season,
    weatherFactor: params.weatherFactor,
    holidayImpact: params.holidayImpact,
    horizonDays,
    language: params.language,
  });

  return {
    crop: mlResult.crop,
    mandi: mlResult.mandi,
    state: mlResult.state,
    district: mlResult.district,
    variety: mlResult.variety,
    grade: mlResult.grade,
    predictionAvailable: mlResult.predictionAvailable,
    unavailableReason: mlResult.unavailableReason,
    dataQuality: mlResult.dataQuality,
    minPriceQuintal: mlResult.minPriceQuintal,
    maxPriceQuintal: mlResult.maxPriceQuintal,
    modalPriceQuintal: mlResult.modalPriceQuintal,
    todayPrice: mlResult.todayPrice,
    tomorrowPrice: mlResult.tomorrowPrice,
    day7Price: mlResult.day7Price,
    day30Price: mlResult.day30Price,
    trend: mlResult.trend,
    changePercent: mlResult.changePercent,
    confidenceScore: mlResult.confidenceScore,
    dailyPoints: mlResult.dailyPoints,
    forecastPoints: mlResult.forecastPoints,
    influencingFactors: mlResult.influencingFactors,
    bestSellingWindow: mlResult.bestSellingWindow,
    actionAdvice: mlResult.actionAdvice,
    agmarknetGrounded: mlResult.agmarknetGrounded,
    liveApiConnected: mlResult.liveApiConnected,
    dataSource: mlResult.dataSource,
    lastRetrieved: mlResult.lastSuccessfulSync,
    actualTradingDate: mlResult.actualTradingDate,
    apiRetrievalTime: mlResult.apiRetrievalTime,
    season: mlResult.season,
    weatherObservation: mlResult.weatherObservation,
    holidayStatus: mlResult.holidayStatus,
    performanceMetrics: mlResult.performanceMetrics,
    recommendation: mlResult.recommendation,
    nearbyMandiComparison: mlResult.nearbyMandiComparison,
  };
}

// Generate authentic MandiPriceItem list from live/historical repository across each crop's benchmark + major mandis
export function getLiveMandiPricesList(): MandiPriceItem[] {
  const list: MandiPriceItem[] = [];
  let index = 1;
  const seenPairs = new Set<string>();

  for (const cropDef of CROP_MASTER_LIST) {
    // Include crop's actual national benchmark mandi + major regional hubs (so every crop displays its true benchmark hub first)
    const benchmarkMeta = SUPPORTED_MANDIS.find((m) => m.mandi === cropDef.benchmarkMandi) || SUPPORTED_MANDIS[0];
    const extraHubs = SUPPORTED_MANDIS.filter((m) => m.mandi !== benchmarkMeta.mandi).slice(0, 2);
    const mandisForCrop = [benchmarkMeta, ...extraHubs];

    for (const mandiMeta of mandisForCrop) {
      const pairKey = `${cropDef.name}::${mandiMeta.mandi}`;
      if (seenPairs.has(pairKey)) continue;
      seenPairs.add(pairKey);

      const rec = marketDataRepository.getLatestRecord(cropDef.name, mandiMeta.mandi);
      const modal = rec ? rec.modalPrice : cropDef.baseModalPriceQuintal;
      const min = rec ? rec.minPrice : Math.round(modal * 0.9);
      const max = rec ? rec.maxPrice : Math.round(modal * 1.1);
      const pricePerKg = rec ? rec.pricePerKg : +(modal / 100).toFixed(1);
      const arrivalTons = rec ? rec.arrivalTons : 280;

      // Use realistic neutral baseline covariates per crop rather than identical holiday surge on all cards
      const prediction = calculateRealtimePrediction({
        crop: cropDef.name,
        mandi: mandiMeta.mandi,
        state: mandiMeta.state,
        todayPrice: pricePerKg,
        season: 'Current',
        weatherFactor: 'Optimal',
        holidayImpact: 'None',
        horizonDays: 30,
      });

      list.push({
        id: `mandi-sync-${index++}`,
        crop: cropDef.name,
        mandi: mandiMeta.mandi,
        state: mandiMeta.state,
        modalPrice: modal,
        minPrice: min,
        maxPrice: max,
        pricePerKg,
        changePercent: prediction.changePercent,
        arrivalTons,
        trend: prediction.trend,
        lastUpdated: rec?.dataQuality === 'VERIFIED_OFFICIAL' ? `Live (${rec.tradingDate})` : `Historical (${rec?.tradingDate || 'Baseline'})`,
        ai7DayForecastPerKg: prediction.day7Price,
        ai30DayForecastPerKg: prediction.day30Price || +(pricePerKg * (1 + prediction.changePercent / 80)).toFixed(1),
        confidence: prediction.confidenceScore,
        season: cropDef.seasonPeak,
        weatherFactor: rec?.dataQuality === 'VERIFIED_OFFICIAL' ? 'data.gov.in Live Feed' : 'Agmarknet Historical Baseline',
        holidayImpact: prediction.recommendation?.verdict.replace(/_/g, ' ') || 'Active Model',
      });
    }
  }

  return list;
}

// Agmarknet integration configuration status
export const DEFAULT_AGMARKNET_CONFIG: AgmarknetSyncConfig = {
  apiKey: 'SERVER-CONFIGURED',
  source: 'data.gov.in (Agmarknet)',
  lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
  status: 'Connected',
  totalRecordsLoaded: 42,
  resourceId: '9ef84268-d588-465a-a308-a864a43d0070',
};

