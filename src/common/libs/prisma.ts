import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

if (process.env.NODE_ENV === 'production') {
  // FIXED: In production, DO NOT create a new client for each function
  // This was causing excessive connection overhead in serverless environment
  // Use global singleton pattern even in production
  const globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };

  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = createPrismaClient();
  }
  prisma = globalWithPrisma.prisma;
} else {
  // In development, reuse the client
  const globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = createPrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;
