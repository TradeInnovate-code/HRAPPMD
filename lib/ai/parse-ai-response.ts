import { ZodSchema } from 'zod';
import { err, ok, type ServiceResult } from '@/lib/errors/service-error';

export async function parseAiResponse<T>(
  rawResponse: string,
  schema: ZodSchema<T>,
): Promise<ServiceResult<T>> {
  try {
    const parsed = JSON.parse(rawResponse);
    const result = schema.safeParse(parsed);
    if (result.success) {
      return ok(result.data);
    }
    const message = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    return err('AI_VALIDATION_ERROR', `AI response failed schema validation: ${message}`);
  } catch {
    return err('AI_PARSE_ERROR', 'AI response is not valid JSON');
  }
}
