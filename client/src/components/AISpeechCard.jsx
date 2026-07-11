import { useEffect } from 'react';
import { useConversation } from '../context/ConversationContext';
import FuriganaText from './FuriganaText';

/**
 * AISpeechCard - Displays the AI tutor's Japanese message.
 * Auto-triggers TTS when a new message arrives.
 */
export default function AISpeechCard({ onSpeak, message }) {
  const context = useConversation();
  const aiMessage = message || context.aiMessage;
  const isHistorical = !!message;
  const { settings, status } = context;

  // Auto-speak when new AI message arrives (only for current message)
  useEffect(() => {
    if (!isHistorical && aiMessage?.speech && status === 'ready' && onSpeak) {
      // Small delay to let the UI render first
      const timer = setTimeout(() => {
        onSpeak(aiMessage.speech);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [aiMessage?.speech, isHistorical, status]);

  // Loading state (only for current message)
  if (!isHistorical && (status === 'loading' || status === 'processing')) {
    return (
      <div className="glass-card glass-card-ai p-6 fade-in-up">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-sm font-bold">
            先
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--accent-cyan)' }}>先生 is thinking...</span>
        </div>
        <div className="flex items-center gap-2 py-4">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!aiMessage) {
    if (isHistorical) return null;
    return (
      <div className="glass-card glass-card-ai p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-400/20 to-violet-500/20 flex items-center justify-center">
          <span className="text-3xl">🎌</span>
        </div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Japanese Conversation Tutor
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Press <span className="font-semibold" style={{ color: 'var(--accent-cyan)' }}>Start Conversation</span> to begin practicing
        </p>
      </div>
    );
  }

  // Determine which text to display
  const displayText = settings.showFurigana && aiMessage.speechFurigana
    ? aiMessage.speechFurigana
    : aiMessage.speech;

  return (
    <div className="glass-card glass-card-ai p-6 fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-sm font-bold">
            先
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--accent-cyan)' }}>先生 (Sensei)</span>
        </div>
        <button
          onClick={() => onSpeak?.(aiMessage.speech)}
          className="btn-glass flex items-center gap-1.5 text-xs py-1.5 px-3"
          title="Replay audio"
        >
          🔊 Replay
        </button>
      </div>

      {/* Japanese text */}
      <div className="text-japanese-lg mb-3">
        <FuriganaText text={displayText} showFurigana={settings.showFurigana} />
      </div>

      {/* Romaji */}
      <p className="text-sm mb-2 italic" style={{ color: 'var(--text-muted)' }}>
        {aiMessage.speechRomaji}
      </p>

      {/* English translation (conditional) */}
      {settings.showEnglish && aiMessage.english && (
        <p className="text-sm pt-2 border-t" style={{ color: 'var(--text-secondary)', borderColor: 'var(--glass-border)' }}>
          🇬🇧 {aiMessage.english}
        </p>
      )}
    </div>
  );
}
