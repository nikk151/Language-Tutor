import { useState } from 'react';
import { useConversation } from '../context/ConversationContext';
import FuriganaText from './FuriganaText';

/**
 * SuggestedReply - Shows a hint for what the student could say.
 * Applies masking based on hint level (easy/medium/hard/expert).
 */
export default function SuggestedReply() {
  const { suggestedReply, settings } = useConversation();
  const [isRevealed, setIsRevealed] = useState(false);

  if (!suggestedReply) return null;

  // Expert mode: hide entirely
  if (settings.hintLevel === 'expert' && !isRevealed) {
    return (
      <div className="glass-card p-4 fade-in-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">💡</span>
            <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              Hint hidden (Expert mode)
            </span>
          </div>
          <button
            onClick={() => setIsRevealed(true)}
            className="btn-glass text-xs py-1 px-3"
          >
            Reveal
          </button>
        </div>
      </div>
    );
  }

  // Determine display text based on hint level
  const getDisplayText = () => {
    const text = settings.showFurigana && suggestedReply.furigana
      ? suggestedReply.furigana
      : suggestedReply.text;

    if (settings.hintLevel === 'easy' || isRevealed) {
      return text;
    }

    // For medium/hard, mask parts of the text
    // Strip furigana for masking, then re-apply
    const plainText = text.replace(/\[.*?\]/g, '');
    const words = plainText.split(/(?<=[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf])|(?=[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf])/);

    if (settings.hintLevel === 'medium') {
      // Replace about half the characters with blanks
      const masked = words.map((word, i) =>
        i % 3 === 1 ? '＿＿' : word
      ).join('');
      return masked;
    }

    if (settings.hintLevel === 'hard') {
      // Show only a few characters
      const masked = words.map((word, i) =>
        i % 5 === 0 ? word : '＿'
      ).join('');
      return masked;
    }

    return text;
  };

  const displayText = getDisplayText();
  const showFuriganaForHint = (settings.hintLevel === 'easy' || isRevealed) && settings.showFurigana;

  return (
    <div className="glass-card p-4 fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">💡</span>
          <span className="text-sm font-medium" style={{ color: 'var(--accent-gold)' }}>
            Suggested Reply
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{
            background: 'rgba(226, 183, 20, 0.1)',
            color: 'var(--accent-gold)',
            border: '1px solid rgba(226, 183, 20, 0.2)'
          }}>
            {settings.hintLevel}
          </span>
        </div>
        {!isRevealed && settings.hintLevel !== 'easy' && (
          <button
            onClick={() => setIsRevealed(true)}
            className="btn-glass text-xs py-1 px-3"
          >
            Show Full
          </button>
        )}
      </div>

      {/* Suggested reply text */}
      <div className="text-japanese-md mb-2">
        <FuriganaText text={displayText} showFurigana={showFuriganaForHint} />
      </div>

      {/* Romaji and English (only on easy or revealed) */}
      {(settings.hintLevel === 'easy' || isRevealed) && (
        <div className="space-y-1 mt-2">
          {suggestedReply.romaji && (
            <p className="text-xs italic" style={{ color: 'var(--text-muted)' }}>
              {suggestedReply.romaji}
            </p>
          )}
          {suggestedReply.english && (
            <p className="text-xs pt-1 border-t" style={{ color: 'var(--text-secondary)', borderColor: 'var(--glass-border)' }}>
              🇬🇧 {suggestedReply.english}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
