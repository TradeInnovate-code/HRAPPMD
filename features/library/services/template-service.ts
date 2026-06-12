import { prisma } from '@/lib/prisma/client';
import { ok, err, type ServiceResult } from '@/lib/errors/service-error';
import type { CreateTemplateInput, UpdateTemplateInput } from '../schemas/template.schemas';

export async function createTemplate(
  input: CreateTemplateInput,
  organizationId: string,
): Promise<ServiceResult<{ id: string }>> {
  try {
    const template = await prisma.documentTemplate.create({
      data: {
        organizationId,
        name: input.name,
        type: input.type,
        contentJson: { body: input.content },
      },
    });
    return ok({ id: template.id });
  } catch {
    return err('TEMPLATE_CREATE_ERROR', 'Failed to create template');
  }
}

export async function getTemplate(
  templateId: string,
  organizationId: string,
): Promise<
  ServiceResult<{
    id: string;
    name: string;
    type: string;
    content: string;
    createdAt: Date;
  }>
> {
  try {
    const template = await prisma.documentTemplate.findFirst({
      where: { id: templateId, organizationId },
    });
    if (!template) {
      return err('TEMPLATE_NOT_FOUND', 'Template not found');
    }
    const contentJson = template.contentJson as { body?: string };
    return ok({
      id: template.id,
      name: template.name,
      type: template.type,
      content: contentJson.body ?? '',
      createdAt: template.createdAt,
    });
  } catch {
    return err('TEMPLATE_FETCH_ERROR', 'Failed to fetch template');
  }
}

export async function updateTemplate(
  templateId: string,
  input: UpdateTemplateInput,
  organizationId: string,
): Promise<ServiceResult<{ id: string }>> {
  try {
    const existing = await prisma.documentTemplate.findFirst({
      where: { id: templateId, organizationId },
    });
    if (!existing) {
      return err('TEMPLATE_NOT_FOUND', 'Template not found');
    }
    await prisma.documentTemplate.update({
      where: { id: templateId },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.type && { type: input.type }),
        ...(input.content && { contentJson: { body: input.content } }),
      },
    });
    return ok({ id: templateId });
  } catch {
    return err('TEMPLATE_UPDATE_ERROR', 'Failed to update template');
  }
}

export async function listTemplates(organizationId: string) {
  return prisma.documentTemplate.findMany({
    where: { organizationId },
    select: { id: true, name: true, type: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteTemplate(
  templateId: string,
  organizationId: string,
): Promise<ServiceResult<{ id: string }>> {
  try {
    const existing = await prisma.documentTemplate.findFirst({
      where: { id: templateId, organizationId },
    });
    if (!existing) {
      return err('TEMPLATE_NOT_FOUND', 'Template not found');
    }
    await prisma.documentTemplate.delete({ where: { id: templateId } });
    return ok({ id: templateId });
  } catch {
    return err('TEMPLATE_DELETE_ERROR', 'Failed to delete template');
  }
}
