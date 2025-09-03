import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

if (process.env.NODE_ENV === 'production') {
  prisma = createPrismaClient();
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = createPrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

// Optimize for serverless environment
if (process.env.NODE_ENV === 'production') {
  // Graceful shutdown
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}

export default prisma;
