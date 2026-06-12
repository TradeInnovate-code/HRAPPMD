import { z } from 'zod';

export const AuditAnswerSchema = z.object({
  questionKey: z.string().min(1),
  answerValue: z.string().min(1),
  answerText: z.string().optional(),
});

export const SubmitAuditSchema = z.object({
  auditId: z.string().min(1),
  answers: z.array(AuditAnswerSchema).min(1),
});

export const StartAuditSchema = z.object({
  organizationId: z.string().min(1),
});

export const AuditDomainScoreSchema = z.object({
  domain: z.string(),
  score: z.number().min(0).max(100),
  maxScore: z.number(),
  label: z.string(),
});

export const AuditResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  domainScores: z.array(AuditDomainScoreSchema),
  topIssues: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      severity: z.enum(['high', 'medium', 'low']),
      domain: z.string(),
    }),
  ),
  recommendedActions: z.array(z.string()),
});

export type AuditAnswer = z.infer<typeof AuditAnswerSchema>;
export type SubmitAuditInput = z.infer<typeof SubmitAuditSchema>;
export type AuditDomainScore = z.infer<typeof AuditDomainScoreSchema>;
export type AuditResult = z.infer<typeof AuditResultSchema>;
