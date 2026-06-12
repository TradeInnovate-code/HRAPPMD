import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  } as ConstructorParameters<typeof PrismaClient>[0]);

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
