import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

interface BlogWhereInput {
  status: string;
  OR?: Array<{
    title?: { contains: string; mode: 'insensitive' };
    content?: { contains: string; mode: 'insensitive' };
    excerpt?: { contains: string; mode: 'insensitive' };
  }>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'GET') {
    try {
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=60, stale-while-revalidate=30',
      );

      const { page = '1', per_page = '9', search = '' } = req.query;

      const pageNum = Number(page) || 1;
      const perPageNum = Number(per_page) || 9;
      const searchTerm = String(search);

      const skip = (pageNum - 1) * perPageNum;

      const where: BlogWhereInput = {
        status: 'published',
        ...(searchTerm && {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { content: { contains: searchTerm, mode: 'insensitive' } },
            { excerpt: { contains: searchTerm, mode: 'insensitive' } },
          ],
        }),
      };

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
            tags: {
              include: {
                tag: true,
              },
            },
          },
          orderBy: {
            published_at: 'desc',
          },
          skip,
          take: perPageNum,
        }),
        (prisma as any).blog.count({ where: where as any }),
      ]);

      // Transform to match existing blog structure
      const transformedBlogs = await Promise.all(
        blogs.map(async (blog: any) => {
          const contentMeta = await prisma.contentmeta.findUnique({
            where: { slug: blog.slug },
            select: { views: true },
          });

          return {
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
            total_views_count: contentMeta?.views || 0,
            tags_list: blog.tags?.map((bt: any) => bt.tag.slug) || [],
            tags: blog.tags?.map((bt: any) => bt.tag) || [],
            reading_time: blog.reading_time,
          };
        }),
      );

      const totalPages = Math.ceil(totalCount / perPageNum);

      const responses = {
        status: true,
        data: {
          total_pages: totalPages,
          total_posts: totalCount,
          page: pageNum,
          per_page: perPageNum,
          posts: transformedBlogs,
        },
      };

      res.status(200).json(responses);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({ status: false, error: 'Failed to fetch blogs' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
