import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { NextSeo } from 'next-seo';
import { useEffect, useState } from 'react';
import { FiClock, FiExternalLink } from 'react-icons/fi';

import Card from '@/common/components/elements/Card';
import Container from '@/common/components/elements/Container';
import prisma from '@/common/libs/prisma';

interface RedirectPageProps {
  originalUrl: string;
  title?: string;
  description?: string;
  slug: string;
}

const RedirectPage = ({
  originalUrl,
  title,
  description,
  slug,
}: RedirectPageProps) => {
  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!originalUrl) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRedirecting(true);
          window.location.href = originalUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [originalUrl]);

  const handleRedirectNow = () => {
    setIsRedirecting(true);
    window.location.href = originalUrl;
  };

  return (
    <>
      <NextSeo
        title={`Redirecting to ${title || 'Link'} - Ilham Shofa`}
        description={description || `You will be redirected to ${originalUrl}`}
      />
      <div className='flex min-h-screen items-center justify-center'>
        <Container>
          <Card className='mx-auto max-w-2xl border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900'>
            <div className='mb-6 text-center'>
              <div className='mb-4 text-blue-500'>
                <FiExternalLink size={48} className='mx-auto' />
              </div>
              <h1 className='mb-2 text-2xl font-bold text-neutral-800 dark:text-neutral-200'>
                {title || 'Redirecting to External Link'}
              </h1>
              {description && (
                <p className='mb-4 text-neutral-600 dark:text-neutral-400'>
                  {description}
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
            </div>
          </Card>
        </Container>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;

  if (!slug) {
    return {
      notFound: true,
    };
  }

  try {
    const shortUrl = await prisma.shortUrl.findUnique({
      where: { slug },
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

    // Increment click count
    await prisma.shortUrl.update({
      where: { slug },
      data: {
        clicks: {
          increment: 1,
        },
        updated_at: new Date(),
      },
    });

    // Return URL data for confirmation page instead of redirecting
    return {
      props: {
        originalUrl: shortUrl.original_url,
        title: shortUrl.title || null,
        description: shortUrl.description || null,
        slug: shortUrl.slug,
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
