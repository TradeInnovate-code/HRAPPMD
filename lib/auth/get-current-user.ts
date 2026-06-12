import { prisma } from '@/lib/prisma/client';
import { isDevAuthMode, getDevSession, DEV_USER } from './dev-auth';

async function resolveClerkId(): Promise<string | null> {
  if (isDevAuthMode()) {
    return getDevSession();
  }
  const { auth } = await import('@clerk/nextjs/server');
  const { userId } = await auth();
  return userId;
}

export async function getCurrentUser() {
  const userId = await resolveClerkId();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { organization: true },
  });

  return user;
}

export async function getOrCreateUser() {
  const userId = await resolveClerkId();
  if (!userId) return null;

  const existing = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { organization: true },
  });

  if (existing) return existing;

  // Dev mode: auto-create user + org
  if (isDevAuthMode()) {
    const organization = await prisma.organization.create({
      data: { name: 'Admin Organization' },
    });
    return prisma.user.create({
      data: {
        clerkId: DEV_USER.clerkId,
        email: DEV_USER.email,
        name: DEV_USER.name,
        organizationId: organization.id,
      },
      include: { organization: true },
    });
  }

  // Clerk mode: resolve from Clerk
  const { currentUser } = await import('@clerk/nextjs/server');
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const organization = await prisma.organization.create({
    data: { name: `${clerkUser.firstName ?? 'My'}'s Organization` },
  });

  const user = await prisma.user.create({
    data: {
      clerkId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
      name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null,
      organizationId: organization.id,
    },
    include: { organization: true },
  });

  return user;
}
