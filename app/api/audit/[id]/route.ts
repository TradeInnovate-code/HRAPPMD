import { NextResponse } from 'next/server';
import { requireOrg } from '@/lib/auth/require-auth';
import { getAudit } from '@/features/audit/services/audit-service';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { organizationId } = await requireOrg();
    const { id } = await params;
    const result = await getAudit(id, organizationId);

    if (!result.success) {
      return NextResponse.json(result.error, { status: 404 });
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
