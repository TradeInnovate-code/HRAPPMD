'use client';

import { Globe } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  function toggleLanguage() {
    const next = language === 'en' ? 'ro' : 'en';
    setLanguage(next);
  }

  return (
    <button
      onClick={toggleLanguage}
      aria-label={t('topNav.toggleLanguage')}
      className="rounded-md p-2 text-muted-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
    >
      <Globe className="h-4 w-4" />
      <span className="text-xs font-medium uppercase">{language}</span>
    </button>
  );
}
