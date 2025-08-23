import { NextApiRequest, NextApiResponse } from 'next';

import { extractOGTags } from '@/common/helpers/ogExtractor';
import prisma from '@/common/libs/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ message: 'Invalid slug' });
  }

  try {
    const shortUrl = await prisma.shortUrl.findUnique({
      where: { slug },
    });

    if (!shortUrl || !shortUrl.is_active) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    // Check if URL has expired
    if (shortUrl.expires_at && new Date() > shortUrl.expires_at) {
      return res.status(404).json({ message: 'Short URL has expired' });
    }

    // Extract OG data from the original URL
    let ogData;
    try {
      ogData = await extractOGTags(shortUrl.original_url);
      // Don't use default data, only use what we actually extracted
    } catch (error) {
      console.error('Error extracting OG data:', error);
      ogData = {
        title: null,
        description: null,
        image: null,
        siteName: null,
        type: null,
        url: null,
      };
    }

    return res.status(200).json({
      originalUrl: shortUrl.original_url,
      title: shortUrl.title,
      description: shortUrl.description,
      slug: shortUrl.slug,
      ogData,
    });
  } catch (error) {
    console.error('Error processing OG data request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
