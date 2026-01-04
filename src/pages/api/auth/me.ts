import { NextApiResponse } from 'next';

import { AuthenticatedRequest, withAuth } from '@/common/libs/auth';
import prisma from '@/common/libs/prisma';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    console.log('[/api/auth/me] User ID:', req.user?.userId);

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar_url: true,
        role: true,
        created_at: true,
      },
    });

    if (!user) {
      console.log('[/api/auth/me] User not found for ID:', req.user.userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('[/api/auth/me] User found:', user.email);
    res.status(200).json({ user });
  } catch (error) {
    console.error('[/api/auth/me] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export default withAuth(handler);
