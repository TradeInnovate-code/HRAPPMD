'use client';

import { PageHeader } from '@/components/layout/page-header';
import { User, Shield, Building } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function SettingsPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('settings.title')}
        description={t('settings.description')}
      />

      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5" /> {t('settings.profile')}
          </h2>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">{t('settings.name')}</span>
              <span className="font-medium">Dev Admin</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">{t('settings.email')}</span>
              <span className="font-medium">admin@hri.local</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">{t('settings.role')}</span>
              <span className="font-medium">Administrator</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Building className="h-5 w-5" /> {t('settings.organization')}
          </h2>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">{t('settings.organizationName')}</span>
              <span className="font-medium">Dev Organization</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">{t('settings.plan')}</span>
              <span className="font-medium">Development</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5" /> {t('settings.security')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t('settings.securityDescription')}
          </p>
        </div>
      </div>
    </div>
  );
}
