import { useState, useRef, useCallback, useEffect } from 'react';
import { useConversation } from '../context/ConversationContext';

/**
 * Custom hook for browser Speech Synthesis (TTS).
 * Uses the Web Speech API — works in Chrome/Edge.
 */
export default function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const utteranceRef = useRef(null);

  const context = useConversation();
  const settings = context?.settings;

  // Load voices (they load async in some browsers)
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true);

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);

        // Find the best Japanese voice
        const japaneseVoices = availableVoices.filter(v =>
          v.lang.startsWith('ja') || v.lang === 'ja-JP'
        );

        if (japaneseVoices.length > 0) {
          // Prefer Google voices, then Microsoft, then any
          const googleVoice = japaneseVoices.find(v => v.name.includes('Google'));
          const msVoice = japaneseVoices.find(v => v.name.includes('Microsoft'));
          setSelectedVoice(googleVoice || msVoice || japaneseVoices[0]);
        }
      };

      loadVoices();

      // Chrome loads voices async
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text) => {
    if (!isSupported || !text) return;

    // Cancel any current speech
    window.speechSynthesis.cancel();

    // Strip furigana annotations for speaking
    const cleanText = text.replace(/\[.*?\]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ja-JP';
    utterance.rate = settings?.voiceSpeed || 0.9; // Dynamic speed from settings
    utterance.pitch = 1;
    utterance.volume = 1;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error('TTS error:', event);
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, selectedVoice, settings?.voiceSpeed]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    isSpeaking,
    speak,
    stop,
    isSupported,
    voices,
    selectedVoice
  };
}
