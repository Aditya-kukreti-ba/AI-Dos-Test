<div align="center">

# ⬡ DOS Shield

### AI Security Testing Platform

**Stress-test and red-team large language models using AI-generated adversarial attacks**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-ai--dos--test.vercel.app-2dd4bf?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-dos-test.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)

</div>

---

## What is DOS Shield?

DOS Shield is a browser-based AI security testing tool that pits one language model against another. An **attacker model** dynamically generates adversarial prompts — never the same twice — and fires them at a **target model**, measuring how it degrades under different attack types. Every test produces a full PDF report with every prompt, every response, and all performance metrics.

**Live at → [ai-dos-test.vercel.app](https://ai-dos-test.vercel.app/)**

---

## Attack Modules

| Module | Description |
|---|---|
| 🌊 **Complex Prompt Flood** | Sends deeply nested, multi-layered prompts designed to overwhelm reasoning capacity |
| 🔥 **Token Exhaustion** | Crafts prompts that force maximum-length responses to drain token quotas |
| ⚡ **Batch Attack** | Fires concurrent request bursts to stress-test throughput and rate limiting |
| 🎯 **Model-Specific Exploit** | Generates adversarial prompts targeting instruction override, looping, and format breakdown |

---

## How It Works

```
Attacker Model                        Target Model
──────────────                        ────────────
Llama 4 Scout 17B          →          Llama 3.1 8B Instruct
  generates unique          fires       receives attack
  adversarial prompt  ───────────►     responds
                                       ↓
                               metrics recorded:
                               • response time
                               • tokens used
                               • success / error / timeout
```

1. **Select** an attacker model and a target model from 9 supported models
2. **Configure** attack type, number of requests, and mode (Auto or Manual)
3. **Launch** — the attacker model generates unique prompts in real time using seed pools and random variation
4. **Watch** live metrics update: latency, token consumption, error rate, response time chart
5. **Export** a full PDF report with dark theme, every prompt, and every model response

---

## Supported Models

| Model | Provider |
|---|---|
| Llama 3.1 8B Instruct | Cerebras |
| Llama 3.3 70B Instruct | Groq |
| Llama 4 Scout 17B | Groq |
| Qwen 2.5 72B Instruct | Novita |
| Qwen 2.5 Coder 7B | NScale |
| Qwen3 32B | Groq |
| DeepSeek R1 | SambaNova |
| DeepSeek V3 | Novita |
| Gemma 3 27B | Scaleway |

All models are accessed via the **[HuggingFace Router API](https://huggingface.co/docs/inference-providers)** — a single unified endpoint that routes requests to the right inference provider automatically.

> **Note:** A HuggingFace API key with available credits is required to run attacks. Add it in the dashboard settings.

---

## Tech Stack

- **React 19** + **TypeScript** — UI and type safety
- **Vite 7** — build tooling and dev proxy (handles CORS for HF API)
- **React Three Fiber** + **Three.js** — 3D animated hero scene
- **Framer Motion** — page transitions and reveal animations
- **React Router v7** — landing page + dashboard routing
- **jsPDF** + **jspdf-autotable** — PDF report generation
- **HuggingFace Router API** — model inference backend

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/Aditya-kukreti-ba/AI-Dos-Test.git
cd AI-Dos-Test

# Install dependencies
npm install

# Start the dev server (Vite proxy handles CORS automatically)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), enter your HuggingFace API key in the dashboard, and launch an attack.

> The Vite dev proxy rewrites `/hf-api/*` → `router.huggingface.co/*` to avoid CORS issues during development. In production, Vercel serves the built files directly and the API calls go to the router endpoint.

---

## Project Structure

```
src/
├── components/
│   ├── AttackConfig.tsx      # Attack configuration panel
│   ├── DOSShieldIcon.tsx     # SVG icon component
│   ├── MetricsPanel.tsx      # Live metrics display
│   ├── ModelSelector.tsx     # Model dropdown with provider badges
│   ├── ResponseLogPanel.tsx  # Expandable response log (click to reveal output)
│   ├── Scene3D.tsx           # Dashboard 3D background
│   └── Sidebar.tsx           # Dashboard navigation
├── hooks/
│   └── useAttackRunner.ts    # Core attack execution logic
├── landing/
│   ├── Hero.tsx
│   ├── HeroScene3D.tsx       # Animated particle + 3D hero background
│   └── Navbar.tsx
├── pages/
│   ├── LandingPage.tsx       # Marketing landing page (all sections)
│   ├── Home.tsx              # Dashboard overview
│   ├── PromptFlood.tsx
│   ├── TokenExhaustion.tsx
│   ├── BatchAttack.tsx
│   ├── ModelExploit.tsx
│   └── Reports.tsx           # Saved test history + PDF export
├── services/
│   ├── huggingface.ts        # HF Router API client + prompt generation
│   └── reportGenerator.ts   # PDF report builder
└── types/
    └── index.ts              # Shared TypeScript types
```

---

## PDF Reports

Every completed test can be exported as a styled PDF containing:

- Test configuration (attack type, models, mode)
- Full metrics table (latency, tokens, error rate, duration)
- Per-request log with the **full attack prompt** and the **full target model response**

Comparison reports across multiple test runs are also supported from the Reports page.

---

<div align="center">

Built with React, Three.js, and the HuggingFace Inference Router

**[▶ Try it live](https://ai-dos-test.vercel.app/)**

</div>