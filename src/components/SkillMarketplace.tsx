import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Check, Link, Puzzle, Cpu, Database, Globe, Workflow, Code, Sparkles, RefreshCw } from 'lucide-react';
import { SkillItem } from '../types';
import { getSkillsMarketplace, toggleSkillInstall } from '../services/mikiEngine';

export const SkillMarketplace: React.FC = () => {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'miki' | 'openclaw' | 'hermes'>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [installingId, setInstallingId] = useState<string | null>(null);

  const fetchSkills = () => {
    try {
      const data = getSkillsMarketplace();
      setSkills(data);
      if (data.length > 0 && !selectedSkill) {
        setSelectedSkill(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch skills marketplace', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleToggleInstall = (skill: SkillItem) => {
    setInstallingId(skill.id);
    const updated = toggleSkillInstall(skill.id);

    if (updated) {
      setSkills(prev => prev.map(s => s.id === skill.id ? updated : s));
      if (selectedSkill?.id === skill.id) {
        setSelectedSkill(updated);
      }
    }
    setInstallingId(null);
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'openclaw') {
      return matchesSearch && skill.compatibility.includes('OpenClaw');
    }
    if (selectedFilter === 'hermes') {
      return matchesSearch && skill.compatibility.includes('Hermes Agent');
    }
    if (selectedFilter === 'miki') {
      return matchesSearch && skill.compatibility.includes('Miki Native');
    }
    return matchesSearch;
  });

  return (
    <section id="skills" className="py-16 sm:py-20 border-b border-[#1c1c22] bg-[#060608]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#FF5A3C] uppercase tracking-wider mb-3">
            <span>◆</span> Universal Skill Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F4F5] uppercase tracking-tight mb-4">
            Hot-Reloadable Skill Registry
          </h2>
          <p className="text-[#A1A1AA] text-sm sm:text-base">
            Seamlessly run Miki plugins, OpenClaw skill modules, and Hermes Agent tools in one unified engine.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#A1A1AA]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills, drivers, bridges..."
              className="w-full bg-[#0e0e12] border border-[#1c1c24] focus:border-[#FF5A3C] rounded-full pl-10 pr-4 py-2.5 text-xs font-mono text-[#F4F4F5] focus:outline-none min-h-[42px]"
            />
          </div>

          {/* Filter Pills - Horizontally scrollable on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none w-full md:w-auto">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 text-xs font-mono rounded-full border transition-all whitespace-nowrap shrink-0 min-h-[38px] ${
                selectedFilter === 'all'
                  ? 'bg-[#FF5A3C] text-white border-[#FF5A3C] font-semibold'
                  : 'bg-[#0e0e12] text-[#A1A1AA] border-[#1c1c24] hover:text-[#F4F4F5] hover:border-[#2a2a36]'
              }`}
            >
              All Skills ({skills.length})
            </button>

            <button
              onClick={() => setSelectedFilter('openclaw')}
              className={`px-4 py-2 text-xs font-mono rounded-full border transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 min-h-[38px] ${
                selectedFilter === 'openclaw'
                  ? 'bg-[#FF5A3C] text-white border-[#FF5A3C] font-semibold'
                  : 'bg-[#0e0e12] text-[#A1A1AA] border-[#1c1c24] hover:text-[#F4F4F5] hover:border-[#2a2a36]'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              OpenClaw Compatible
            </button>

            <button
              onClick={() => setSelectedFilter('hermes')}
              className={`px-4 py-2 text-xs font-mono rounded-full border transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 min-h-[38px] ${
                selectedFilter === 'hermes'
                  ? 'bg-[#FF5A3C] text-white border-[#FF5A3C] font-semibold'
                  : 'bg-[#0e0e12] text-[#A1A1AA] border-[#1c1c24] hover:text-[#F4F4F5] hover:border-[#2a2a36]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Hermes Agent Compatible
            </button>
          </div>

        </div>

        {/* Master-Detail Skill View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Skill List Column */}
          <div className="lg:col-span-7 space-y-3.5">
            {loading ? (
              <div className="p-8 text-center text-xs font-mono text-[#A1A1AA] bg-[#0e0e12] rounded-2xl border border-[#1c1c24]">
                Loading Skill Catalog...
              </div>
            ) : filteredSkills.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-[#A1A1AA] bg-[#0e0e12] rounded-2xl border border-[#1c1c24]">
                No skills matched search criteria.
              </div>
            ) : (
              filteredSkills.map((skill) => {
                const isSelected = selectedSkill?.id === skill.id;
                const isInstalling = installingId === skill.id;

                return (
                  <div
                    key={skill.id}
                    onClick={() => setSelectedSkill(skill)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0e0e12] border-[#FF5A3C]'
                        : 'bg-[#0e0e12]/70 border-[#1c1c24] hover:border-[#2a2a36]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-[#F4F4F5] group-hover:text-[#FF5A3C]">
                            {skill.name}
                          </h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#08080a] border border-[#1f1f28] text-[#A1A1AA]">
                            v{skill.version}
                          </span>
                        </div>
                        <p className="text-xs text-[#A1A1AA] leading-relaxed line-clamp-2">
                          {skill.description}
                        </p>
                      </div>

                      {/* Install Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleInstall(skill);
                        }}
                        disabled={isInstalling}
                        className={`px-3.5 py-1.5 text-xs font-mono rounded-full border flex items-center gap-1.5 shrink-0 transition-all min-h-[36px] ${
                          skill.installed
                            ? 'bg-emerald-950/40 border-emerald-700 text-emerald-400 hover:bg-red-950/40 hover:border-red-800 hover:text-red-300'
                            : 'bg-[#FF5A3C] border-[#FF5A3C] text-white hover:bg-[#FF7A5C]'
                        }`}
                      >
                        {isInstalling ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : skill.installed ? (
                          <>
                            <Check className="w-3 h-3" />
                            Installed
                          </>
                        ) : (
                          <>
                            <Download className="w-3 h-3" />
                            Install
                          </>
                        )}
                      </button>
                    </div>

                    {/* Footer compatibility tags */}
                    <div className="flex items-center gap-2 pt-3 border-t border-[#1a1a22] text-[11px] font-mono text-[#A1A1AA]">
                      <span className="text-[#FF5A3C]">By {skill.author}</span>
                      <span>•</span>
                      <span>{skill.downloads} downloads</span>
                      <span>•</span>
                      <div className="flex gap-1 overflow-x-auto scrollbar-none">
                        {skill.compatibility.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-[#14141a] border border-[#1f1f28] text-[10px]">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>

          {/* Skill Code Inspector */}
          <div className="lg:col-span-5 p-4 sm:p-6 rounded-2xl bg-[#0e0e12] border border-[#1c1c24] lg:sticky lg:top-24 font-mono">
            {selectedSkill ? (
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#1c1c24] mb-4">
                  <div>
                    <span className="text-[10px] text-[#FF5A3C] uppercase tracking-wider block mb-1">
                      SKILL PLUGIN INSPECTOR
                    </span>
                    <h3 className="text-lg font-bold text-[#F4F4F5]">{selectedSkill.name}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs ${
                    selectedSkill.installed ? 'bg-emerald-950/60 border border-emerald-700 text-emerald-400' : 'bg-[#08080a] border border-[#1c1c24] text-[#A1A1AA]'
                  }`}>
                    {selectedSkill.installed ? 'ACTIVE IN RUNTIME' : 'NOT INSTALLED'}
                  </span>
                </div>

                <p className="text-xs text-[#A1A1AA] mb-4 leading-relaxed font-sans">
                  {selectedSkill.description}
                </p>

                <div className="mb-4">
                  <div className="text-xs font-bold text-[#F4F4F5] mb-2 flex items-center justify-between">
                    <span>PLUGIN INTERFACE SNIPPET:</span>
                    <span className="text-[#A1A1AA] text-[10px]">ISkillPlugin v1.4</span>
                  </div>
                  <pre className="p-3 rounded-xl bg-[#08080a] border border-[#1c1c24] text-xs text-[#F4F4F5] overflow-x-auto leading-relaxed">
                    <code>{selectedSkill.codeSnippet}</code>
                  </pre>
                </div>

                <div className="p-3 rounded-xl bg-[#08080a] border border-[#1c1c24] text-xs text-[#A1A1AA] space-y-1">
                  <div className="text-[#FF5A3C] font-bold">ECOSYSTEM COMPATIBILITY:</div>
                  <div>• OpenClaw JSON Schema Mapper: OK</div>
                  <div>• Hermes Tool Function Call Protocol: OK</div>
                  <div>• Hot-reload safely on WebSocket reconnect</div>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-xs text-[#A1A1AA]">
                Select a skill from the left column to view its specification.
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
