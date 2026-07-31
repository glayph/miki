import React from 'react';
import { Github, Terminal, Sun, Moon } from 'lucide-react';

interface FooterProps {
  onNavClick: (id: string) => void;
  onOpenDocs: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick, onOpenDocs, theme, onToggleTheme }) => {
  return (
    <footer className="bg-[#0A0A0B] border-t border-[#27272A] py-16 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Column Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Product */}
          <div>
            <div className="text-[#FF5A3C] font-bold mb-4 uppercase tracking-wider">PRODUCT</div>
            <ul className="space-y-2.5 text-[#A1A1AA]">
              <li><button onClick={() => onNavClick('features')} className="hover:text-[#F4F4F5]">Features Grid</button></li>
              <li><button onClick={() => onNavClick('architecture')} className="hover:text-[#F4F4F5]">ReAct Architecture</button></li>
              <li><button onClick={() => onNavClick('skills')} className="hover:text-[#F4F4F5]">Skill Marketplace</button></li>
              <li><button onClick={() => onNavClick('pricing')} className="hover:text-[#F4F4F5]">Pricing Tiers</button></li>
            </ul>
          </div>

          {/* Col 2: Resources */}
          <div>
            <div className="text-[#FF5A3C] font-bold mb-4 uppercase tracking-wider">RESOURCES</div>
            <ul className="space-y-2.5 text-[#A1A1AA]">
              <li><button onClick={onOpenDocs} className="hover:text-[#F4F4F5]">Documentation</button></li>
              <li><button onClick={() => onNavClick('apikeys')} className="hover:text-[#F4F4F5]">API Key Studio</button></li>
              <li><button onClick={() => onNavClick('telemetry')} className="hover:text-[#F4F4F5]">System Telemetry</button></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F4F4F5]">GitHub Repository</a></li>
            </ul>
          </div>

          {/* Col 3: Ecosystem */}
          <div>
            <div className="text-[#FF5A3C] font-bold mb-4 uppercase tracking-wider">ECOSYSTEM</div>
            <ul className="space-y-2.5 text-[#A1A1AA]">
              <li><span className="text-[#F4F4F5]">OpenClaw Skill Adapter</span></li>
              <li><span className="text-[#F4F4F5]">Hermes Agent Bridge</span></li>
              <li><span className="text-[#F4F4F5]">SQLite Memory Driver</span></li>
              <li><span className="text-[#F4F4F5]">Playwright Chromium Tool</span></li>
            </ul>
          </div>

          {/* Col 4: Legal & Framework */}
          <div>
            <div className="text-[#FF5A3C] font-bold mb-4 uppercase tracking-wider">LEGAL & LICENSE</div>
            <ul className="space-y-2.5 text-[#A1A1AA]">
              <li><span>MIT Open Source License</span></li>
              <li><span>Privacy Policy</span></li>
              <li><span>Terms of Service</span></li>
              <li><span>SOC2 Type II Ready</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#A1A1AA]">
          <div className="flex items-center gap-2">
            <div className="font-mono font-black text-sm tracking-tighter text-[#F4F4F5] flex items-center">
              <span className="text-[#FF5A3C]">{'{'}</span>MIKI<span className="text-[#FF5A3C]">{'}'}</span>
            </div>
            <span className="text-[#F4F4F5] font-bold uppercase tracking-wider">miki agentic framework</span>
            <span>© {new Date().getFullYear()} Miki Core Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="px-2.5 py-1 text-[#A1A1AA] hover:text-[#F4F4F5] bg-[#111113] border border-[#27272A] rounded flex items-center gap-1.5 transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#FF5A3C]" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#FF5A3C]" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            )}
            <span className="text-[#FF5A3C]">Express + Vite Fullstack Engine</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
