import { useConversation } from '../context/ConversationContext';

/**
 * MicrophoneButton - Large circular mic button with visual feedback.
 * Press to start recording, release/click again to stop.
 */
export default function MicrophoneButton({ isListening, onStart, onStop, isSupported }) {
  const { status } = useConversation();
  const isDisabled = status === 'loading' || status === 'processing' || !isSupported;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Microphone button */}
      <button
        onMouseDown={onStart}
        onMouseUp={onStop}
        onMouseLeave={onStop}
        onTouchStart={onStart}
        onTouchEnd={onStop}
        onTouchCancel={onStop}
        onContextMenu={(e) => e.preventDefault()}
        disabled={isDisabled}
        className={`
          relative w-20 h-20 rounded-full flex items-center justify-center
          transition-all duration-300 ease-out
          ${isListening
            ? 'bg-gradient-to-br from-rose-500 to-pink-600 mic-recording scale-110 opacity-100'
            : isDisabled
              ? 'bg-gray-700/50 cursor-not-allowed opacity-40'
              : 'bg-gradient-to-br from-rose-500/80 to-pink-600/80 hover:from-rose-500 hover:to-pink-600 hover:scale-105 active:scale-95 opacity-50 hover:opacity-100'
          }
        `}
        style={{
          boxShadow: isListening
            ? '0 0 40px rgba(244, 63, 94, 0.4)'
            : '0 8px 24px rgba(0, 0, 0, 0.3)'
        }}
        title={!isSupported ? 'Speech recognition not supported in this browser' : isListening ? 'Release to stop recording' : 'Hold to record (or hold Space)'}
      >
        {/* Mic icon */}
        {isListening ? (
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="waveform-bar" />
            ))}
          </div>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
        )}
      </button>

      {/* Status text */}
      <span className="text-xs font-medium" style={{
        color: isListening ? 'var(--accent-rose)' : 'var(--text-muted)'
      }}>
        {!isSupported
          ? 'Not supported'
          : isListening
            ? 'Listening... (release to stop)'
            : status === 'processing'
              ? 'Processing...'
              : 'Hold to speak'
        }
      </span>
    </div>
  );
}
