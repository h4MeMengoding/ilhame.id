import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

// Ultra-fast redirect API endpoint - optimized for maximum speed
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Invalid slug' });
  }

  try {
    // Set aggressive caching headers for maximum performance
    res.setHeader(
      'Cache-Control',
      'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
    );

    // Use minimal query for fastest database response
    const shortUrl = await prisma.shortUrl.findUnique({
      where: { slug },
      select: {
        original_url: true,
        is_active: true,
        expires_at: true,
      },
    });

    if (!shortUrl || !shortUrl.is_active) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Check if URL has expired
    if (shortUrl.expires_at && new Date() > shortUrl.expires_at) {
      return res.status(404).json({ error: 'URL expired' });
    }

    // Update click count asynchronously (fire and forget for maximum speed)
    setImmediate(() => {
      prisma.shortUrl
        .update({
          where: { slug },
          data: {
            clicks: { increment: 1 },
            updated_at: new Date(),
          },
        })
        .catch(console.error);
    });

    // Return 301 redirect immediately for fastest response
    res.writeHead(301, {
      Location: shortUrl.original_url,
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      'X-Powered-By': 'ilhame.id',
    });
    res.end();
  } catch (error) {
    console.error('Redirect API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
