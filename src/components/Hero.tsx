import React, { useState } from 'react';
import { Play, Copy, Check, Terminal as TerminalIcon, Github, Sparkles, ArrowRight, RefreshCw, Cpu, Layers, ShieldCheck } from 'lucide-react';
import { HERO_CODE_SNIPPETS } from '../data/mikiContent';
import { AgentRunResponse } from '../types';
import { runAgentTask } from '../services/mikiEngine';

interface HeroProps {
  onGetStarted: () => void;
  onOpenDocs: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted, onOpenDocs }) => {
  const [activeTab, setActiveTab] = useState<'quickstart' | 'customSkill' | 'cliBoot' | 'sandbox'>('quickstart');
  const [copied, setCopied] = useState(false);

  // Live Sandbox state
  const [prompt, setPrompt] = useState("Summarize top AI news today and persist nodes into SQLite memory");
  const [isRunning, setIsRunning] = useState(false);
  const [agentResult, setAgentResult] = useState<AgentRunResponse | null>(null);
  const [sandboxError, setSandboxError] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunAgent = async () => {
    if (!prompt.trim() || isRunning) return;
    setIsRunning(true);
    setSandboxError(null);

    try {
      const data = await runAgentTask(prompt, 'miki-live-demo');
      setAgentResult(data);
    } catch (err: any) {
      setSandboxError(err.message || 'Error running agent sandbox');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <section id="overview" className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#27272A] bg-[#0A0A0B]">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111113_1px,transparent_1px),linear-gradient(to_bottom,#111113_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tech Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-[#111113] border border-[#27272A] text-xs font-mono text-[#A1A1AA]">
            <span className="w-2 h-2 bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 font-semibold">100% Frontend (GitHub Pages Hostable)</span>
            <span className="text-[#27272A]">|</span>
            <span className="text-[#F4F4F5]">glayph/Agent Framework</span>
          </div>
        </div>

        {/* Main Title & Copy */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-[#F4F4F5] uppercase leading-[0.95] mb-6">
            Autonomous Agent <br className="hidden sm:block" />
            <span className="text-[#FF5A3C]">Pure Frontend Engine.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed mb-8 max-w-2xl mx-auto">
            Build, deploy, and host autonomous ReAct agents on GitHub Pages without any server backend. Powered by client-side execution, layered memory, and universal skill compatibility.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-7 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-white bg-[#FF5A3C] hover:bg-[#FF7A5C] rounded-none transition-all shadow-lg flex items-center justify-center gap-2 group"
            >
              Start Building Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="https://github.com/glayph/agent"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-[#F4F4F5] bg-[#111113] hover:bg-[#111113]/80 border border-[#27272A] hover:border-[#A1A1AA]/50 rounded-none transition-all flex items-center justify-center gap-2"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </div>
        </div>

        {/* Interactive Code & Sandbox Terminal */}
        <div className="max-w-5xl mx-auto rounded-none border border-[#27272A] bg-[#111113] overflow-hidden shadow-2xl">
          
          {/* Terminal Topbar */}
          <div className="px-4 py-3 bg-[#0A0A0B] border-b border-[#27272A] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-[#3F3F46]" />
              <div className="w-2.5 h-2.5 bg-[#27272A]" />
              <div className="w-2.5 h-2.5 bg-[#18181B]" />
              <span className="ml-2 text-xs font-mono text-[#A1A1AA] flex items-center gap-1.5">
                <TerminalIcon className="w-3.5 h-3.5 text-[#FF5A3C]" />
                miki-kernel // interactive terminal
              </span>
            </div>

            {/* Terminal Tabs */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('quickstart')}
                className={`px-2.5 py-1 text-xs font-mono rounded-none ${
                  activeTab === 'quickstart'
                    ? 'bg-[#111113] text-[#FF5A3C] border border-[#FF5A3C]/40 font-semibold'
                    : 'text-[#A1A1AA] hover:text-[#F4F4F5]'
                }`}
              >
                agent.ts
              </button>
              <button
                onClick={() => setActiveTab('customSkill')}
                className={`px-2.5 py-1 text-xs font-mono rounded-none ${
                  activeTab === 'customSkill'
                    ? 'bg-[#111113] text-[#FF5A3C] border border-[#FF5A3C]/40 font-semibold'
                    : 'text-[#A1A1AA] hover:text-[#F4F4F5]'
                }`}
              >
                skill-plugin.ts
              </button>
              <button
                onClick={() => setActiveTab('cliBoot')}
                className={`px-2.5 py-1 text-xs font-mono rounded-none ${
                  activeTab === 'cliBoot'
                    ? 'bg-[#111113] text-[#FF5A3C] border border-[#FF5A3C]/40 font-semibold'
                    : 'text-[#A1A1AA] hover:text-[#F4F4F5]'
                }`}
              >
                $ miki start
              </button>
              <button
                onClick={() => setActiveTab('sandbox')}
                className={`px-2.5 py-1 text-xs font-mono rounded-none flex items-center gap-1 ${
                  activeTab === 'sandbox'
                    ? 'bg-[#FF5A3C] text-white font-semibold'
                    : 'bg-[#FF5A3C]/10 text-[#FF5A3C] hover:bg-[#FF5A3C]/20 border border-[#FF5A3C]/30'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                Live Sandbox
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm text-[#F4F4F5] min-h-[280px] bg-[#0A0A0B]/60">
            {activeTab === 'sandbox' ? (
              <div className="space-y-4">
                <div className="p-3 rounded-none bg-[#111113] border border-[#27272A]">
                  <div className="text-xs text-[#A1A1AA] mb-2 flex items-center justify-between">
                    <span>TYPE TASK PROMPT FOR MIKI RE-ACT AGENT:</span>
                    <span className="text-[#FF5A3C]">Pure Frontend ReAct Engine</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g. Inspect target web page and persist findings to memory.db"
                      className="flex-1 bg-[#0A0A0B] border border-[#27272A] rounded-none px-3 py-2 text-xs font-mono text-[#F4F4F5] focus:outline-none focus:border-[#FF5A3C]"
                    />
                    <button
                      onClick={handleRunAgent}
                      disabled={isRunning}
                      className="px-4 py-2 bg-[#FF5A3C] hover:bg-[#FF7A5C] text-white rounded-none text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {isRunning ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Executing Loop...
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          Run Agent Loop
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Agent Execution Logs & Result */}
                {sandboxError && (
                  <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 rounded-none text-xs">
                    {sandboxError}
                  </div>
                )}

                {agentResult && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#A1A1AA] border-b border-[#27272A] pb-1">
                      <span>RUN ID: {agentResult.runId}</span>
                      <span>TIME: {agentResult.executionTimeMs}ms</span>
                    </div>

                    {/* Step Breakdown */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-[#FF5A3C]">RE-ACT STEP LOGS:</div>
                      {agentResult.steps.map((s) => (
                        <div key={s.step} className="p-2.5 rounded-none bg-[#111113] border border-[#27272A] text-xs space-y-1">
                          <div className="flex items-center justify-between text-[#A1A1AA]">
                            <span className="uppercase font-bold text-[#FF5A3C]">[STEP {s.step}: {s.type}]</span>
                            <span>{s.latencyMs}ms</span>
                          </div>
                          <p className="text-[#F4F4F5]">{s.content}</p>
                          {s.code && (
                            <pre className="p-2 rounded-none bg-[#0A0A0B] text-[11px] text-[#A1A1AA] overflow-x-auto border border-[#27272A]">
                              {s.code}
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Output Box */}
                    <div className="p-3 rounded-none bg-[#111113] border border-[#FF5A3C]/30 text-xs">
                      <div className="text-xs font-bold text-[#FF5A3C] mb-1">SYNTHESIZED AGENT OUTPUT:</div>
                      <div className="text-[#F4F4F5] whitespace-pre-wrap">{agentResult.output}</div>
                    </div>
                  </div>
                )}

                {!agentResult && !isRunning && (
                  <div className="text-center py-8 text-[#A1A1AA] text-xs">
                    Click <span className="text-[#FF5A3C] font-bold">"Run Agent Loop"</span> above to test Miki's ReAct orchestration & skill acquisition engine in real time.
                  </div>
                )}
              </div>
            ) : (
              <div className="relative group">
                <button
                  onClick={() => handleCopy(HERO_CODE_SNIPPETS[activeTab as keyof typeof HERO_CODE_SNIPPETS])}
                  className="absolute top-0 right-0 p-1.5 text-[#A1A1AA] hover:text-[#F4F4F5] bg-[#111113] border border-[#27272A] rounded-none transition-colors"
                  title="Copy snippet"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <pre className="overflow-x-auto text-[#F4F4F5] leading-relaxed">
                  <code>{HERO_CODE_SNIPPETS[activeTab as keyof typeof HERO_CODE_SNIPPETS]}</code>
                </pre>
              </div>
            )}
          </div>

          {/* Terminal Footer Info */}
          <div className="px-4 py-2 bg-[#0A0A0B] border-t border-[#27272A] flex flex-wrap items-center justify-between text-[11px] text-[#A1A1AA] font-mono">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500" />
              SQLite Memory: ONLINE
            </span>
            <span className="flex items-center gap-3">
              <span>OpenClaw Loader: READY</span>
              <span>Hermes Bridge: ACTIVE</span>
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
