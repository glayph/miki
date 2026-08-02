/// <reference types="vite/client" />

// Direct top-level Vite eager glob import for markdown files in /docs/
const globDocsSub = import.meta.glob('../../docs/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const globDocsRoot = import.meta.glob('../../docs/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

// Additional direct glob paths for absolute root paths
const globRootSub = import.meta.glob('/docs/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const globRootMain = import.meta.glob('/docs/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const globModules: Record<string, string> = {
  ...globDocsSub,
  ...globDocsRoot,
  ...globRootSub,
  ...globRootMain
};

export interface DocItem {
  path: string; // e.g. '/docs/architecture/react.md'
  title: string;
  category: string;
  content: string;
  id: string; // e.g. 'architecture-react'
}

function normalizePath(p: string): string {
  let clean = p;
  if (clean.includes('/docs/')) {
    clean = clean.substring(clean.indexOf('/docs/'));
  } else if (clean.startsWith('docs/')) {
    clean = '/' + clean;
  } else if (!clean.startsWith('/docs/')) {
    clean = '/docs/' + clean.replace(/^\//, '');
  }
  return clean;
}

// Map path keys to clean category names
function getCategoryFromPath(path: string): string {
  if (path.includes('/architecture/')) return 'Architecture';
  if (path.includes('/ecosystem/')) return 'Ecosystem';
  if (path.includes('/guides/')) return 'Guides';
  if (path.includes('/legal/')) return 'Legal';
  if (path.includes('changelog.md')) return 'Release Logs';
  return 'General';
}

// Extract first H1 title (# Title) or filename
function getTitleFromMarkdown(content: string, fallbackPath: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  if (match && match[1]) {
    return match[1].trim();
  }
  const cleanName = fallbackPath.split('/').pop()?.replace('.md', '') || fallbackPath;
  return cleanName.replace(/-/g, ' ').toUpperCase();
}

// Generate clean unique ID from path
function getIdFromPath(path: string): string {
  return path
    .replace(/^\/docs\//, '')
    .replace(/\.md$/, '')
    .replace(/\//g, '-');
}

export const markdownStore: Record<string, DocItem> = {};

// Extract raw string content from glob import value (string or { default: string })
function extractRawContent(modValue: any): string {
  if (typeof modValue === 'string') return modValue;
  if (modValue && typeof modValue === 'object') {
    if (typeof modValue.default === 'string') return modValue.default;
    if (typeof modValue.content === 'string') return modValue.content;
  }
  return String(modValue || '');
}

// Populate store
Object.entries(globModules).forEach(([filePath, modValue]) => {
  const rawText = extractRawContent(modValue);
  if (!rawText.trim()) return;

  const normalizedPath = normalizePath(filePath);
  const id = getIdFromPath(normalizedPath);
  const category = getCategoryFromPath(normalizedPath);
  const title = getTitleFromMarkdown(rawText, normalizedPath);

  markdownStore[normalizedPath] = {
    path: normalizedPath,
    title,
    category,
    content: rawText,
    id
  };
});

// Fallback embedded content if glob produced empty or missing items
const FALLBACK_DOCS: Record<string, { title: string; category: string; content: string }> = {
  '/docs/guides/quickstart.md': {
    title: 'Quickstart & Installation',
    category: 'Guides',
    content: `# 🎯 Quickstart Guide

## Overview
Welcome to **glayph/agent**! This guide will help you get up and running with the autonomous AI agent framework in minutes.

### 🚀 Getting Started
\`\`\`bash
# 1. Clone repo
git clone https://github.com/glayph/agent.git
cd agent

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
\`\`\`
`
  },
  '/docs/guides/skills.md': {
    title: 'Skill Plugin Development',
    category: 'Guides',
    content: `# 🧩 Skills & Tool Integration Guide

## Overview
Skills in glayph/agent provide modular, executable tools for autonomous agent workflows.
`
  },
  '/docs/architecture/react.md': {
    title: 'ReAct Orchestration Loop',
    category: 'Architecture',
    content: `# 🤖 ReAct Engine Architecture

## Overview
The glayph/agent framework implements a robust Reasoning & Action (ReAct) Engine.
`
  },
  '/docs/ecosystem/root.md': {
    title: 'Monorepo Architecture Structure',
    category: 'Ecosystem',
    content: `# Root — Top-Level Structure

\`\`\`
Hiro/
├── .devin/                          Devin AI workflow definitions
├── .github/workflows/               GitHub CI/CD pipelines
├── bin/                             CLI entry points
├── config/                          Runtime YAML configuration files
├── docs/                            Project documentation
├── packages/                        Monorepo workspaces
└── src/skills/                      Skills marketplace
\`\`\`
`
  },
  '/docs/ecosystem/core.md': {
    title: 'Core Agent Engine Runtime',
    category: 'Ecosystem',
    content: `# 🧠 Core Agent Engine Runtime

The core runtime provides state management, event orchestration, and model context assembly.
`
  },
  '/docs/ecosystem/hermes.md': {
    title: 'Hermes Communication Bus',
    category: 'Ecosystem',
    content: `# 📡 Hermes Message Bus Specification

Hermes provides inter-process communication (IPC) and message routing between agents and external bridges.
`
  },
  '/docs/ecosystem/openclaw.md': {
    title: 'OpenClaw Web Automation Engine',
    category: 'Ecosystem',
    content: `# 🦞 OpenClaw Web Automation Engine

OpenClaw enables structured web scraping, dynamic DOM navigation, and browser automation for Miki agents.
`
  },
  '/docs/ecosystem/playwright.md': {
    title: 'Playwright Browser Engine',
    category: 'Ecosystem',
    content: `# 🎭 Playwright Browser Engine Integration

Provides headless Chromium browser control with anti-bot detection mitigation.
`
  },
  '/docs/ecosystem/sqlite-memory.md': {
    title: 'SQLite Vector Memory Engine',
    category: 'Ecosystem',
    content: `# 🗄️ SQLite Vector Memory Engine

In-memory vector store using SQLite and cosine similarity for fast context retrieval.
`
  },
  '/docs/ecosystem/hiro-memory.md': {
    title: 'Hiro-Memory TKG Architecture',
    category: 'Ecosystem',
    content: `# 🕸️ Hiro-Memory Temporal Knowledge Graph

Manages entity relationships, time-decayed memory scoring, and episodic recall.
`
  },
  '/docs/ecosystem/hiro-cli.md': {
    title: 'Hiro Terminal TUI',
    category: 'Ecosystem',
    content: `# 💻 Hiro Terminal TUI & CLI

Interactive command-line interface for managing agents, sessions, and environment keys.
`
  },
  '/docs/ecosystem/gateway.md': {
    title: 'API Gateway Proxy',
    category: 'Ecosystem',
    content: `# 🌐 API Gateway Proxy

Secure WebSocket and HTTP gateway for routing external API requests to agent sessions.
`
  },
  '/docs/ecosystem/config.md': {
    title: 'Configuration & Secret Vault',
    category: 'Ecosystem',
    content: `# 🔒 Configuration & Secret Vault

Encrypted local credential store for managing API keys and environment variables.
`
  },
  '/docs/ecosystem/installer.md': {
    title: 'Skill Installer Framework',
    category: 'Ecosystem',
    content: `# 📦 Skill Installer Framework

Automated package manager for downloading, verifying, and registering agent skill plugins.
`
  },
  '/docs/ecosystem/scripts.md': {
    title: 'Build & Release Automation',
    category: 'Ecosystem',
    content: `# 🛠️ Build & Release Automation Scripts

Automation tools for bundling, linting, testing, and generating release artifacts.
`
  },
  '/docs/ecosystem/ui.md': {
    title: 'React Web Dashboard UI',
    category: 'Ecosystem',
    content: `# 🖥️ React Web Dashboard UI

Modern single-page application dashboard for real-time agent control and system monitoring.
`
  },
  '/docs/legal/privacy.md': {
    title: 'Privacy & Telemetry Policy',
    category: 'Legal',
    content: `# 🛡️ Privacy & Telemetry Policy

Miki is designed with zero-telemetry defaults. All agent execution and data remain client-side.
`
  },
  '/docs/legal/terms.md': {
    title: 'Terms of Service & Usage SLA',
    category: 'Legal',
    content: `# 📜 Terms of Service & SLA

Open-source usage terms and service level guidelines for glayph/agent software.
`
  },
  '/docs/legal/license.md': {
    title: 'Apache 2.0 Open Source License',
    category: 'Legal',
    content: `# 📄 Apache 2.0 License

Licensed under the Apache License, Version 2.0. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
`
  },
  '/docs/legal/soc2.md': {
    title: 'SOC 2 Type II Security Controls',
    category: 'Legal',
    content: `# 🔒 SOC 2 Type II Compliance Framework

Security controls, encryption standards, and audit logging specifications.
`
  },
  '/docs/changelog.md': {
    title: 'Changelog & Release Notes',
    category: 'Release Logs',
    content: `# 📋 Release Notes & Changelog

## v1.0.0
- Launch of glayph/agent framework
- Complete ReAct orchestration loop
- 40+ skills and tools pre-configured
`
  }
};

// Ensure fallbacks if missing
Object.entries(FALLBACK_DOCS).forEach(([path, doc]) => {
  if (!markdownStore[path]) {
    markdownStore[path] = {
      path,
      title: doc.title,
      category: doc.category,
      content: doc.content,
      id: getIdFromPath(path)
    };
  }
});

// Helper functions for UI components
export function getDocByPath(path: string): DocItem | null {
  if (!path) return Object.values(markdownStore)[0] || null;
  const normalized = normalizePath(path);
  
  if (markdownStore[normalized]) return markdownStore[normalized];
  if (markdownStore[path]) return markdownStore[path];

  const cleanFilename = path.split('/').pop() || path;
  
  const found = Object.values(markdownStore).find(
    doc => doc.path === normalized || 
           doc.path.endsWith(path) || 
           path.endsWith(doc.path) ||
           doc.path.endsWith(cleanFilename) ||
           doc.id === getIdFromPath(normalized)
  );

  return found || Object.values(markdownStore)[0] || null;
}

export function getAllDocs(): DocItem[] {
  return Object.values(markdownStore);
}

export function getDocsByCategory(): Record<string, DocItem[]> {
  const categories: Record<string, DocItem[]> = {};
  
  Object.values(markdownStore).forEach(doc => {
    if (!categories[doc.category]) {
      categories[doc.category] = [];
    }
    categories[doc.category].push(doc);
  });

  return categories;
}


