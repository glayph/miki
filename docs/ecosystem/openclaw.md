# OpenClaw Skill Adapter Specification

The **OpenClaw Skill Adapter** allows Miki agents to consume, map, and execute standard OpenClaw JSON skill definitions without modification.

---

## 1. Specification Overview

OpenClaw skills define declarative schemas for external tool invocation. Miki translates OpenClaw JSON manifests into standard `ISkillPlugin` TypeScript instances at runtime.

---

## 2. OpenClaw Skill Definition Schema

Example `openclaw-skill.json`:

```json
{
  "$schema": "https://openclaw.dev/schemas/v1/skill.json",
  "id": "github-pr-creator",
  "name": "GitHub Pull Request Creator",
  "version": "1.2.0",
  "description": "Creates pull requests with automated code reviews and branch management.",
  "parameters": {
    "type": "object",
    "properties": {
      "repo": { "type": "string", "description": "Repository in owner/repo format" },
      "title": { "type": "string", "description": "PR title string" },
      "head": { "type": "string", "description": "Feature branch name" },
      "base": { "type": "string", "default": "main" }
    },
    "required": ["repo", "title", "head"]
  },
  "execution": {
    "runtime": "node",
    "entry": "./index.js"
  }
}
```

---

## 3. Registering OpenClaw Skills in Miki

```typescript
import { OpenClawAdapter } from 'miki/adapters/openclaw';

const openclawPlugin = await OpenClawAdapter.fromJSONFile('./openclaw-skill.json');

agent.registerSkill(openclawPlugin);
```

---

## 4. Parameter Translation Engine

Miki automatically converts OpenClaw schema types into strict Zod schemas for runtime argument validation before sending requests to the ReAct model context.
