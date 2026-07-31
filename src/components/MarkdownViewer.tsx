import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  FileText, Code, Eye, Copy, Check, Terminal, ExternalLink, 
  Info, Edit3, Sparkles 
} from 'lucide-react';

interface MarkdownViewerProps {
  filePath: string;
  content: string;
  title?: string;
  category?: string;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({
  filePath,
  content,
  title,
  category
}) => {
  const [viewMode, setViewMode] = useState<'rendered' | 'raw'>('rendered');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [showEditInfo, setShowEditInfo] = useState<boolean>(false);

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(content);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const lines = content.split('\n');

  return (
    <div className="bg-[#111113] border border-[#27272A] rounded-xl overflow-hidden">
      {/* Top Header & Inspector Control Bar */}
      <div className="bg-[#0A0A0B] border-b border-[#27272A] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Metadata & File Path Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          {category && (
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-[#18181B] border border-[#27272A] text-[#FF5A3C] font-bold">
              {category}
            </span>
          )}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#18181B] border border-[#27272A] rounded text-xs font-mono text-[#F4F4F5]">
            <FileText className="w-3.5 h-3.5 text-[#FF5A3C]" />
            <span className="text-[#A1A1AA]">Source:</span>
            <span className="text-[#FF5A3C] font-bold">{filePath}</span>
          </div>
        </div>

        {/* Right: Controls & Toggles */}
        <div className="flex items-center gap-2">
          {/* Edit Source Inspector Info */}
          <button
            onClick={() => setShowEditInfo(!showEditInfo)}
            className="px-2.5 py-1 bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-[#A1A1AA] hover:text-white rounded text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Learn how to edit this documentation file"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#FF5A3C]" />
            <span>Edit Source</span>
          </button>

          {/* Rendered vs Raw Toggle */}
          <div className="flex items-center bg-[#18181B] p-0.5 border border-[#27272A] rounded">
            <button
              onClick={() => setViewMode('rendered')}
              className={`px-2.5 py-1 text-xs font-mono rounded flex items-center gap-1.5 transition-all ${
                viewMode === 'rendered'
                  ? 'bg-[#FF5A3C] text-white font-bold'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Rendered</span>
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-2.5 py-1 text-xs font-mono rounded flex items-center gap-1.5 transition-all ${
                viewMode === 'raw'
                  ? 'bg-[#FF5A3C] text-white font-bold'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>View Raw</span>
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyRaw}
            className="p-1.5 bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-[#A1A1AA] hover:text-white rounded text-xs transition-colors"
            title="Copy Raw Markdown"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-[#FF5A3C]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Edit Source Info Banner */}
      {showEditInfo && (
        <div className="bg-[#18181B] border-b border-[#27272A] p-4 text-xs font-mono text-[#F4F4F5] flex items-start gap-3">
          <Info className="w-4 h-4 text-[#FF5A3C] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-[#FF5A3C]">Dynamic Markdown Sync Active</div>
            <p className="text-[#A1A1AA]">
              This documentation section is driven by <code className="text-white px-1 py-0.5 bg-[#0A0A0B] rounded border border-[#27272A]">{filePath}</code>.
            </p>
            <p className="text-[#A1A1AA]">
              To update this page, simply edit the file in your repository or AI Studio code editor. Vite's eager glob loader will automatically hot-reload the changes without requiring build restarts!
            </p>
          </div>
        </div>
      )}

      {/* Main Body */}
      <div className="p-6 sm:p-8">
        {viewMode === 'rendered' ? (
          <article className="prose prose-invert max-w-none text-xs sm:text-sm font-mono leading-relaxed space-y-4 text-[#A1A1AA]">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F4F5] border-b border-[#27272A] pb-3 mb-6 font-mono">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold text-[#F4F4F5] mt-8 mb-3 font-mono flex items-center gap-2">
                    <span className="text-[#FF5A3C]">•</span> {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-bold text-[#F4F4F5] mt-6 mb-2 font-mono">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-[#A1A1AA] leading-relaxed mb-4 font-mono text-xs sm:text-sm">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-1.5 text-[#A1A1AA] mb-4 pl-2 font-mono text-xs sm:text-sm">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-1.5 text-[#A1A1AA] mb-4 pl-2 font-mono text-xs sm:text-sm">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-[#A1A1AA]">{children}</li>
                ),
                code: ({ className, children, ...props }) => {
                  const isInline = !className && !String(children).includes('\n');
                  if (isInline) {
                    return (
                      <code className="px-1.5 py-0.5 rounded bg-[#0A0A0B] border border-[#27272A] text-[#FF5A3C] font-mono text-[11px] sm:text-xs">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <div className="relative my-4 rounded-lg bg-[#0A0A0B] border border-[#27272A] p-4 overflow-x-auto">
                      <code className="text-xs font-mono text-[#F4F4F5] block leading-relaxed">
                        {children}
                      </code>
                    </div>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-[#FF5A3C] bg-[#0A0A0B] p-4 my-4 text-[#F4F4F5] text-xs font-mono rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6 border border-[#27272A] rounded-lg bg-[#0A0A0B]">
                    <table className="w-full text-left text-xs font-mono text-[#A1A1AA] border-collapse">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-[#18181B] text-[#F4F4F5] border-b border-[#27272A] font-bold">
                    {children}
                  </thead>
                ),
                th: ({ children }) => (
                  <th className="p-3 border-r border-[#27272A] last:border-r-0">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="p-3 border-t border-[#27272A] border-r border-[#27272A] last:border-r-0">{children}</td>
                ),
                hr: () => <hr className="border-[#27272A] my-8" />,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF5A3C] hover:underline font-mono inline-flex items-center gap-1"
                  >
                    {children}
                  </a>
                )
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        ) : (
          /* Raw Markdown Mode */
          <div className="bg-[#0A0A0B] border border-[#27272A] rounded-lg p-4 font-mono text-xs overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody>
                {lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-[#18181B]">
                    <td className="w-12 text-right pr-4 text-[#52525B] select-none border-r border-[#27272A] py-0.5">
                      {idx + 1}
                    </td>
                    <td className="pl-4 text-[#A1A1AA] whitespace-pre py-0.5">
                      {line}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
