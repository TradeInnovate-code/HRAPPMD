'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { JDForm } from '@/features/job-descriptions/components/jd-form';
import { LivePreviewPanel } from '@/features/job-descriptions/components/live-preview-panel';
import type { JobDescriptionOutput } from '@/features/job-descriptions/schemas/jd.schemas';

export default function NewJobDescriptionPage() {
  const [result, setResult] = useState<
    (JobDescriptionOutput & { id: string; roleTitle: string }) | null
  >(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Generate Job Description"
        description="Enter the role details and let AI create a complete job profile."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <JDForm onGenerated={setResult} />
        <LivePreviewPanel result={result} />
      </div>
    </div>
  );
}
