'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { AuditWizard } from '@/features/audit/components/audit-wizard';
import { RecommendationPanel } from '@/features/audit/components/recommendation-panel';
import type { AuditResult, AuditAnswer } from '@/features/audit/schemas/audit.schemas';
import { AUDIT_QUESTIONS } from '@/features/audit/schemas/questions';

export default function NewAuditPage() {
  const router = useRouter();
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = useCallback(async (answers: AuditAnswer[]) => {
    setIsSubmitting(true);
    try {
      // Start audit
      const startRes = await fetch('/api/audit/start', { method: 'POST' });
      if (!startRes.ok) throw new Error('Failed to start audit');
      const { auditId } = await startRes.json();

      // Submit answers
      const submitRes = await fetch('/api/audit/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditId, answers }),
      });
      if (!submitRes.ok) throw new Error('Failed to submit audit');
      const result: AuditResult = await submitRes.json();
      setAuditResult(result);
    } catch (error) {
      console.error('Audit submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  if (auditResult) {
    return (
      <div>
        <PageHeader
          title="Audit Results"
          description="Here's your organizational maturity assessment."
        />
        <RecommendationPanel
          result={auditResult}
          onGoToDashboard={() => router.push('/dashboard')}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="New Audit"
        description={`Answer ${AUDIT_QUESTIONS.length} questions across 5 key domains to assess your organization.`}
      />
      <AuditWizard
        questions={AUDIT_QUESTIONS}
        onComplete={handleComplete}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
