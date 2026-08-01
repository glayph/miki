# Quickstart & GitHub Pages Deployment Guide

Welcome to **glayph/Agent** — the autonomous agentic framework designed for AI engineers and developers. This project is a **100% Client-Side Single Page Application (SPA)** that can be hosted directly on **GitHub Pages** (`github.com`) without any backend server required.

---

## 1. Cloning the Repository

To get started locally or fork for your own GitHub Pages deployment:

```bash
git clone https://github.com/glayph/Agent.git
cd Agent
npm install
```

---

## 2. Local Development & Preview

Start the Vite dev server:

```bash
npm run dev
```

Or build and preview the production static SPA bundle locally:

```bash
npm run build
npx serve dist
```

---

## 3. Hosting on GitHub Pages (`github.com`)

This repository is pre-configured with a GitHub Actions deployment workflow (`.github/workflows/deploy.yml`).

### Option A: Automatic Deployment via GitHub Actions (Recommended)
1. Push your repository to GitHub: `https://github.com/your-username/Agent.git`
2. Go to **Settings -> Pages** on your GitHub repository.
3. Under **Source**, select **GitHub Actions**.
4. Every time you push to `main` or `master`, your site will automatically build and deploy to `https://your-username.github.io/Agent/`.

### Option B: Manual Static Build & `gh-pages` Branch
```bash
npm run build
npx gh-pages -d dist
```

---

## 4. Creating & Running Agents Client-Side

Create a file named `agent.ts`:

```typescript
import { createAgent } from 'miki';

const agent = createAgent({
  name: "GlayphAgent",
  model: "gemini-2.5-flash",
  memoryDriver: "client-sqlite"
});

const response = await agent.run({
  prompt: "Inspect target data and summarize findings."
});

console.log("Agent Thought Process:\n", response.thoughts);
console.log("Final Answer:\n", response.output);
```
