import { NextResponse } from 'next/server';
import { requireOrg } from '@/lib/auth/require-auth';
import { prisma } from '@/lib/prisma/client';

export async function GET() {
  try {
    const { organizationId } = await requireOrg();
    const roles = await prisma.role.findMany({
      where: { organizationId },
      select: { id: true, title: true, department: true, level: true },
      orderBy: { title: 'asc' },
    });
    return NextResponse.json(roles);
  } catch (error) {
    if (error instanceof NextResponse) return error;
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: 'Internal server error' },
      { status: 500 },
    );
  }
}
