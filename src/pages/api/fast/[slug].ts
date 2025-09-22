import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

// Super lightweight redirect with static cache
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    res.writeHead(404);
    res.end();
    return;
  }

  // Static cache for common redirects
  const staticRedirects: Record<string, string> = {
    // Add your most common redirects here for instant response
    // 'github': 'https://github.com/h4MeMengoding',
    // 'linkedin': 'https://linkedin.com/in/yourprofile',
  };

  if (staticRedirects[slug]) {
    res.writeHead(301, {
      Location: staticRedirects[slug],
      'Cache-Control': 'public, max-age=3600',
    });
    res.end();
    return;
  }

  // For dynamic redirects, use shared prisma client
  try {
    const shortUrl = await prisma.shortUrl.findFirst({
      where: {
        slug,
        is_active: true,
      },
      select: { original_url: true },
    });

    if (!shortUrl) {
      res.writeHead(404);
      res.end();
      return;
    }

    // No stats tracking for maximum speed
    res.writeHead(301, {
      Location: shortUrl.original_url,
      'Cache-Control': 'public, max-age=300',
    });
    res.end();
  } catch (error) {
    res.writeHead(500);
    res.end();
  }
}
