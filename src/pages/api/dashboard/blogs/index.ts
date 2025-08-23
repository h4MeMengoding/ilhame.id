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
      const { page = '1', per_page = '10', search = '' } = req.query;

      const pageNum = Number(page) || 1;
      const perPageNum = Number(per_page) || 10;
      const searchTerm = String(search);

      const skip = (pageNum - 1) * perPageNum;

      const where = searchTerm
        ? {
            OR: [
              { title: { contains: searchTerm, mode: 'insensitive' } },
              { content: { contains: searchTerm, mode: 'insensitive' } },
              { excerpt: { contains: searchTerm, mode: 'insensitive' } },
            ],
          }
        : {};

      const [blogs, totalCount] = await Promise.all([
        (prisma as any).blog.findMany({
          where: where as any,
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            updated_at: 'desc',
          },
          skip,
          take: perPageNum,
        }),
        (prisma as any).blog.count({ where: where as any }),
      ]);

      // Transform to match expected structure
      const transformedBlogs = await Promise.all(
        blogs.map(async (blog: any) => {
          const contentMeta = await prisma.contentmeta.findUnique({
            where: { slug: blog.slug },
            select: { views: true },
          });

          return {
            id: blog.id,
            title: blog.title,
            slug: blog.slug,
            content: blog.content,
            status: blog.status,
            excerpt: blog.excerpt,
            featured_image_url: blog.featured_image_url,
            created_at: blog.created_at.toISOString(),
            updated_at: blog.updated_at.toISOString(),
            author: {
              name: blog.author.name,
              email: blog.author.email,
            },
            total_views_count: contentMeta?.views || 0,
            is_featured: blog.is_featured,
          };
        }),
      );

      const totalPages = Math.ceil(totalCount / perPageNum);

      res.status(200).json({
        status: true,
        data: {
          posts: transformedBlogs,
          total_pages: totalPages,
          total_posts: totalCount,
          page: pageNum,
          per_page: perPageNum,
        },
      });
    } catch (error) {
      console.error('Error fetching blogs for dashboard:', error);
      res.status(500).json({ error: 'Failed to fetch blogs' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        title,
        slug,
        content,
        excerpt,
        featured_image_url,
        status = 'draft',
        is_featured = false,
      } = req.body;

      if (!title || !slug || !content) {
        return res
          .status(400)
          .json({ error: 'Title, slug, and content are required' });
      }

      // Check if slug already exists
      const existingBlog = await (prisma as any).blog.findUnique({
        where: { slug },
      });

      if (existingBlog) {
        return res.status(400).json({ error: 'Slug already exists' });
      }

      const blogData = {
        title,
        slug,
        content,
        excerpt,
        featured_image_url,
        status,
        is_featured,
        author_id: req.user.userId,
        published_at: status === 'published' ? new Date() : null,
      };

      const newBlog = await (prisma as any).blog.create({
        data: blogData,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Create content meta for views tracking
      await prisma.contentmeta.create({
        data: {
          slug: newBlog.slug,
          type: 'blog',
          views: 0,
        },
      });

      res.status(201).json({
        status: true,
        data: newBlog,
      });
    } catch (error) {
      console.error('Error creating blog:', error);
      res.status(500).json({ error: 'Failed to create blog' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withAuth(handler);
