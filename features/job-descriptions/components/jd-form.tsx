'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';
import type { GenerateJDInput, JobDescriptionOutput } from '../schemas/jd.schemas';

interface JDFormProps {
  onGenerated: (result: JobDescriptionOutput & { id: string; roleTitle: string }) => void;
}

export function JDForm({ onGenerated }: JDFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenerateJDInput>({
    defaultValues: {
      roleTitle: '',
      level: '',
      department: '',
      industry: '',
    },
  });

  async function onSubmit(data: GenerateJDInput) {
    setLoading(true);
    setError(null);

    // Parse comma-separated responsibilities into array
    const body = {
      ...data,
      responsibilities: data.responsibilities
        ? (data.responsibilities as unknown as string)
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean)
        : undefined,
    };

    try {
      const res = await fetch('/api/job-descriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.message || 'Generation failed');
        return;
      }

      onGenerated(json);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Role Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="roleTitle">Role Title *</Label>
            <Input
              id="roleTitle"
              placeholder="e.g. Senior Product Manager"
              {...register('roleTitle', { required: 'Role title is required' })}
            />
            {errors.roleTitle && (
              <p className="text-xs text-destructive">{errors.roleTitle.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="level">Seniority Level</Label>
              <Input id="level" placeholder="e.g. Senior, Lead, Manager" {...register('level')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="e.g. Engineering, Marketing"
                {...register('department')}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              placeholder="e.g. Fintech, Healthcare, SaaS"
              {...register('industry')}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="responsibilities">
              Key Responsibilities (optional, comma-separated)
            </Label>
            <Textarea
              id="responsibilities"
              placeholder="e.g. Lead cross-functional teams, Define product roadmap, Manage stakeholders"
              rows={3}
              {...register('responsibilities')}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating with AI…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Job Description
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
