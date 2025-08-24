import { NextApiRequest, NextApiResponse } from 'next';

import { withAuth } from '@/common/libs/auth';
import prisma from '@/common/libs/prisma';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 20, category } = req.query;
      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const where = {
        is_published: true,
        ...(category && { category: category as string }),
      };

      const [gallery, totalCount] = await Promise.all([
        prisma.gallery.findMany({
          where,
          orderBy: {
            created_at: 'desc',
          },
          skip,
          take: parseInt(limit as string),
        }),
        prisma.gallery.count({ where }),
      ]);

      res.status(200).json({
        success: true,
        data: gallery,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit as string)),
        },
      });
    } catch (error) {
      console.error('Error fetching gallery:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch gallery',
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description, image_url, category, is_featured } = req.body;

      if (!title || !image_url) {
        return res.status(400).json({
          success: false,
          message: 'Title and image URL are required',
        });
      }

      const gallery = await prisma.gallery.create({
        data: {
          title,
          description,
          image_url,
          category,
          is_featured: is_featured || false,
        },
      });

      res.status(201).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      console.error('Error creating gallery item:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create gallery item',
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`,
    });
  }
}

export default function galleryHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    return handler(req, res);
  } else {
    return withAuth(handler)(req, res);
  }
}
