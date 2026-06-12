import { NextRequest, NextResponse } from 'next/server';
import { requireOrg } from '@/lib/auth/require-auth';
import { parseRequestBody } from '@/lib/validations/parse';
import { SubmitAuditSchema } from '@/features/audit/schemas/audit.schemas';
import { submitAudit } from '@/features/audit/services/audit-service';

export async function POST(request: NextRequest) {
  try {
    const { organizationId } = await requireOrg();

    const parsed = await parseRequestBody(request, SubmitAuditSchema);
    if (!parsed.success) {
      return NextResponse.json(parsed.error, { status: 400 });
    }

    const result = await submitAudit(parsed.data, organizationId);
    if (!result.success) {
      return NextResponse.json(result.error, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Internal server error' },
      { status: 500 },
    );
  }
}
