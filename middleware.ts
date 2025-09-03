import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Fast redirect for ALL short URLs - bypass the page entirely
  if (url.pathname.startsWith('/s/')) {
    const slug = url.pathname.split('/')[2];

    // Check if this is a bot request
    const userAgent = request.headers.get('user-agent') || '';
    const isBot =
      /bot|crawler|spider|crawling|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|discord|slack/i.test(
        userAgent,
      );

    // For bots, continue to the page for OG tags
    if (isBot) {
      return NextResponse.next();
    }

    // Check if user specifically wants the preview page
    const showPreview = request.nextUrl.searchParams.get('preview') === 'true';

    if (!showPreview && slug) {
      // Redirect ALL regular users to fast API endpoint
      url.pathname = `/api/r/${slug}`;
      url.search = ''; // Remove query parameters
      return NextResponse.redirect(url);
    }
  }

  // Add security headers
  const response = NextResponse.next();

  // Add caching headers for static assets
  if (url.pathname.startsWith('/_next/static/')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable',
    );
  }

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
