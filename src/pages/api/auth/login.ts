import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';
import { getClientIP, verifyTurnstileToken } from '@/common/libs/turnstile';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, password, turnstileToken } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Verify Turnstile token if provided and enabled
  const isDevelopment = process.env.NODE_ENV === 'development';
  const hasTurnstileConfig = !!process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

  if ((hasTurnstileConfig || isDevelopment) && turnstileToken) {
    try {
      const clientIP = getClientIP(req);
      const verification = await verifyTurnstileToken(turnstileToken, clientIP);

      if (!verification.success) {
        return res.status(400).json({
          error: 'CAPTCHA verification failed',
          details: verification['error-codes'],
        });
      }
    } catch (error) {
      console.error('Turnstile verification error:', error);
      return res.status(500).json({ error: 'CAPTCHA verification failed' });
    }
  } else if (hasTurnstileConfig && !isDevelopment && !turnstileToken) {
    // If Turnstile is configured for production but no token provided
    return res.status(400).json({ error: 'CAPTCHA verification required' });
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET || (process.env.NEXTAUTH_SECRET as string),
      { expiresIn: '7d' },
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
