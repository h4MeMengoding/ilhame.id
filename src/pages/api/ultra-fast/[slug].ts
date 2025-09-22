import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

// Ultra-fast redirect with static cache and optimized database access
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

  // Set aggressive caching headers for better performance
  res.setHeader(
    'Cache-Control',
    'public, max-age=600, s-maxage=1200, stale-while-revalidate=86400',
  );

  try {
    // For critical/common links, you can add static redirects here for instant response
    const staticRedirects: Record<string, string> = {
      github: 'https://github.com/h4MeMengoding',
      ig: 'https://instagram.com/ilhamshofaaa',
      linkedin: 'https://linkedin.com/in/ilham-shofa',
      // Add more static redirects for your most common links
    };

    if (staticRedirects[slug]) {
      res.writeHead(301, {
        Location: staticRedirects[slug],
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
      });
      res.end();
      return;
    }

    // For dynamic URLs, use optimized database query with shared client
    // Simple timeout for database operations
    const dbTimeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('DB timeout')), 3000);
    });

    const dbQuery = prisma.shortUrl.findFirst({
      where: {
        slug,
        is_active: true,
      },
      select: {
        original_url: true,
        id: true,
      },
    });

    const shortUrl = await Promise.race([dbQuery, dbTimeout]);

    if (!shortUrl?.original_url) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    // Async click tracking (fire and forget)
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
        console.error('Click tracking failed:', err);
      }
    });

    // Immediate redirect
    res.writeHead(301, {
      Location: shortUrl.original_url,
      'Cache-Control':
        'public, max-age=600, s-maxage=1200, stale-while-revalidate=86400',
    });
    res.end();
  } catch (error) {
    console.error('Ultra-fast redirect error:', error);

    // Emergency fallback - redirect to homepage
    res.writeHead(302, {
      Location: '/',
      'Cache-Control': 'no-cache',
    });
    res.end();
  }
}
