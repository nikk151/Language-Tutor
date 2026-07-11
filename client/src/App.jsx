import { useEffect, useCallback } from 'react';
import { ConversationProvider, useConversation, useConversationDispatch } from './context/ConversationContext';
import AISpeechCard from './components/AISpeechCard';
import SuggestedReply from './components/SuggestedReply';
import TranscriptCard from './components/TranscriptCard';
import FeedbackCard from './components/FeedbackCard';
import MicrophoneButton from './components/MicrophoneButton';
import ControlBar from './components/ControlBar';
import SettingsPanel from './components/SettingsPanel';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import useSpeechSynthesis from './hooks/useSpeechSynthesis';
import { startConversation, sendResponse, clearConversation } from './services/api';
import './index.css';

function AppContent() {
  const state = useConversation();
  const dispatch = useConversationDispatch();
  const { settings, status, aiMessage } = state;

  const {
    isListening,
    transcript: sttTranscript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: sttSupported
  } = useSpeechRecognition();

  const {
    isSpeaking,
    speak,
    stop: stopSpeaking,
    isSupported: ttsSupported
  } = useSpeechSynthesis();

  // Start a new conversation
  const handleStart = useCallback(async () => {
    dispatch({ type: 'SET_LOADING' });
    stopSpeaking();
    resetTranscript();

    try {
      const response = await startConversation(settings);
      dispatch({ type: 'SET_AI_RESPONSE', payload: response });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.error || error.message || 'Failed to start conversation'
      });
    }
  }, [settings, dispatch, stopSpeaking, resetTranscript]);

  // Send user response to API
  const handleSendResponse = useCallback(async (transcript) => {
    dispatch({ type: 'SET_PROCESSING' });
    stopSpeaking();

    try {
      const response = await sendResponse(transcript, settings);
      dispatch({ type: 'SET_AI_RESPONSE', payload: response });
      resetTranscript();
    } catch (error) {
      console.error('Failed to send response:', error);
      dispatch({
        type: 'SET_ERROR',
        payload: error.response?.data?.error || error.message || 'Failed to process response'
      });
    }
  }, [settings, dispatch, stopSpeaking, resetTranscript]);

  // Toggle microphone
  const handleToggleMic = useCallback(() => {
    if (isListening) {
      stopListening();
    } else if (status === 'ready') {
      stopSpeaking();
      dispatch({ type: 'SET_LISTENING' });
      startListening();
    }
  }, [isListening, status, startListening, stopListening, stopSpeaking, dispatch]);

  // Replay AI speech
  const handleReplay = useCallback(() => {
    if (aiMessage?.speech) {
      speak(aiMessage.speech);
    }
  }, [aiMessage, speak]);

  // Clear conversation
  const handleClear = useCallback(async () => {
    stopSpeaking();
    resetTranscript();
    try {
      await clearConversation();
    } catch (e) {
      // Ignore clear errors
    }
    dispatch({ type: 'CLEAR_CONVERSATION' });
  }, [dispatch, stopSpeaking, resetTranscript]);

  // Toggle settings
  const handleToggleSettings = useCallback(() => {
    dispatch({ type: 'TOGGLE_SETTINGS' });
  }, [dispatch]);

  // Speak function for AISpeechCard
  const handleSpeak = useCallback((text) => {
    if (ttsSupported) {
      speak(text);
    }
  }, [ttsSupported, speak]);

  // Update transcript in state when STT changes
  useEffect(() => {
    if (sttTranscript) {
      dispatch({ type: 'SET_TRANSCRIPT', payload: sttTranscript });
    }
  }, [sttTranscript, dispatch]);

  // When recording stops, either send response or reset to ready
  useEffect(() => {
    if (!isListening && status === 'listening') {
      if (sttTranscript) {
        handleSendResponse(sttTranscript);
      } else {
        // Mic turned off without capturing anything
        dispatch({ type: 'SET_READY' });
      }
    }
  }, [isListening, sttTranscript, status, dispatch, handleSendResponse]);

  // Keyboard shortcut: Space to toggle recording
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !e.target.closest('input, select, textarea, button')) {
        e.preventDefault();
        handleToggleMic();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListening, status, handleToggleMic]);

  // Auto-scroll to the bottom of the page when a new AI response arrives or status changes
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [state.history.length, status, aiMessage]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Decorative sakura petals */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="sakura-petal"
          style={{
            left: `${15 + i * 18}%`,
            animationName: 'floatPetal',
            animationDuration: `${12 + i * 3}s`,
            animationDelay: `${i * 2}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
          }}
        />
      ))}

      {/* Header */}
      <header className="px-4 py-5 text-center relative z-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
            日本語会話チューター
          </span>
        </h1>
        <p className="text-xs md:text-sm" style={{ color: 'var(--text-muted)' }}>
          Japanese Conversation Practice — {settings.topic} • {settings.difficulty}
          {isSpeaking && <span className="ml-2 text-cyan-400">🔊 Speaking...</span>}
        </p>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 pb-64 max-w-2xl mx-auto w-full space-y-4 relative z-10">
        {/* Settings Panel */}
        <SettingsPanel />

        {/* Conversation History */}
        {state.history.map((turn, index) => (
          <div key={index} className="space-y-4 mb-8">
            <AISpeechCard message={turn.aiMessage} />
            {turn.userTranscript && <TranscriptCard message={turn.userTranscript} />}
            {turn.feedback && <FeedbackCard feedbackData={turn.feedback} />}
          </div>
        ))}

        {/* Current Turn */}
        <div className="space-y-4 mb-8">
          <AISpeechCard onSpeak={handleSpeak} />
          
          <SuggestedReply />

          {/* Only show transcript card if there is transcript data or listening */}
          {(state.transcript || interimTranscript || status === 'listening') && (
            <TranscriptCard interimTranscript={interimTranscript} />
          )}
        </div>

        {/* Error display */}
        {state.error && (
          <div className="glass-card p-4 fade-in-up" style={{
            borderColor: 'rgba(244, 63, 94, 0.3)',
            background: 'rgba(244, 63, 94, 0.08)'
          }}>
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span className="text-sm" style={{ color: 'var(--accent-rose)' }}>
                {state.error}
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Bottom bar — Mic + Controls */}
      <div className="fixed bottom-0 left-0 right-0 z-20" style={{
        background: 'linear-gradient(to top, rgba(10, 10, 26, 0.98) 60%, transparent)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}>
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-6 space-y-4">
          {/* Microphone */}
          <div className="flex justify-center">
            <MicrophoneButton
              isListening={isListening}
              onToggle={handleToggleMic}
              isSupported={sttSupported}
            />
          </div>

          {/* Control buttons */}
          <ControlBar
            onStart={handleStart}
            onReplay={handleReplay}
            onClear={handleClear}
            onToggleSettings={handleToggleSettings}
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ConversationProvider>
      <AppContent />
    </ConversationProvider>
  );
}

export default App;
