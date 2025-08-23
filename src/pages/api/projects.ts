/* eslint-disable @typescript-eslint/no-explicit-any */
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

async function handler(req: AuthenticatedRequest, res: NextApiResponse<Data>) {
  if (req.method === 'GET') {
    try {
      // Add no-cache headers to ensure fresh data
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      const { home } = req.query;

      // Different sorting for home page vs projects page
      const orderBy =
        home === 'true'
          ? [{ updated_at: 'desc' as const }] // Home page: only sort by updated_at
          : [
              { is_featured: 'desc' as const }, // Projects page: featured first, then updated_at
              { updated_at: 'desc' as const },
            ];

      const response = await prisma.projects.findMany({
        orderBy,
      });
      res.status(200).json({ status: true, data: response });
    } catch (error) {
      res.status(200).json({ status: false, error: error });
    }
  } else if (req.method === 'POST') {
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

      // Validate required fields
      if (!title || !slug || !image) {
        return res.status(400).json({
          status: false,
          message: 'Title, slug, and image are required',
        });
      }

      // Check if slug is unique
      const existingProject = await prisma.projects.findUnique({
        where: { slug },
      });

      if (existingProject) {
        return res.status(400).json({
          status: false,
          message: 'Slug already exists',
        });
      }

      // Create project data object without ID (let auto-increment handle it)
      const createData = {
        title: title.trim(),
        slug: slug.trim(),
        description: description?.trim() || '',
        image: image.trim(),
        link_demo: link_demo?.trim() || null,
        link_github: link_github?.trim() || null,
        stacks: stacks || '[]',
        content: content?.trim() || null,
        is_show: is_show ?? true,
        is_featured: is_featured ?? false,
        updated_at: updated_at ? new Date(updated_at) : new Date(),
      };

      const newProject = await prisma.projects.create({
        data: createData,
      });

      res.status(201).json({ status: true, data: newProject });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({
        status: false,
        message:
          error instanceof Error ? error.message : 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
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
