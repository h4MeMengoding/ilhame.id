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
  // In production, create a new client for each serverless function
  prisma = createPrismaClient();
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
