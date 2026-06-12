import { NextResponse } from 'next/server';
import { requireOrg } from '@/lib/auth/require-auth';
import { startAudit } from '@/features/audit/services/audit-service';

export async function POST() {
  try {
    const { organizationId } = await requireOrg();
    const result = await startAudit(organizationId);

    if (!result.success) {
      return NextResponse.json(result.error, { status: 400 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Internal server error' },
      { status: 500 },
    );
  }
}
