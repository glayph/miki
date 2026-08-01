import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, Search, ChevronRight, ExternalLink, FileText, Sparkles 
} from 'lucide-react';
import { getAllDocs, getDocByPath, markdownStore } from '../utils/markdownLoader';
import { MarkdownViewer } from '../components/MarkdownViewer';

export const DocsPage: React.FC = () => {
  const [activePath, setActivePath] = useState<string>('/docs/guides/quickstart.md');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
            className="px-3.5 py-1.5 text-xs font-mono text-[#A1A1AA] hover:text-white bg-[#111113] border border-[#27272A] rounded-lg flex items-center gap-2"
          >
            GitHub Repository <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Grid: Sidebar + Markdown Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Nav Sidebar */}
        <div className="space-y-6 bg-[#111113] border border-[#27272A] rounded-xl p-4 h-fit">
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
            <input
              type="text"
              placeholder="Filter docs files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#0A0A0B] border border-[#27272A] rounded-lg text-xs font-mono text-[#F4F4F5] outline-none focus:border-[#FF5A3C]"
            />
          </div>

          {filteredNav.map((cat, idx) => (
            <div key={idx}>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#FF5A3C] font-bold mb-2 px-2">
                {cat.category}
              </div>
              <ul className="space-y-1">
                {cat.items.map((item) => {
                  const isActive = activePath === item.path;
                  return (
                    <li key={item.path}>
                      <button
                        onClick={() => setActivePath(item.path)}
                        className={`w-full text-left px-2.5 py-1.5 text-xs font-mono rounded-md transition-all flex items-center justify-between ${
                          isActive
                            ? 'bg-[#0A0A0B] text-[#FF5A3C] font-bold border border-[#FF5A3C]/40'
                            : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#0A0A0B]'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {isActive && <ChevronRight className="w-3 h-3 text-[#FF5A3C]" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
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

