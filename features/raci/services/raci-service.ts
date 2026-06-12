import { prisma } from '@/lib/prisma/client';
import { ok, err, type ServiceResult } from '@/lib/errors/service-error';
import type { SaveRaciInput, RaciCell } from '../schemas/raci.schemas';
import { track } from '@/lib/telemetry/events';

export async function saveRaciMatrix(
  input: SaveRaciInput,
  organizationId: string,
): Promise<ServiceResult<{ id: string }>> {
  try {
    const matrix = await prisma.raciMatrix.create({
      data: {
        organizationId,
        name: input.name,
        matrixJson: JSON.parse(JSON.stringify(input.cells)),
      },
    });

    track('raci.saved', { matrixId: matrix.id, name: input.name });
    return ok({ id: matrix.id });
  } catch {
    return err('RACI_SAVE_ERROR', 'Failed to save RACI matrix');
  }
}

export async function getRaciMatrix(
  matrixId: string,
  organizationId: string,
): Promise<
  ServiceResult<{
    id: string;
    name: string;
    cells: RaciCell[];
    createdAt: Date;
  }>
> {
  try {
    const matrix = await prisma.raciMatrix.findFirst({
      where: { id: matrixId, organizationId },
    });

    if (!matrix) {
      return err('RACI_NOT_FOUND', 'RACI matrix not found');
    }

    return ok({
      id: matrix.id,
      name: matrix.name,
      cells: matrix.matrixJson as unknown as RaciCell[],
      createdAt: matrix.createdAt,
    });
  } catch {
    return err('RACI_FETCH_ERROR', 'Failed to fetch RACI matrix');
  }
}

export async function listRaciMatrices(organizationId: string) {
  const matrices = await prisma.raciMatrix.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, createdAt: true },
  });

  return matrices;
}

export async function updateRaciMatrix(
  matrixId: string,
  input: Partial<SaveRaciInput>,
  organizationId: string,
): Promise<ServiceResult<{ id: string }>> {
  try {
    const existing = await prisma.raciMatrix.findFirst({
      where: { id: matrixId, organizationId },
    });

    if (!existing) {
      return err('RACI_NOT_FOUND', 'RACI matrix not found');
    }

    await prisma.raciMatrix.update({
      where: { id: matrixId },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.cells && { matrixJson: JSON.parse(JSON.stringify(input.cells)) }),
      },
    });

    return ok({ id: matrixId });
  } catch {
    return err('RACI_UPDATE_ERROR', 'Failed to update RACI matrix');
  }
}
