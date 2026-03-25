# BugTrace — AI-Powered Code Reviewer

BugTrace is a full-stack AI platform that analyzes your source code for bugs, suggesting fixes, rating code quality, and auto-generating documentation. Think of it as having a senior developer review your code 24/7.

## ✨ Core Features
- **Bug Detection:** AI identifies critical errors, logic flaws, and potential runtime crashes.
- **Smart Suggestions:** Get "Before & After" code blocks showing how to improve your logic.
- **Quality Score:** Every review gives you a 1-10 score based on modern best practices.
- **Auto-Documentation:** Generates human-readable summaries of what your code actually does.
- **GitHub Integration:** Analyze public repositories directly from a URL.
- **Modern UI:** Responsive, dark-themed glassmorphism design with sleek animations.

## 🛠️ Tech Stack
- **Frontend:** React + Vite (Pure CSS design system)
- **Backend:** Node.js + Express
- **AI:** Google Gemini 2.0 Flash (with 4-model fallback chain)
- **Database:** PostgreSQL (Neon)
- **Auth:** Google OAuth 2.0 + JWT

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A Neon PostgreSQL account
- Google Gemini API Key

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/CyberScythe1/BugTrace.git
   cd BugTrace
   ```

2. Setup the Backend:
   ```bash
   cd backend
   npm install
   # Create a .env file with your credentials (PORT, DATABASE_URL, GEMINI_API_KEY, GOOGLE_CLIENT_ID, etc.)
   node src/config/initDb.js
   node server.js
   ```

3. Setup the Frontend:
   ```bash
   cd ../frontend
   npm install
   # Create a .env file with VITE_GOOGLE_CLIENT_ID and VITE_API_URL
   npm run dev
   ```

## 📄 License
MIT
