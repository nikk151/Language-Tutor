import { GoogleGenAI } from '@google/genai';
import { buildSystemInstruction, RESPONSE_SCHEMA } from '../config/prompts.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = 'gemini-3.1-flash-lite';

/**
 * Generate a response from the AI tutor.
 * @param {Array} conversationHistory - Array of { role, parts } messages
 * @param {Object} settings - { difficulty, topic, hintLevel, showFurigana }
 * @returns {Object} Parsed JSON response from the AI
 */
export async function generateResponse(conversationHistory, settings) {
  const systemInstruction = buildSystemInstruction(settings);

  try {
    const response = await genai.models.generateContent({
      model: MODEL_NAME,
      contents: conversationHistory,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.8,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });

    const text = response.text;
    const parsed = JSON.parse(text);

    // Validate required fields exist
    if (!parsed.aiSpeech || !parsed.suggestedReply) {
      throw new Error('AI response missing required fields');
    }

    // Ensure scores default to 0 if not present
    if (!parsed.scores) {
      parsed.scores = {
        pronunciation: 0,
        grammar: 0,
        vocabulary: 0,
        naturalness: 0,
        fluency: 0
      };
    }

    return parsed;
  } catch (error) {
    // Handle rate limiting
    if (error.status === 429) {
      const retryAfter = error.headers?.['retry-after'] || 60;
      throw new Error(`Rate limited. Please wait ${retryAfter} seconds and try again.`);
    }

    console.error('Gemini API error:', error);
    throw error;
  }
}
