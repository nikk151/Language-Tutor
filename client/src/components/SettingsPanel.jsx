import { useConversation, useConversationDispatch } from '../context/ConversationContext';

const TOPICS = [
  'Daily Life',
  'Travel & Directions',
  'Food & Restaurants',
  'Shopping',
  'Mock Interview',
  'Work & Business',
  'Hobbies & Interests',
  'Weather & Seasons',
  'Family & Relationships',
  'Health & Body',
  'School & Education',
  'Technology',
  'Culture & Traditions',
  'Sports & Exercise',
  'Free Conversation'
];

const DIFFICULTIES = [
  { value: 'N5', label: 'N5 — Beginner' },
  { value: 'N4', label: 'N4 — Elementary' },
  { value: 'N3', label: 'N3 — Intermediate' },
  { value: 'N2', label: 'N2 — Upper Intermediate' },
  { value: 'N1', label: 'N1 — Advanced' },
];

const HINT_LEVELS = [
  { value: 'easy', label: 'Easy — Full hint' },
  { value: 'medium', label: 'Medium — Partial hint' },
  { value: 'hard', label: 'Hard — Keywords only' },
  { value: 'expert', label: 'Expert — No hint' },
];

/**
 * SettingsPanel - Dropdowns and toggles for conversation settings.
 */
export default function SettingsPanel() {
  const { settings, showSettings } = useConversation();
  const dispatch = useConversationDispatch();

  if (!showSettings) return null;

  const updateSetting = (key, value) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } });
  };

  return (
    <div className="glass-card p-5 settings-panel">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--accent-cyan)' }}>
        ⚙️ Conversation Settings
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Topic */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            Topic
          </label>
          <select
            value={settings.topic}
            onChange={(e) => updateSetting('topic', e.target.value)}
            className="input-glass"
          >
            {TOPICS.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            Difficulty
          </label>
          <select
            value={settings.difficulty}
            onChange={(e) => updateSetting('difficulty', e.target.value)}
            className="input-glass"
          >
            {DIFFICULTIES.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

        {/* Hint Level */}
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            Hint Level
          </label>
          <select
            value={settings.hintLevel}
            onChange={(e) => updateSetting('hintLevel', e.target.value)}
            className="input-glass"
          >
            {HINT_LEVELS.map(h => (
              <option key={h.value} value={h.value}>{h.label}</option>
            ))}
          </select>
        </div>

        {/* Furigana Toggle */}
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            Furigana (Readings)
          </label>
          <button
            className={`toggle-switch ${settings.showFurigana ? 'active' : ''}`}
            onClick={() => updateSetting('showFurigana', !settings.showFurigana)}
            aria-label="Toggle furigana"
          />
        </div>

        {/* English Toggle */}
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            English Translation
          </label>
          <button
            className={`toggle-switch ${settings.showEnglish ? 'active' : ''}`}
            onClick={() => updateSetting('showEnglish', !settings.showEnglish)}
            aria-label="Toggle English translation"
          />
        </div>
      </div>
    </div>
  );
}
