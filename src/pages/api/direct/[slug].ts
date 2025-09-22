import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

// Optimized redirect endpoint - uses shared Prisma client
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request');
    return;
  }

  try {
    // Set cache headers immediately for faster subsequent requests
    res.setHeader(
      'Cache-Control',
      'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
    );

    // Create timeout promise to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Database timeout')), 4000); // 4 second timeout
    });

    // Database query with minimal fields for faster response
    const queryPromise = prisma.shortUrl.findFirst({
      where: {
        slug,
        is_active: true,
        OR: [{ expires_at: null }, { expires_at: { gt: new Date() } }],
      },
      select: {
        original_url: true,
        id: true, // Needed for async click tracking
      },
    });

    // Race between query and timeout
    const shortUrl = await Promise.race([queryPromise, timeoutPromise]);

    if (!shortUrl?.original_url) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Short URL not found');
      return;
    }

    // Update click count asynchronously without blocking the redirect
    // Use setImmediate to run after response is sent
    setImmediate(async () => {
      try {
        await prisma.shortUrl.update({
          where: { id: shortUrl.id },
          data: {
            clicks: { increment: 1 },
            updated_at: new Date(),
          },
        });
      } catch (err) {
        console.error('Failed to update click count:', err);
      }
    });

    // Perform redirect immediately
    res.writeHead(301, {
      Location: shortUrl.original_url,
      'Cache-Control':
        'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
    });
    res.end();
  } catch (error) {
    console.error('Error in direct redirect:', error);

    // Fallback to a more generic error page or homepage
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
}
