import { NextRequest, NextResponse } from 'next/server';
import { requireOrg } from '@/lib/auth/require-auth';
import { parseRequestBody } from '@/lib/validations/parse';
import { SaveRaciSchema } from '@/features/raci/schemas/raci.schemas';
import { saveRaciMatrix, listRaciMatrices } from '@/features/raci/services/raci-service';

export async function POST(request: NextRequest) {
  try {
    const { organizationId } = await requireOrg();

    const parsed = await parseRequestBody(request, SaveRaciSchema);
    if (!parsed.success) {
      return NextResponse.json(parsed.error, { status: 400 });
    }

    const result = await saveRaciMatrix(parsed.data, organizationId);
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

export async function GET() {
  try {
    const { organizationId } = await requireOrg();
    const matrices = await listRaciMatrices(organizationId);
    return NextResponse.json(matrices);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Internal server error' },
      { status: 500 },
    );
  }
}
