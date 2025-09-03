import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

// Edge runtime for maximum speed - no Node.js overhead
export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return new Response('Bad Request', { status: 400 });
  }

  try {
    // Direct database query without Prisma overhead
    const response = await fetch(process.env.DATABASE_URL + '', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          SELECT original_url 
          FROM shorturls 
          WHERE slug = $1 
          AND is_active = true 
          AND (expires_at IS NULL OR expires_at > NOW())
          LIMIT 1
        `,
        params: [slug],
      }),
    });

    const data = await response.json();

    if (!data.rows || data.rows.length === 0) {
      return new Response('Not Found', { status: 404 });
    }

    const originalUrl = data.rows[0].original_url;

    // Update click count asynchronously
    fetch(process.env.DATABASE_URL + '', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query:
          'UPDATE shorturls SET clicks = clicks + 1, updated_at = NOW() WHERE slug = $1',
        params: [slug],
      }),
    }).catch(() => {
      // Ignore click count errors silently
    });

    return Response.redirect(originalUrl, 301);
  } catch (error) {
    return new Response('Server Error', { status: 500 });
  }
}
