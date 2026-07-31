import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DocsModal } from './components/DocsModal';
import { usePathname, navigate } from './utils/router';

// Page Views
import { OverviewPage } from './pages/OverviewPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { ReActArchitecturePage } from './pages/ReActArchitecturePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { DocsPage } from './pages/DocsPage';
import { TelemetryPage } from './pages/TelemetryPage';
import { OpenClawPage } from './pages/ecosystem/OpenClawPage';
import { HermesPage } from './pages/ecosystem/HermesPage';
import { SqliteMemoryPage } from './pages/ecosystem/SqliteMemoryPage';
import { PlaywrightPage } from './pages/ecosystem/PlaywrightPage';
import { LicensePage } from './pages/legal/LicensePage';
import { PrivacyPage } from './pages/legal/PrivacyPage';
import { TermsPage } from './pages/legal/TermsPage';
import { Soc2Page } from './pages/legal/Soc2Page';

export default function App() {
  const pathname = usePathname();
  const [docsModalOpen, setDocsModalOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('miki_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('miki_theme', theme);
  }, [theme]);

  // Dynamic SEO Title & Meta Tag Updates based on current path
  useEffect(() => {
    const seoMap: Record<string, { title: string; description: string }> = {
      '/': {
        title: 'Miki — Agentic Framework for AI Engineers | ReAct Loop & Skill Marketplace',
        description: 'Miki is an open-source agentic framework for developers featuring autonomous ReAct orchestration, layered SQLite memory, and skill plugins.'
      },
      '/features': {
        title: 'Features Grid & Capabilities Matrix — Miki Framework',
        description: 'Explore Miki core features: ReAct loops, layered SQLite memory, Chromium browser automation, and universal skill bridges.'
      },
      '/architecture/react': {
        title: 'ReAct Architecture Loop Deep-Dive — Miki',
        description: 'Interactive state machine simulator, token cost estimator, and execution sequence diagrams for Miki ReAct reasoning kernel.'
      },
      '/marketplace': {
        title: 'Skill Marketplace & Ecosystem Registry — Miki',
        description: 'Browse and install verified skill plugins for Miki agents. Universal compatibility with OpenClaw JSON skills and Hermes tools.'
      },
      '/docs': {
        title: 'Documentation Hub & Quickstart Guide — Miki',
        description: 'Complete documentation for Miki framework. Installation, setup guides, API references, and skill plugin tutorials.'
      },
      '/telemetry': {
        title: 'System Telemetry & Live Status Dashboard — Miki',
        description: 'Real-time telemetry, worker node cluster metrics, SQLite memory allocation, and execution log stream.'
      },
      '/ecosystem/openclaw': {
        title: 'OpenClaw Skill Adapter Specification — Miki Ecosystem',
        description: 'Technical integration spec for converting OpenClaw JSON tool definitions into Miki ISkillPlugin format.'
      },
      '/ecosystem/hermes': {
        title: 'Hermes Agent Bridge Specification — Miki Ecosystem',
        description: 'Low-latency bi-directional socket streaming contract for Hermes Agent tools and remote execution runtimes.'
      },
      '/ecosystem/sqlite-memory': {
        title: 'SQLite Layered Memory Driver Spec — Miki Ecosystem',
        description: 'Technical specification for zero-latency local WAL mode vector-lite memory engine in Miki.'
      },
      '/ecosystem/playwright': {
        title: 'Playwright Chromium Tool Technical Spec — Miki Ecosystem',
        description: 'Headless browser automation tool spec with anti-detection fingerprinting and compressed DOM extraction.'
      },
      '/legal/license': {
        title: 'MIT Open Source License — Miki Framework',
        description: 'Official MIT License terms and permissions matrix for Miki core framework and CLI.'
      },
      '/legal/privacy': {
        title: 'Privacy Policy & Local Data Guarantees — Miki',
        description: 'Local SQLite storage guarantees, telemetry opt-out parameters, and zero model retraining assurances.'
      },
      '/legal/terms': {
        title: 'Terms of Service & Usage SLA — Miki Framework',
        description: 'Acceptable agent usage policy, API rate limit enforcement, and enterprise service level agreements.'
      },
      '/legal/soc2': {
        title: 'SOC2 Type II Readiness & Security Controls — Miki',
        description: 'Security controls matrix across AICPA Trust Services Criteria for Miki cloud and enterprise VPCs.'
      }
    };

    const currentSeo = seoMap[pathname] || seoMap['/'];
    document.title = currentSeo.title;

    const updateMeta = (selector: string, attrName: string, attrVal: string, content: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateMeta('meta[name="description"]', 'name', 'description', currentSeo.description);
    updateMeta('meta[property="og:title"]', 'property', 'og:title', currentSeo.title);
    updateMeta('meta[property="og:description"]', 'property', 'og:description', currentSeo.description);
  }, [pathname]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const renderCurrentPage = () => {
    switch (pathname) {
      case '/':
      case '/overview':
        return <OverviewPage onOpenDocs={() => navigate('/docs')} />;
      case '/features':
        return <FeaturesPage />;
      case '/architecture/react':
        return <ReActArchitecturePage />;
      case '/marketplace':
        return <MarketplacePage />;
      case '/docs':
        return <DocsPage />;
      case '/telemetry':
        return <TelemetryPage />;
      case '/ecosystem/openclaw':
        return <OpenClawPage />;
      case '/ecosystem/hermes':
        return <HermesPage />;
      case '/ecosystem/sqlite-memory':
        return <SqliteMemoryPage />;
      case '/ecosystem/playwright':
        return <PlaywrightPage />;
      case '/legal/license':
        return <LicensePage />;
      case '/legal/privacy':
        return <PrivacyPage />;
      case '/legal/terms':
        return <TermsPage />;
      case '/legal/soc2':
        return <Soc2Page />;
      default:
        return <OverviewPage onOpenDocs={() => navigate('/docs')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#F4F4F5] selection:bg-[#FF5A3C] selection:text-white transition-colors duration-200 flex flex-col justify-between">
      <div>
        {/* Sticky Header Navbar */}
        <Navbar theme={theme} onToggleTheme={toggleTheme} />

        {/* Main Routed Page Content with Framer Motion Page Transition */}
        <main>
          <AnimatePresence mode="wait">
            <React.Fragment key={pathname}>
              {renderCurrentPage()}
            </React.Fragment>
          </AnimatePresence>
        </main>
      </div>

      {/* Shared Root Footer */}
      <Footer theme={theme} onToggleTheme={toggleTheme} />

      {/* Quickstart Documentation Drawer / Modal */}
      <DocsModal
        isOpen={docsModalOpen}
        onClose={() => setDocsModalOpen(false)}
      />
    </div>
  );
}
