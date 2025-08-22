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

    // Try to create new admin user or update existing one
    const user = await prisma.user.upsert({
      where: { email: 'adm@ilhame.id' },
      update: {
        password: hashedPassword,
        name: 'Administrator',
        role: 'admin',
        is_active: true,
      },
      create: {
        email: 'adm@ilhame.id',
        password: hashedPassword,
        name: 'Administrator',
        role: 'admin',
        is_active: true,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'Admin user created/updated successfully',
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
