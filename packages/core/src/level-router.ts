import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { streamAgentResponse } from "./channels/agent-response.js";
import type { AgentOrchestrator } from "./agent.js";

export const MIKI_TASK_LEVELS = [
  "normal",
  "adaptive",
  "low",
  "medium",
  "high",
  "extra",
  "max",
  "turbo",
] as const;

export type MikiTaskLevel = (typeof MIKI_TASK_LEVELS)[number];

export interface MikiGoalRequest {
  goal: string;
  level?: MikiTaskLevel;
  sessionId?: string;
}

export interface AdaptiveExecutionPlan {
  level: MikiTaskLevel;
  estimatedMinutes: number;
  maxRunMinutes: number;
  milestoneCount: number;
  checkpointEveryTurns: number;
  sameContextContinuation: boolean;
  rationale: string;
}

export interface MikiLevelRunResult {
  ok: boolean;
  level: MikiTaskLevel;
  plan: AdaptiveExecutionPlan;
  goal: string;
  sessionId: string;
  response: string;
  startedAt: string;
  finishedAt: string;
  error?: string;
}

const LEVEL_PATTERNS: Array<[MikiTaskLevel, RegExp]> = [
  ["turbo", /\bturbo(?:[- ]level)?\b|failure injection|debug lfs/i],
  ["max", /\bmax(?:[- ]level)?\b|\blfs\b|large file storage/i],
  [
    "extra",
    /\bextra(?:[- ]level)?\b|polished web app|web app with login|full[- ]stack|authenticated website/i,
  ],
  [
    "high",
    /\bhigh(?:[- ]level)?\b|deep research|multi-step|investigate|migrate/i,
  ],
  [
    "medium",
    /\bmedium(?:[- ]level)?\b|\bbuild\b|\bimplement\b|integrate|deploy|project|application/i,
  ],
  ["low", /\blow(?:[- ]level)?\b|\bfile\b|shell|simple automation|run a test/i],
  ["adaptive", /adaptive|decide|choose|compare|recommend/i],
];

export function inferMikiTaskLevel(goal: string): MikiTaskLevel {
  const normalized = goal.trim();
  for (const [level, pattern] of LEVEL_PATTERNS) {
    if (pattern.test(normalized)) return level;
  }
  return "normal";
}

export function resolveMikiTaskLevel(
  goal: string,
  requested?: MikiTaskLevel,
): MikiTaskLevel {
  return requested ?? inferMikiTaskLevel(goal);
}

const BASE_ADAPTIVE_PLANS: Record<
  MikiTaskLevel,
  Omit<AdaptiveExecutionPlan, "level" | "rationale">
> = {
  normal: {
    estimatedMinutes: 1,
    maxRunMinutes: 5,
    milestoneCount: 1,
    checkpointEveryTurns: 8,
    sameContextContinuation: true,
  },
  adaptive: {
    estimatedMinutes: 5,
    maxRunMinutes: 15,
    milestoneCount: 2,
    checkpointEveryTurns: 8,
    sameContextContinuation: true,
  },
  low: {
    estimatedMinutes: 10,
    maxRunMinutes: 20,
    milestoneCount: 2,
    checkpointEveryTurns: 10,
    sameContextContinuation: true,
  },
  medium: {
    estimatedMinutes: 30,
    maxRunMinutes: 60,
    milestoneCount: 4,
    checkpointEveryTurns: 12,
    sameContextContinuation: true,
  },
  high: {
    estimatedMinutes: 60,
    maxRunMinutes: 120,
    milestoneCount: 6,
    checkpointEveryTurns: 10,
    sameContextContinuation: true,
  },
  extra: {
    estimatedMinutes: 120,
    maxRunMinutes: 240,
    milestoneCount: 8,
    checkpointEveryTurns: 8,
    sameContextContinuation: true,
  },
  max: {
    estimatedMinutes: 180,
    maxRunMinutes: 360,
    milestoneCount: 10,
    checkpointEveryTurns: 8,
    sameContextContinuation: true,
  },
  turbo: {
    estimatedMinutes: 90,
    maxRunMinutes: 180,
    milestoneCount: 8,
    checkpointEveryTurns: 8,
    sameContextContinuation: true,
  },
};

/**
 * Selects an internal work budget from the request itself. This is deliberately
 * not a UI-facing Goal setting: ordinary chat calls this planner automatically.
 */
export function buildAdaptiveExecutionPlan(
  goal: string,
  requested?: MikiTaskLevel,
): AdaptiveExecutionPlan {
  const level = resolveMikiTaskLevel(goal, requested);
  const base = BASE_ADAPTIVE_PLANS[level];
  const normalized = goal.trim();
  const words = normalized ? normalized.split(/\s+/).length : 0;
  const signals = [
    /\b(and|then|after|also|with|including)\b/i.test(normalized),
    /\b(test|verify|validate|document|screenshot|archive|release)\b/i.test(
      normalized,
    ),
    /\b(auth|login|database|backend|frontend|api|deploy|github|linux|windows)\b/i.test(
      normalized,
    ),
    words > 80,
  ].filter(Boolean).length;
  const complexityMultiplier = Math.min(1.75, 1 + signals * 0.15);
  const estimatedMinutes = Math.max(
    base.estimatedMinutes,
    Math.ceil(base.estimatedMinutes * complexityMultiplier),
  );
  const maxRunMinutes = Math.max(
    base.maxRunMinutes,
    Math.ceil(estimatedMinutes * 1.75),
  );
  const milestoneCount = Math.max(
    base.milestoneCount,
    base.milestoneCount + Math.min(3, Math.floor(signals / 2)),
  );
  const rationale =
    signals === 0
      ? `Selected ${level} from the request language and scope.`
      : `Selected ${level}; added ${signals} complexity signal${signals === 1 ? "" : "s"} for dependencies, verification, or scope breadth.`;
  return {
    level,
    estimatedMinutes,
    maxRunMinutes,
    milestoneCount,
    checkpointEveryTurns: base.checkpointEveryTurns,
    sameContextContinuation: true,
    rationale,
  };
}

export function buildMikiExecutionPrompt(
  goal: string,
  level?: MikiTaskLevel,
): string {
  const plan = buildAdaptiveExecutionPlan(goal, level);
  return [
    "You are Agent Miki. Execute the user's goal yourself through your registered tools and runtime.",
    `Adaptive execution plan: level=${plan.level}; estimated work=${plan.estimatedMinutes} minutes; safe run budget=${plan.maxRunMinutes} minutes; milestones=${plan.milestoneCount}; checkpoint every ${plan.checkpointEveryTurns} tool turns.`,
    `Execution level: ${plan.level}.`,
    plan.rationale,
    "This plan was selected automatically from ordinary chat. Never ask the user to create or choose a Goal, level, duration, milestone, or checkpoint.",
    "Do not merely explain how the user could do it. Plan the work internally, perform the permitted steps, verify the result, and report what changed.",
    "Work in bounded milestones. At every checkpoint, preserve useful state and continue in this same conversation/session automatically; do not restart completed work or ask for confirmation unless an approval policy requires it.",
    "Use the lowest-cost capable route first: deterministic tools or a local model before a remote provider. Do not invent credentials, model IDs, files, or successful results.",
    "If a required capability, permission, credential, dependency, or user approval is missing, stop at that boundary and report the exact limitation, cause, enabling change, and next safe action.",
    "Record failures and useful improvements in the durable Report/capability workflow when that tool is available.",
    "Never silently perform destructive or externally visible actions without the configured approval policy.",
    "",
    `User request:\n${goal.trim()}`,
  ].join("\n");
}

function redactJournalText(value: string): string {
  return value
    .replace(
      /(api[_-]?key|token|secret|password)\s*[:=]\s*[^\s,;]+/gi,
      "$1=[REDACTED]",
    )
    .slice(0, 12000);
}

async function persistLevelRun(record: Record<string, unknown>): Promise<void> {
  try {
    const runtimeRoot =
      process.env.MIKI_RUNTIME_ROOT || path.join(process.cwd(), "runtime");
    const reportDir = path.join(runtimeRoot, "data", "reports");
    await mkdir(reportDir, { recursive: true });
    await appendFile(
      path.join(reportDir, "level-runs.jsonl"),
      `${JSON.stringify(record)}\n`,
      { encoding: "utf8", mode: 0o600 },
    );
  } catch {
    // Journaling must never make a user goal appear to fail. The health/report
    // surfaces can flag missing persistence separately.
  }
}

const ORDINARY_GOAL_PATTERNS = [
  /^(?:please\s+)?(?:build|create|make|fix|debug|run|research|analy[sz]e|implement|write|update|test|inspect|check|set\s+up|download|deploy)\b/i,
  /\b(for me|নিজে|করো|বানাও|তৈরি করো|চালাও|পরীক্ষা করো|ঠিক করো)\b/i,
];

export function shouldTreatOrdinaryMessageAsGoal(message: string): boolean {
  const normalized = message.trim();
  if (normalized.length < 12) return false;
  if (/^(?:hi|hello|hey|what is|who are you|how are you)\b/i.test(normalized)) {
    return false;
  }
  return ORDINARY_GOAL_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function prepareOrdinaryChatMessage(message: string): string {
  const normalized = message.trim();
  if (!shouldTreatOrdinaryMessageAsGoal(normalized)) return message;
  return buildMikiExecutionPrompt(normalized);
}

export async function executeGoalThroughMiki(
  orchestrator: AgentOrchestrator,
  request: MikiGoalRequest,
  onText?: (text: string) => Promise<void> | void,
): Promise<MikiLevelRunResult> {
  const goal = request.goal.trim();
  if (!goal) throw new Error("goal is required");
  const plan = buildAdaptiveExecutionPlan(goal, request.level);
  const level = plan.level;
  const sessionId = request.sessionId?.trim() || `miki-level:${Date.now()}`;
  const startedAt = new Date().toISOString();
  try {
    const response = await streamAgentResponse(
      orchestrator,
      sessionId,
      buildMikiExecutionPrompt(goal, level),
      onText ?? (() => undefined),
      Math.max(24000, plan.maxRunMinutes * 60 * 1000),
    );
    const finishedAt = new Date().toISOString();
    await persistLevelRun({
      ok: true,
      level,
      plan,
      goal: redactJournalText(goal),
      sessionId,
      response: redactJournalText(response),
      startedAt,
      finishedAt,
    });
    return {
      ok: true,
      level,
      plan,
      goal,
      sessionId,
      response,
      startedAt,
      finishedAt,
    };
  } catch (error) {
    const finishedAt = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.message : String(error);
    await persistLevelRun({
      ok: false,
      level,
      plan,
      goal: redactJournalText(goal),
      sessionId,
      response: "",
      startedAt,
      finishedAt,
      error: redactJournalText(errorMessage),
    });
    return {
      ok: false,
      level,
      plan,
      goal,
      sessionId,
      response: "",
      startedAt,
      finishedAt,
      error: errorMessage,
    };
  }
}
