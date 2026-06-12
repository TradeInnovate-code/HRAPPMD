import { z } from 'zod';

export const CreateExportSchema = z.object({
  type: z.enum(['audit', 'job-description', 'raci']),
  entityId: z.string().min(1, 'Entity ID is required'),
  format: z.enum(['pdf', 'docx', 'csv']),
});

export type CreateExportInput = z.infer<typeof CreateExportSchema>;
export type ExportFormat = CreateExportInput['format'];
export type ExportType = CreateExportInput['type'];
