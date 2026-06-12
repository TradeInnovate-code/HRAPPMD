import { prisma } from '@/lib/prisma/client';
import { ok, err, type ServiceResult } from '@/lib/errors/service-error';
import { generateJobDescription as aiGenerateJD } from '@/lib/ai/ai-service';
import type { GenerateJDInput, UpdateJDInput } from '../schemas/jd.schemas';
import { track } from '@/lib/telemetry/events';

export async function generateJobDescription(
  input: GenerateJDInput,
  organizationId: string,
): Promise<
  ServiceResult<{
    id: string;
    roleTitle: string;
    responsibilities: string[];
    competencies: string[];
    kpis: string[];
  }>
> {
  try {
    // Get org info for industry context
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { industry: true },
    });

    // Create or find the role
    let role = await prisma.role.findFirst({
      where: {
        organizationId,
        title: input.roleTitle,
        department: input.department ?? null,
      },
    });

    if (!role) {
      role = await prisma.role.create({
        data: {
          organizationId,
          title: input.roleTitle,
          department: input.department ?? null,
          level: input.level ?? null,
        },
      });
    }

    // Call AI service
    const aiResult = await aiGenerateJD({
      roleTitle: input.roleTitle,
      level: input.level,
      department: input.department,
      responsibilities: input.responsibilities,
      industry: input.industry ?? org?.industry ?? undefined,
    });

    if (!aiResult.success) {
      return err(aiResult.error.code, aiResult.error.message);
    }

    const output = aiResult.data;

    // Save to database
    const jd = await prisma.jobDescription.create({
      data: {
        roleId: role.id,
        status: 'draft',
        responsibilitiesJson: output.responsibilities,
        competenciesJson: output.competencies,
        kpisJson: output.kpis,
        rawPromptVersion: 'jd_v1',
        rawAiOutputJson: JSON.parse(JSON.stringify(output)),
      },
    });

    track('jd.generated', { jdId: jd.id, roleTitle: input.roleTitle });

    return ok({
      id: jd.id,
      roleTitle: role.title,
      responsibilities: output.responsibilities,
      competencies: output.competencies,
      kpis: output.kpis,
    });
  } catch {
    return err('JD_GENERATE_ERROR', 'Failed to generate job description');
  }
}

export async function getJobDescription(
  jdId: string,
  organizationId: string,
): Promise<
  ServiceResult<{
    id: string;
    status: string;
    roleTitle: string;
    department: string | null;
    level: string | null;
    responsibilities: string[];
    competencies: string[];
    kpis: string[];
  }>
> {
  try {
    const jd = await prisma.jobDescription.findFirst({
      where: { id: jdId, role: { organizationId } },
      include: { role: { select: { title: true, department: true, level: true } } },
    });

    if (!jd) {
      return err('JD_NOT_FOUND', 'Job description not found');
    }

    return ok({
      id: jd.id,
      status: jd.status,
      roleTitle: jd.role.title,
      department: jd.role.department,
      level: jd.role.level,
      responsibilities: jd.responsibilitiesJson as string[],
      competencies: jd.competenciesJson as string[],
      kpis: jd.kpisJson as string[],
    });
  } catch {
    return err('JD_FETCH_ERROR', 'Failed to fetch job description');
  }
}

export async function updateJobDescription(
  jdId: string,
  input: UpdateJDInput,
  organizationId: string,
): Promise<ServiceResult<{ id: string }>> {
  try {
    const jd = await prisma.jobDescription.findFirst({
      where: { id: jdId, role: { organizationId } },
    });

    if (!jd) {
      return err('JD_NOT_FOUND', 'Job description not found');
    }

    await prisma.jobDescription.update({
      where: { id: jdId },
      data: {
        ...(input.responsibilitiesJson && { responsibilitiesJson: input.responsibilitiesJson }),
        ...(input.competenciesJson && { competenciesJson: input.competenciesJson }),
        ...(input.kpisJson && { kpisJson: input.kpisJson }),
        ...(input.status && { status: input.status }),
      },
    });

    return ok({ id: jdId });
  } catch {
    return err('JD_UPDATE_ERROR', 'Failed to update job description');
  }
}

export async function listJobDescriptions(organizationId: string) {
  const jds = await prisma.jobDescription.findMany({
    where: { role: { organizationId } },
    include: { role: { select: { title: true, department: true, level: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return jds.map((jd: (typeof jds)[number]) => ({
    id: jd.id,
    status: jd.status,
    roleTitle: jd.role.title,
    department: jd.role.department,
    level: jd.role.level,
    createdAt: jd.createdAt,
  }));
}
