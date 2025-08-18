import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const { slug } = req.query;

      if (!slug) {
        return res.status(400).json({ error: 'Slug is required' });
      }

      const urlData = await prisma.shortUrl.findUnique({
        where: { slug: slug as string },
      });

      if (!urlData) {
        return res.status(404).json({ error: 'Short URL not found' });
      }

      res.status(200).json({ data: urlData });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
