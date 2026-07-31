# Skill Plugin Development Guide

Skills in Miki are modular, hot-reloadable plugins that extend agent execution capabilities.

---

## 1. The `ISkillPlugin` Interface

Every skill must implement the `ISkillPlugin` interface:

```typescript
export interface ISkillPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
  execute: (args: Record<string, any>, context: AgentContext) => Promise<any>;
}
```

---

## 2. Example: Custom Weather Skill

Create a file `skills/WeatherSkill.ts`:

```typescript
import { ISkillPlugin, AgentContext } from 'miki';

export const WeatherSkill: ISkillPlugin = {
  id: 'weather-fetcher',
  name: 'Weather Fetcher',
  version: '1.0.0',
  description: 'Fetches current weather conditions for any city.',
  parameters: {
    type: 'object',
    properties: {
      city: { type: 'string', description: 'City name (e.g. London, Tokyo)' }
    },
    required: ['city']
  },
  execute: async ({ city }) => {
    // Call external weather API or return mock data
    return {
      city,
      temperature: "22°C",
      condition: "Partly Cloudy",
      humidity: "65%"
    };
  }
};
```

---

## 3. Registering the Skill

```typescript
import { WeatherSkill } from './skills/WeatherSkill';

agent.registerSkill(WeatherSkill);
```
