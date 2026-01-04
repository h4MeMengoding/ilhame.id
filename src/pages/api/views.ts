import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

interface ResponseData {
  views: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { slug } = req.query;

  if (req.method === 'GET') {
    try {
      const contentMeta = await prisma.contentmeta.findUnique({
        where: { slug: slug as string },
        select: { views: true },
      });

      const contentViewsCount = contentMeta?.views ?? 0;

      const response: ResponseData = {
        views: contentViewsCount,
      };

      return res.json(response);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch content meta' });
    }
  } else if (req.method === 'POST') {
    try {
      // Cookie name untuk tracking views
      const cookieName = `viewed_${slug}`;
      const cookies = req.headers.cookie || '';

      // Check apakah user sudah pernah view artikel ini (via cookie)
      const hasViewedCookie = cookies.includes(cookieName);

      // Check dari localStorage indicator (sent via header)
      const hasViewedLocalStorage = req.headers['x-has-viewed'] === 'true';

      // Jika sudah pernah view (dari cookie atau localStorage), return current count tanpa increment
      if (hasViewedCookie || hasViewedLocalStorage) {
        const contentMeta = await prisma.contentmeta.findUnique({
          where: { slug: slug as string },
          select: { views: true },
        });
        return res.json({
          views: contentMeta?.views ?? 0,
          incremented: false,
        });
      }

      // Increment views karena ini view baru
      const contentMeta = await prisma.contentmeta.update({
        where: { slug: slug as string },
        data: {
          views: {
            increment: 1,
          },
        },
        select: { views: true },
      });

      // Set cookie untuk 24 jam (86400 seconds)
      res.setHeader(
        'Set-Cookie',
        `${cookieName}=true; Path=/; Max-Age=86400; SameSite=Lax`,
      );

      return res.json({ ...contentMeta, incremented: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update views count' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
