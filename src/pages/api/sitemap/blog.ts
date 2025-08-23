import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const blogs = await (prisma as any).blog.findMany({
      where: {
        status: 'published',
      },
      select: {
        id: true,
        slug: true,
        updated_at: true,
        created_at: true,
      },
      orderBy: {
        published_at: 'desc',
      },
      take: 100,
    });

    const sitemap = generateSitemap(blogs);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=86400, stale-while-revalidate',
    );

    return res.status(200).send(sitemap);
  } catch (error) {
    console.error('Error generating blog sitemap:', error);
    return res.status(500).json({ message: 'Error generating sitemap' });
  }
}

function generateSitemap(posts: any[]) {
  const baseUrl = 'https://ilhame.id';

  const urlsXml = posts
    .map((post) => {
      const url = `${baseUrl}/blog/${post.slug}?id=${post.id}`;
      const lastmod = new Date(
        post.updated_at || post.created_at,
      ).toISOString();

      return `
    <url>
      <loc>${url}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlsXml}
</urlset>`;
}
