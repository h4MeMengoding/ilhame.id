import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: number;
    email: string;
    name?: string;
    role?: string;
  };
}

type Data = {
  status: boolean;
  data?: any;
  message?: string;
  error?: any;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id } = req.query;
  const projectId = parseInt(id as string);

  if (req.method === 'GET') {
    try {
      // Add no-cache headers to ensure fresh data
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      const project = await prisma.projects.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        return res
          .status(404)
          .json({ status: false, message: 'Project not found' });
      }

      res.status(200).json({ status: true, data: project });
    } catch (error) {
      res.status(500).json({ status: false, error: error });
    }
  } else if (req.method === 'PUT') {
    try {
      const {
        title,
        slug,
        description,
        image,
        link_demo,
        link_github,
        stacks,
        content,
        is_show,
        is_featured,
        updated_at,
      } = req.body;

      // Check if slug is unique (excluding current project)
      const existingProject = await prisma.projects.findFirst({
        where: {
          slug,
          NOT: { id: projectId },
        },
      });

      if (existingProject) {
        return res.status(400).json({
          status: false,
          message: 'Slug already exists',
        });
      }

      const updatedProject = await prisma.projects.update({
        where: { id: projectId },
        data: {
          title,
          slug,
          description,
          image,
          link_demo,
          link_github,
          stacks,
          content,
          is_show,
          is_featured,
          updated_at: updated_at ? new Date(updated_at) : new Date(),
        },
      });

      res.status(200).json({ status: true, data: updatedProject });
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({
        status: false,
        message:
          error instanceof Error ? error.message : 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  } else if (req.method === 'PATCH') {
    try {
      const updateData = req.body;

      const updatedProject = await prisma.projects.update({
        where: { id: projectId },
        data: {
          ...updateData,
          updated_at: new Date(),
        },
      });

      res.status(200).json({ status: true, data: updatedProject });
    } catch (error) {
      res.status(500).json({ status: false, error: error });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.projects.delete({
        where: { id: projectId },
      });

      res
        .status(200)
        .json({ status: true, message: 'Project deleted successfully' });
    } catch (error) {
      res.status(500).json({ status: false, error: error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
    res.status(405).json({ status: false, message: 'Method not allowed' });
  }
}

export const withAdminAuth = (
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>,
) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
      // Allow GET requests without authentication for public access
      return handler(req, res);
    }

    // For non-GET methods, require authentication and admin role
    const token =
      req.headers.authorization?.replace('Bearer ', '') ||
      req.cookies.auth_token;

    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: 'Authentication required' });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || (process.env.NEXTAUTH_SECRET as string),
      ) as any;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          is_active: true,
        },
      });

      if (!user || !user.is_active) {
        return res
          .status(401)
          .json({ status: false, message: 'Invalid or inactive user' });
      }

      if (user.role !== 'admin') {
        return res
          .status(403)
          .json({ status: false, message: 'Admin access required' });
      }

      req.user = {
        id: user.id,
        email: user.email,
        name: user.name || undefined,
        role: user.role,
      };

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ status: false, message: 'Invalid token' });
    }
  };
};

export default withAdminAuth(handler);
