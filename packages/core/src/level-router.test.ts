import { describe, expect, it } from "vitest";
import type { AgentOrchestrator } from "./agent.js";
import {
  MIKI_TASK_LEVELS,
  buildMikiExecutionPrompt,
  executeGoalThroughMiki,
  inferMikiTaskLevel,
  prepareOrdinaryChatMessage,
  shouldTreatOrdinaryMessageAsGoal,
} from "./level-router.js";

describe("Miki task level router", () => {
  it("exposes the complete requested level set", () => {
    expect(MIKI_TASK_LEVELS).toEqual([
      "normal",
      "adaptive",
      "low",
      "medium",
      "high",
      "extra",
      "max",
      "turbo",
    ]);
  });

  it.each([
    ["compare two options and decide", "adaptive"],
    ["low-level inspect a file", "low"],
    ["medium-level build an integration", "medium"],
    ["high-level research the topic", "high"],
    ["extra-level build a polished web app with login", "extra"],
    ["max-level run the LFS build", "max"],
    ["turbo-level debug LFS failure injection", "turbo"],
    ["say hello", "normal"],
  ] as const)("infers %s as %s", (goal, expected) => {
    expect(inferMikiTaskLevel(goal)).toBe(expected);
  });

  it("detects action requests in ordinary chat without hijacking greetings", () => {
    expect(shouldTreatOrdinaryMessageAsGoal("Build a report for me")).toBe(true);
    expect(shouldTreatOrdinaryMessageAsGoal("Hello, how are you?")).toBe(false);
    expect(shouldTreatOrdinaryMessageAsGoal("What is Linux?")).toBe(false);
    expect(prepareOrdinaryChatMessage("Build a report for me")).toContain(
      "Execute the user's goal yourself",
    );
    expect(prepareOrdinaryChatMessage("What is Linux?")).toBe("What is Linux?");
  });

  it("builds a prompt that tells Miki to execute and verify the goal", () => {
    const prompt = buildMikiExecutionPrompt("create a report", "high");
    expect(prompt).toContain("Execute the user's goal yourself");
    expect(prompt).toContain("Execution level: high");
    expect(prompt).toContain("create a report");
    expect(prompt).toContain("Do not merely explain");
  });

  it("delegates a goal through the existing agent loop", async () => {
    const calls: string[] = [];
    const orchestrator = {
      async *runAgentLoop(sessionId: string, message: string) {
        calls.push(`${sessionId}:${message}`);
        yield JSON.stringify({ type: "final", content: "Miki completed it." });
      },
    } as unknown as AgentOrchestrator;

    const result = await executeGoalThroughMiki(orchestrator, {
      goal: "turbo-level debug LFS",
      sessionId: "test-level-session",
    });

    expect(result.ok).toBe(true);
    expect(result.level).toBe("turbo");
    expect(result.response).toBe("Miki completed it.");
    expect(calls).toHaveLength(1);
    expect(calls[0]).toContain("test-level-session");
    expect(calls[0]).toContain("Execution level: turbo");
  });
});
