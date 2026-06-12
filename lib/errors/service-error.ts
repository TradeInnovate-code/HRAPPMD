export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

export function ok<T>(data: T): ServiceResult<T> {
  return { success: true, data };
}

export function err<T = never>(code: string, message: string): ServiceResult<T> {
  return { success: false, error: { code, message } };
}

export class ServiceError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = 'ServiceError';
  }

  toResult(): ServiceResult<never> {
    return err(this.code, this.message);
  }
}
