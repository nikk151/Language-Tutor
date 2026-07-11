# 🎌 Japanese AI Conversation Practice App

An interactive, premium web application that lets you practice speaking Japanese with an AI Tutor named **先生 (Sensei)**. It features real-time speech-to-text, natural voice text-to-speech feedback, JLPT difficulty levels (N5-N1), focused grammar practice mode, and dynamic suggested replies with romaji, furigana readings, and English translations.

---

## 📖 Choose Your Guide
* [💻 Developer & Coder Guide](#-developer--coder-guide) — For technical users, details on architecture, API design, project structure, and quick commands.
* [🛠️ Non-Coder & Beginner Guide](#%EF%B8%8F-non-coder--beginner-guide) — For users with no programming background who want detailed step-by-step setup instructions.

---

## 💻 Developer & Coder Guide

### 🏗️ Architecture & Tech Stack
The application is structured as a decoupled monorepo with a frontend client and a backend API server.

* **Frontend (Client):** 
  - **Framework:** React 19 (Vite-powered environment)
  - **State Management:** React Context API + Reducer for clean state flow
  - **Styling:** Vanilla CSS customized with CSS variables for glassmorphism aesthetics, dynamic keyframe animations, and custom scrollbars. Tailwind CSS is used for utility-first responsive layout structures.
  - **Speech API:** Uses the browser's native Web Speech API (`SpeechRecognition` for STT and `SpeechSynthesis` for TTS).
* **Backend (Server):**
  - **Runtime:** Node.js + Express
  - **AI Integration:** Google Gemini Developer API using the official `@google/genai` SDK
  - **Deployment Model:** Full-stack deployment via Express serving static React assets in production from the `client/dist` directory.

---

### 📂 Directory Structure
```text
├── client/                     # React Frontend App
│   ├── src/
│   │   ├── components/         # AISpeechCard, SettingsPanel, TranscriptCard, etc.
│   │   ├── context/            # ConversationContext (State & Reducers)
│   │   ├── data/               # grammarPatterns.js (180+ structured JLPT points)
│   │   ├── hooks/              # useSpeechRecognition, useSpeechSynthesis (TTS speed caching)
│   │   ├── services/           # api.js (Axios instances connecting to backend)
│   │   ├── App.jsx             # Orchestrates conversation flow & auto-scroll events
│   │   └── index.css           # Glassmorphism design tokens & layout overrides
│   └── vite.config.js          # Vite config with dev-server proxy targeting port 5000
│
├── server/                     # Express API Server
│   ├── config/                 # prompts.js (Gemini System Prompts & RESPONSE_SCHEMA)
│   ├── routes/                 # conversation.js (Starts, responds, clears sessions)
│   ├── services/               # aiService.js (Gemini SDK integration & validation)
│   ├── app.js                  # App configuration & production static file fallback routing
│   └── server.js               # Entrance port listener (default: 5000)
│
├── .env                        # Local Environment variables (API Key)
└── package.json                # Root package for install-all automation scripts
```

---

### 🔌 API Routing & Endpoints
All API requests expect and return JSON payloads.

1. **`POST /api/conversation/start`**
   - Starts a fresh conversation session.
   - **Payload:** `{ settings: { topic, difficulty, hintLevel, showFurigana, practicingGrammar, grammarLevel, grammarPattern } }`
   - **Returns:** AI response structure matching the schema.

2. **`POST /api/conversation/respond`**
   - Sends the student's spoken message and returns the next conversation turn.
   - **Payload:** `{ message: "Student response", settings: { ... } }`
   - **Returns:** AI response containing `aiSpeech`, `suggestedReply`, `feedback`, `grammarCorrection`, `naturalReply`, and `scores`.

3. **`POST /api/conversation/clear`**
   - Resets the active conversation session.

#### Gemini Response JSON Schema:
```json
{
  "aiSpeech": "Japanese reply (Furigana annotations: 漢字[かんじ])",
  "aiSpeechRomaji": "Romaji reading",
  "aiSpeechFurigana": "Annotated furigana markup",
  "suggestedReply": "Recommended response",
  "suggestedReplyRomaji": "Suggested response romaji",
  "suggestedReplyFurigana": "Suggested response furigana markup",
  "suggestedReplyEnglish": "English translation",
  "feedback": "English grammatical evaluation",
  "grammarCorrection": "Corrected Japanese string",
  "naturalReply": "Colloquial native phrasing",
  "english": "English translation of aiSpeech",
  "scores": {
    "pronunciation": 9,
    "grammar": 8,
    "vocabulary": 8,
    "naturalness": 7,
    "fluency": 8
  }
}
```

---

### ⚡ Developer Quick Start

1. **Clone the Repo:**
   ```bash
   git clone https://github.com/nikk151/Language-Tutor.git
   cd Language-Tutor
   ```
2. **Setup environment variables:**
   Create a `.env` in the root:
   ```env
   GEMINI_API_KEY=your_key_here
   GEMINI_MODEL=gemini-3-flash
   ```
3. **Install all packages:**
   ```bash
   npm run install-all
   ```
4. **Run Dev mode (Requires two terminal windows):**
   - **Terminal 1:** `cd server && npm run dev`
   - **Terminal 2:** `cd client && npm run dev`
5. **Production Build:**
   ```bash
   npm run build
   npm start
   ```

---

## 🛠️ Non-Coder & Beginner Guide

If you have never coded before or don't know how to run a programming project, don't worry! Follow these simple instructions to set it up.

### Step 1: Install the Required Tools
You need these three free programs on your computer:
1. **VS Code (Code Editor):** Download and install from [code.visualstudio.com](https://code.visualstudio.com/).
2. **Node.js (App Engine):** Download and install the version labeled **LTS** from [nodejs.org](https://nodejs.org/).
3. **Git (Downloader):** 
   - **Windows:** Download and install from [git-scm.com/download/win](https://git-scm.com/download/win).
   - **Mac:** Open terminal (`Cmd + Space`, type `Terminal`, hit Enter), type `git --version`, and click **Install** when prompted.

---

### Step 2: Download the Files
1. Create a new folder on your Desktop named `Japanese-Tutor`.
2. Open the **VS Code** app.
3. Click **File** (top left) -> **Open Folder...** -> select your `Japanese-Tutor` folder.
4. Click **Terminal** (top menu) -> **New Terminal**.
5. Copy and paste the command below into the terminal window at the bottom, then hit **Enter**:
   ```bash
   git clone https://github.com/nikk151/Language-Tutor.git .
   ```

---

### Step 3: Setup your Gemini AI Key
1. Visit [aistudio.google.com](https://aistudio.google.com/) and sign in with your Google account.
2. Click **Get API key** -> **Create API key**.
3. Copy the long key code.
4. In VS Code, right-click the file list on the left side, choose **New File**, and name it exactly `.env`.
5. Open the `.env` file, paste the following text, and replace `PASTE_YOUR_KEY_HERE` with your key:
   ```env
   GEMINI_API_KEY=PASTE_YOUR_KEY_HERE
   GEMINI_MODEL=gemini-3-flash
   ```
6. Save the file (`Ctrl + S` or `Cmd + S`).

---

### Step 4: Run the App on your Laptop
1. In the VS Code terminal window, paste this command and press **Enter**:
   ```bash
   npm run install-all
   ```
   *(This downloads all backend and frontend packages. It may take 1-2 minutes.)*
2. Once installed, start the **Backend Server**:
   ```bash
   cd server && npm run dev
   ```
3. Open a **second terminal** in VS Code (click the `+` icon on the right side of the terminal panel header).
4. Run the **Frontend Interface**:
   ```bash
   cd client && npm run dev
   ```
5. Open your web browser (Chrome/Edge) and go to: **`http://localhost:5173`**

---

### Step 5: How to Deploy to the Cloud (Free)
Hosting the app on **Render** lets you open the link and practice on your mobile phone without needing your laptop active.

1. Create a free account at [github.com](https://github.com/) and create a new **Private** repository named `Language-Tutor`.
2. Copy your repository link (e.g. `https://github.com/your-username/Language-Tutor.git`).
3. Stop your local servers in VS Code by pressing `Ctrl + C` in both terminals, and run:
   ```bash
   git remote set-url origin https://github.com/YOUR_USERNAME/Language-Tutor.git
   git branch -M main
   git push -u origin main
   ```
4. Create a free account at [render.com](https://render.com/).
5. Click **New +** -> **Web Service** -> connect your repository.
6. Set the configuration options:
   - **Name:** `japanese-tutor`
   - **Runtime:** `Node`
   - **Build Command:** `npm run install-all && npm run build`
   - **Start Command:** `npm start`
7. Click **Advanced** -> **Add Environment Variable**:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** *(Paste your Google Gemini API key)*
8. Click **Deploy Web Service**. Once Render finishes building, it will give you a permanent web link to use on your phone!
