// AI Agent Core Type Definitions for AGRITECH
import { LanguageCode } from '../../types';

export type AgentIntent =
  | 'MARKET_PRICE'
  | 'PRICE_PREDICTION'
  | 'MANDI_COMPARISON'
  | 'HIGHEST_LOWEST_MANDI'
  | 'CROP_CULTIVATION'
  | 'FERTILIZER_SOIL'
  | 'DISEASE_PEST_MANAGEMENT'
  | 'WEATHER_FORECAST'
  | 'HARVEST_STORAGE'
  | 'AI_EXPLANATION'
  | 'TRADING_BUYERS'
  | 'ESCROW_PAYMENT'
  | 'APP_HELP'
  | 'GENERAL_GREETING'
  | 'CLARIFICATION_NEEDED';

export interface ExtractedEntities {
  crop?: string;
  cropId?: string;
  mandi?: string;
  state?: string;
  horizonDays?: number;
  timeframe?: 'today' | 'tomorrow' | '7days' | '15days' | '30days' | 'season';
  specificTopic?: string;
  pestOrDisease?: string;
  isComparison?: boolean;
  comparisonMandi?: string;
}

export interface ConversationTurn {
  id: string;
  timestamp: string;
  userMessage: string;
  intent: AgentIntent;
  entities: ExtractedEntities;
  replyText: string;
  language: LanguageCode;
  toolsCalled?: string[];
}

export interface ConversationSession {
  sessionId: string;
  userRole: 'farmer' | 'buyer' | 'admin' | 'trader';
  language: LanguageCode;
  activeCrop?: string;
  activeMandi?: string;
  previousMandi?: string;
  activeState?: string;
  activeTopic?: string;
  turns: ConversationTurn[];
  lastActive: string;
}

export interface AgentProcessingResult {
  reply: string;
  intent: AgentIntent;
  language: LanguageCode;
  entities: ExtractedEntities;
  toolsCalled: string[];
  dataGrounded: boolean;
  sessionId: string;
  followUpSuggestions?: string[];
}
