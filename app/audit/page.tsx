'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardCheck, ArrowRight, Plus } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function AuditPage() {
  const { t } = useLanguage();
  return (
    <div>
      <PageHeader
        title={t('audit.title')}
        description={t('audit.description')}
        actions={
          <Link href="/audit/new">
            <Button>
              <Plus className="h-4 w-4" /> {t('audit.startNewAudit')}
            </Button>
          </Link>
        }
      />

      {/* Empty state */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ClipboardCheck className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t('audit.noAudits')}</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            {t('audit.noAuditsDescription')}
          </p>
          <Link href="/audit/new">
            <Button>
              {t('audit.startYourFirstAudit')} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
