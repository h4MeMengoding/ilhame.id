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

  if (req.method === 'GET') {
    try {
      const tags = await (prisma as any).tag.findMany({
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { blogs: true },
          },
        },
      });

      res.status(200).json({
        status: true,
        data: tags,
      });
    } catch (error) {
      console.error('Error fetching tags:', error);
      res.status(500).json({ error: 'Failed to fetch tags' });
    }
  } else if (req.method === 'POST') {
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

      // Check if slug already exists
      const existingTag = await (prisma as any).tag.findUnique({
        where: { slug },
      });

      if (existingTag) {
        return res.status(400).json({ error: 'Tag already exists' });
      }

      const newTag = await (prisma as any).tag.create({
        data: {
          name: name.trim(),
          slug,
        },
      });

      res.status(201).json({
        status: true,
        data: newTag,
      });
    } catch (error) {
      console.error('Error creating tag:', error);
      res.status(500).json({ error: 'Failed to create tag' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withAuth(handler);
