import { INITIAL_SKILLS } from '../data/mikiContent';
import { SkillItem, SystemHealth, AgentRunResponse, AgentRunStep } from '../types';

const STORAGE_KEY_SKILLS = 'miki_installed_skills';
const sessionStartTime = Date.now();

// Helper to get stored skills or initial catalog
export function getSkillsMarketplace(): SkillItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SKILLS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading skills from localStorage:', err);
  }
  // Fallback to initial
  return INITIAL_SKILLS;
}

// Toggle skill install status and persist locally
export function toggleSkillInstall(skillId: string, install?: boolean): SkillItem | null {
  const currentSkills = getSkillsMarketplace();
  let updatedSkill: SkillItem | null = null;

  const nextSkills = currentSkills.map(skill => {
    if (skill.id === skillId) {
      const newInstalled = install !== undefined ? install : !skill.installed;
      updatedSkill = { ...skill, installed: newInstalled };
      return updatedSkill;
    }
    return skill;
  });

  try {
    localStorage.setItem(STORAGE_KEY_SKILLS, JSON.stringify(nextSkills));
  } catch (err) {
    console.error('Error persisting skills to localStorage:', err);
  }

  return updatedSkill;
}

// Get system health telemetry
export function getSystemHealth(): SystemHealth {
  const uptimeSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
  const skills = getSkillsMarketplace();
  const activeSkillsCount = skills.filter(s => s.installed).length;

  return {
    status: 'operational',
    version: '1.4.2-release',
    uptimeSeconds,
    activeAgents: 14,
    activeSkillsCount,
    memoryUsageMb: 128 + Math.floor((uptimeSeconds % 60) * 0.8),
    lastHeartbeat: new Date().toISOString(),
    clusterNodes: 3,
    avgLatencyMs: 42 + Math.floor(Math.random() * 8)
  };
}

// Client-side ReAct Execution Engine
export async function runAgentTask(prompt: string, agentName: string = 'miki-client-demo'): Promise<AgentRunResponse> {
  const startTime = Date.now();
  const runId = 'run_' + Math.random().toString(36).substring(2, 10);

  const steps: AgentRunStep[] = [];

  // Step 1: Initial Thought
  steps.push({
    step: 1,
    timestamp: new Date().toISOString(),
    type: 'thought',
    content: `Received task: "${prompt}". Parsing constraints, initializing browser SQLite memory driver, and selecting active tools.`,
    latencyMs: 15
  });

  // Brief async delay for realistic UI execution simulation
  await new Promise(resolve => setTimeout(resolve, 300));

  // Step 2: Skill Check & Action
  const promptLower = prompt.toLowerCase();
  const needsWeb = promptLower.includes('news') || promptLower.includes('search') || promptLower.includes('web') || promptLower.includes('summarize');

  if (needsWeb) {
    steps.push({
      step: 2,
      timestamp: new Date().toISOString(),
      type: 'action',
      content: 'Invoking Chromium Browser Tool to query live web targets.',
      tool: 'browser_automation',
      code: `const page = await browser.newPage();\nawait page.goto('https://news.ycombinator.com');`,
      latencyMs: 140
    });

    await new Promise(resolve => setTimeout(resolve, 300));

    steps.push({
      step: 3,
      timestamp: new Date().toISOString(),
      type: 'observation',
      content: 'Browser extracted top articles and technical headlines. Storing raw DOM payload into local IndexedDB/SQLite short-term memory.',
      latencyMs: 85
    });
  } else {
    steps.push({
      step: 2,
      timestamp: new Date().toISOString(),
      type: 'action',
      content: 'Executing ReAct step in client browser runtime environment.',
      tool: 'react_kernel',
      code: `const memoryState = await memory.query("SELECT * FROM short_term LIMIT 5");`,
      latencyMs: 60
    });
  }

  await new Promise(resolve => setTimeout(resolve, 300));

  // Step 3: Check if Auto-acquisition is needed
  if (promptLower.includes('openclaw') || promptLower.includes('hermes') || promptLower.includes('install')) {
    steps.push({
      step: steps.length + 1,
      timestamp: new Date().toISOString(),
      type: 'skill_acquisition',
      content: "Capability gap detected: Miki Marketplace Auto-Acquisition triggered. Installing skill plugin: 'openclaw-bridge-v1.1'.",
      tool: 'marketplace_auto_install',
      latencyMs: 110
    });
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  // Synthesize response output
  const finalOutput = `[Miki Client-Side ReAct Engine]

Task completed for: "${prompt}"

• ReAct Execution Loop completed in ${steps.length} iterations.
• Layered Memory: IndexedDB vector-lite local WAL storage active.
• Action Result: Processed query successfully without server backend.
• Skills Engaged: ${needsWeb ? 'Chromium Automation, Web Scraper' : 'ReAct Core Kernel, Local Memory'}.`;

  const totalTime = Date.now() - startTime;

  // Final Step: Result
  steps.push({
    step: steps.length + 1,
    timestamp: new Date().toISOString(),
    type: 'result',
    content: 'Task completed. Final output generated.',
    latencyMs: totalTime
  });

  return {
    runId,
    status: 'completed',
    agentName,
    prompt,
    output: finalOutput,
    steps,
    skillsUsed: ['ReAct Orchestration Kernel', 'Layered Client Memory', needsWeb ? 'Chromium Browser Tool' : 'Code Interpreter'],
    executionTimeMs: totalTime
  };
}
