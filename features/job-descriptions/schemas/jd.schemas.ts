import { z } from 'zod';

export const GenerateJDInputSchema = z.object({
  roleTitle: z.string().min(1, 'Role title is required'),
  level: z.string().optional(),
  department: z.string().optional(),
  responsibilities: z.array(z.string()).optional(),
  industry: z.string().optional(),
});

export const JobDescriptionOutputSchema = z.object({
  responsibilities: z.array(z.string().min(1)).min(3),
  competencies: z.array(z.string().min(1)).min(3),
  kpis: z.array(z.string().min(1)).min(3),
});

export const UpdateJDSchema = z.object({
  responsibilitiesJson: z.array(z.string()).optional(),
  competenciesJson: z.array(z.string()).optional(),
  kpisJson: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published']).optional(),
});

export type GenerateJDInput = z.infer<typeof GenerateJDInputSchema>;
export type JobDescriptionOutput = z.infer<typeof JobDescriptionOutputSchema>;
export type UpdateJDInput = z.infer<typeof UpdateJDSchema>;
