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

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Valid blog ID is required' });
  }

  const blogId = Number(id);

  if (req.method === 'GET') {
    try {
      const blog = await (prisma as any).blog.findUnique({
        where: { id: blogId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }

      res.status(200).json({
        status: true,
        data: blog,
      });
    } catch (error) {
      console.error('Error fetching blog:', error);
      res.status(500).json({ error: 'Failed to fetch blog' });
    }
  } else if (req.method === 'PUT') {
    try {
      const {
        title,
        slug,
        content,
        excerpt,
        featured_image_url,
        status,
        is_featured,
        meta_title,
        meta_description,
        tag_ids = [],
      } = req.body;

      if (!title || !slug || !content) {
        return res
          .status(400)
          .json({ error: 'Title, slug, and content are required' });
      }

      // Check if slug already exists for other blogs
      const existingBlog = await (prisma as any).blog.findFirst({
        where: {
          slug,
          id: { not: blogId },
        },
      });

      if (existingBlog) {
        return res.status(400).json({ error: 'Slug already exists' });
      }

      // Get current blog to check status change
      const currentBlog = await (prisma as any).blog.findUnique({
        where: { id: blogId },
      });

      if (!currentBlog) {
        return res.status(404).json({ error: 'Blog not found' });
      }

      // Calculate reading time (average 200 words per minute)
      const wordCount = content.trim().split(/\s+/).length;
      const reading_time = Math.ceil(wordCount / 200);

      const updateData: any = {
        title,
        slug,
        content,
        excerpt,
        featured_image_url,
        status,
        is_featured,
        meta_title: meta_title || null,
        meta_description: meta_description || null,
        reading_time,
        updated_at: new Date(),
      };

      // If status changed to published and wasn't published before, set published_at
      if (status === 'published' && currentBlog.status !== 'published') {
        updateData.published_at = new Date();
      }

      const updatedBlog = await (prisma as any).blog.update({
        where: { id: blogId },
        data: updateData,
      });

      // Update tags
      // First, delete all existing tag relations
      await (prisma as any).blogTag.deleteMany({
        where: { blog_id: blogId },
      });

      // Then create new tag relations
      if (tag_ids && tag_ids.length > 0) {
        await (prisma as any).blogTag.createMany({
          data: tag_ids.map((tagId: number) => ({
            blog_id: blogId,
            tag_id: tagId,
          })),
        });
      }

      // Fetch with relations separately to avoid null issues
      const blogWithRelations = await (prisma as any).blog.findUnique({
        where: { id: blogId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      // Update content meta slug if changed
      if (currentBlog.slug !== slug) {
        await prisma.contentmeta.updateMany({
          where: { slug: currentBlog.slug },
          data: { slug },
        });
      }

      res.status(200).json({
        status: true,
        data: blogWithRelations,
      });
    } catch (error) {
      console.error('Error updating blog:', error);
      res.status(500).json({ error: 'Failed to update blog' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const blog = await (prisma as any).blog.findUnique({
        where: { id: blogId },
      });

      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }

      // Delete content meta
      await prisma.contentmeta.deleteMany({
        where: { slug: blog.slug },
      });

      // Delete blog
      await (prisma as any).blog.delete({
        where: { id: blogId },
      });

      res.status(200).json({
        status: true,
        message: 'Blog deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting blog:', error);
      res.status(500).json({ error: 'Failed to delete blog' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withAuth(handler);
