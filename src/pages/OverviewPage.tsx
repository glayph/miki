import React, { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { navigate } from '../utils/router';
import { 
  Workflow, Database, Globe, Puzzle, ArrowRight, Sparkles, Check, 
  ShieldCheck, Cpu, Terminal, RefreshCw, Zap, Layers, Link as LinkIcon 
} from 'lucide-react';
import { SkillItem } from '../types';
import { getSkillsMarketplace, toggleSkillInstall } from '../services/mikiEngine';

interface OverviewPageProps {
  onOpenDocs: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onOpenDocs }) => {
  const [featuredSkills, setFeaturedSkills] = useState<SkillItem[]>([]);
  const [installingId, setInstallingId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const data = getSkillsMarketplace();
      if (Array.isArray(data)) {
        setFeaturedSkills(data.slice(0, 3));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleToggleInstall = (skill: SkillItem) => {
    setInstallingId(skill.id);
    const updated = toggleSkillInstall(skill.id);
    if (updated) {
      setFeaturedSkills(prev => prev.map(s => s.id === skill.id ? updated : s));
    }
    setInstallingId(null);
  };

  return (
    <div className="space-y-0">
      {/* 1. Hero with Live ReAct Sandbox */}
      <Hero
        onGetStarted={() => navigate('/marketplace')}
        onOpenDocs={onOpenDocs}
      />

      {/* 2. Core Pillars Preview Section */}
      <section className="py-16 sm:py-20 border-b border-[#1c1c22] bg-[#08080a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#FF5A3C] uppercase tracking-wider mb-2">
                <span className="text-[#FF5A3C]">◆</span> Engine Architecture
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#F4F4F5] uppercase tracking-tight">
                Three Core Pillars
              </h2>
            </div>
            <button
              onClick={() => navigate('/features')}
              className="px-4 py-2 bg-[#111115] hover:bg-[#18181f] border border-[#22222a] hover:border-[#FF5A3C]/60 text-xs font-mono font-medium rounded-full text-[#F4F4F5] flex items-center gap-2 transition-all w-fit group min-h-[38px]"
            >
              <span>Explore Capabilities Matrix (6 Features)</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FF5A3C] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Pillar 1 */}
            <div className="bg-[#0e0e12] border border-[#1c1c24] hover:border-[#FF5A3C]/50 p-6 rounded-2xl transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#16161c] border border-[#22222d] flex items-center justify-center mb-4 text-[#FF5A3C] group-hover:bg-[#FF5A3C]/10 transition-colors">
                  <Workflow className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-mono text-[#FF5A3C] uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <span>◆</span> Pillar 01 // Core
                </div>
                <h3 className="text-base font-bold text-[#F4F4F5] mb-2 uppercase tracking-wide">ReAct Orchestration</h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed mb-4">
                  Multi-step reasoning kernel with dynamic step reflection, prompt breakdown, self-correction, and tool routing.
                </p>
              </div>
              <div className="pt-4 border-t border-[#1a1a22] flex items-center justify-between text-[11px] font-mono text-[#A1A1AA]">
                <span>Latency: ~14ms/step</span>
                <span className="text-[#FF5A3C] font-semibold">v1.4 Live</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#0e0e12] border border-[#1c1c24] hover:border-[#FF5A3C]/50 p-6 rounded-2xl transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#16161c] border border-[#22222d] flex items-center justify-center mb-4 text-[#FF5A3C] group-hover:bg-[#FF5A3C]/10 transition-colors">
                  <Database className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-mono text-[#FF5A3C] uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <span>◆</span> Pillar 02 // Memory
                </div>
                <h3 className="text-base font-bold text-[#F4F4F5] mb-2 uppercase tracking-wide">Layered SQLite Vector DB</h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed mb-4">
                  WAL-mode local SQLite engine with quantized vector similarity indexing and automatic token context decay.
                </p>
              </div>
              <div className="pt-4 border-t border-[#1a1a22] flex items-center justify-between text-[11px] font-mono text-[#A1A1AA]">
                <span>Read Speed: &lt;1.2ms</span>
                <span className="text-[#FF5A3C] font-semibold">v1.4 Live</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#0e0e12] border border-[#1c1c24] hover:border-[#FF5A3C]/50 p-6 rounded-2xl transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#16161c] border border-[#22222d] flex items-center justify-center mb-4 text-[#FF5A3C] group-hover:bg-[#FF5A3C]/10 transition-colors">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-mono text-[#FF5A3C] uppercase tracking-widest mb-1.5 flex items-center gap-1">
                  <span>◆</span> Pillar 03 // Tooling
                </div>
                <h3 className="text-base font-bold text-[#F4F4F5] mb-2 uppercase tracking-wide">Chromium Stealth Tool</h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed mb-4">
                  Headless browser automation with DOM AST extraction, anti-bot stealth fingerprinting, and canvas clicks.
                </p>
              </div>
              <div className="pt-4 border-t border-[#1a1a22] flex items-center justify-between text-[11px] font-mono text-[#A1A1AA]">
                <span>Dom AST: Compressed</span>
                <span className="text-[#FF5A3C] font-semibold">v1.4 Live</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Skill Registry Showcase Teaser */}
      <section className="py-16 sm:py-20 border-b border-[#1c1c22] bg-[#060608]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#FF5A3C] uppercase tracking-wider mb-2">
                <span className="text-[#FF5A3C]">◆</span> Hot-Reloadable Plugins
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#F4F4F5] uppercase tracking-tight">
                Skill Registry Showcase
              </h2>
            </div>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-5 py-2.5 bg-[#FF5A3C] hover:bg-[#FF7A5C] text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2 transition-all w-fit rounded-full shadow-lg group min-h-[38px]"
            >
              <span>Open Universal Registry (8 Skills)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredSkills.map((skill) => (
              <div 
                key={skill.id}
                className="bg-[#0e0e12] border border-[#1c1c24] p-5 sm:p-6 rounded-2xl hover:border-[#FF5A3C]/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="h-28 rounded-xl bg-[#14141a] border border-[#1f1f28] mb-4 p-4 flex items-center justify-between relative overflow-hidden group-hover:border-[#FF5A3C]/30 transition-colors">
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#FF5A3C]/10 rounded-full blur-xl group-hover:bg-[#FF5A3C]/20 transition-all" />
                    <div className="w-10 h-10 rounded-lg bg-[#1e1e28] flex items-center justify-center text-[#FF5A3C] font-mono font-bold text-lg">
                      {skill.name.charAt(0)}
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 bg-[#09090c] border border-[#22222d] rounded-full text-[#FF5A3C]">
                      {skill.version}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-[#F4F4F5]">{skill.name}</h3>
                    <span className="text-xs font-mono text-[#71717A]">{skill.downloads} installs</span>
                  </div>
                  
                  <p className="text-xs text-[#A1A1AA] leading-relaxed mb-4 line-clamp-2">
                    {skill.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {skill.compatibility.map((c, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2.5 py-0.5 bg-[#14141a] text-[#A1A1AA] border border-[#1f1f28] rounded-full">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleToggleInstall(skill)}
                  disabled={installingId === skill.id}
                  className={`w-full py-2.5 px-4 text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2 rounded-full min-h-[40px] ${
                    skill.installed
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                      : 'bg-[#FF5A3C] text-white hover:bg-[#FF7A5C]'
                  }`}
                >
                  {installingId === skill.id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : skill.installed ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Plugin Installed
                    </>
                  ) : (
                    'Install Plugin'
                  )}
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Ecosystem & Architecture Matrix Teaser */}
      <section className="py-12 sm:py-16 bg-[#08080a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 bg-[#0e0e12] border border-[#1c1c24] rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#FF5A3C] font-semibold">
                <Cpu className="w-4 h-4" />
                <span>◆ INTEROPERABILITY PROTOCOL</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#F4F4F5] uppercase tracking-tight">
                Inspect OpenClaw & Hermes Bridges
              </h3>
              <p className="text-xs text-[#A1A1AA] max-w-xl leading-relaxed">
                Learn how Miki bi-directionally translates OpenClaw JSON tool definitions and streams Hermes Agent socket requests with zero overhead.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={() => navigate('/architecture/react')}
                className="w-full md:w-auto px-6 py-3 bg-[#FF5A3C] text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#FF7A5C] transition-colors rounded-full min-h-[42px]"
              >
                Inspect Architecture
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
