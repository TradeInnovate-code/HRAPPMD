import { type ZodSchema } from 'zod';
import { err, type ServiceResult } from '@/lib/errors/service-error';

export function parseOrError<T>(schema: ZodSchema<T>, data: unknown): ServiceResult<T> {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const message = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
  return err('VALIDATION_ERROR', message);
}

export async function parseRequestBody<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<ServiceResult<T>> {
  try {
    const body = await request.json();
    return parseOrError(schema, body);
  } catch {
    return err('INVALID_JSON', 'Request body is not valid JSON');
  }
}
