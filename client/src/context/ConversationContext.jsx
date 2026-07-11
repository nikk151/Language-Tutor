import { createContext, useContext, useReducer } from 'react';

const ConversationContext = createContext(null);
const ConversationDispatchContext = createContext(null);

const initialState = {
  // AI's current message
  aiMessage: null,
  // Suggested reply for the student
  suggestedReply: null,
  // User's spoken transcript
  transcript: '',
  // AI feedback on user's response
  feedback: null,
  // Conversation status
  status: 'idle', // 'idle' | 'loading' | 'ready' | 'listening' | 'processing' | 'error'
  // Error message
  error: null,
  // Conversation history (for display)
  history: [],
  // Settings
  settings: {
    topic: 'Free Conversation',
    difficulty: 'N5',
    hintLevel: 'easy',
    showFurigana: true,
    showEnglish: true,
    practicingGrammar: false,
    grammarLevel: 'N3',
    grammarPattern: ''
  },
  // Settings panel visibility
  showSettings: false,
};

function conversationReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, status: 'loading', error: null };

    case 'SET_AI_RESPONSE': {
      const newHistory = [...state.history];
      
      // If we have an existing aiMessage and transcript, it means a turn just completed.
      // We package the old aiMessage, the user's transcript, and the newly received feedback.
      if (state.aiMessage && state.transcript) {
        newHistory.push({
          aiMessage: state.aiMessage,
          userTranscript: state.transcript,
          feedback: {
            text: action.payload.feedback,
            grammarCorrection: action.payload.grammarCorrection,
            naturalReply: action.payload.naturalReply,
            scores: action.payload.scores,
          }
        });
      } else if (state.aiMessage && !state.transcript && action.payload.feedback) {
        // Edge case: feedback received but no transcript (shouldn't happen, but just in case)
        newHistory.push({
          aiMessage: state.aiMessage,
          userTranscript: '',
          feedback: {
            text: action.payload.feedback,
            grammarCorrection: action.payload.grammarCorrection,
            naturalReply: action.payload.naturalReply,
            scores: action.payload.scores,
          }
        });
      }

      return {
        ...state,
        history: newHistory,
        aiMessage: {
          speech: action.payload.aiSpeech,
          speechRomaji: action.payload.aiSpeechRomaji,
          speechFurigana: action.payload.aiSpeechFurigana,
          english: action.payload.english,
        },
        suggestedReply: {
          text: action.payload.suggestedReply,
          romaji: action.payload.suggestedReplyRomaji,
          furigana: action.payload.suggestedReplyFurigana,
          english: action.payload.suggestedReplyEnglish,
        },
        // Clear current feedback and transcript since they belong to the historical turn
        feedback: null,
        transcript: '',
        status: 'ready',
        error: null,
      };
    }

    case 'SET_TRANSCRIPT':
      return { ...state, transcript: action.payload };

    case 'SET_LISTENING':
      return { ...state, status: 'listening' };

    case 'SET_READY':
      return { ...state, status: 'ready' };

    case 'SET_PROCESSING':
      return { ...state, status: 'processing' };

    case 'SET_ERROR':
      return { ...state, status: 'error', error: action.payload };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case 'TOGGLE_SETTINGS':
      return { ...state, showSettings: !state.showSettings };

    case 'CLEAR_CONVERSATION':
      return {
        ...initialState,
        settings: state.settings,
        showSettings: state.showSettings,
      };

    case 'ADD_TO_HISTORY':
      return {
        ...state,
        history: [...state.history, action.payload]
      };

    default:
      return state;
  }
}

export function ConversationProvider({ children }) {
  const [state, dispatch] = useReducer(conversationReducer, initialState);

  return (
    <ConversationContext.Provider value={state}>
      <ConversationDispatchContext.Provider value={dispatch}>
        {children}
      </ConversationDispatchContext.Provider>
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  const context = useContext(ConversationContext);
  if (!context && context !== null) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
}

export function useConversationDispatch() {
  const context = useContext(ConversationDispatchContext);
  if (!context) {
    throw new Error('useConversationDispatch must be used within a ConversationProvider');
  }
  return context;
}
