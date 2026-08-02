import React, { useState } from 'react';
import { X, Copy, Check, Terminal, BookOpen, Code, Layers } from 'lucide-react';
import { QUICKSTART_DOCS } from '../data/mikiContent';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-3xl bg-[#111113] border border-[#27272A] rounded-none shadow-2xl overflow-hidden font-mono text-xs max-h-[90vh] sm:max-h-[85vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#0A0A0B] border-b border-[#27272A] flex items-center justify-between">
          <div className="flex items-center gap-2 truncate pr-2">
            <BookOpen className="w-4 h-4 text-[#FF5A3C] shrink-0" />
            <span className="font-bold text-xs sm:text-sm text-[#F4F4F5] truncate">Miki SDK Quickstart & API Reference</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#111113] rounded-none border border-transparent hover:border-[#27272A] shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6">
          <div className="p-3.5 sm:p-4 rounded-none bg-[#0A0A0B] border border-[#27272A] text-[#A1A1AA] leading-relaxed text-xs">
            Miki is designed for developer control. Initialize your agent, configure memory drivers, register custom tool plugins, and run ReAct reasoning loops in under 2 minutes.
          </div>

          <div className="space-y-4">
            {QUICKSTART_DOCS.map((doc) => (
              <div key={doc.id} className="p-3.5 sm:p-4 rounded-none bg-[#0A0A0B] border border-[#27272A] space-y-2">
                <div className="flex items-center justify-between text-[#F4F4F5] gap-2">
                  <span className="font-bold text-xs text-[#FF5A3C] truncate">{doc.title}</span>
                  <button
                    onClick={() => handleCopy(doc.id, doc.code)}
                    className="p-1.5 text-[#A1A1AA] hover:text-[#F4F4F5] transition-colors shrink-0 flex items-center gap-1 text-[11px]"
                    title="Copy code"
                  >
                    {copiedId === doc.id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === doc.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-none bg-[#111113] text-xs text-[#F4F4F5] overflow-x-auto border border-[#27272A] whitespace-pre">
                  <code>{doc.code}</code>
                </pre>
              </div>
            ))}
          </div>

          {/* Engine Methods Reference */}
          <div className="p-3.5 sm:p-4 rounded-none bg-[#0A0A0B] border border-[#27272A] space-y-2">
            <div className="font-bold text-[#FF5A3C] text-xs">STANDALONE CLIENT ENGINE METHODS:</div>
            <div className="text-[#A1A1AA] space-y-1.5 text-[11px]">
              <div><code className="text-[#F4F4F5]">runAgentTask(prompt)</code> — Client-side ReAct agent execution</div>
              <div><code className="text-[#F4F4F5]">getSystemHealth()</code> — Real-time telemetry & cluster status</div>
              <div><code className="text-[#F4F4F5]">getSkillsMarketplace()</code> — Local skill plugins registry & persistence</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 bg-[#0A0A0B] border-t border-[#27272A] flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#FF5A3C] hover:bg-[#FF7A5C] text-white rounded-none text-xs font-mono font-bold uppercase min-h-[40px]"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
