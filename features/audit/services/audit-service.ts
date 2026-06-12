import { prisma } from '@/lib/prisma/client';
import { ok, err, type ServiceResult } from '@/lib/errors/service-error';
import { calculateAuditScore } from './scoring-engine';
import type { SubmitAuditInput, AuditResult } from '../schemas/audit.schemas';
import { track } from '@/lib/telemetry/events';

export async function startAudit(
  organizationId: string,
): Promise<ServiceResult<{ auditId: string }>> {
  try {
    const audit = await prisma.audit.create({
      data: {
        organizationId,
        status: 'in_progress',
        version: '1.0',
      },
    });
    track('audit.started', { auditId: audit.id, organizationId });
    return ok({ auditId: audit.id });
  } catch {
    return err('AUDIT_CREATE_ERROR', 'Failed to create audit');
  }
}

export async function submitAudit(
  input: SubmitAuditInput,
  organizationId: string,
): Promise<ServiceResult<AuditResult>> {
  try {
    // Verify audit belongs to organization
    const audit = await prisma.audit.findFirst({
      where: { id: input.auditId, organizationId },
    });

    if (!audit) {
      return err('AUDIT_NOT_FOUND', 'Audit not found');
    }

    if (audit.status === 'completed') {
      return err('AUDIT_ALREADY_COMPLETED', 'This audit has already been completed');
    }

    // Save answers
    await prisma.auditAnswer.deleteMany({ where: { auditId: input.auditId } });
    await prisma.auditAnswer.createMany({
      data: input.answers.map((a) => ({
        auditId: input.auditId,
        questionKey: a.questionKey,
        answerValue: a.answerValue,
        answerText: a.answerText ?? null,
      })),
    });

    // Calculate score
    const result = calculateAuditScore({ answers: input.answers });

    // Update audit
    await prisma.audit.update({
      where: { id: input.auditId },
      data: {
        status: 'completed',
        score: result.overallScore,
        resultJson: JSON.parse(JSON.stringify(result)),
        completedAt: new Date(),
      },
    });

    // Update organization maturity score
    await prisma.organization.update({
      where: { id: organizationId },
      data: { maturityScore: result.overallScore },
    });

    track('audit.completed', {
      auditId: input.auditId,
      organizationId,
      score: result.overallScore,
    });

    return ok(result);
  } catch {
    return err('AUDIT_SUBMIT_ERROR', 'Failed to submit audit');
  }
}

export async function getAudit(
  auditId: string,
  organizationId: string,
): Promise<
  ServiceResult<{
    id: string;
    status: string;
    score: number | null;
    resultJson: AuditResult | null;
    answers: { questionKey: string; answerValue: string | null; answerText: string | null }[];
    startedAt: Date;
    completedAt: Date | null;
  }>
> {
  try {
    const audit = await prisma.audit.findFirst({
      where: { id: auditId, organizationId },
      include: {
        answers: {
          select: {
            questionKey: true,
            answerValue: true,
            answerText: true,
          },
        },
      },
    });

    if (!audit) {
      return err('AUDIT_NOT_FOUND', 'Audit not found');
    }

    return ok({
      id: audit.id,
      status: audit.status,
      score: audit.score,
      resultJson: audit.resultJson as AuditResult | null,
      answers: audit.answers,
      startedAt: audit.startedAt,
      completedAt: audit.completedAt,
    });
  } catch {
    return err('AUDIT_FETCH_ERROR', 'Failed to fetch audit');
  }
}
