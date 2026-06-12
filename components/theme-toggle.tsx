'use client';

import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

function getInitialTheme(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('hri-theme');
  const prefersDark =
    stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', prefersDark);
  return prefersDark;
}

export function ThemeToggle() {
  const [dark, setDark] = useState(getInitialTheme);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('hri-theme', next ? 'dark' : 'light');
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="rounded-md p-2 text-muted-foreground hover:bg-muted transition-colors"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
