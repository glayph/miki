# Quickstart & Installation Guide

Welcome to **Miki** — the autonomous agentic framework designed for AI engineers and developers. This guide will walk you through setting up your first Miki agent project in under 2 minutes.

---

## Prerequisites

* **Node.js**: v18.0.0 or higher (or Bun v1.0+)
* **API Key**: Gemini API Key or local Ollama endpoint

---

## 1. Installation

Install the core package and the `@google/genai` SDK:

```bash
npm install miki @google/genai
```

Or using Yarn/PNPM/Bun:

```bash
bun add miki @google/genai
```

---

## 2. Environment Setup

Create a `.env` file in your root project directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
MIKI_MEMORY_DB=./data/miki_memory.db
DISABLE_MIKI_TELEMETRY=0
```

---

## 3. Creating Your First Agent

Create a file named `agent.ts`:

```typescript
import { MikiAgent } from 'miki';
import { GoogleGenAI } from '@google/genai';

const agent = new MikiAgent({
  name: "CodeAssistant",
  model: "gemini-2.5-flash",
  memoryPath: "./data/miki_memory.db"
});

const response = await agent.run({
  prompt: "Inspect package.json and summarize total project dependencies."
});

console.log("Agent Thought Process:\n", response.thoughts);
console.log("Final Answer:\n", response.output);
```

---

## 4. Running the Dev Server

Execute using `tsx` or `ts-node`:

```bash
npx tsx agent.ts
```

Output:
```
[Miki ReAct] Phase 1: Thought -> Need to read package.json file.
[Miki ReAct] Phase 2: Action  -> Calling tool: read_file({ path: "package.json" })
[Miki ReAct] Phase 3: Observe -> Successfully read 36 lines.
[Miki ReAct] Final Output    -> Dependencies count: 8 runtime, 7 dev.
```
