import { z } from 'zod';

export const CreateTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  type: z.enum(['policy', 'procedure', 'checklist', 'form', 'other']),
  content: z.string().min(1, 'Content is required'),
});

export const UpdateTemplateSchema = CreateTemplateSchema.partial();

export type CreateTemplateInput = z.infer<typeof CreateTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof UpdateTemplateSchema>;
export type TemplateType = CreateTemplateInput['type'];
