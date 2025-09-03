import { NextApiRequest, NextApiResponse } from 'next';

// Simple redirect without external dependencies
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    res.writeHead(400);
    res.end();
    return;
  }

  try {
    // Use fetch for database connection (works on Vercel edge)
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      res.writeHead(500);
      res.end();
      return;
    }

    // Direct SQL query via HTTP (if using services like PlanetScale, Supabase, etc.)
    // For now, fall back to Prisma but with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 2000); // 2 second timeout
    });

    const queryPromise = (async () => {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();

      try {
        const result = await prisma.shortUrl.findFirst({
          where: {
            slug,
            is_active: true,
          },
          select: { original_url: true },
        });

        await prisma.$disconnect();
        return result;
      } catch (error) {
        await prisma.$disconnect();
        throw error;
      }
    })();

    const shortUrl = await Promise.race([queryPromise, timeoutPromise]);

    if (
      !shortUrl ||
      typeof shortUrl !== 'object' ||
      !('original_url' in shortUrl)
    ) {
      res.writeHead(404);
      res.end();
      return;
    }

    // No stats tracking for maximum speed
    res.writeHead(301, {
      Location: shortUrl.original_url as string,
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    });
    res.end();
  } catch (error) {
    res.writeHead(500);
    res.end();
  }
}
