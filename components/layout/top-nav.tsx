'use client';

import { usePathname, useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { useLanguage } from '@/lib/language-context';

const routeTitles: Record<string, string> = {
  '/dashboard': 'titles.dashboard',
  '/audit': 'titles.audit',
  '/job-descriptions': 'titles.jobDescriptions',
  '/raci': 'titles.raci',
  '/library': 'titles.library',
  '/results': 'titles.results',
  '/settings': 'titles.settings',
};

function getPageTitle(pathname: string, t: (path: string) => string): string {
  for (const [route, titleKey] of Object.entries(routeTitles)) {
    if (pathname.startsWith(route)) return t(titleKey);
  }
  return t('titles.hri');
}

export function TopNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const title = getPageTitle(pathname, t);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6 lg:px-8">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <LanguageToggle />
        <DevUserMenu />
      </div>
    </header>
  );
}

function DevUserMenu() {
  const router = useRouter();
  const { t } = useLanguage();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <User className="h-4 w-4" />
        <span>{t('topNav.admin')}</span>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
      >
        <LogOut className="h-4 w-4" />
        {t('topNav.logout')}
      </button>
    </div>
  );
}
