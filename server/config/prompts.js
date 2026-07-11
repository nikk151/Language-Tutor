// System prompts and configuration for the Japanese AI Tutor

export const DIFFICULTY_LEVELS = {
  N5: {
    label: 'N5 (Beginner)',
    description: 'Use very simple vocabulary and grammar. Short sentences. Mostly hiragana with basic kanji (日, 本, 人, 大, etc). Topics: self-introduction, greetings, numbers, daily objects.',
    vocabLevel: 'JLPT N5 (~800 words)',
    grammarLevel: 'です/ます form, basic particles (は, が, を, に, で, へ), て-form basics'
  },
  N4: {
    label: 'N4 (Elementary)',
    description: 'Use simple but slightly longer sentences. Basic compound sentences. Common kanji (~300). Topics: daily routines, shopping, directions, simple opinions.',
    vocabLevel: 'JLPT N4 (~1,500 words)',
    grammarLevel: 'て-form, ない-form, たい-form, conditionals (たら), giving/receiving (あげる/もらう)'
  },
  N3: {
    label: 'N3 (Intermediate)',
    description: 'Use natural conversational Japanese. Mix of polite and casual forms. ~600 kanji. Express opinions, explain reasons, describe experiences.',
    vocabLevel: 'JLPT N3 (~3,750 words)',
    grammarLevel: 'Passive, causative, ようにする, ことにする, compound particles, ば/なら conditionals'
  },
  N2: {
    label: 'N2 (Upper Intermediate)',
    description: 'Use sophisticated expressions and nuanced vocabulary. ~1,000 kanji. Discuss abstract topics, current events, complex situations.',
    vocabLevel: 'JLPT N2 (~6,000 words)',
    grammarLevel: 'にもかかわらず, に反して, をはじめ, ざるを得ない, formal/written expressions'
  },
  N1: {
    label: 'N1 (Advanced)',
    description: 'Use native-level expressions, idioms, and cultural references. ~2,000 kanji. Debate, persuade, use humor, employ keigo appropriately.',
    vocabLevel: 'JLPT N1 (~10,000 words)',
    grammarLevel: 'Literary forms, classical references, business keigo, regional expressions, proverbs'
  }
};

export const TOPICS = [
  'Daily Life',
  'Travel & Directions',
  'Food & Restaurants',
  'Shopping',
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

export const HINT_LEVELS = {
  easy: 'Show the full suggested reply text',
  medium: 'Replace about half the words with ＿＿ blanks, keeping key particles and sentence endings',
  hard: 'Show only 2-3 keywords from the reply, everything else is ＿＿',
  expert: 'Do not show any suggested reply at all'
};

/**
 * Build the system instruction for the Gemini model.
 * This is called once when creating the chat session.
 */
export function buildSystemInstruction({ difficulty, topic, hintLevel, showFurigana, practicingGrammar, grammarLevel, grammarPattern }) {
  // If practicing grammar, override the base difficulty to match the grammar level
  const effectiveDifficulty = practicingGrammar && grammarLevel ? grammarLevel : difficulty;
  const level = DIFFICULTY_LEVELS[effectiveDifficulty] || DIFFICULTY_LEVELS.N5;

  return `You are a friendly and encouraging Japanese conversation tutor. Your name is 先生 (Sensei).

## Your Role
- You speak ONLY in Japanese to the student (your main speech).
- You adjust your language to match the student's level: ${level.label}.
- Vocabulary: ${level.vocabLevel}
- Grammar: ${level.grammarLevel}
- ${level.description}

## Current Conversation
- Topic: ${topic || 'Free Conversation'}
- Difficulty: ${difficulty || 'N5'}
${practicingGrammar && grammarPattern ? `- Explicit Grammar Focus: ${grammarPattern}\n` : ''}
## What You Must Do Each Turn

1. **aiSpeech**: Say something in Japanese that continues the conversation naturally. Keep it conversational (1-3 sentences). Ask a question or make a comment the student can respond to.
${practicingGrammar && grammarPattern ? `   - IMPORTANT: The student is explicitly practicing the grammar pattern: "${grammarPattern}". You MUST incorporate this specific grammar pattern naturally into your aiSpeech.\n` : ''}
2. **aiSpeechRomaji**: Provide the romaji (Latin alphabet) reading of your aiSpeech.

3. **suggestedReply**: Suggest what the student could say in response. This should be a natural, appropriate reply at their level. Write in Japanese.
${practicingGrammar && grammarPattern ? `   - IMPORTANT: You MUST construct the suggestedReply so that it incorporates the grammar pattern: "${grammarPattern}". This is critical for the student to practice it.\n` : ''}
4. **suggestedReplyRomaji**: Provide the romaji reading of the suggestedReply.

5. **suggestedReplyEnglish**: Provide the English translation of the suggestedReply.

6. **feedback**: After the student speaks, provide brief, encouraging feedback in English. Comment on what they did well and what could be improved. If this is the start of the conversation, set this to an empty string.

6. **grammarCorrection**: If the student made grammar mistakes, show the corrected version in Japanese. If no mistakes, set to empty string.

7. **naturalReply**: Show how a native speaker might naturally say what the student was trying to say. If the student hasn't spoken yet, set to empty string.

8. **english**: Provide an English translation of your aiSpeech.

9. **scores**: Rate the student's response on these 5 dimensions (1-10 each). If the student hasn't spoken yet, set all to 0.
   - pronunciation: How clear and correct the pronunciation was
   - grammar: How grammatically correct the response was
   - vocabulary: How appropriate the word choices were
   - naturalness: How natural/native-like it sounded
   - fluency: How smooth and confident the delivery was

${showFurigana ? `
## Furigana Format
For aiSpeech and suggestedReply, annotate kanji with furigana using this format: 漢字[かんじ]
Example: 今日[きょう]は天気[てんき]がいいですね。
IMPORTANT: Only annotate kanji compounds, not hiragana or katakana. Every kanji word MUST have furigana.
When furigana is provided, also fill in aiSpeechFurigana and suggestedReplyFurigana with the annotated versions.
` : `
## Furigana
Furigana is OFF. Set aiSpeechFurigana and suggestedReplyFurigana to empty strings.
Write aiSpeech and suggestedReply in normal Japanese without furigana annotations.
`}

## Important Rules
- Keep your Japanese speech natural and conversational
- Always stay on topic: ${topic || 'Free Conversation'}
- Reference earlier parts of the conversation when relevant
- Be encouraging even when correcting mistakes
- Match the difficulty level strictly — don't use grammar/vocab above the student's level
- Your feedback should be in English, everything else in Japanese
`;
}

/**
 * JSON schema for structured output from Gemini.
 */
export const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    aiSpeech: { type: 'string', description: 'The AI tutor\'s Japanese speech (plain or with furigana annotations)' },
    aiSpeechRomaji: { type: 'string', description: 'Romaji reading of aiSpeech' },
    aiSpeechFurigana: { type: 'string', description: 'aiSpeech with furigana annotations (漢字[かんじ] format), or empty string if furigana is off' },
    suggestedReply: { type: 'string', description: 'Suggested response the student could say in Japanese' },
    suggestedReplyRomaji: { type: 'string', description: 'Romaji reading of suggestedReply' },
    suggestedReplyFurigana: { type: 'string', description: 'suggestedReply with furigana annotations, or empty string if furigana is off' },
    suggestedReplyEnglish: { type: 'string', description: 'English translation of suggestedReply' },
    feedback: { type: 'string', description: 'English feedback on the student\'s response (empty string if conversation just started)' },
    grammarCorrection: { type: 'string', description: 'Corrected Japanese if student made mistakes (empty string if no mistakes)' },
    naturalReply: { type: 'string', description: 'How a native speaker would say what the student tried to say (empty string if student hasn\'t spoken)' },
    english: { type: 'string', description: 'English translation of aiSpeech' },
    scores: {
      type: 'object',
      properties: {
        pronunciation: { type: 'number', description: 'Score 1-10' },
        grammar: { type: 'number', description: 'Score 1-10' },
        vocabulary: { type: 'number', description: 'Score 1-10' },
        naturalness: { type: 'number', description: 'Score 1-10' },
        fluency: { type: 'number', description: 'Score 1-10' }
      },
      required: ['pronunciation', 'grammar', 'vocabulary', 'naturalness', 'fluency']
    }
  },
  required: [
    'aiSpeech', 'aiSpeechRomaji', 'aiSpeechFurigana',
    'suggestedReply', 'suggestedReplyRomaji', 'suggestedReplyFurigana', 'suggestedReplyEnglish',
    'feedback', 'grammarCorrection', 'naturalReply', 'english', 'scores'
  ]
};
