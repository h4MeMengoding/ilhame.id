import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';

export interface AuthUser {
  userId: number;
  email: string;
  name?: string;
}

export interface AuthenticatedRequest extends NextApiRequest {
  user: AuthUser;
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET as string,
    ) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(req: NextApiRequest): string | null {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

export function withAuth<T = any>(
  handler: (req: AuthenticatedRequest, res: any) => Promise<T> | T,
) {
  return async (req: NextApiRequest, res: any) => {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    const user = verifyToken(token);

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    (req as AuthenticatedRequest).user = user;

    return handler(req as AuthenticatedRequest, res);
  };
}
