import { SkillItem, PricingPlan } from '../types';

export const INITIAL_SKILLS: SkillItem[] = [
  {
    id: 'skill-react-loop',
    name: 'ReAct Orchestration Kernel',
    description: 'Autonomous reasoning-and-action execution loop with step breakdown and retry logic.',
    category: 'reasoning',
    compatibility: ['Miki Native', 'OpenClaw', 'Hermes Agent'],
    version: '1.4.0',
    downloads: '24.8k',
    installed: true,
    author: 'miki-core',
    iconName: 'Workflow',
    codeSnippet: `import { createAgent, ReActKernel } from "miki";

const kernel = new ReActKernel({
  maxIterations: 12,
  reflection: true,
  strictOutputSchema: true
});`
  },
  {
    id: 'skill-sqlite-memory',
    name: 'Layered SQLite Memory Engine',
    description: 'Zero-latency vector-lite & relational short/long-term memory with auto-pruning and indexing.',
    category: 'memory',
    compatibility: ['Miki Native', 'OpenClaw'],
    version: '2.1.2',
    downloads: '18.3k',
    installed: true,
    author: 'miki-core',
    iconName: 'Database',
    codeSnippet: `import { SqliteMemoryDriver } from "miki/memory";

const memory = new SqliteMemoryDriver({
  path: "./data/miki_memory.db",
  decayFactor: 0.95,
  maxTokensPerContext: 8192
});`
  },
  {
    id: 'skill-playwright-browser',
    name: 'Chromium Browser Automation',
    description: 'Headless Chromium driver for real DOM interaction, screenshot extraction, and form fills.',
    category: 'automation',
    compatibility: ['Miki Native', 'OpenClaw', 'Hermes Agent'],
    version: '3.0.1',
    downloads: '31.2k',
    installed: true,
    author: 'miki-core',
    iconName: 'Globe',
    codeSnippet: `import { PlaywrightBrowserTool } from "miki/tools";

const browser = new PlaywrightBrowserTool({
  headless: true,
  stealth: true,
  viewport: { width: 1280, height: 800 }
});`
  },
  {
    id: 'skill-openclaw-bridge',
    name: 'OpenClaw Skill Adapter',
    description: 'Universal loader mapping OpenClaw JSON skills and tools seamlessly into Miki ISkillPlugin format.',
    category: 'bridge',
    compatibility: ['OpenClaw', 'Miki Native'],
    version: '1.1.0',
    downloads: '14.5k',
    installed: false,
    author: 'community/openclaw-devs',
    iconName: 'Link',
    codeSnippet: `import { loadOpenClawSkill } from "miki/bridges/openclaw";

const clawSkill = await loadOpenClawSkill("openclaw/github-prs");
agent.use(clawSkill);`
  },
  {
    id: 'skill-hermes-adapter',
    name: 'Hermes Agent Skill Bridge',
    description: 'Enables execution of Hermes Agent tools, function calling contracts, and schema validation.',
    category: 'bridge',
    compatibility: ['Hermes Agent', 'Miki Native'],
    version: '1.0.8',
    downloads: '9.7k',
    installed: false,
    author: 'community/hermes-devs',
    iconName: 'Cpu',
    codeSnippet: `import { HermesSkillAdapter } from "miki/bridges/hermes";

const hermesTool = new HermesSkillAdapter("hermes/terminal-runner");
agent.use(hermesTool);`
  },
  {
    id: 'skill-auto-acquisition',
    name: 'Skill Marketplace Auto-Acquisition',
    description: 'Mid-task capability gap detection: automatically queries registry, installs missing skill, and resumes.',
    category: 'developer',
    compatibility: ['Miki Native'],
    version: '1.2.0',
    downloads: '11.9k',
    installed: true,
    author: 'miki-core',
    iconName: 'Download',
    codeSnippet: `import { AutoSkillAcquisition } from "miki/marketplace";

agent.enableAutoAcquisition({
  registryUrl: "https://registry.miki.dev/v1",
  autoApproveFree: true
});`
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'community',
    name: 'Community',
    description: 'Open-source self-hosted framework for developers and local agent experimentations.',
    price: '$0',
    period: 'forever free',
    features: [
      'Self-hosted Core CLI & NPM packages',
      'Unlimited local ReAct orchestration',
      'SQLite layered memory driver',
      'Playwright browser automation driver',
      'OpenClaw & Hermes skill compatibility',
      'Community Discord & GitHub support'
    ],
    ctaText: 'Clone on GitHub'
  },
  {
    id: 'pro',
    name: 'Pro Cloud / Team',
    description: 'Managed agent runtime, telemetry dashboard, auto-scaling and hosted skill registry.',
    price: '$29',
    period: 'per seat / month',
    highlighted: true,
    badge: 'MOST POPULAR',
    features: [
      'Everything in Community',
      'Hosted Cloud Runtime on global edge',
      'Managed SQLite + Vector sync clusters',
      'Private Skill Registry & hot-reloading',
      'WebSockets streaming agent state',
      'Dedicated API Key management & RBAC',
      'Priority 24/7 technical support'
    ],
    ctaText: 'Start 14-Day Free Trial'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom deployment (VPC / On-Premise), SLA guarantees, and enterprise security compliance.',
    price: 'Custom',
    period: 'tailored plans',
    features: [
      'Dedicated Isolated VPC / Air-gapped runtime',
      'Unlimited multi-tenant agent instances',
      'Custom LLM providers & local fine-tuned models',
      'SOC2 Type II, HIPAA & ISO 27001 readiness',
      'Custom skill bridge engineering support',
      'Guaranteed 99.99% uptime SLA'
    ],
    ctaText: 'Contact Enterprise Team'
  }
];

export const HERO_CODE_SNIPPETS = {
  quickstart: `import { createAgent } from "miki";

const agent = createAgent({
  name: "miki-analyst",
  memory: { driver: "sqlite", path: "./memory.db" },
  skills: ["browser", "filesystem", "web-search"],
  llm: { provider: "openai", model: "gpt-4o" },
});

// ReAct loop with auto skill acquisition enabled
const result = await agent.run(
  "Summarize today's top AI news and save report to notes.md"
);

console.log(result.output);`,

  customSkill: `import { defineSkill, ISkillPlugin } from "miki/skills";

export const SqliteQuerySkill = defineSkill({
  id: "sqlite-query",
  version: "1.0.0",
  description: "Execute read-only SQL queries on SQLite DB",
  parameters: {
    query: { type: "string", description: "SQL query string" }
  },
  async execute({ query }, { memory }) {
    return await memory.db.query(query);
  }
});`,

  cliBoot: `$ npm i -g miki-cli
$ miki init my-agent
$ cd my-agent && miki start --port 3000

[MIKI] Server initialized on http://localhost:3000
[MIKI] Connected memory engine: SQLite (./data/miki.db)
[MIKI] Loaded 6 active skill plugins (OpenClaw bridge READY)
[MIKI] Listening for WebSocket & HTTP ReAct requests...`
};

export const QUICKSTART_DOCS = [
  {
    id: 'install',
    title: '1. Installation',
    code: `npm install miki @google/genai`
  },
  {
    id: 'init',
    title: '2. Create Agent Instance',
    code: `import { createAgent } from "miki";

const agent = createAgent({
  name: "miki-dev",
  memory: { driver: "sqlite", path: "./data/agent.db" },
  skills: ["browser", "web-search"],
});`
  },
  {
    id: 'run',
    title: '3. Execute ReAct Task',
    code: `const result = await agent.run("Find latest React 19 features and summarize");
console.log("Status:", result.status);
console.log("Output:", result.output);`
  }
];
