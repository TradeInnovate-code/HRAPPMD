import { NextRequest, NextResponse } from 'next/server';
import { requireOrg } from '@/lib/auth/require-auth';
import { parseRequestBody } from '@/lib/validations/parse';
import { CreateTemplateSchema } from '@/features/library/schemas/template.schemas';
import { createTemplate, listTemplates } from '@/features/library/services/template-service';

export async function POST(request: NextRequest) {
  try {
    const { organizationId } = await requireOrg();
    const parsed = await parseRequestBody(request, CreateTemplateSchema);
    if (!parsed.success) {
      return NextResponse.json(parsed.error, { status: 400 });
    }
    const result = await createTemplate(parsed.data, organizationId);
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
    const templates = await listTemplates(organizationId);
    return NextResponse.json(templates);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Internal server error' },
      { status: 500 },
    );
  }
}
