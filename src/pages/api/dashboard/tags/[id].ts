import type { NextApiResponse } from 'next';

import { AuthenticatedRequest, withAuth } from '@/common/libs/auth';
import prisma from '@/common/libs/prisma';

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { id } = req.query;
  const tagId = Number(id);

  if (isNaN(tagId)) {
    return res.status(400).json({ error: 'Invalid tag ID' });
  }

  if (req.method === 'GET') {
    try {
      const tag = await (prisma as any).tag.findUnique({
        where: { id: tagId },
        include: {
          _count: {
            select: { blogs: true },
          },
        },
      });

      if (!tag) {
        return res.status(404).json({ error: 'Tag not found' });
      }

      res.status(200).json({
        status: true,
        data: tag,
      });
    } catch (error) {
      console.error('Error fetching tag:', error);
      res.status(500).json({ error: 'Failed to fetch tag' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Tag name is required' });
      }

      // Generate slug from name
      const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Check if tag exists
      const existingTag = await (prisma as any).tag.findUnique({
        where: { id: tagId },
      });

      if (!existingTag) {
        return res.status(404).json({ error: 'Tag not found' });
      }

      // Check if new slug conflicts with another tag
      const slugConflict = await (prisma as any).tag.findFirst({
        where: {
          slug,
          id: { not: tagId },
        },
      });

      if (slugConflict) {
        return res
          .status(400)
          .json({ error: 'Tag with this name already exists' });
      }

      const updatedTag = await (prisma as any).tag.update({
        where: { id: tagId },
        data: {
          name: name.trim(),
          slug,
        },
      });

      res.status(200).json({
        status: true,
        data: updatedTag,
      });
    } catch (error) {
      console.error('Error updating tag:', error);
      res.status(500).json({ error: 'Failed to update tag' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Check if tag exists
      const existingTag = await (prisma as any).tag.findUnique({
        where: { id: tagId },
        include: {
          _count: {
            select: { blogs: true },
          },
        },
      });

      if (!existingTag) {
        return res.status(404).json({ error: 'Tag not found' });
      }

      // Delete all blog-tag relations first
      await (prisma as any).blogTag.deleteMany({
        where: { tag_id: tagId },
      });

      // Then delete the tag
      await (prisma as any).tag.delete({
        where: { id: tagId },
      });

      res.status(200).json({
        status: true,
        message: `Tag deleted successfully. Removed from ${existingTag._count.blogs} blog post(s).`,
      });
    } catch (error) {
      console.error('Error deleting tag:', error);
      res.status(500).json({ error: 'Failed to delete tag' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withAuth(handler);
