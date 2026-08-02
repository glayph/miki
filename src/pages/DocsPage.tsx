import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, Search, ChevronRight, ExternalLink, FileText, Sparkles,
  Cpu, Boxes, ShieldCheck, GitCommit, Folder, Layers, X
} from 'lucide-react';
import { getAllDocs, getDocByPath, markdownStore } from '../utils/markdownLoader';
import { MarkdownViewer } from '../components/MarkdownViewer';

// Category icon mapper
const categoryIcons: Record<string, React.ElementType> = {
  'Guides': BookOpen,
  'Architecture': Cpu,
  'Ecosystem': Boxes,
  'Legal': ShieldCheck,
  'Release Logs': GitCommit,
  'General': Folder,
};

export const DocsPage: React.FC = () => {
  const [activePath, setActivePath] = useState<string>('/docs/guides/quickstart.md');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);

  const allDocs = getAllDocs();

  // Custom labels map for clean sidebar display
  const labelMap: Record<string, string> = {
    '/docs/guides/quickstart.md': 'Quickstart & Installation',
    '/docs/guides/skills.md': 'Skill Plugin Development',
    '/docs/architecture/react.md': 'ReAct Orchestration Loop',
    '/docs/ecosystem/root.md': 'Monorepo Architecture Structure',
    '/docs/ecosystem/core.md': 'Core Agent Engine Runtime',
    '/docs/ecosystem/hermes.md': 'Hermes Communication Bus',
    '/docs/ecosystem/openclaw.md': 'OpenClaw Web Automation Engine',
    '/docs/ecosystem/playwright.md': 'Playwright Browser Engine',
    '/docs/ecosystem/sqlite-memory.md': 'SQLite Vector Memory Engine',
    '/docs/ecosystem/hiro-memory.md': 'Hiro-Memory TKG Architecture',
    '/docs/ecosystem/hiro-cli.md': 'Hiro Terminal TUI',
    '/docs/ecosystem/gateway.md': 'API Gateway Proxy',
    '/docs/ecosystem/config.md': 'Configuration & Secret Vault',
    '/docs/ecosystem/installer.md': 'Skill Installer Framework',
    '/docs/ecosystem/scripts.md': 'Build & Release Automation',
    '/docs/ecosystem/ui.md': 'React Web Dashboard UI',
    '/docs/legal/privacy.md': 'Privacy & Telemetry Policy',
    '/docs/legal/terms.md': 'Terms of Service & Usage SLA',
    '/docs/legal/license.md': 'Apache 2.0 Open Source License',
    '/docs/legal/soc2.md': 'SOC 2 Type II Security Controls',
    '/docs/changelog.md': 'Changelog & Release Notes'
  };

  const categoryOrder = ['Guides', 'Architecture', 'Ecosystem', 'Legal', 'Release Logs', 'General'];

  // Group loaded docs dynamically
  const groupedDocs: Record<string, { path: string; label: string }[]> = {};

  allDocs.forEach(doc => {
    const cat = doc.category || 'General';
    if (!groupedDocs[cat]) groupedDocs[cat] = [];
    groupedDocs[cat].push({
      path: doc.path,
      label: labelMap[doc.path] || doc.title
    });
  });

  const docNavGroups = Object.keys(groupedDocs)
    .sort((a, b) => {
      const idxA = categoryOrder.indexOf(a);
      const idxB = categoryOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    })
    .map(category => ({
      category,
      items: groupedDocs[category]
    }));

  const currentDoc = getDocByPath(activePath) || getDocByPath('/docs/guides/quickstart.md') || allDocs[0];

  // Filter items if searching
  const filteredNav = docNavGroups.map(group => ({
    ...group,
    items: group.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.path.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-[#27272A] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-[#111113] border border-[#27272A] text-[#FF5A3C] font-bold">
              DYNAMIC MARKDOWN DOCUMENTATION HUB
            </span>
            <span className="text-xs font-mono text-[#A1A1AA]">Hot-Reload Enabled</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#F4F4F5] font-mono">
            Miki Developer Documentation
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/glayph/agent"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 text-xs font-mono text-[#A1A1AA] hover:text-white bg-[#111113] border border-[#27272A] rounded-lg flex items-center gap-2 transition-colors"
          >
            GitHub Repository <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Grid: Sidebar + Markdown Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Nav Sidebar */}
        <div className="bg-[#111113] border border-[#27272A] rounded-xl p-4 h-fit lg:sticky lg:top-24 space-y-4">
          
          {/* Sidebar Header & Mobile Toggle */}
          <div className="flex items-center justify-between pb-3 border-b border-[#27272A]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FF5A3C]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F4F4F5]">
                Navigation Index
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1F1F23] text-[#A1A1AA] border border-[#27272A]">
                {allDocs.length} docs
              </span>
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="lg:hidden p-1 bg-[#18181B] text-[#FF5A3C] border border-[#27272A] rounded text-xs font-mono"
              >
                {mobileNavOpen ? 'Hide' : 'Select Doc'}
              </button>
            </div>
          </div>

          {/* Search Input & List Container (Always visible on lg, togglable on mobile) */}
          <div className={`${mobileNavOpen ? 'block' : 'hidden lg:block'} space-y-4`}>
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
              <input
                type="text"
                placeholder="Filter docs files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-2 bg-[#0A0A0B] border border-[#27272A] rounded-lg text-xs font-mono text-[#F4F4F5] outline-none focus:border-[#FF5A3C] transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category List */}
            <div className="space-y-5 max-h-[50vh] lg:max-h-[calc(100vh-240px)] overflow-y-auto pr-1 custom-scrollbar">
              {filteredNav.map((cat, idx) => {
                const CategoryIcon = categoryIcons[cat.category] || Folder;
                return (
                  <div key={idx} className="space-y-1.5">
                    {/* Category Banner */}
                    <div className="flex items-center justify-between px-2 py-1 rounded bg-[#18181B]/60 border border-[#27272A]/40">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="w-3.5 h-3.5 text-[#FF5A3C]" />
                        <span className="text-[11px] font-mono uppercase tracking-wider text-[#F4F4F5] font-bold">
                          {cat.category}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#71717A] bg-[#0A0A0B] px-1.5 py-0.2 rounded border border-[#27272A]">
                        {cat.items.length}
                      </span>
                    </div>

                    {/* Sub-items */}
                    <ul className="space-y-0.5 pl-1">
                      {cat.items.map((item) => {
                        const isActive = activePath === item.path;
                        return (
                          <li key={item.path}>
                            <button
                              onClick={() => {
                                setActivePath(item.path);
                                setMobileNavOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-2 text-xs font-mono rounded-md transition-all flex items-center justify-between group min-h-[38px] ${
                                isActive
                                  ? 'bg-[#FF5A3C]/10 text-[#FF5A3C] font-semibold border-l-2 border-[#FF5A3C] pl-3'
                                  : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#18181B]'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#FF5A3C]' : 'text-[#52525B] group-hover:text-[#A1A1AA]'}`} />
                                <span className="truncate">{item.label}</span>
                              </div>
                              {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#FF5A3C] shrink-0 ml-1" />}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}

              {filteredNav.length === 0 && (
                <div className="text-center py-6 text-xs font-mono text-[#71717A]">
                  No matching documentation files found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Content Reader */}
        <div className="lg:col-span-3 space-y-6">
          {currentDoc ? (
            <MarkdownViewer
              filePath={currentDoc.path}
              content={currentDoc.content}
              title={currentDoc.title}
              category={currentDoc.category}
            />
          ) : (
            <div className="p-8 bg-[#111113] border border-[#27272A] rounded-xl font-mono text-xs text-[#A1A1AA]">
              Documentation file not found: {activePath}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};


