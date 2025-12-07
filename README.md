
# 🛡️ AI Bug Bounty Hunter

<div align="center">

![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Tech](https://img.shields.io/badge/Built%20With-TypeScript-blue?style=for-the-badge&logo=typescript)

<br/>

**The Autonomous Security Analyst that never sleeps.**
<br/>
*Context-aware crawling. Intelligent exploitation. Graph-based knowledge.*

[View Demo](#-screenshots) • [Report Bug](https://github.com/singhalmridul/ai-bug-bounty-hunter/issues) • [Request Feature](https://github.com/singhalmridul/ai-bug-bounty-hunter/issues)

</div>

---

## 📖 About

**AI Bug Bounty Hunter** is not just another vulnerability scanner. It is an agentic AI system designed to mimic the intuition and methodology of a human security researcher.

Traditional scanners rely on regex and rigid rule sets, often missing complex business logic vulnerabilities or drowning you in false positives. **AI Bug Bounty Hunter** leverages **LLMs (GPT-4 Turbo)** to understand the *semantics* of a web application. It navigates dynamically, understands authentication flows, and creates targeted payloads based on the specific context of the page components.

Backed by a **Neo4j Graph Database**, it builds a comprehensive map of your application's attack surface, enabling it to visualize relationships between diverse assets and uncover deep-rooted security flaws.

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **🧠 Agentic AI Core** | Powered by OpenAI, the crawler "thinks" before it acts, crafting bespoke payloads for XSS, SQLi, and logic bugs. |
| **🕸️ Graph Knowledge Base** | All findings, assets, and relationships are stored in **Neo4j**, allowing for complex relationship analysis. |
| **⚡ Real-Time Console** | Watch the scanner working in real-time with a dedicated execution console and live dashboard updates. |
| **🎨 Premium UI** | A fully responsive, glassmorphism-inspired dashboard built with **React** and **TailwindCSS**. |
| **📄 Automated Reporting** | One-click PDF report generation suitable for bug bounty submissions or executive summaries. |
| **🔄 Smart Queuing** | Robust job management using **BullMQ** and **Redis** ensures scalable and reliable scanning. |

## 🏗️ Architecture

```mermaid
graph TD
    Client[React Frontend] -->|REST API| API[Fastify Backend]
    API -->|Jobs| Queue[Redis BullMQ]
    Queue -->|Process| Worker[Crawler Service]
    Worker -->|Control| Browser[Playwright Engine]
    Worker -->|Analyze| AI[OpenAI LLM]
    Worker -->|Store| DB[(Neo4j Graph DB)]
    API -->|Query| DB
    API -->|Persist| PG[(Postgres DB)]
```

## 🛠️ Technology Stack

*   **Frontend**: React, TypeScript, TailwindCSS, Lucide React
*   **Backend**: Fastify, Node.js, Prisma
*   **AI/ML**: OpenAI GPT-4 Turbo
*   **Database**: Neo4j (Graph), PostgreSQL (Relational)
*   **Infrastructure**: Docker, Redis

## 🚀 Getting Started

### Prerequisites
*   Docker & Docker Compose
*   Node.js 18+
*   OpenAI API Key

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

4.  **Install & Run**
    ```bash
    npm install
    npx playwright install
    npm run dev
    ```

5.  **Access the App**
    *   **Frontend**: `http://localhost:5173`
    *   **Backend**: `http://localhost:3000`

## 📸 Screenshots

<div align="center">
  <img src="/Users/singhalmridul/.gemini/antigravity/brain/5c460254-cd17-4794-8125-0395ecfe0622/uploaded_image_1765139209724.png" alt="Findings Dashboard" width="800" style="border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"/>
  <p><em>Real-time Vulnerability Findings</em></p>
</div>

## 🤝 Contributing

We welcome contributions from the community!
1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
