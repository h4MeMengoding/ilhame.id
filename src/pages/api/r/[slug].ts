import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

// Ultra-minimal redirect API - fastest possible implementation
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { slug } = req.query;

  // Immediate validation without try-catch overhead
  if (req.method !== 'GET' || !slug || typeof slug !== 'string') {
    res.writeHead(400);
    res.end('Bad Request');
    return;
  }

  // Set response headers immediately
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');

  let shortUrl;
  try {
    // Fastest possible database query - only get what we need
    shortUrl = await prisma.shortUrl.findFirst({
      where: {
        slug,
        is_active: true,
        OR: [{ expires_at: null }, { expires_at: { gt: new Date() } }],
      },
      select: { original_url: true },
    });
  } catch (error) {
    // Database error - return 500 immediately
    res.writeHead(500);
    res.end('Database Error');
    return;
  }

  if (!shortUrl) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  // Update stats in background without waiting
  process.nextTick(async () => {
    try {
      await prisma.shortUrl.update({
        where: { slug },
        data: {
          clicks: { increment: 1 },
          updated_at: new Date(),
        },
      });
    } catch (e) {
      // Ignore click count errors
    }
  });

  // Immediate redirect
  res.writeHead(301, {
    Location: shortUrl.original_url,
    'Cache-Control': 'public, max-age=60',
  });
  res.end();
}
