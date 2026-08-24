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

export interface MikiLevelRunResult {
  ok: boolean;
  level: MikiTaskLevel;
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
  ["extra", /\bextra(?:[- ]level)?\b|polished web app|web app with login/i],
  ["high", /\bhigh(?:[- ]level)?\b|deep research|multi-step/i],
  ["medium", /\bmedium(?:[- ]level)?\b|build|implement|integrate/i],
  ["low", /\blow(?:[- ]level)?\b|file|shell|simple automation/i],
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

export function buildMikiExecutionPrompt(
  goal: string,
  level: MikiTaskLevel,
): string {
  return [
    "You are Agent Miki. Execute the user's goal yourself through your registered tools and runtime.",
    `Execution level: ${level}.`,
    "Do not merely explain how the user could do it. Plan the work, perform the permitted steps, verify the result, and report what changed.",
    "Use the lowest-cost capable route first: deterministic tools or a local model before a remote provider. Do not invent credentials, model IDs, files, or successful results.",
    "If a required capability, permission, credential, dependency, or user approval is missing, stop at that boundary and report the exact limitation, cause, enabling change, and next safe action.",
    "Record failures and useful improvements in the durable Report/capability workflow when that tool is available.",
    "Never silently perform destructive or externally visible actions without the configured approval policy.",
    "",
    `User goal:\n${goal.trim()}`,
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
  const level = inferMikiTaskLevel(normalized);
  return buildMikiExecutionPrompt(normalized, level);
}

export async function executeGoalThroughMiki(
  orchestrator: AgentOrchestrator,
  request: MikiGoalRequest,
  onText?: (text: string) => Promise<void> | void,
): Promise<MikiLevelRunResult> {
  const goal = request.goal.trim();
  if (!goal) throw new Error("goal is required");
  const level = resolveMikiTaskLevel(goal, request.level);
  const sessionId = request.sessionId?.trim() || `miki-level:${Date.now()}`;
  const startedAt = new Date().toISOString();
  try {
    const response = await streamAgentResponse(
      orchestrator,
      sessionId,
      buildMikiExecutionPrompt(goal, level),
      onText ?? (() => undefined),
      24000,
    );
    const finishedAt = new Date().toISOString();
    await persistLevelRun({
      ok: true,
      level,
      goal: redactJournalText(goal),
      sessionId,
      response: redactJournalText(response),
      startedAt,
      finishedAt,
    });
    return {
      ok: true,
      level,
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
      goal,
      sessionId,
      response: "",
      startedAt,
      finishedAt,
      error: errorMessage,
    };
  }
}
