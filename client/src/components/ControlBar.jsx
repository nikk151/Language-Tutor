import { useConversation } from '../context/ConversationContext';

/**
 * ControlBar - Action buttons: Start/Next, Replay, Clear, Settings toggle.
 */
export default function ControlBar({ onStart, onReplay, onClear, onToggleSettings }) {
  const { aiMessage, status, showSettings } = useConversation();
  const isLoading = status === 'loading' || status === 'processing';

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {/* Start / Next Conversation */}
      <button
        onClick={onStart}
        disabled={isLoading}
        className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" />
            </svg>
            Processing...
          </>
        ) : (
          <>
            {aiMessage ? '🔄 Next' : '🎌 Start Conversation'}
          </>
        )}
      </button>

      {/* Replay AI Speech */}
      {aiMessage && (
        <button
          onClick={onReplay}
          className="btn-glass flex items-center gap-1.5"
          title="Replay AI speech"
        >
          🔊 Replay
        </button>
      )}

      {/* Clear Conversation */}
      {aiMessage && (
        <button
          onClick={onClear}
          className="btn-glass flex items-center gap-1.5"
          title="Clear conversation"
        >
          🗑️ Clear
        </button>
      )}

      {/* Settings Toggle */}
      <button
        onClick={onToggleSettings}
        className={`btn-glass flex items-center gap-1.5 ${showSettings ? 'border-cyan-500/40' : ''}`}
        title="Settings"
      >
        ⚙️ Settings
      </button>
    </div>
  );
}
