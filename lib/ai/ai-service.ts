import { z } from 'zod';
import { openai, AI_MODEL } from './client';
import { parseAiResponse } from './parse-ai-response';
import { err, type ServiceResult } from '@/lib/errors/service-error';
import { track } from '@/lib/telemetry/events';

export const JobDescriptionOutputSchema = z.object({
  responsibilities: z.array(z.string().min(1)).min(3),
  competencies: z.array(z.string().min(1)).min(3),
  kpis: z.array(z.string().min(1)).min(3),
});

export type JobDescriptionOutput = z.infer<typeof JobDescriptionOutputSchema>;

export interface GenerateJobDescriptionParams {
  roleTitle: string;
  level?: string;
  department?: string;
  responsibilities?: string[];
  industry?: string;
}

function buildJobDescriptionPrompt(params: GenerateJobDescriptionParams): string {
  const context = [
    `Role Title: ${params.roleTitle}`,
    params.level ? `Level: ${params.level}` : null,
    params.department ? `Department: ${params.department}` : null,
    params.industry ? `Industry: ${params.industry}` : null,
    params.responsibilities?.length
      ? `Existing Responsibilities: ${params.responsibilities.join(', ')}`
      : null,
  ]
    .filter(Boolean)
    .join('\n');

  return `You are an expert HR consultant. Generate a structured job description based on the following information.

${context}

Return ONLY valid JSON with exactly these fields:
- "responsibilities": string[] (minimum 5 items, specific and measurable)
- "competencies": string[] (minimum 5 items, mix of technical and soft skills)
- "kpis": string[] (minimum 3 items, quantifiable where possible)

Rules:
- No markdown formatting
- No explanation or commentary
- No extra keys
- Each item should be a complete, professional sentence`;
}

export async function generateJobDescription(
  params: GenerateJobDescriptionParams,
  maxRetries = 1,
): Promise<ServiceResult<JobDescriptionOutput>> {
  const prompt = buildJobDescriptionPrompt(params);

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        return err('AI_EMPTY_RESPONSE', 'AI returned an empty response');
      }

      const result = await parseAiResponse(content, JobDescriptionOutputSchema);
      if (result.success) {
        return result;
      }

      if (attempt < maxRetries) {
        track('ai.validation_failure', { attempt, error: result.error.message });
        continue;
      }

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown AI error';
      if (attempt < maxRetries) {
        track('ai.validation_failure', { attempt, error: message });
        continue;
      }
      return err('AI_REQUEST_ERROR', message);
    }
  }

  return err('AI_MAX_RETRIES', 'AI generation failed after maximum retries');
}
