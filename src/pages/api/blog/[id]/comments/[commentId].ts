import { NextApiRequest, NextApiResponse } from 'next';

import { verifyToken } from '@/common/libs/auth';
import prisma from '@/common/libs/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`,
    });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header is required',
      });
    }

    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    const { commentId } = req.query;

    // Find the comment
    const comment = await prisma.comment.findUnique({
      where: {
        id: parseInt(commentId as string),
      },
      include: {
        user: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check permissions: admin can delete any comment, user can only delete their own
    const isAdmin = user.role === 'admin';
    const isOwner = user.userId === comment.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this comment',
      });
    }

    // Delete all replies first (cascade delete)
    await prisma.comment.deleteMany({
      where: {
        parent_id: parseInt(commentId as string),
      },
    });

    // Delete the comment
    await prisma.comment.delete({
      where: {
        id: parseInt(commentId as string),
      },
    });

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment',
    });
  }
}
