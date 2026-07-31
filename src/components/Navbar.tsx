import React, { useState } from 'react';
import { Github, Terminal, Key, Cpu, Menu, X, Layers, ShieldAlert, Sparkles, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDocs: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenDocs, theme, onToggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'skills', label: 'Skills & Ecosystem' },
    { id: 'apikeys', label: 'API Keys' },
    { id: 'telemetry', label: 'Status' },
    { id: 'pricing', label: 'Pricing' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0B]/90 backdrop-blur-md border-b border-[#27272A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          onClick={() => handleNavClick('overview')} 
          className="flex items-center gap-2 text-left group focus:outline-none"
        >
          <div className="font-mono font-black text-xl tracking-tighter text-[#F4F4F5] flex items-center">
            <span className="text-[#FF5A3C]">{'{'}</span>MIKI<span className="text-[#FF5A3C]">{'}'}</span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#111113] border border-[#27272A] text-[#A1A1AA]">
            v1.4.2
          </span>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${
                  isActive
                    ? 'text-[#FF5A3C] bg-[#111113] border border-[#FF5A3C]/40 font-semibold'
                    : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#111113]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenDocs}
            className="px-3 py-1.5 text-xs font-mono text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#111113] rounded-md border border-transparent hover:border-[#27272A] transition-colors"
          >
            Docs
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#111113] border border-[#27272A] rounded-md transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>

          <button
            onClick={onToggleTheme}
            className="p-1.5 text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#111113] border border-[#27272A] rounded-md transition-colors flex items-center justify-center"
            title={theme === 'dark' ? "Switch to Light Theme" : "Switch to Dark Theme"}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#FF5A3C]" />
            ) : (
              <Moon className="w-4 h-4 text-[#FF5A3C]" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('apikeys')}
            className="px-4 py-1.5 text-xs font-mono font-medium text-white bg-[#FF5A3C] hover:bg-[#FF7A5C] rounded-lg transition-all shadow-sm flex items-center gap-1.5 focus:ring-2 focus:ring-[#FF5A3C]/50"
          >
            <Key className="w-3.5 h-3.5" />
            Get Started
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#A1A1AA] hover:text-[#F4F4F5] border border-[#27272A] rounded-lg bg-[#111113]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0B] border-b border-[#27272A] px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="w-full text-left px-3 py-2 text-sm font-mono rounded-md text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#111113]"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#27272A] flex flex-col gap-2">
            <button
              onClick={onToggleTheme}
              className="w-full text-left px-3 py-2 text-sm font-mono text-[#A1A1AA] hover:text-[#F4F4F5] bg-[#111113] border border-[#27272A] rounded-md flex items-center justify-between"
            >
              <span>Theme: {theme === 'dark' ? 'Dark' : 'Light'}</span>
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#FF5A3C]" /> : <Moon className="w-4 h-4 text-[#FF5A3C]" />}
            </button>
            <button
              onClick={() => { onOpenDocs(); setMobileMenuOpen(false); }}
              className="w-full text-center py-2 text-sm font-mono text-[#A1A1AA] bg-[#111113] border border-[#27272A] rounded-md"
            >
              Documentation
            </button>
            <button
              onClick={() => handleNavClick('apikeys')}
              className="w-full text-center py-2 text-sm font-mono font-medium text-white bg-[#FF5A3C] rounded-md"
            >
              Get Started / API Keys
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
