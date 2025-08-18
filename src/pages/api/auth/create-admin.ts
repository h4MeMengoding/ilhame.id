import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const user = await prisma.user.create({
      data: {
        email: 'admin@ilhame.id',
        password: hashedPassword,
        name: 'Administrator',
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'Admin user created successfully',
      user: userWithoutPassword,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Admin user already exists' });
    }

    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
