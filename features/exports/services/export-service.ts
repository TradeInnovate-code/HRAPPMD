import { prisma } from '@/lib/prisma/client';
import { ok, err, type ServiceResult } from '@/lib/errors/service-error';
import type { CreateExportInput } from '../schemas/export.schemas';
import { track } from '@/lib/telemetry/events';

export async function createExportJob(
  input: CreateExportInput,
  userId: string,
  organizationId: string,
): Promise<ServiceResult<{ id: string; status: string }>> {
  try {
    // Verify the entity exists in the user's org
    const entityExists = await verifyEntity(input.type, input.entityId, organizationId);
    if (!entityExists) {
      return err('ENTITY_NOT_FOUND', `${input.type} not found`);
    }

    const job = await prisma.exportJob.create({
      data: {
        userId,
        format: input.format,
        status: 'pending',
        entityType: input.type,
        entityId: input.entityId,
      },
    });

    // In a production system, this would queue a background job.
    // For MVP, we mark it as completed immediately.
    await prisma.exportJob.update({
      where: { id: job.id },
      data: { status: 'completed' },
    });

    track('export.created', { exportId: job.id, type: input.type, format: input.format });

    return ok({ id: job.id, status: 'completed' });
  } catch {
    return err('EXPORT_CREATE_ERROR', 'Failed to create export');
  }
}

export async function listExportJobs(userId: string) {
  return prisma.exportJob.findMany({
    where: { userId },
    select: {
      id: true,
      format: true,
      status: true,
      entityType: true,
      entityId: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function verifyEntity(
  type: string,
  entityId: string,
  organizationId: string,
): Promise<boolean> {
  switch (type) {
    case 'audit': {
      const audit = await prisma.audit.findFirst({
        where: { id: entityId, organizationId },
      });
      return !!audit;
    }
    case 'job-description': {
      const jd = await prisma.jobDescription.findFirst({
        where: { id: entityId, role: { organizationId } },
      });
      return !!jd;
    }
    case 'raci': {
      const raci = await prisma.raciMatrix.findFirst({
        where: { id: entityId, organizationId },
      });
      return !!raci;
    }
    default:
      return false;
  }
}
