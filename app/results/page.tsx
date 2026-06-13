'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, FileDown, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { motionPresets } from '@/lib/utils/motion';
import { useLanguage } from '@/lib/language-context';

const STATUS_MAP: Record<string, { icon: React.ElementType; color: string }> = {
  pending: { icon: Clock, color: 'text-[#3291C9]' },
  completed: { icon: CheckCircle2, color: 'text-[#28A745]' },
  failed: { icon: AlertCircle, color: 'text-[#EE6666]' },
};

interface ExportItem {
  id: string;
  format: string;
  status: string;
  entityType: string;
  entityId: string;
  createdAt: string;
}

export default function ResultsPage() {
  const { t } = useLanguage();
  const [exports, setExports] = useState<ExportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/exports')
      .then((res) => res.json())
      .then((data) => setExports(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('results.title')}
        description={t('results.description')}
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : exports.length === 0 ? (
        <motion.div {...motionPresets.fadeIn}>
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <FileDown className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-1">{t('results.noExports')}</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {t('results.noExportsDescription')}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('results.exportHistory')}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {exports.map((exp, i) => {
                const statusInfo = STATUS_MAP[exp.status] || STATUS_MAP.pending;
                const StatusIcon = statusInfo.icon;
                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {exp.entityType.replace('-', ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(exp.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{exp.format.toUpperCase()}</Badge>
                      {exp.status === 'completed' && (
                        <Download className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
