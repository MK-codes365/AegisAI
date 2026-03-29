# AegisAI 🛡️ 
### The Intelligence Layer for Modern Support Operations

**AegisAI** is a high-performance, AI-native support platform designed to transition support from reactive ticket-handling to proactive incident management. By leveraging Amazon Bedrock and Comprehend, AegisAI automatically clusters related support issues into **Master Incidents**, enabling support teams to resolve hundreds of tickets with a single click.

![AegisAI Dashboard](file:///C:/Users/mukui/.gemini/antigravity/brain/49262967-fe7e-4363-a0b8-86632d6136ef/media__1774798594892.png)

## ✨ Unique Features

*   **🧠 AI Master Incident Clustering**: Real-time pattern detection that groups related tickets into single "Master Incidents" based on root-cause analysis (e.g., detecting a regional API timeout across 50 individual reports).
*   **⚡ Resilient Architecture**: A custom-built network resilience engine that handles transient AWS connectivity issues (`ETIMEDOUT`) using an in-memory "Last Known Good" cache and optimistic UI updates.
*   **🎭 Multi-Dimensional Sentiment Analysis**: Deep integration with Amazon Comprehend to detect customer frustration levels, triggering automated escalations before a ticket even reaches an agent.
*   **📍 Intelligent Routing**: Automated assignment to specialized agents based on AI-classified categories and urgency levels.
*   **💎 Morphic UI Design**: A state-of-the-art glassmorphism dashboard with neon-glowing alerts, smooth micro-animations, and real-time AI insight cards.

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, Lucide Icons, Recharts (Modern UI/UX)
- **Backend**: Node.js, Express, DynamoDB
- **AI/ML**: Amazon Bedrock (Nova 2 Lite), Amazon Comprehend
- **Infrastructure**: AWS SDK v3, Region-Aware Configuration

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- AWS Credentials (with Bedrock & Comprehend access)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/MK-codes365/AegisAI.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables (`.env`):
   ```env
   AWS_REGION=ca-central-1
   BEDROCK_MODEL_ID=us.amazon.nova-2-lite-v1:0
   PORT=3001
   ```
4. Run the development environment:
   ```bash
   npm run dev    # Starts the React Frontend
   npm run server # Starts the AI Backend
   ```

---
*Built with passion for the next generation of Customer Success.*
