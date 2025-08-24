import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      // Get distinct categories from published gallery items
      const categories = await prisma.gallery.findMany({
        where: {
          is_published: true,
          AND: [
            {
              category: {
                not: null,
              },
            },
            {
              category: {
                not: '',
              },
            },
          ],
        },
        distinct: ['category'],
        select: {
          category: true,
        },
        orderBy: {
          category: 'asc',
        },
      });

      const categoryList = categories
        .map((item) => item.category)
        .filter((category) => category && category.trim() !== '');

      res.status(200).json({
        success: true,
        data: categoryList,
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch categories',
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`,
    });
  }
}
