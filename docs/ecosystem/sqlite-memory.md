# SQLite Layered Memory Driver Specification

The **SQLite Layered Memory Driver** provides zero-latency, local WAL (Write-Ahead Logging) storage for Miki agent conversation state, episodic recall, and vector embeddings.

---

## 1. Memory Tier Architecture

Miki structures agent memory into three distinct operational layers:

```
┌─────────────────────────────────────────────────────────────┐
│ Tier 1: Working Memory (In-Memory React State Stack)        │
└──────────────────────────────┬──────────────────────────────┘
                               │ Flushing
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Tier 2: Episodic Memory (Local SQLite WAL Database)        │
└──────────────────────────────┬──────────────────────────────┘
                               │ Semantic Indexing
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ Tier 3: Vector Memory (SQLite FTS5 + Vector-Lite Index)    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Database Initialization & Schema

```sql
-- Core Episodic Turns Table
CREATE TABLE IF NOT EXISTS agent_turns (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  step_number INTEGER NOT NULL,
  thought TEXT,
  action_tool TEXT,
  action_args TEXT,
  observation TEXT,
  token_cost INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_session_step ON agent_turns(session_id, step_number);
```

---

## 3. Usage & Memory Driver Config

```typescript
import { SqliteMemoryDriver } from 'miki/memory/sqlite';

const memory = new SqliteMemoryDriver({
  filename: './data/miki_memory.db',
  walMode: true,
  maxHistoryTurns: 50,
  enableVectorSearch: true
});

await memory.initialize();
```
