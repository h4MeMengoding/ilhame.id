import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'GET') {
    try {
      const { id, tags } = req.query;

      if (!id) {
        return res.status(400).json({
          status: 400,
          error: 'Post ID is required',
        });
      }

      const postId = Number(id);
      const tagList = tags ? (tags as string).split(',').filter(Boolean) : [];

      let relatedPosts;

      if (tagList.length > 0) {
        // Find posts with matching tags
        relatedPosts = await (prisma as any).blog.findMany({
          where: {
            status: 'published',
            id: {
              not: postId,
            },
            tags: {
              some: {
                tag: {
                  slug: {
                    in: tagList,
                  },
                },
              },
            },
          },
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 6,
        });
      }

      // If no posts found with tags or no tags provided, get latest posts
      if (!relatedPosts || relatedPosts.length < 3) {
        const additionalPosts = await (prisma as any).blog.findMany({
          where: {
            status: 'published',
            id: {
              not: postId,
              notIn: relatedPosts?.map((p: any) => p.id) || [],
            },
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 6 - (relatedPosts?.length || 0),
        });

        relatedPosts = [...(relatedPosts || []), ...additionalPosts];
      }

      // Transform posts
      const transformedPosts = relatedPosts.slice(0, 3).map((post: any) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        featured_image_url:
          post.featured_image_url || '/images/placeholder.png',
        created_at: post.created_at,
        reading_time: post.reading_time,
      }));

      res.status(200).json({
        status: 200,
        data: transformedPosts,
      });
    } catch (error) {
      console.error('Error fetching related posts:', error);
      res.status(500).json({
        status: 500,
        error: 'Failed to fetch related posts',
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
