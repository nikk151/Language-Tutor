import { useState } from 'react';
import { useConversation } from '../context/ConversationContext';

/**
 * FeedbackCard - Displays AI feedback, scores, and corrections.
 */
export default function FeedbackCard({ feedbackData }) {
  const context = useConversation();
  const feedback = feedbackData !== undefined ? feedbackData : context.feedback;
  const [isOpen, setIsOpen] = useState(false);

  // Don't show if no feedback or all scores are 0 (conversation just started)
  if (!feedback || !feedback.text) return null;

  const { scores } = feedback;
  const hasScores = scores && Object.values(scores).some(s => s > 0);

  const scoreConfig = [
    { key: 'pronunciation', label: 'Pronunciation', icon: '🗣️', color: '#00d4ff' },
    { key: 'grammar', label: 'Grammar', icon: '📝', color: '#8b5cf6' },
    { key: 'vocabulary', label: 'Vocabulary', icon: '📚', color: '#10b981' },
    { key: 'naturalness', label: 'Naturalness', icon: '🌸', color: '#f4a7bb' },
    { key: 'fluency', label: 'Fluency', icon: '💨', color: '#f59e0b' },
  ];

  return (
    <div className="glass-card glass-card-feedback p-6 fade-in-up">
      {/* Header (Clickable Dropdown) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full mb-2 cursor-pointer focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <span className="text-sm font-semibold" style={{ color: 'var(--accent-violet)' }}>
            Feedback
          </span>
        </div>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {isOpen ? '▲ Hide' : '▼ Show'}
        </span>
      </button>

      {/* Expandable Content */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
          {/* Feedback text */}
          {feedback.text && (
            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {feedback.text}
            </p>
          )}

          {/* Scores */}
          {hasScores && (
            <div className="space-y-3 mb-4">
              {scoreConfig.map(({ key, label, icon, color }) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-sm w-5">{icon}</span>
                  <span className="text-xs w-24" style={{ color: 'var(--text-secondary)' }}>
                    {label}
                  </span>
                  <div className="flex-1 score-bar">
                    <div
                      className="score-bar-fill"
                      style={{
                        width: `${(scores[key] || 0) * 10}%`,
                        background: `linear-gradient(90deg, ${color}88, ${color})`
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold w-8 text-right" style={{ color }}>
                    {scores[key] || 0}/10
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Grammar correction */}
          {feedback.grammarCorrection && (
            <div className="p-3 rounded-xl mb-3" style={{
              background: 'rgba(244, 63, 94, 0.08)',
              border: '1px solid rgba(244, 63, 94, 0.15)'
            }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-xs">✏️</span>
                <span className="text-xs font-medium" style={{ color: 'var(--accent-rose)' }}>
                  Grammar Correction
                </span>
              </div>
              <p className="text-japanese-sm">{feedback.grammarCorrection}</p>
            </div>
          )}

          {/* Natural alternative */}
          {feedback.naturalReply && (
            <div className="p-3 rounded-xl" style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.15)'
            }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-xs">🌿</span>
                <span className="text-xs font-medium" style={{ color: 'var(--accent-emerald)' }}>
                  Natural Alternative
                </span>
              </div>
              <p className="text-japanese-sm">{feedback.naturalReply}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
