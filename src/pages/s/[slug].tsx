import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { useEffect, useState } from 'react';
import { FiClock, FiExternalLink } from 'react-icons/fi';

import Card from '@/common/components/elements/Card';
import Container from '@/common/components/elements/Container';
import { extractOGTags, type OGData } from '@/common/helpers/ogExtractor';
import prisma from '@/common/libs/prisma';

interface RedirectPageProps {
  originalUrl: string;
  title?: string;
  description?: string;
  slug: string;
  countdownSeconds: number;
  ogData: OGData;
  isBotRequest?: boolean;
}

const RedirectPage = ({
  originalUrl,
  title,
  description,
  slug,
  countdownSeconds,
  ogData,
  isBotRequest = false,
}: RedirectPageProps) => {
  const [countdown, setCountdown] = useState(countdownSeconds);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!originalUrl) return;

    // If this is a bot request or countdown is 0, redirect immediately
    if (isBotRequest || countdownSeconds === 0) {
      window.location.href = originalUrl;
      return;
    }

    // Preload the destination URL for faster redirect
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = originalUrl;
    document.head.appendChild(link);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRedirecting(true);
          // Use location.replace for faster redirect without history entry
          window.location.replace(originalUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      document.head.removeChild(link);
    };
  }, [originalUrl, countdownSeconds, isBotRequest]);

  const handleRedirectNow = () => {
    setIsRedirecting(true);
    window.location.replace(originalUrl);
  };

  // For bot requests, show minimal content but still include OG tags
  if (isBotRequest) {
    return (
      <>
        <NextSeo
          title={ogData.title || 'Redirecting...'}
          description={
            ogData.description ||
            'You will be redirected to the original content'
          }
          openGraph={{
            title: ogData.title || undefined,
            description: ogData.description || undefined,
            url: ogData.url || originalUrl,
            siteName: ogData.siteName || undefined,
            images: ogData.image
              ? [
                  {
                    url: ogData.image,
                    width: 1200,
                    height: 630,
                    alt: ogData.title || 'Preview Image',
                  },
                ]
              : [],
            type: ogData.type || 'website',
          }}
          twitter={{
            cardType: 'summary_large_image',
            site: '@ilhamshofaaa',
          }}
        />
        <div style={{ display: 'none' }}>
          <h1>{ogData.title}</h1>
          <p>{ogData.description}</p>
          {ogData.image && <img src={ogData.image} alt='Preview' />}
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.href = "${originalUrl}";`,
          }}
        />
      </>
    );
  }

  if (countdownSeconds === 0) {
    return null;
  }

  return (
    <>
      <NextSeo
        title={ogData.title || 'Redirecting...'}
        description={
          ogData.description || 'You will be redirected to the original content'
        }
        openGraph={{
          title: ogData.title || undefined,
          description: ogData.description || undefined,
          url: ogData.url || originalUrl,
          siteName: ogData.siteName || undefined,
          images: ogData.image
            ? [
                {
                  url: ogData.image,
                  width: 1200,
                  height: 630,
                  alt: ogData.title || 'Preview Image',
                },
              ]
            : [],
          type: ogData.type || 'website',
        }}
        twitter={{
          cardType: 'summary_large_image',
          site: '@ilhamshofaaa',
        }}
      />
      <div className='flex min-h-screen items-center justify-center'>
        <Container>
          <Card className='mx-auto max-w-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900'>
            <div className='mb-6 text-center'>
              <div className='mb-4 text-blue-500'>
                <FiExternalLink size={48} className='mx-auto' />
              </div>
              <h1 className='mb-2 text-2xl font-bold text-neutral-800 dark:text-neutral-200'>
                {ogData.title || title || 'Redirecting to External Link'}
              </h1>
              {(ogData.description || description) && (
                <p className='mb-4 text-neutral-600 dark:text-neutral-400'>
                  {ogData.description || description}
                </p>
              )}
            </div>

            <div className='mb-6 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800'>
              <p className='mb-2 text-sm text-neutral-600 dark:text-neutral-400'>
                You will be redirected to:
              </p>
              <p className='break-all font-mono text-sm text-blue-600 dark:text-blue-400'>
                {originalUrl}
              </p>
            </div>

            <div className='mb-6 text-center'>
              {!isRedirecting ? (
                <div className='flex items-center justify-center space-x-2 text-neutral-600 dark:text-neutral-400'>
                  <FiClock className='animate-pulse' />
                  <span>Redirecting in {countdown} seconds...</span>
                </div>
              ) : (
                <div className='flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400'>
                  <div className='h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent'></div>
                  <span>Redirecting now...</span>
                </div>
              )}
            </div>

            <div className='flex flex-col justify-center gap-3 sm:flex-row'>
              <button
                onClick={handleRedirectNow}
                disabled={isRedirecting}
                className='flex items-center justify-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <FiExternalLink size={16} />
                <span>{isRedirecting ? 'Redirecting...' : 'Continue Now'}</span>
              </button>

              <Link
                href='/'
                className='flex items-center justify-center space-x-2 rounded-lg border border-neutral-300 px-6 py-3 font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800'
              >
                <span>Go Back Home</span>
              </Link>
            </div>

            <div className='mt-6 text-center'>
              <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                Short link:{' '}
                <span className='font-mono'>ilhame.id/s/{slug}</span>
              </p>
              <p className='mt-2 text-xs text-neutral-400 dark:text-neutral-500'>
                To see this preview page, use:{' '}
                <Link
                  href={`/s/${slug}?preview=true`}
                  className='font-mono text-blue-500 hover:text-blue-600'
                >
                  ilhame.id/s/{slug}?preview=true
                </Link>
              </p>
            </div>
          </Card>
        </Container>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  res,
  query,
}) => {
  const slug = params?.slug as string;

  if (!slug) {
    return {
      notFound: true,
    };
  }

  try {
    // Set cache headers for faster subsequent requests
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    const shortUrl = await prisma.shortUrl.findUnique({
      where: { slug },
      select: {
        original_url: true,
        title: true,
        description: true,
        slug: true,
        is_active: true,
        expires_at: true,
        clicks: true,
      },
    });

    if (!shortUrl || !shortUrl.is_active) {
      return {
        notFound: true,
      };
    }

    // Check if URL has expired
    if (shortUrl.expires_at && new Date() > shortUrl.expires_at) {
      return {
        notFound: true,
      };
    }

    // Check if this is a preview request
    const isPreviewRequest = query.preview === 'true';

    // Get countdown setting from environment variable
    const countdownSeconds = parseInt(
      process.env.URL_REDIRECT_COUNTDOWN || '3', // Reduced default to 3 seconds
      10,
    );

    // Check if this is a bot/crawler request
    const userAgent = req.headers['user-agent'] || '';
    const isBotRequest =
      /bot|crawler|spider|crawling|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram|discord|slack/i.test(
        userAgent,
      );

    // For bots, immediate redirect (no countdown), or non-preview requests, redirect immediately
    if (isBotRequest || countdownSeconds === 0 || !isPreviewRequest) {
      // Update click count asynchronously (don't wait for it)
      prisma.shortUrl
        .update({
          where: { slug },
          data: {
            clicks: {
              increment: 1,
            },
            updated_at: new Date(),
          },
        })
        .catch((error) => console.error('Error updating click count:', error));

      // Redirect immediately
      return {
        redirect: {
          destination: shortUrl.original_url,
          permanent: false,
        },
      };
    }

    // For regular users, try to extract OG data but with timeout protection
    let ogData: OGData = {
      title: null,
      description: null,
      image: null,
      siteName: null,
      type: null,
      url: null,
    };

    // Extract OG data with a race condition - either get it fast or use fallback
    try {
      // Set a very short timeout for OG extraction to prevent serverless timeout
      const ogPromise = extractOGTags(shortUrl.original_url);
      const timeoutPromise = new Promise<OGData>((resolve) => {
        setTimeout(() => {
          resolve({
            title: shortUrl.title || null,
            description: shortUrl.description || null,
            image: null,
            siteName: null,
            type: 'website',
            url: shortUrl.original_url,
          });
        }, 2000); // 2 second fallback
      });

      ogData = await Promise.race([ogPromise, timeoutPromise]);
    } catch (error) {
      console.error('Error extracting OG data, using fallback:', error);
      // Use fallback data from database or default
      ogData = {
        title: shortUrl.title || null,
        description: shortUrl.description || null,
        image: null,
        siteName: null,
        type: 'website',
        url: shortUrl.original_url,
      };
    }

    // Update click count asynchronously (don't wait for it)
    prisma.shortUrl
      .update({
        where: { slug },
        data: {
          clicks: {
            increment: 1,
          },
          updated_at: new Date(),
        },
      })
      .catch((error) => console.error('Error updating click count:', error));

    // Return URL data for confirmation page with countdown
    return {
      props: {
        originalUrl: shortUrl.original_url,
        title: shortUrl.title || null,
        description: shortUrl.description || null,
        slug: shortUrl.slug,
        countdownSeconds,
        ogData,
        isBotRequest: false,
      },
    };
  } catch (error) {
    console.error('Error processing redirect:', error);
    return {
      notFound: true,
    };
  }
};

export default RedirectPage;
