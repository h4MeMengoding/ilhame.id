import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const comments = await prisma.comment.findMany({
        where: {
          blog_id: parseInt(id as string),
          is_approved: true,
          parent_id: null, // Only get top-level comments
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar_url: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar_url: true,
                },
              },
            },
            where: {
              is_approved: true,
            },
            orderBy: {
              created_at: 'asc',
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      res.status(200).json({
        success: true,
        data: comments,
      });
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch comments',
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { content, user_id, parent_id } = req.body;

      if (!content || !user_id) {
        return res.status(400).json({
          success: false,
          message: 'Content and user_id are required',
        });
      }

      const newComment = await prisma.comment.create({
        data: {
          content,
          blog_id: parseInt(id as string),
          user_id: parseInt(user_id),
          parent_id: parent_id ? parseInt(parent_id) : null,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar_url: true,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        data: newComment,
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create comment',
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
