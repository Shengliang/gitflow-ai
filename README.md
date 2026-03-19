# GitFlow AI: Auto-Merge Orchestrator

**Primary License:** [MIT License](./LICENSE) (Visible and Detectable)

GitFlow AI is an intelligent orchestrator for GitLab and GitHub workflows, designed for the **GitLab AI Hackathon 2026**. It automates complex merge strategies, resolves semantic conflicts using Gemini 3.1 Pro, and manages bi-weekly release cycles with high-precision AI diagnostics.

## 🚀 Features

- **AI-Powered Merge Queues:** Orchestrate PR merges using Binary Tree or FIFO Batching strategies.
- **Semantic Conflict Resolution:** Gemini-driven analysis to resolve non-trivial code conflicts based on intent.
- **Project-to-Master Sync:** Automated final-stage integration with full regression validation.
- **Priority-Based Queuing:** High-priority lanes for critical bug fixes and emergency patches.
- **Live AI Presentation:** A multimodal demo agent that explains the architecture and workflow in real-time.
- **Local CLI Integration:** A terminal-based interface for developers to interact with the AI orchestrator.

## 🛠️ Tech Stack

- **Frontend:** React 18, Tailwind CSS, Motion (framer-motion).
- **Backend:** Node.js, Express, Vite Middleware.
- **Database:** Firebase Firestore (Real-time state synchronization).
- **AI Engine:** Google Gemini 3.1 Pro (via `@google/genai`).
- **Icons:** Lucide React.

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://gitlab.com/gitlab-ai-hackathon/gitflow-ai.git
   cd gitflow-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_FIRESTORE_DATABASE_ID=your_firebase_firestore_database_id
   ```

4. **Firebase Setup:**
   The application uses Firebase Firestore for real-time state synchronization. Ensure all `VITE_FIREBASE_*` environment variables are correctly set.

5. **Run the development server:**
   ```bash
   npm run dev
   ```

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for the full text.

## 🤝 GitLab AI Hackathon 2026

This project was built for the **AI Productivity Track** of the GitLab AI Hackathon.
**Submission URL:** [https://gitlab.com/gitlab-ai-hackathon/gitflow-ai](https://gitlab.com/gitlab-ai-hackathon/gitflow-ai)
