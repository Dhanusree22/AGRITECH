import { GoogleGenAI } from '@google/genai';
import { aiAgentController } from '../../src/services/aiAgent/aiAgentController';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      message = '',
      role = 'farmer',
      language = 'en',
      context = '',
      sessionId = 'default-session',
    } = req.body || {};

    if (!message || !String(message).trim()) {
      const greetingRes = await aiAgentController.processQuery({
        query: 'hello',
        language,
        role,
        sessionId,
        context,
      });
      return res.status(200).json({
        reply: greetingRes.reply,
        intent: greetingRes.intent,
        entities: greetingRes.entities,
        sessionId,
      });
    }

    const agentResult = await aiAgentController.processQuery({
      query: message,
      language,
      role,
      sessionId,
      context,
    });

    const apiKey = process.env.GEMINI_API_KEY;
    if (
      apiKey &&
      apiKey !== 'MY_GEMINI_API_KEY' &&
      agentResult.intent !== 'GENERAL_GREETING' &&
      agentResult.intent !== 'CLARIFICATION_NEEDED'
    ) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI timeout')), 2200)
        );
        const enrichmentPrompt = `You are AgriAI, a helpful agricultural assistant for Indian farmers.
Language: Respond in pure, natural ${language} script.
The farmer asked: "${message}"
Here are the verified factual agricultural data points:
"${agentResult.reply}"

Speak directly to the farmer in 2 to 4 clear, respectful, natural spoken sentences conveying these exact facts and numbers without adding markdown or asterisks.`;

        const aiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: enrichmentPrompt,
        });
        const enriched = await Promise.race([aiPromise, timeoutPromise]);
        const fluentText = enriched.text?.trim();
        if (fluentText && fluentText.length > 20) {
          return res.status(200).json({
            reply: fluentText,
            intent: agentResult.intent,
            entities: agentResult.entities,
            toolsCalled: agentResult.toolsCalled,
            sessionId: agentResult.sessionId,
            followUpSuggestions: agentResult.followUpSuggestions,
          });
        }
      } catch {
        // seamlessly fall through to deterministic grounded agentResult.reply
      }
    }

    return res.status(200).json({
      reply: agentResult.reply,
      intent: agentResult.intent,
      entities: agentResult.entities,
      toolsCalled: agentResult.toolsCalled,
      sessionId: agentResult.sessionId,
      followUpSuggestions: agentResult.followUpSuggestions,
    });
  } catch (err: any) {
    console.error('Vercel AI Chat Error:', err);
    const emergencyRes = await aiAgentController.processQuery({
      query: req.body?.message || 'help',
      language: req.body?.language || 'en',
      role: req.body?.role || 'farmer',
      sessionId: req.body?.sessionId || 'default-session',
    });
    return res.status(200).json({
      reply: emergencyRes.reply,
      intent: emergencyRes.intent,
      entities: emergencyRes.entities,
      sessionId: emergencyRes.sessionId,
    });
  }
}
