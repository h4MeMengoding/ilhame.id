import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
  regions: ['sin1'], // Singapore region - change to match your database region
};

// Edge function for ultimate speed - runs on Vercel Edge Runtime
export default async function handler(req: NextRequest) {
  const url = new URL(req.url);
  const slug = url.pathname.split('/').pop();

  if (!slug) {
    return new Response('Bad Request', { status: 400 });
  }

  try {
    // Static redirects for fastest possible response
    const staticRedirects: Record<string, string> = {
      github: 'https://github.com/h4MeMengoding',
      ig: 'https://instagram.com/ilhamshofaaa',
      linkedin: 'https://linkedin.com/in/ilham-shofa',
      haii: 'https://example.com', // Replace with actual URL for testing
      // Add more common redirects here
    };

    if (staticRedirects[slug]) {
      return NextResponse.redirect(staticRedirects[slug], {
        status: 301,
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=7200',
        },
      });
    }

    // For database queries on Edge, call our own API endpoint
    // This is more reliable than direct database calls
    const apiUrl = new URL('/api/direct/' + slug, req.url);
    const response = await fetch(apiUrl.toString(), {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Edge-Function-Internal',
      },
    });

    if (response.status === 301 || response.status === 302) {
      const location = response.headers.get('Location');
      if (location) {
        return NextResponse.redirect(location, {
          status: 301,
          headers: {
            'Cache-Control': 'public, max-age=300, s-maxage=600',
          },
        });
      }
    }

    // If not found, return 404
    return new Response('Not Found', { status: 404 });
  } catch (error) {
    console.error('Edge function error:', error);

    // Emergency fallback - redirect to homepage
    return NextResponse.redirect('/', {
      status: 302,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }
}
