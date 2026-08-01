import { SkillItem } from '../types';

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

  cliBoot: `$ git clone https://github.com/glayph/Agent.git
$ cd Agent && npm install
$ npm run build # Outputs 100% static SPA to /dist for GitHub Pages deployment
$ npx serve dist # Local preview

[AGENT] 100% Frontend ReAct Engine active
[AGENT] GitHub Pages deployment: gh-pages or GitHub Actions ready
[AGENT] Connected memory driver: IndexedDB / SQLite (client-side)
[AGENT] Loaded 6 active skill plugins (OpenClaw & Hermes bridges READY)`
};

export const QUICKSTART_DOCS = [
  {
    id: 'install',
    title: '1. Clone Repository & Install',
    code: `git clone https://github.com/glayph/Agent.git
cd Agent
npm install`
  },
  {
    id: 'build',
    title: '2. Build & Deploy to GitHub Pages',
    code: `# Build static SPA bundle for GitHub Pages hosting
npm run build

# Push to your GitHub repo to trigger auto-deployment workflow (.github/workflows/deploy.yml)
git add .
git commit -m "Deploy Agent frontend to GitHub Pages"
git push origin main`
  },
  {
    id: 'run',
    title: '3. Execute Client-Side ReAct Task',
    code: `import { createAgent } from "miki";

const agent = createAgent({
  name: "glayph-agent-client",
  memory: { driver: "client-sqlite" },
  skills: ["browser", "web-search"],
});

const result = await agent.run("Summarize latest tech trends");
console.log("Status:", result.status);
console.log("Output:", result.output);`
  }
];
