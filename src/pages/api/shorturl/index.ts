import { NextApiRequest, NextApiResponse } from 'next';

import { getTokenFromRequest, verifyToken } from '@/common/libs/auth';
import prisma from '@/common/libs/prisma';

// Generate random slug
function generateSlug(length = 6): string {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Validate URL
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const { page = 1, limit = 10, user_email } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const whereClause: any = { is_active: true };

      if (user_email) {
        whereClause.user_email = user_email as string;
      }

      const urls = await prisma.shortUrl.findMany({
        where: whereClause,
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: Number(limit),
      });

      const total = await prisma.shortUrl.count({ where: whereClause });

      res.status(200).json({
        data: urls,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      console.error('Error fetching URLs:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const token = getTokenFromRequest(req);
      const user = token ? verifyToken(token) : null;

      const { original_url, custom_slug, title, description } = req.body;

      // Validate required fields
      if (!original_url) {
        return res.status(400).json({ error: 'Original URL is required' });
      }

      if (!isValidUrl(original_url)) {
        return res.status(400).json({ error: 'Invalid URL format' });
      }

      // Generate or use custom slug
      let slug = custom_slug;
      if (!slug) {
        do {
          slug = generateSlug();
        } while (await prisma.shortUrl.findUnique({ where: { slug } }));
      } else {
        // Check if custom slug already exists
        const existingUrl = await prisma.shortUrl.findUnique({
          where: { slug },
        });
        if (existingUrl) {
          return res.status(400).json({ error: 'Custom slug already exists' });
        }
      }

      // Create short URL
      const shortUrl = await prisma.shortUrl.create({
        data: {
          slug,
          original_url,
          title,
          description,
          user_email: user?.email || null,
        },
      });

      res.status(201).json({
        data: shortUrl,
        short_url: `${process.env.SITE_URL}/s/${slug}`,
      });
    } catch (error) {
      console.error('Error creating short URL:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
