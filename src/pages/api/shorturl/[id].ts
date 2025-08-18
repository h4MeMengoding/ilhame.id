import { NextApiRequest, NextApiResponse } from 'next';

import { getTokenFromRequest, verifyToken } from '@/common/libs/auth';
import prisma from '@/common/libs/prisma';

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
  const { id } = req.query;
  const urlId = parseInt(id as string);

  if (!urlId || isNaN(urlId)) {
    return res.status(400).json({ error: 'Invalid URL ID' });
  }

  // Verify authentication
  const token = getTokenFromRequest(req);
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (req.method === 'PUT') {
    try {
      const { title, description, custom_slug, original_url } = req.body;

      // Validate required fields
      if (!original_url) {
        return res.status(400).json({ error: 'Original URL is required' });
      }

      if (!isValidUrl(original_url)) {
        return res.status(400).json({ error: 'Invalid URL format' });
      }

      // Check if URL exists and belongs to user
      const existingUrl = await prisma.shortUrl.findUnique({
        where: { id: urlId },
      });

      if (!existingUrl) {
        return res.status(404).json({ error: 'URL not found' });
      }

      if (existingUrl.user_email !== user.email) {
        return res
          .status(403)
          .json({ error: 'You can only edit your own URLs' });
      }

      // Check if custom slug is unique (only if it's different from current)
      if (custom_slug && custom_slug !== existingUrl.slug) {
        const slugExists = await prisma.shortUrl.findUnique({
          where: { slug: custom_slug },
        });
        if (slugExists) {
          return res.status(400).json({ error: 'Custom slug already exists' });
        }
      }

      // Update the URL
      const updatedUrl = await prisma.shortUrl.update({
        where: { id: urlId },
        data: {
          title: title || null,
          description: description || null,
          slug: custom_slug || existingUrl.slug,
          original_url,
          updated_at: new Date(),
        },
      });

      res.status(200).json({
        data: updatedUrl,
        message: 'URL updated successfully',
      });
    } catch (error) {
      console.error('Error updating URL:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Check if URL exists and belongs to user
      const existingUrl = await prisma.shortUrl.findUnique({
        where: { id: urlId },
      });

      if (!existingUrl) {
        return res.status(404).json({ error: 'URL not found' });
      }

      if (existingUrl.user_email !== user.email) {
        return res
          .status(403)
          .json({ error: 'You can only delete your own URLs' });
      }

      // Delete the URL
      await prisma.shortUrl.delete({
        where: { id: urlId },
      });

      res.status(200).json({
        message: 'URL deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting URL:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
