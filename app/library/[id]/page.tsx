'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save, Pencil, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { motionPresets } from '@/lib/utils/motion';

interface TemplateDetail {
  id: string;
  name: string;
  type: string;
  content: string;
  createdAt: string;
}

export default function TemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [template, setTemplate] = useState<TemplateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/templates/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTemplate(data);
        setDraft(data.content || '');
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/templates/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: draft }),
    });
    if (res.ok && template) {
      setTemplate({ ...template, content: draft });
      setEditing(false);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!template) {
    return <div className="py-16 text-center text-muted-foreground">Template not found.</div>;
  }

  return (
    <motion.div className="space-y-6" {...motionPresets.fadeIn}>
      <PageHeader
        title={template.name}
        description={`${template.type} • Created ${new Date(template.createdAt).toLocaleDateString()}`}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push('/library')}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
          {editing ? (
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-1.5 h-4 w-4" />
              )}
              Save
            </Button>
          ) : (
            <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
              <Pencil className="mr-1.5 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </PageHeader>

      <Card>
        <CardContent className="p-6">
          {editing ? (
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={24}
              className="font-mono text-sm"
            />
          ) : (
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">{template.content}</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
