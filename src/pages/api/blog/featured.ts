import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

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

      const featuredBlogs = await (prisma as any).blog.findMany({
        where: {
          status: 'published',
          is_featured: true,
        },
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
          published_at: 'desc',
        },
        take: 4,
      });

      // Transform to match existing blog structure
      const transformedBlogs = await Promise.all(
        featuredBlogs.map(async (blog: any) => {
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
          };
        }),
      );

      const responses = {
        status: true,
        data: {
          posts: transformedBlogs,
        },
      };

      res.status(200).json(responses);
    } catch (error) {
      console.error('Error fetching featured blogs:', error);
      res
        .status(500)
        .json({ status: false, error: 'Failed to fetch featured blogs' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
