// Central Agricultural AI Agent Controller for AGRITECH
// Coordinates NLU intent/entity recognition, conversation memory, tool routing, and dynamic response generation.

import { AgentIntent, ExtractedEntities, AgentProcessingResult, ConversationSession } from './types';
import { parseUserQuery } from './intentEntityRecognizer';
import { conversationContextManager } from './conversationContextManager';
import { toolRoutingEngine, ToolExecutionOutput } from './toolRoutingEngine';
import { dynamicResponseGenerator } from './dynamicResponseGenerator';
import { LanguageCode } from '../../types';

export interface ProcessAgentQueryInput {
  query: string;
  language?: LanguageCode;
  role?: 'farmer' | 'buyer' | 'admin' | 'trader';
  sessionId?: string;
  context?: string;
}

export class AIAgentController {
  public async processQuery(input: ProcessAgentQueryInput): Promise<AgentProcessingResult> {
    const {
      query = '',
      language = 'en',
      role = 'farmer',
      sessionId = 'default-session',
      context = '',
    } = input;

    // 1. Retrieve or create session context
    const session = conversationContextManager.getOrCreateSession(sessionId, role, language);

    // 2. Multilingual NLU intent and entity extraction with anaphora resolution
    const nluResult = parseUserQuery(query, {
      activeCrop: session.activeCrop,
      activeMandi: session.activeMandi,
      lastIntent: session.turns.length > 0 ? session.turns[session.turns.length - 1].intent : undefined,
    });

    const intent = nluResult.intent;
    const entities = nluResult.entities;

    // 3. Tool execution across APMC database, prediction engine, or agronomy RAG
    let toolOutput: ToolExecutionOutput;
    const toolsCalled: string[] = [];

    try {
      toolOutput = await toolRoutingEngine.executeTool(intent, entities, session);
      toolsCalled.push(toolOutput.toolName);
    } catch (err) {
      console.error('[AIAgentController] Tool execution fallback:', err);
      toolOutput = {
        toolName: 'fallbackHandler',
        intent: 'CLARIFICATION_NEEDED',
        cropName: entities.crop || session.activeCrop || 'Tomato',
        mandiName: entities.mandi || session.activeMandi || 'Kolar APMC Mandi',
        data: {},
        summaryDataPoint: 'Guidance requested',
      };
    }

    // 4. Generate dynamic speech-optimized response in requested language
    const replyText = dynamicResponseGenerator.generateResponse(toolOutput, language, entities);

    // 5. Update conversation memory with new turn
    conversationContextManager.recordTurn(sessionId, {
      userMessage: query,
      intent,
      entities: {
        ...entities,
        crop: toolOutput.cropName,
        mandi: toolOutput.mandiName,
      },
      replyText,
      language,
      toolsCalled,
    });

    return {
      reply: replyText,
      intent,
      language,
      entities: {
        ...entities,
        crop: toolOutput.cropName,
        mandi: toolOutput.mandiName,
      },
      toolsCalled,
      dataGrounded: true,
      sessionId,
      followUpSuggestions: this.generateFollowUpSuggestions(intent, toolOutput.cropName, language),
    };
  }

  public resetSession(sessionId: string): void {
    conversationContextManager.resetSession(sessionId);
  }

  public getSession(sessionId: string): ConversationSession | undefined {
    return conversationContextManager.getSession(sessionId);
  }

  private generateFollowUpSuggestions(
    intent: AgentIntent,
    crop: string,
    lang: LanguageCode
  ): string[] {
    switch (intent) {
      case 'MARKET_PRICE':
        if (lang === 'kn') {
          return ['ನಾಳೆಯ ಬೆಲೆ ಮುನ್ಸೂಚನೆ ಏನು?', 'ಯಾವ ಮಂಡಿಯಲ್ಲಿ ಗರಿಷ್ಠ ಬೆಲೆ ಇದೆ?', 'ಈ ಬೆಳೆಗೆ ಸೂಕ್ತ ರಸಗೊಬ್ಬರ ಯಾವುದು?'];
        }
        if (lang === 'hi') {
          return ['कल का भाव क्या रहेगा?', 'किस मंडी में सबसे अधिक भाव है?', 'पैदावार कैसे बढ़ाएं?'];
        }
        return [`What will the price be tomorrow?`, `Which mandi has the highest price?`, `How to increase yield?`];

      case 'PRICE_PREDICTION':
        if (lang === 'kn') {
          return ['ಇತರ ಮಂಡಿಗಳೊಂದಿಗೆ ಹೋಲಿಸಿ', 'ಖರೀದಿದಾರರನ್ನು ಹೇಗೆ ಸಂಪರ್ಕಿಸುವುದು?', 'ಕಟಾವು ನಂತರ ಶೇಖರಣೆ ಹೇಗೆ?'];
        }
        if (lang === 'hi') {
          return ['दूसरी मंडियों से तुलना करें', 'खरीदार कैसे खोजें?', 'सुरक्षित भंडारण के उपाय?'];
        }
        return [`Compare with other mandis`, `How to find buyers?`, `Safe storage conditions`];

      case 'DISEASE_PEST_MANAGEMENT':
        if (lang === 'kn') {
          return ['ಸಾವಯವ ಪರಿಹಾರಗಳೇನು?', 'ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿ ಸಿಂಪಡಣೆಗೆ ಸೂಕ್ತವೇ?', 'ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಎಷ್ಟು?'];
        }
        if (lang === 'hi') {
          return ['जैविक उपचार क्या है?', 'क्या आज स्प्रे करना सुरक्षित है?', 'आज का मंडी भाव क्या है?'];
        }
        return [`Organic remedy options`, `Is weather suitable for spraying?`, `Current mandi price`];

      default:
        if (lang === 'kn') {
          return ['ಟೊಮೆಟೊ ಇಂದಿನ ದರ ಎಷ್ಟು?', 'ಈರುಳ್ಳಿ ನಾಳೆಯ ಮುನ್ಸೂಚನೆ?', 'ಭತ್ತದ ರೋಗಗಳು ಮತ್ತು ಪರಿಹಾರ'];
        }
        if (lang === 'hi') {
          return ['टमाटर का आज का भाव?', 'प्याज का कल का पूर्वानुमान?', 'धान के रोग व उपचार'];
        }
        return [`Tomato price today?`, `Onion forecast tomorrow?`, `Common diseases in Paddy`];
    }
  }
}

export const aiAgentController = new AIAgentController();
