# 🎌 Japanese AI Conversation Tutor

A personal Japanese conversation practice app where an AI tutor speaks Japanese, you respond by voice, and the AI provides detailed feedback. 100% free — no paid APIs.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) + Tailwind CSS v3 |
| Backend | Node.js + Express |
| AI | Gemini Flash (free tier) |
| Speech-to-Text | Web Speech API (browser) |
| Text-to-Speech | Web Speech API (browser) |

## Getting Started

### 1. Get a free Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a free API key
3. Add it to `.env`:
   ```
   GEMINI_API_KEY=your_key_here
   ```

### 2. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 3. Run

You can run the app in two ways:

#### Option A: Unified Start (Easiest)
Run from the root directory:
```bash
# Install everything
npm run install-all

# Start both servers (dev mode)
# Terminal 1:
cd server && npm run dev
# Terminal 2:
cd client && npm run dev
```

Open **http://localhost:5173** in Chrome or Edge.

---

## Deployment (to Render, Railway, etc.)

Because the backend is configured to serve the frontend static files in production, you can deploy the entire app as a **single Web Service** on platforms like **Render.com**.

### 1. Push your code to GitHub
Make sure all your changes (including the root `package.json`) are committed and pushed to a GitHub repository.

### 2. Set up on Render.com
1. Create a free account on [Render](https://render.com).
2. Click **New** -> **Web Service**.
3. Connect your GitHub repository.
4. Configure the settings:
   - **Environment**: `Node`
   - **Region**: Select a region close to you
   - **Branch**: `main` (or whichever branch you push to)
   - **Build Command**: `npm run install-all && npm run build`
   - **Start Command**: `npm start`
5. Click **Advanced** and add an Environment Variable:
   - Key: `GEMINI_API_KEY`
   - Value: `your_gemini_api_key`
6. Click **Deploy Web Service**.

Once deployed, Render will provide you with a permanent public link (e.g. `https://your-app.onrender.com`) that you can open on your mobile phone or any other device anytime, without needing your laptop to be running!

## Features

- 🗣️ **Voice Recognition** — Speak Japanese and get real-time transcription
- 🔊 **Text-to-Speech** — Hear the AI tutor speak Japanese
- 📊 **Detailed Feedback** — Scores for pronunciation, grammar, vocabulary, naturalness, fluency
- 📝 **Grammar Corrections** — See what you said vs. the natural way to say it
- 💡 **Adjustable Hints** — Easy/Medium/Hard/Expert hint levels
- 🔤 **Furigana** — Toggle reading annotations above kanji
- 🎯 **JLPT Levels** — Practice at N5 through N1 difficulty
- 🌸 **15 Topics** — Daily life, travel, food, work, mock interviews and more

## Browser Support

Best experience in **Chrome** or **Edge** (full Web Speech API support). On iOS Safari, the Speech Recognition API requires tapping the microphone each time due to iOS security policies.
