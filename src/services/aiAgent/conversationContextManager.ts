// Session & Conversation Context Manager for AGRITECH AI Agent
// Tracks active crop, active mandi, topic, and multi-turn state across user queries.

import { ConversationSession, ConversationTurn, ExtractedEntities, AgentIntent } from './types';
import { LanguageCode } from '../../types';

class ConversationContextManager {
  private sessions: Map<string, ConversationSession> = new Map();
  private maxTurnsPerSession: number = 20;

  public getOrCreateSession(
    sessionId: string = 'default-session',
    userRole: 'farmer' | 'buyer' | 'admin' | 'trader' = 'farmer',
    language: LanguageCode = 'en'
  ): ConversationSession {
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = {
        sessionId,
        userRole,
        language,
        turns: [],
        lastActive: new Date().toISOString(),
      };
      this.sessions.set(sessionId, session);
    } else {
      session.language = language;
      session.userRole = userRole;
      session.lastActive = new Date().toISOString();
    }
    return session;
  }

  public recordTurn(
    sessionId: string,
    turn: {
      userMessage: string;
      intent: AgentIntent;
      entities: ExtractedEntities;
      replyText: string;
      language: LanguageCode;
      toolsCalled?: string[];
    }
  ): ConversationSession {
    const session = this.getOrCreateSession(sessionId, undefined, turn.language);

    const newTurn: ConversationTurn = {
      id: `turn-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      userMessage: turn.userMessage,
      intent: turn.intent,
      entities: turn.entities,
      replyText: turn.replyText,
      language: turn.language,
      toolsCalled: turn.toolsCalled,
    };

    session.turns.push(newTurn);
    if (session.turns.length > this.maxTurnsPerSession) {
      session.turns = session.turns.slice(-this.maxTurnsPerSession);
    }

    // Contextual update of active entities if explicitly resolved
    if (turn.entities.crop) {
      session.activeCrop = turn.entities.crop;
    }
    if (turn.entities.mandi) {
      if (session.activeMandi && session.activeMandi !== turn.entities.mandi) {
        session.previousMandi = session.activeMandi;
      }
      session.activeMandi = turn.entities.mandi;
    }
    if (turn.intent !== 'GENERAL_GREETING' && turn.intent !== 'CLARIFICATION_NEEDED') {
      session.activeTopic = turn.intent;
    }

    session.lastActive = new Date().toISOString();
    return session;
  }

  public resetSession(sessionId: string = 'default-session'): void {
    const existing = this.sessions.get(sessionId);
    if (existing) {
      this.sessions.set(sessionId, {
        sessionId,
        userRole: existing.userRole,
        language: existing.language,
        turns: [],
        lastActive: new Date().toISOString(),
      });
    }
  }

  public getSession(sessionId: string): ConversationSession | undefined {
    return this.sessions.get(sessionId);
  }
}

export const conversationContextManager = new ConversationContextManager();
