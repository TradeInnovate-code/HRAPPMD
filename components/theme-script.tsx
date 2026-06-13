'use client';

export function ThemeScript() {
  // This runs on the client to set the theme before hydration
  if (typeof window !== 'undefined') {
    try {
      const t = localStorage.getItem('hri-theme');
      if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme:dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  }
  return null;
}
