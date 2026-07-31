import React, { useState } from 'react';
import { 
  Workflow, Database, Globe, Puzzle, Download, Link, Sparkles, 
  Check, ArrowRight, Terminal, Github, Copy, ShieldCheck, Flame, Cpu, Zap
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  codeSnippet: string;
  statusTag: string;
}

export const FeaturesGrid: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const setupCmd = "git clone https://github.com/glayph/agent.git && cd agent && npm install && npm start";

  const handleCopy = () => {
    navigator.clipboard.writeText(setupCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const features: FeatureCardProps[] = [
    {
      icon: <Workflow className="w-5 h-5 text-[#FF5A3C]" />,
      title: "ReAct Multi-Agent Swarms",
      description: "Autonomous agent-to-agent negotiation, parallel execution trees, and task delegation across distributed worker nodes.",
      badge: "AVAILABLE NOW",
      codeSnippet: "miki.swarm({ agents: ['researcher', 'coder'], consensus: 'voting' })",
      statusTag: "v1.4 Live"
    },
    {
      icon: <Database className="w-5 h-5 text-[#FF5A3C]" />,
      title: "Layered SQLite Memory Driver",
      description: "SQLite-backed short and long-term memory with vector indexing, semantic search, and automatic zero-latency WAL mode checkpoints.",
      badge: "AVAILABLE NOW",
      codeSnippet: "memory: { driver: 'sqlite', path: './memory.db' }",
      statusTag: "v1.4 Live"
    },
    {
      icon: <Globe className="w-5 h-5 text-[#FF5A3C]" />,
      title: "Stealth Chromium Automation",
      description: "Built-in Playwright browser engine with anti-detection fingerprinting, DOM AST extraction, and real-time canvas clickers.",
      badge: "AVAILABLE NOW",
      codeSnippet: "browser.goto(url).extractDOM({ stealth: true })",
      statusTag: "v1.4 Live"
    },
    {
      icon: <Flame className="w-5 h-5 text-[#FF5A3C]" />,
      title: "Zero-Latency Local Neural Engine",
      description: "On-device WebGPU and WASM quantized model execution engine for offline agent reasoning with zero external API fees.",
      badge: "AVAILABLE NOW",
      codeSnippet: "agent.useLocalModel({ provider: 'webgpu', model: 'qwen-2.5-7b' })",
      statusTag: "v1.4 Live"
    },
    {
      icon: <Puzzle className="w-5 h-5 text-[#FF5A3C]" />,
      title: "Universal Hot-Reload Skill System",
      description: "Clean ISkillPlugin contract with live hot-reloading. Register, load, unload, and extend agent toolkits dynamically mid-task.",
      badge: "AVAILABLE NOW",
      codeSnippet: "agent.use(defineSkill({ id: 'custom-skill' }))",
      statusTag: "v1.4 Live"
    },
    {
      icon: <Download className="w-5 h-5 text-[#FF5A3C]" />,
      title: "Autonomous Skill Auto-Acquisition",
      description: "Detects missing capabilities mid-execution, queries the registry, installs needed skills, and resumes task execution automatically.",
      badge: "AVAILABLE NOW",
      codeSnippet: "agent.enableAutoAcquisition({ registryUrl: 'https://registry.miki.dev' })",
      statusTag: "v1.4 Live"
    }
  ];

  return (
    <section id="features" className="py-20 border-b border-[#27272A] bg-[#0A0A0B] relative overflow-hidden">
      
      {/* Background Accent Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF5A3C]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Prominent Direct GitHub Download Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111113] border border-[#FF5A3C]/50 text-xs font-mono font-bold tracking-widest text-[#FF5A3C] uppercase mb-6 shadow-lg shadow-[#FF5A3C]/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Miki Engine v1.4.2 — Open Source & Ready</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F4F4F5] uppercase tracking-tight mb-6 leading-none">
            Download & Build <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5A3C] via-amber-400 to-[#FF7A5C]">
              Direct From GitHub
            </span>
          </h2>

          <p className="text-[#A1A1AA] text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Get the entire agentic core stack with multi-agent swarms, SQLite vector memory, browser automation, and hot-reloadable skill plugins.
          </p>

          {/* Quick Setup Terminal Card */}
          <div className="bg-[#111113] border border-[#27272A] p-4 sm:p-6 rounded-none max-w-2xl mx-auto mb-8 shadow-2xl text-left">
            <div className="flex items-center justify-between text-xs font-mono text-[#A1A1AA] mb-4 border-b border-[#27272A] pb-3">
              <span className="flex items-center gap-2 text-[#FF5A3C] font-bold">
                <Terminal className="w-4 h-4" /> ONE-COMMAND QUICK SETUP
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% READY
              </span>
            </div>

            <div className="p-3.5 bg-[#0A0A0B] border border-[#27272A] flex items-center justify-between gap-3 font-mono text-xs sm:text-sm text-[#F4F4F5] mb-4 overflow-x-auto">
              <span className="text-[#FF5A3C] select-none">$</span>
              <code className="flex-1 text-[#F4F4F5] whitespace-nowrap">{setupCmd}</code>
              <button
                onClick={handleCopy}
                className="p-1.5 bg-[#111113] hover:bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors shrink-0 flex items-center gap-1 text-[11px]"
                title="Copy Command"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-xs font-mono text-[#A1A1AA]">
                License: <strong className="text-[#F4F4F5]">MIT Open Source</strong>
              </span>

              <a
                href="https://github.com/glayph/agent"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#FF5A3C] hover:bg-[#FF7A5C] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Github className="w-4 h-4" />
                Download / Clone Repository
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-none bg-[#111113] border border-[#27272A] hover:border-[#FF5A3C]/50 transition-all group flex flex-col justify-between relative"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-none bg-[#0A0A0B] border border-[#27272A] group-hover:border-[#FF5A3C]/40 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-none bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#F4F4F5] mb-2 group-hover:text-[#FF5A3C] transition-colors flex items-center gap-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Code Snippet Footer */}
              <div className="pt-4 border-t border-[#27272A]">
                <div className="p-2.5 rounded-none bg-[#0A0A0B] border border-[#27272A] font-mono text-[11px] text-[#A1A1AA] overflow-x-auto flex items-center justify-between">
                  <code>{item.codeSnippet}</code>
                  <span className="text-[10px] text-[#FF5A3C] ml-2 shrink-0">{item.statusTag}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
