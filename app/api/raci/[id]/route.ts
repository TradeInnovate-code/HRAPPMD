import { NextRequest, NextResponse } from 'next/server';
import { requireOrg } from '@/lib/auth/require-auth';
import { parseRequestBody } from '@/lib/validations/parse';
import { SaveRaciSchema } from '@/features/raci/schemas/raci.schemas';
import { getRaciMatrix, updateRaciMatrix } from '@/features/raci/services/raci-service';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { organizationId } = await requireOrg();
    const { id } = await params;
    const result = await getRaciMatrix(id, organizationId);

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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { organizationId } = await requireOrg();
    const { id } = await params;

    const parsed = await parseRequestBody(request, SaveRaciSchema.partial());
    if (!parsed.success) {
      return NextResponse.json(parsed.error, { status: 400 });
    }

    const result = await updateRaciMatrix(id, parsed.data, organizationId);
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
