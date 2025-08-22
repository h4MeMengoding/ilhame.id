import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: number;
    email: string;
    name?: string;
    role?: string;
  };
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: () => void,
) => {
  try {
    const token =
      req.headers.authorization?.replace('Bearer ', '') ||
      req.cookies.auth_token;

    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: 'Authentication required' });
    }

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

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      role: user.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({ status: false, message: 'Invalid token' });
  }
};

export const withAuth = (
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>,
) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
      // Allow GET requests without authentication for public access
      return handler(req, res);
    }

    return authenticateUser(req, res, () => handler(req, res));
  };
};
