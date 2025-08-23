import * as cheerio from 'cheerio';

export interface OGData {
  title: string | null;
  description: string | null;
  image: string | null;
  siteName: string | null;
  type: string | null;
  url: string | null;
}

export async function extractOGTags(url: string): Promise<OGData> {
  try {
    // Add timeout and proper headers
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OGBot/1.0; +https://ilhame.id)',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'no-cache',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const ogData: OGData = {
      title: null,
      description: null,
      image: null,
      siteName: null,
      type: null,
      url: null,
    };

    // Extract Open Graph tags
    ogData.title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      null;

    ogData.description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      null;

    ogData.image =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      null;

    ogData.siteName =
      $('meta[property="og:site_name"]').attr('content') || null;

    ogData.type = $('meta[property="og:type"]').attr('content') || 'website';

    ogData.url =
      $('meta[property="og:url"]').attr('content') ||
      $('link[rel="canonical"]').attr('href') ||
      url;

    // Clean up image URL if relative
    if (ogData.image && !ogData.image.startsWith('http')) {
      try {
        const urlObj = new URL(url);
        if (ogData.image.startsWith('/')) {
          ogData.image = `${urlObj.protocol}//${urlObj.host}${ogData.image}`;
        } else {
          ogData.image = `${urlObj.protocol}//${urlObj.host}/${ogData.image}`;
        }
      } catch (e) {
        // If URL parsing fails, remove image
        ogData.image = null;
      }
    }

    return ogData;
  } catch (error) {
    console.error('Error extracting OG tags:', error);
    return {
      title: null,
      description: null,
      image: null,
      siteName: null,
      type: null,
      url: null,
    };
  }
}

export function getDefaultOGData(
  url: string,
  title?: string,
  description?: string,
): OGData {
  try {
    const urlObj = new URL(url);
    return {
      title: title || `${urlObj.hostname}`,
      description: description || `Redirecting to ${url}`,
      siteName: urlObj.hostname,
      type: 'website',
      url: url,
      image: null,
    };
  } catch (e) {
    return {
      title: title || 'External Link',
      description: description || `Redirecting to ${url}`,
      type: 'website',
      url: url,
      siteName: null,
      image: null,
    };
  }
}
