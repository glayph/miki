/// <reference types="vite/client" />
// Dynamic Markdown Loader using Vite Eager Glob Import
// Any edit to .md files under /docs/ automatically hot-reloads rendered docs!

const globModules = (import.meta as any).glob ? import.meta.glob('/docs/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string> : {};


export interface DocItem {
  path: string; // e.g. '/docs/architecture/react.md'
  title: string;
  category: string;
  content: string;
  id: string; // e.g. 'architecture-react'
}

// Map path keys to clean category names
function getCategoryFromPath(path: string): string {
  if (path.includes('/architecture/')) return 'Architecture';
  if (path.includes('/ecosystem/')) return 'Ecosystem';
  if (path.includes('/guides/')) return 'Guides';
  if (path.includes('/legal/')) return 'Legal';
  if (path.includes('changelog.md')) return 'Updates';
  return 'General';
}

// Extract first H1 title (# Title) or filename
function getTitleFromMarkdown(content: string, fallback: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  if (match && match[1]) {
    return match[1].trim();
  }
  const cleanName = fallback.split('/').pop()?.replace('.md', '') || fallback;
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

// Populate store
Object.entries(globModules).forEach(([filePath, content]) => {
  // Normalize file path if needed
  const normalizedPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  const id = getIdFromPath(normalizedPath);
  const category = getCategoryFromPath(normalizedPath);
  const title = getTitleFromMarkdown(content, normalizedPath);

  markdownStore[normalizedPath] = {
    path: normalizedPath,
    title,
    category,
    content,
    id
  };
});

// Helper functions for UI components
export function getDocByPath(path: string): DocItem | null {
  if (markdownStore[path]) return markdownStore[path];
  
  // Try matching without leading slash or with /docs prefix
  const key = Object.keys(markdownStore).find(
    p => p === path || p.endsWith(path) || p.includes(path)
  );
  return key ? markdownStore[key] : null;
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
