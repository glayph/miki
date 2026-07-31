# ReAct Orchestration Engine Specification

The **ReAct Engine** (Reasoning + Acting) is the core algorithmic kernel of the Miki Agent Framework. It implements an autonomous loop that interleaves chain-of-thought reasoning with real-time tool execution.

---

## 1. Core Execution Loop Architecture

The Miki ReAct engine executes in a closed feedback loop consisting of three discrete phases:

```
┌─────────────────────────────────────────────────────────────┐
│                       User Goal                             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: Thought (Internal Model Reflection & Planning)      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Phase 2: Action (Tool Selection & Parameter Extraction)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Phase 3: Observation (Environment Feedback & Memory Sync)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
               [Goal Satisfied? Yes -> Return / No -> Loop]
```

### 1.1 Phase Definitions

1. **Thought**: The LLM analyzes the current goal, conversation history, and SQLite episodic memory to decide the next logical step.
2. **Action**: The model outputs a structured JSON action payload containing the target `tool_name` and typed `parameters`.
3. **Observation**: The Miki runtime intercepts the action, invokes the corresponding `ISkillPlugin` or local system tool, and captures the stdout/stderr return values into the observation stack.

---

## 2. Token Cost & Optimization Parameters

Miki includes built-in token budgeting and context pruning mechanisms to prevent context window explosion during long-running tasks.

| Parameter | Default Value | Description |
| :--- | :--- | :--- |
| `max_iterations` | `15` | Maximum ReAct loop cycles before forced termination |
| `max_token_budget` | `32,000` | Soft limit on accumulated prompt + completion tokens |
| `observation_truncation_bytes` | `8,192` | Max raw output size per tool response before summary compression |
| `temperature_decay_rate` | `0.05` | Progressive reduction in sampling temperature for deterministic retries |

---

## 3. TypeScript Engine Code Snippet

```typescript
import { ReActEngine, MemoryDriver } from 'miki/core';

const memory = new MemoryDriver({ dbPath: './data/miki_memory.db' });
const engine = new ReActEngine({
  model: 'gemini-2.5-flash',
  maxIterations: 15,
  memoryDriver: memory
});

const result = await engine.run({
  prompt: "Analyze server access logs and list top 5 IP addresses generating 500 errors."
});

console.log("Agent Final Output:", result.output);
console.log("Execution Cycles:", result.iterations);
```

---

## 4. Error Handling & Auto-Recovery

When a tool invocation fails during the **Action** phase:
1. The error output is captured as an **Observation** with status `tool_error`.
2. The ReAct engine injects a self-correction directive into the next **Thought** turn.
3. If 3 consecutive tool execution failures occur on the same step, Miki triggers fallback skill discovery via the Skill Marketplace.
