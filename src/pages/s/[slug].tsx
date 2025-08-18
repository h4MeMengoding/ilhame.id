import { GetServerSideProps } from 'next';
import Link from 'next/link';

import prisma from '@/common/libs/prisma';

interface RedirectPageProps {
  originalUrl?: string;
  title?: string;
  error?: string;
}

const RedirectPage = ({ originalUrl, title, error }: RedirectPageProps) => {
  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-800 dark:text-gray-200'>
            404
          </h1>
          <p className='mt-2 text-gray-600 dark:text-gray-400'>
            Short URL not found
          </p>
          <Link
            href='/'
            className='mt-4 inline-block rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600'
          >
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900'>
      <div className='text-center'>
        <div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500'></div>
        <p className='mt-4 text-gray-600 dark:text-gray-400'>
          Redirecting to {title || originalUrl}...
        </p>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;

  if (!slug) {
    return {
      props: {
        error: 'No slug provided',
      },
    };
  }

  try {
    const shortUrl = await prisma.shortUrl.findUnique({
      where: { slug },
    });

    if (!shortUrl || !shortUrl.is_active) {
      return {
        props: {
          error: 'Short URL not found or inactive',
        },
      };
    }

    // Check if URL has expired
    if (shortUrl.expires_at && new Date() > shortUrl.expires_at) {
      return {
        props: {
          error: 'Short URL has expired',
        },
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

    // Redirect to original URL
    return {
      redirect: {
        destination: shortUrl.original_url,
        permanent: false,
      },
    };
  } catch (error) {
    console.error('Error redirecting:', error);
    return {
      props: {
        error: 'Server error',
      },
    };
  }
};

export default RedirectPage;
