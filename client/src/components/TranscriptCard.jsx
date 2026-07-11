import { useConversation } from '../context/ConversationContext';

/**
 * TranscriptCard - Shows the user's spoken Japanese text.
 * Displays both final transcript and real-time interim results.
 */
export default function TranscriptCard({ interimTranscript, message }) {
  const context = useConversation();
  const transcript = message !== undefined ? message : context.transcript;
  const status = message !== undefined ? 'ready' : context.status;

  // Don't show if nothing to display
  if (!transcript && !interimTranscript && status !== 'listening') return null;

  return (
    <div className="glass-card glass-card-user p-4 fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-xs">
          👤
        </div>
        <span className="text-sm font-medium" style={{ color: 'var(--accent-emerald)' }}>
          You said
        </span>
        {status === 'listening' && (
          <span className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full" style={{
            background: 'rgba(244, 63, 94, 0.1)',
            color: 'var(--accent-rose)',
            border: '1px solid rgba(244, 63, 94, 0.2)'
          }}>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            Listening...
          </span>
        )}
      </div>

      {/* Transcript */}
      <div className="text-japanese-md">
        {transcript && <span>{transcript}</span>}
        {interimTranscript && (
          <span style={{ color: 'var(--text-muted)' }}>
            {interimTranscript}
          </span>
        )}
        {status === 'listening' && !transcript && !interimTranscript && (
          <span className="italic text-sm" style={{ color: 'var(--text-muted)' }}>
            Speak in Japanese...
          </span>
        )}
      </div>
    </div>
  );
}
