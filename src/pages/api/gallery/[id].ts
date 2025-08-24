import { NextApiRequest, NextApiResponse } from 'next';

import { withAuth } from '@/common/libs/auth';
import prisma from '@/common/libs/prisma';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const gallery = await prisma.gallery.findUnique({
        where: {
          id: parseInt(id as string),
        },
      });

      if (!gallery) {
        return res.status(404).json({
          success: false,
          message: 'Gallery item not found',
        });
      }

      res.status(200).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      console.error('Error fetching gallery item:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch gallery item',
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const {
        title,
        description,
        image_url,
        category,
        is_featured,
        is_published,
      } = req.body;

      const gallery = await prisma.gallery.update({
        where: {
          id: parseInt(id as string),
        },
        data: {
          title,
          description,
          image_url,
          category,
          is_featured,
          is_published,
          updated_at: new Date(),
        },
      });

      res.status(200).json({
        success: true,
        data: gallery,
      });
    } catch (error) {
      console.error('Error updating gallery item:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update gallery item',
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      // First check if gallery item exists
      const existingGallery = await prisma.gallery.findUnique({
        where: {
          id: parseInt(id as string),
        },
      });

      if (!existingGallery) {
        return res.status(404).json({
          success: false,
          message: 'Gallery item not found or already deleted',
        });
      }

      // Delete the gallery item
      await prisma.gallery.delete({
        where: {
          id: parseInt(id as string),
        },
      });

      res.status(200).json({
        success: true,
        message: 'Gallery item deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting gallery item:', error);

      // Check if error is because record doesn't exist
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        return res.status(404).json({
          success: false,
          message: 'Gallery item not found or already deleted',
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to delete gallery item',
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`,
    });
  }
}

export default withAuth(handler);
