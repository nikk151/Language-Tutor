import { Router } from 'express';
import {
  startConversation,
  respondToConversation,
  clearConversation
} from '../services/conversationService.js';

const router = Router();

/**
 * POST /api/conversation/start
 * Start a new conversation with given settings.
 * Body: { topic, difficulty, hintLevel, showFurigana, showEnglish }
 */
router.post('/start', async (req, res) => {
  try {
    const { topic, difficulty, hintLevel, showFurigana, showEnglish } = req.body;
    const response = await startConversation({
      topic: topic || 'Daily Life',
      difficulty: difficulty || 'N5',
      hintLevel: hintLevel || 'easy',
      showFurigana: showFurigana !== false,
      showEnglish: showEnglish !== false
    });
    res.json(response);
  } catch (error) {
    console.error('Error starting conversation:', error);
    res.status(error.message?.includes('Rate limited') ? 429 : 500).json({
      error: error.message || 'Failed to start conversation'
    });
  }
});

/**
 * POST /api/conversation/respond
 * Send user's spoken response and get AI feedback + next message.
 * Body: { transcript, settings? }
 */
router.post('/respond', async (req, res) => {
  try {
    const { transcript, settings } = req.body;

    if (!transcript || !transcript.trim()) {
      return res.status(400).json({ error: 'No transcript provided' });
    }

    const response = await respondToConversation(transcript.trim(), settings);
    res.json(response);
  } catch (error) {
    console.error('Error responding:', error);
    res.status(error.message?.includes('Rate limited') ? 429 : 500).json({
      error: error.message || 'Failed to process response'
    });
  }
});

/**
 * POST /api/conversation/clear
 * Clear conversation history.
 */
router.post('/clear', (req, res) => {
  const result = clearConversation();
  res.json(result);
});

export default router;
