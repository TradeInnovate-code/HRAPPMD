import { NextRequest, NextResponse } from 'next/server';
import { requireOrg } from '@/lib/auth/require-auth';
import { parseRequestBody } from '@/lib/validations/parse';
import { CreateExportSchema } from '@/features/exports/schemas/export.schemas';
import { createExportJob, listExportJobs } from '@/features/exports/services/export-service';

export async function POST(request: NextRequest) {
  try {
    const { userId, organizationId } = await requireOrg();
    const parsed = await parseRequestBody(request, CreateExportSchema);
    if (!parsed.success) {
      return NextResponse.json(parsed.error, { status: 400 });
    }
    const result = await createExportJob(parsed.data, userId, organizationId);
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
    const { userId } = await requireOrg();
    const exports = await listExportJobs(userId);
    return NextResponse.json(exports);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Internal server error' },
      { status: 500 },
    );
  }
}
