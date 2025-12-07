# 🛡️ AI Bug Bounty Hunter

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-MVP%20Complete-success.svg)
![Stack](https://img.shields.io/badge/stack-React%20|%20Node%20|%20Neo4j%20|%20OpenAI-purple.svg)

**Autonomous vulnerability scanner powered by Agentic AI.**
AI Bug Bounty Hunter is a next-generation security tool that uses Large Language Models (LLMs) to intelligently crawl, analyze, and exploit web vulnerabilities in real-time. Unlike traditional scanners, it understands context, manages complex state, and reduces false positives by verifying findings.

---

## ✨ Key Features

- **🧠 AI-Driven Analysis**: Uses `GPT-4-Turbo` to generate context-aware attack payloads (XSS, SQLi, Auth Bypass).
- **🕸️ Graph Knowledge Base**: Powered by **Neo4j** to visualize relationships between pages, parameters, and vulnerabilities.
- **⚡ Real-Time Dashboard**: Live monitoring of scan progress, active agents, and findings.
- **📄 Professional Reporting**: Automated PDF generation for bug bounty submissions.
- **🔒 Secure Architecture**: Robust authentication (JWT + BCrypt) and job queueing (BullMQ + Redis).

## 🛠️ Technology Stack

- **Frontend**: React, Vite, TailwindCSS, Lucide Icons
- **Backend**: Fastify (Node.js), Prisma (Postgres)
- **Engine**: Playwright (Headless Browser), OpenAI API
- **Infrastructure**: Docker, Redis, Neo4j, PostgreSQL

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- OpenAI API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/singhalmridul/ai-bug-bounty-hunter.git
    cd ai-bug-bounty-hunter
    ```

2.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    OPENAI_API_KEY=sk-your-api-key
    DATABASE_URL="postgresql://admin:password@localhost:5432/bugbounty?schema=public"
    JWT_SECRET="dev-secret"
    REDIS_HOST="localhost"
    NEO4J_URI="bolt://localhost:7687"
    NEO4J_USER="neo4j"
    NEO4J_PASSWORD="password"
    ```

3.  **Start Infrastructure**
    ```bash
    docker-compose up -d
    ```

4.  **Start Services**
    ```bash
    npm install
    npm run dev
    ```

5.  **Access the App**
    -   Frontend: `http://localhost:5173`
    -   Backend API: `http://localhost:3000`

## 📸 Screenshots
*(Add screenshots of your dashboard here)*

## 🛣️ Roadmap

- [x] **MVP Goals**
    - [x] Proof of Concept Crawler
    - [x] Neo4j Integration
    - [x] Real-time Dashboard
    - [x] Authenticaton & Reporting
- [ ] **Future**
    - [ ] Cloud Deployment (AWS/GCP)
    - [ ] Exploit Verification Module
    - [ ] Multi-Modal Analysis (Images/Screenshots)

## 🤝 Contributing
Contributions are welcome! Please fork the repo and submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.
