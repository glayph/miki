import React, { useState } from 'react';
import { Github, Menu, X, Sparkles, Sun, Moon, ChevronDown } from 'lucide-react';
import { navigate, usePathname } from '../utils/router';

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onOpenDocs?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Overview' },
    { path: '/features', label: 'Features' },
    { path: '/architecture/react', label: 'Architecture' },
    { path: '/marketplace', label: 'Skills & Ecosystem' },
    { path: '/telemetry', label: 'Status' },
  ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className={`sticky top-0 z-50 bg-[#0A0A0B]/90 backdrop-blur-md border-b transition-all duration-200 ${
      scrolled ? 'border-[#FF5A3C]/30 shadow-xl shadow-black/20' : 'border-[#27272A]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          onClick={() => handleNavClick('/')} 
          className="flex items-center gap-2 text-left group focus:outline-none"
        >
          <div className="font-mono font-black text-xl tracking-tighter text-[#F4F4F5] flex items-center">
            <span className="text-[#FF5A3C]">{'{'}</span>AGENT<span className="text-[#FF5A3C]">{'}'}</span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-none bg-[#111113] border border-emerald-500/40 text-emerald-400 font-semibold">
            glayph/Agent
          </span>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`px-3 py-1.5 text-xs font-mono rounded-none transition-all ${
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
            onClick={() => handleNavClick('/docs')}
            className={`px-3 py-1.5 text-xs font-mono rounded-none border transition-colors ${
              pathname === '/docs'
                ? 'text-[#FF5A3C] bg-[#111113] border-[#FF5A3C]/40'
                : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#111113] border-transparent hover:border-[#27272A]'
            }`}
          >
            Docs
          </button>

          <a
            href="https://github.com/glayph/agent"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#111113] border border-[#27272A] rounded-none transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>

          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-1.5 text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#111113] border border-[#27272A] rounded-none transition-colors flex items-center justify-center"
              title={theme === 'dark' ? "Switch to Light Theme" : "Switch to Dark Theme"}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#FF5A3C]" />
              ) : (
                <Moon className="w-4 h-4 text-[#FF5A3C]" />
              )}
            </button>
          )}

          <button
            onClick={() => handleNavClick('/marketplace')}
            className="px-4 py-1.5 text-xs font-mono font-medium text-white bg-[#FF5A3C] hover:bg-[#FF7A5C] rounded-none transition-all shadow-sm flex items-center gap-1.5 focus:ring-2 focus:ring-[#FF5A3C]/50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Get Started
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#A1A1AA] hover:text-[#F4F4F5] border border-[#27272A] rounded-none bg-[#111113]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0B]/98 backdrop-blur-lg border-b border-[#27272A] px-4 py-4 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full text-left px-3.5 py-2.5 text-sm font-mono rounded-none transition-all flex items-center justify-between min-h-[44px] ${
                    isActive
                      ? 'text-[#FF5A3C] bg-[#111113] border-l-2 border-[#FF5A3C] font-semibold pl-4'
                      : 'text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-[#111113]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 bg-[#FF5A3C]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#27272A] flex flex-col gap-2.5">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="w-full text-left px-3.5 py-2.5 text-sm font-mono text-[#A1A1AA] hover:text-[#F4F4F5] bg-[#111113] border border-[#27272A] rounded-none flex items-center justify-between min-h-[44px]"
              >
                <span>Theme: <strong className="text-[#F4F4F5]">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</strong></span>
                {theme === 'dark' ? <Sun className="w-4 h-4 text-[#FF5A3C]" /> : <Moon className="w-4 h-4 text-[#FF5A3C]" />}
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleNavClick('/docs')}
                className={`py-2.5 px-3 text-center text-xs font-mono font-medium rounded-none border transition-colors min-h-[44px] flex items-center justify-center ${
                  pathname === '/docs'
                    ? 'text-[#FF5A3C] bg-[#111113] border-[#FF5A3C]'
                    : 'text-[#A1A1AA] bg-[#111113] border-[#27272A] hover:text-[#F4F4F5]'
                }`}
              >
                Documentation
              </button>

              <a
                href="https://github.com/glayph/agent"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 text-center text-xs font-mono text-[#A1A1AA] hover:text-[#F4F4F5] bg-[#111113] border border-[#27272A] rounded-none flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>

            <button
              onClick={() => handleNavClick('/marketplace')}
              className="w-full text-center py-3 text-xs font-mono font-bold uppercase text-white bg-[#FF5A3C] hover:bg-[#FF7A5C] rounded-none shadow-md flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Sparkles className="w-4 h-4" />
              Get Started / Skills Registry
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
