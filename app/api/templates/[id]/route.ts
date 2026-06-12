import { NextRequest, NextResponse } from 'next/server';
import { requireOrg } from '@/lib/auth/require-auth';
import { parseRequestBody } from '@/lib/validations/parse';
import { UpdateTemplateSchema } from '@/features/library/schemas/template.schemas';
import {
  getTemplate,
  updateTemplate,
  deleteTemplate,
} from '@/features/library/services/template-service';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { organizationId } = await requireOrg();
    const { id } = await params;
    const result = await getTemplate(id, organizationId);
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
    const parsed = await parseRequestBody(request, UpdateTemplateSchema);
    if (!parsed.success) {
      return NextResponse.json(parsed.error, { status: 400 });
    }
    const result = await updateTemplate(id, parsed.data, organizationId);
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

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { organizationId } = await requireOrg();
    const { id } = await params;
    const result = await deleteTemplate(id, organizationId);
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
