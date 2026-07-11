import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Start a new conversation.
 * @param {Object} settings - { topic, difficulty, hintLevel, showFurigana, showEnglish }
 */
export async function startConversation(settings) {
  const response = await api.post('/conversation/start', settings);
  return response.data;
}

/**
 * Send user's spoken response and get AI feedback + next message.
 * @param {string} transcript - What the user said
 * @param {Object} settings - Current settings
 */
export async function sendResponse(transcript, settings) {
  const response = await api.post('/conversation/respond', { transcript, settings });
  return response.data;
}

/**
 * Clear conversation history.
 */
export async function clearConversation() {
  const response = await api.post('/conversation/clear');
  return response.data;
}

export default api;
