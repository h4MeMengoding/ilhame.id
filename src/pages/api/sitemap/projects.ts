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
    const projects = await prisma.projects.findMany({
      where: {
        is_show: true,
      },
      orderBy: {
        updated_at: 'desc',
      },
    });

    const sitemap = generateSitemap(projects);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=86400, stale-while-revalidate',
    );

    return res.status(200).send(sitemap);
  } catch (error) {
    console.error('Error generating projects sitemap:', error);
    return res.status(500).json({ message: 'Error generating sitemap' });
  }
}

function generateSitemap(projects: any[]) {
  const urls = projects
    .map((project) => {
      return `
    <url>
      <loc>https://ilhame.id/projects/${project.slug}</loc>
      <lastmod>${new Date(project.updated_at || project.created_at).toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;
}
