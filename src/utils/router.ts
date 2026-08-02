import { useState, useEffect } from 'react';

// Get current normalized pathname (supports hash routing '#/features' and pathname '/features')
function getNormalizedPathname(): string {
  if (window.location.hash) {
    const hashPath = window.location.hash.slice(1);
    return hashPath.startsWith('/') ? hashPath : '/' + hashPath;
  }
  return window.location.pathname || '/';
}

export function navigate(path: string) {
  const current = getNormalizedPathname();
  if (current !== path) {
    if (window.location.hash || window.location.protocol === 'file:') {
      window.location.hash = path;
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new Event('popstate'));
    }
  }
  window.scrollTo(0, 0);
}

export function usePathname(): string {
  const [pathname, setPathname] = useState<string>(getNormalizedPathname);

  useEffect(() => {
    const handleNavigation = () => {
      setPathname(getNormalizedPathname());
    };

    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('hashchange', handleNavigation);
    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('hashchange', handleNavigation);
    };
  }, []);

  return pathname;
}
