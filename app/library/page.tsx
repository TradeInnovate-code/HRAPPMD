'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, FolderOpen, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { motionPresets } from '@/lib/utils/motion';
import { useLanguage } from '@/lib/language-context';

const TYPE_COLORS: Record<string, string> = {
  policy: 'bg-[#1F2179]/10 text-[#1F2179]',
  procedure: 'bg-[#28A745]/10 text-[#28A745]',
  checklist: 'bg-[#3291C9]/10 text-[#3291C9]',
  form: 'bg-[#EE6666]/10 text-[#EE6666]',
  other: 'bg-[#C5F5CB]/40 text-[#1F2179]',
};

interface TemplateListItem {
  id: string;
  name: string;
  type: string;
  createdAt: string;
}

export default function LibraryPage() {
  const { t } = useLanguage();
  const [templates, setTemplates] = useState<TemplateListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/templates')
      .then((res) => res.json())
      .then((data) => setTemplates(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('library.title')}
        description={t('library.description')}
      >
        <Link href="/library/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('library.newTemplate')}
          </Button>
        </Link>
      </PageHeader>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <motion.div {...motionPresets.fadeIn}>
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <FolderOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1">{t('library.noTemplates')}</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                {t('library.noTemplatesDescription')}
              </p>
              <Link href="/library/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  {t('library.createFirstTemplate')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/library/${t.id}`}>
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="p-5 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold leading-snug">{t.name}</h3>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[t.type] || TYPE_COLORS.other}`}
                      >
                        {t.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(t.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
