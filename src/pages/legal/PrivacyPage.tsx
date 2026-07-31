import React from 'react';
import { motion } from 'motion/react';
import { getDocByPath } from '../../utils/markdownLoader';
import { MarkdownViewer } from '../../components/MarkdownViewer';

export const PrivacyPage: React.FC = () => {
  const doc = getDocByPath('/docs/legal/privacy.md');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-[#111113] border border-[#27272A] text-[#FF5A3C] font-bold">
            LEGAL / PRIVACY POLICY
          </span>
          <span className="text-xs font-mono text-[#A1A1AA]">Updated July 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F4F5] font-mono mb-4">
          Privacy Policy & Local Data Guarantees
        </h1>
      </div>

      {doc ? (
        <MarkdownViewer
          filePath={doc.path}
          content={doc.content}
          title={doc.title}
          category={doc.category}
        />
      ) : (
        <div className="p-8 bg-[#111113] border border-[#27272A] rounded-xl text-xs font-mono text-[#A1A1AA]">
          Document /docs/legal/privacy.md not found.
        </div>
      )}
    </motion.div>
  );
};

