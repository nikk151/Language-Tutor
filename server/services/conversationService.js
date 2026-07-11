import { generateResponse } from './aiService.js';

// In-memory conversation storage (single user, no persistence needed)
let conversationHistory = [];
let currentSettings = {
  difficulty: 'N5',
  topic: 'Daily Life',
  hintLevel: 'easy',
  showFurigana: true,
  showEnglish: true
};

/**
 * Start a new conversation with the AI tutor.
 * Clears history and generates an opening message.
 */
export async function startConversation(settings) {
  // Update settings
  currentSettings = { ...currentSettings, ...settings };

  // Clear history for a fresh start
  conversationHistory = [];

  // Add the user's initial "start" message
  conversationHistory.push({
    role: 'user',
    parts: [{ text: `[START CONVERSATION] Topic: ${currentSettings.topic}, Difficulty: ${currentSettings.difficulty}. Please greet me and start a conversation about this topic. Since I haven't spoken yet, set all scores to 0 and leave feedback, grammarCorrection, and naturalReply as empty strings.` }]
  });

  // Generate AI's opening message
  const response = await generateResponse(conversationHistory, currentSettings);

  // Store AI's response in history
  conversationHistory.push({
    role: 'model',
    parts: [{ text: JSON.stringify(response) }]
  });

  return response;
}

/**
 * Send a user response and get AI feedback + next message.
 */
export async function respondToConversation(userTranscript, settings) {
  // Update settings if provided
  if (settings) {
    currentSettings = { ...currentSettings, ...settings };
  }

  // Add user's spoken response to history
  conversationHistory.push({
    role: 'user',
    parts: [{ text: `[STUDENT SAID]: "${userTranscript}" — Please evaluate this response. Provide feedback, scores, grammar correction if needed, a more natural alternative, then continue the conversation with your next message and a new suggested reply.` }]
  });

  // Generate AI's response with feedback
  const response = await generateResponse(conversationHistory, currentSettings);

  // Store AI's response in history
  conversationHistory.push({
    role: 'model',
    parts: [{ text: JSON.stringify(response) }]
  });

  return response;
}

/**
 * Clear conversation history.
 */
export function clearConversation() {
  conversationHistory = [];
  return { message: 'Conversation cleared' };
}

/**
 * Get current settings.
 */
export function getSettings() {
  return currentSettings;
}
