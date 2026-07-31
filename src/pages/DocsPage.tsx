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

  const docNavGroups = [
    {
      category: 'Guides',
      items: [
        { path: '/docs/guides/quickstart.md', label: 'Quickstart & Installation' },
        { path: '/docs/guides/skills.md', label: 'Skill Plugin Development' }
      ]
    },
    {
      category: 'Architecture',
      items: [
        { path: '/docs/architecture/react.md', label: 'ReAct Orchestration Loop' }
      ]
    },
    {
      category: 'Ecosystem Specs',
      items: [
        { path: '/docs/ecosystem/hermes.md', label: 'Hermes Agent Bridge' },
        { path: '/docs/ecosystem/openclaw.md', label: 'OpenClaw Skill Adapter' },
        { path: '/docs/ecosystem/playwright.md', label: 'Playwright Chromium Tool' },
        { path: '/docs/ecosystem/sqlite-memory.md', label: 'SQLite Layered Memory' }
      ]
    },
    {
      category: 'Legal & Compliance',
      items: [
        { path: '/docs/legal/privacy.md', label: 'Privacy & Data Guarantees' },
        { path: '/docs/legal/terms.md', label: 'Terms & Usage SLA' },
        { path: '/docs/legal/license.md', label: 'MIT Open Source License' },
        { path: '/docs/legal/soc2.md', label: 'SOC2 Security Controls' }
      ]
    },
    {
      category: 'Release Logs',
      items: [
        { path: '/docs/changelog.md', label: 'Changelog & Version History' }
      ]
    }
  ];

  const currentDoc = getDocByPath(activePath) || getDocByPath('/docs/guides/quickstart.md');

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

