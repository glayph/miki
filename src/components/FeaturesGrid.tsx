import React from 'react';
import { Workflow, Database, Globe, Puzzle, Download, Link, ArrowUpRight } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  codeSnippet: string;
}

export const FeaturesGrid: React.FC = () => {
  const features: FeatureCardProps[] = [
    {
      icon: <Workflow className="w-5 h-5 text-[#FF5A3C]" />,
      title: "ReAct Orchestration Loop",
      description: "Autonomous reasoning-and-action cycle with step reflection, schema validation, and configurable max iteration caps at the core of every agent run.",
      badge: "CORE ENGINE",
      codeSnippet: "agent.run({ loop: 'react', reflection: true })"
    },
    {
      icon: <Database className="w-5 h-5 text-[#FF5A3C]" />,
      title: "Layered SQLite Memory Engine",
      description: "SQLite-backed short and long-term memory with auto-pruning and indexing. Zero external vector database requirement needed to get started.",
      badge: "MEMORY DRIVER",
      codeSnippet: "memory: { driver: 'sqlite', path: './memory.db' }"
    },
    {
      icon: <Globe className="w-5 h-5 text-[#FF5A3C]" />,
      title: "Browser Automation Toolkit",
      description: "Built-in Playwright/Chromium driver with stealth profile for real DOM extraction, screenshot capturing, and headless form interaction.",
      badge: "PLAYWRIGHT TOOL",
      codeSnippet: "browser.goto(url).extractDOM({ stealth: true })"
    },
    {
      icon: <Puzzle className="w-5 h-5 text-[#FF5A3C]" />,
      title: "Universal Skill System",
      description: "Clean ISkillPlugin contract with live hot-reloading. Register, load, unload, and extend agent toolkits without restarting the process.",
      badge: "HOT-RELOAD",
      codeSnippet: "agent.use(defineSkill({ id: 'custom-skill' }))"
    },
    {
      icon: <Download className="w-5 h-5 text-[#FF5A3C]" />,
      title: "Skill Marketplace & Auto-Acquisition",
      description: "The agent detects capability gaps mid-task, queries the Miki registry, installs the missing skill plugin on the fly, and resumes execution seamlessly.",
      badge: "AUTO-INSTALL",
      codeSnippet: "agent.enableAutoAcquisition({ registryUrl })"
    },
    {
      icon: <Link className="w-5 h-5 text-[#FF5A3C]" />,
      title: "Cross-Ecosystem Compatible",
      description: "Native compatibility bridge with skills and tool definitions created for the OpenClaw and Hermes Agent skill ecosystems.",
      badge: "OPENCLAW & HERMES",
      codeSnippet: "loadOpenClawSkill('openclaw/github-prs')"
    }
  ];

  return (
    <section id="features" className="py-20 border-b border-[#27272A] bg-[#0A0A0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111113] border border-[#27272A] text-xs font-mono font-bold tracking-widest text-[#FF5A3C] uppercase mb-4">
            Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F4F5] uppercase tracking-tight mb-4">
            Engineered For Developer Precision
          </h2>
          <p className="text-[#A1A1AA] text-sm sm:text-base">
            Everything you need to orchestrate autonomous production agents in clean TypeScript.
          </p>
        </div>

        {/* 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-lg bg-[#111113] border border-[#27272A] hover:border-[#FF5A3C]/50 transition-all group flex flex-col justify-between hover:bg-[#161619]"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-lg bg-[#0A0A0B] border border-[#27272A] group-hover:border-[#FF5A3C]/40 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-[#0A0A0B] border border-[#27272A] text-[#A1A1AA]">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#F4F4F5] mb-2 group-hover:text-[#FF5A3C] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Code Snippet Footer */}
              <div className="pt-4 border-t border-[#27272A]">
                <div className="p-2.5 rounded bg-[#0A0A0B] border border-[#27272A] font-mono text-[11px] text-[#A1A1AA] overflow-x-auto">
                  <code>{item.codeSnippet}</code>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
