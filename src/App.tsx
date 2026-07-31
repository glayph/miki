import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturesGrid } from './components/FeaturesGrid';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { SkillMarketplace } from './components/SkillMarketplace';
import { ApiKeyManager } from './components/ApiKeyManager';
import { TelemetryStatus } from './components/TelemetryStatus';
import { PricingSection } from './components/PricingSection';
import { DocsModal } from './components/DocsModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [docsOpen, setDocsOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('miki_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('miki_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    const element = document.getElementById(tabId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPlan = (planId: string) => {
    handleNavClick('apikeys');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F4F4F5] selection:bg-[#FF5A3C] selection:text-white transition-colors duration-200">
      
      {/* Sticky Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDocs={() => setDocsOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Flow */}
      <main>
        {/* Hero Section with Code Snippet & Live ReAct Sandbox */}
        <Hero
          onGetStarted={() => handleNavClick('apikeys')}
          onOpenDocs={() => setDocsOpen(true)}
        />

        {/* Features Grid (6 Core Cards) */}
        <FeaturesGrid />

        {/* Interactive Architecture Diagram */}
        <ArchitectureDiagram />

        {/* Skill Marketplace & Ecosystem Hub */}
        <SkillMarketplace />

        {/* Developer API Key Studio */}
        <ApiKeyManager />

        {/* Framework Live Telemetry Monitor */}
        <TelemetryStatus />

        {/* Pricing Tiers */}
        <PricingSection onSelectPlan={handleSelectPlan} />
      </main>

      {/* Minimal Footer */}
      <Footer
        onNavClick={handleNavClick}
        onOpenDocs={() => setDocsOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Quickstart Documentation Drawer / Modal */}
      <DocsModal
        isOpen={docsOpen}
        onClose={() => setDocsOpen(false)}
      />

    </div>
  );
}
