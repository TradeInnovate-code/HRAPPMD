'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Save, Loader2 } from 'lucide-react';

const TEMPLATE_TYPES = [
  { value: 'policy', label: 'Policy' },
  { value: 'procedure', label: 'Procedure' },
  { value: 'checklist', label: 'Checklist' },
  { value: 'form', label: 'Form' },
  { value: 'other', label: 'Other' },
];

export default function NewTemplatePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState('policy');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!name.trim() || !content.trim()) {
      setError('Name and content are required');
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), type, content: content.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || 'Failed to save');
        return;
      }
      router.push(`/library/${json.id}`);
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="New Template" description="Create a reusable HR document template." />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Template Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                placeholder="e.g. Remote Work Policy"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="type">Type</Label>
              <Select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                {TEMPLATE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Enter the template content..."
              rows={16}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.push('/library')}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
