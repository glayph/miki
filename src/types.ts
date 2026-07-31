export interface ApiKey {
  id: string;
  label: string;
  keyPrefix: string;
  createdAt: string;
  lastUsedAt?: string;
  revokedAt?: string;
  status: 'active' | 'revoked';
}

export interface ApiKeyCreatedResponse extends ApiKey {
  apiKey: string; // The raw secret key returned only once
}

export interface SystemHealth {
  status: 'operational' | 'degraded' | 'maintenance';
  version: string;
  uptimeSeconds: number;
  activeAgents: number;
  activeSkillsCount: number;
  memoryUsageMb: number;
  lastHeartbeat: string;
  clusterNodes: number;
  avgLatencyMs: number;
}

export interface SkillItem {
  id: string;
  name: string;
  description: string;
  category: 'automation' | 'memory' | 'reasoning' | 'search' | 'bridge' | 'developer';
  compatibility: ('Miki Native' | 'OpenClaw' | 'Hermes Agent')[];
  version: string;
  downloads: string;
  installed?: boolean;
  author: string;
  codeSnippet: string;
  iconName: string;
}

export interface AgentRunStep {
  step: number;
  timestamp: string;
  type: 'thought' | 'action' | 'observation' | 'skill_acquisition' | 'result';
  content: string;
  code?: string;
  tool?: string;
  latencyMs?: number;
}

export interface AgentRunResponse {
  runId: string;
  status: 'completed' | 'failed' | 'running';
  agentName: string;
  prompt: string;
  output: string;
  steps: AgentRunStep[];
  skillsUsed: string[];
  executionTimeMs: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  period: string;
  badge?: string;
  highlighted?: boolean;
  features: string[];
  ctaText: string;
}
