import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

const escapeXml = (unsafe: string): string => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
};

const generateRssItem = (post: any): string => {
  return `
    <item>
      <guid>https://ilhame.id/blog/${escapeXml(post.slug)}?id=${post.id}</guid>
      <title><![CDATA[${post.title}]]></title>
      <link>https://ilhame.id/blog/${escapeXml(post.slug)}?id=${post.id}</link>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <pubDate>${new Date(post.created_at).toUTCString()}</pubDate>
      <author>ilhamshofa@gmail.com (Ilham Shofa)</author>
      ${post.tags?.map((tag: any) => `<category><![CDATA[${tag.tag.name}]]></category>`).join('\n      ') || ''}
    </item>
  `;
};

const generateRssFeed = (posts: any[]): string => {
  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ilham Shofa Blog</title>
    <link>https://ilhame.id</link>
    <description>Code the Future &amp; Capture the Moment - Blog by Ilham Shofa about web development, technology, and creative content</description>
    <language>id-ID</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="https://ilhame.id/api/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>https://res.cloudinary.com/dgbg05oc5/image/upload/v1767529742/og-ilhameid_ootgmj.webp</url>
      <title>Ilham Shofa Blog</title>
      <link>https://ilhame.id</link>
    </image>
    ${posts.map(generateRssItem).join('')}
  </channel>
</rss>`;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method === 'GET') {
    try {
      const posts = await (prisma as any).blog.findMany({
        where: {
          status: 'published',
        },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        take: 50, // Limit to 50 most recent posts
      });

      const rss = generateRssFeed(posts);

      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader(
        'Cache-Control',
        's-maxage=600, stale-while-revalidate=3600',
      );
      res.status(200).send(rss);
    } catch (error) {
      console.error('Error generating RSS feed:', error);
      res.status(500).json({ error: 'Failed to generate RSS feed' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
