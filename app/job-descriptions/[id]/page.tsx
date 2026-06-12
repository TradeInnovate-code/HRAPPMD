'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { EditableListBlock } from '@/features/job-descriptions/components/editable-list-block';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { motionPresets } from '@/lib/utils/motion';

interface JDDetail {
  id: string;
  status: string;
  roleTitle: string;
  department: string | null;
  level: string | null;
  responsibilities: string[];
  competencies: string[];
  kpis: string[];
}

export default function JobDescriptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [jd, setJd] = useState<JDDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/job-descriptions/${id}`)
      .then((res) => res.json())
      .then(setJd)
      .finally(() => setLoading(false));
  }, [id]);

  async function save(
    updates: Partial<Pick<JDDetail, 'responsibilities' | 'competencies' | 'kpis' | 'status'>>,
  ) {
    setSaving(true);
    const body: Record<string, unknown> = {};
    if (updates.responsibilities) body.responsibilitiesJson = updates.responsibilities;
    if (updates.competencies) body.competenciesJson = updates.competencies;
    if (updates.kpis) body.kpisJson = updates.kpis;
    if (updates.status) body.status = updates.status;

    const res = await fetch(`/api/job-descriptions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setJd((prev) => (prev ? { ...prev, ...updates } : prev));
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!jd) {
    return (
      <div className="py-16 text-center text-muted-foreground">Job description not found.</div>
    );
  }

  return (
    <motion.div className="space-y-6" {...motionPresets.fadeIn}>
      <PageHeader
        title={jd.roleTitle}
        description={[jd.department, jd.level].filter(Boolean).join(' • ') || undefined}
      >
        <div className="flex items-center gap-2">
          <Badge variant={jd.status === 'published' ? 'success' : 'secondary'}>{jd.status}</Badge>
          <Button variant="outline" size="sm" onClick={() => router.push('/job-descriptions')}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
          {jd.status === 'draft' && (
            <Button size="sm" onClick={() => save({ status: 'published' })} disabled={saving}>
              <Send className="mr-1.5 h-4 w-4" />
              Publish
            </Button>
          )}
        </div>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-3">
        <EditableListBlock
          title="Responsibilities"
          items={jd.responsibilities}
          onSave={(items) => save({ responsibilities: items })}
          saving={saving}
        />
        <EditableListBlock
          title="Competencies"
          items={jd.competencies}
          onSave={(items) => save({ competencies: items })}
          saving={saving}
        />
        <EditableListBlock
          title="KPIs"
          items={jd.kpis}
          onSave={(items) => save({ kpis: items })}
          saving={saving}
        />
      </div>
    </motion.div>
  );
}
