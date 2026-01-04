import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({
          status: 400,
          error: 'Valid blog ID is required',
        });
      }

      const blog = await (prisma as any).blog.findUnique({
        where: {
          id: Number(id),
        },
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
        return res.status(404).json({
          status: 404,
          error: 'Blog not found',
        });
      }

      // Check if blog is published (after finding it)
      if (blog.status !== 'published') {
        return res.status(404).json({
          status: 404,
          error: 'Blog not found',
        });
      }

      // Create or update content meta for views tracking
      await prisma.contentmeta.upsert({
        where: { slug: blog.slug },
        update: {},
        create: {
          slug: blog.slug,
          type: 'blog',
          views: 0,
        },
      });

      // Transform to match existing blog structure
      const transformedBlog = {
        id: blog.id,
        date: blog.created_at.toISOString(),
        modified: blog.updated_at.toISOString(),
        slug: blog.slug,
        status: blog.status,
        link: `/blog/${blog.slug}`,
        title: {
          rendered: blog.title,
        },
        content: {
          rendered: blog.content,
          protected: false,
        },
        excerpt: {
          rendered: blog.excerpt || '',
          protected: false,
        },
        author: blog.author.name || blog.author.email,
        featured_image_url:
          blog.featured_image_url || '/images/placeholder.png',
        tags_list: blog.tags?.map((bt: any) => bt.tag.slug) || [],
        tags: blog.tags?.map((bt: any) => bt.tag) || [],
        reading_time: blog.reading_time,
        meta_title: blog.meta_title,
        meta_description: blog.meta_description,
      };

      res.status(200).json({
        status: 200,
        data: transformedBlog,
      });
    } catch (error) {
      console.error('Error fetching blog detail:', error);
      res.status(500).json({
        status: 500,
        error: 'Failed to fetch blog detail',
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
