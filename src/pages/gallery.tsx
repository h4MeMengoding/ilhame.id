import { GetStaticProps } from 'next';
import { useState } from 'react';
import useSWR from 'swr';

import Container from '@/common/components/elements/Container';
import PageHeading from '@/common/components/elements/PageHeading';
import SEO from '@/common/components/SEO';
import {
  generateBreadcrumbSchema,
  generatePersonSchema,
} from '@/common/libs/structured-data';
import GalleryMasonry from '@/modules/gallery/components/GalleryMasonry';
import { fetcher } from '@/services/fetcher';

interface GalleryItem {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  category?: string;
  is_featured: boolean;
  created_at: string;
}

interface GalleryPageProps {
  initialGalleryItems: GalleryItem[];
}

export default function GalleryPage({ initialGalleryItems }: GalleryPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Fetch gallery data using SWR with initial data from SSG
  const { data, isLoading, error } = useSWR('/api/gallery', fetcher, {
    fallbackData: { data: initialGalleryItems },
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    dedupingInterval: 300000, // 5 minutes
  });

  const galleryItems: GalleryItem[] = data?.data || [];

  // Get unique categories
  const categories = Array.from(
    new Set(
      galleryItems
        .map((item) => item.category)
        .filter((category): category is string => Boolean(category)),
    ),
  ).sort();

  const filteredItems = selectedCategory
    ? galleryItems.filter((item) => item.category === selectedCategory)
    : galleryItems;

  const PAGE_TITLE = 'Gallery';
  const PAGE_DESCRIPTION =
    'A collection of photos and images that capture moments, experiences, and inspirations.';

  const structuredData = [
    generatePersonSchema(),
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://ilhame.id' },
      { name: 'Gallery', url: 'https://ilhame.id/gallery' },
    ]),
  ];

  return (
    <>
      <SEO
        title={`${PAGE_TITLE}`}
        description={PAGE_DESCRIPTION}
        canonical='https://ilhame.id/gallery'
        openGraph={{
          type: 'website',
          locale: 'id_ID',
          url: 'https://ilhame.id/gallery',
          title: `${PAGE_TITLE} - Ilham Shofa`,
          description: PAGE_DESCRIPTION,
          images: [
            {
              url: 'https://i.imgur.com/fj8knf5.png',
              width: 1200,
              height: 630,
              alt: 'Ilham Shofa Gallery',
            },
          ],
          siteName: 'Ilham Shofa',
        }}
        structuredData={structuredData}
      />
      <Container data-aos='fade-up'>
        <PageHeading title={PAGE_TITLE} description={PAGE_DESCRIPTION} />

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className='mb-8 flex flex-wrap gap-3'>
            <button
              onClick={() => setSelectedCategory('')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              All ({galleryItems.length})
            </button>
            {categories.map((category) => {
              const count = galleryItems.filter(
                (item) => item.category === category,
              ).length;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                  }`}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Gallery Grid */}
        {isLoading ? (
          <div className='flex justify-center py-12'>
            <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600'></div>
          </div>
        ) : error ? (
          <div className='py-12 text-center'>
            <p className='text-red-600 dark:text-red-400'>
              Failed to load gallery items
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className='py-12 text-center'>
            <p className='text-neutral-600 dark:text-neutral-400'>
              {selectedCategory
                ? `No photos found in "${selectedCategory}"`
                : 'No photos available'}
            </p>
          </div>
        ) : (
          <GalleryMasonry items={filteredItems} />
        )}
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    // Fetch gallery data directly from the database on the server
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const galleryItems = await prisma.gallery.findMany({
      where: {
        is_published: true,
      },
      orderBy: [{ is_featured: 'desc' }, { created_at: 'desc' }],
      select: {
        id: true,
        title: true,
        description: true,
        image_url: true,
        category: true,
        is_featured: true,
        created_at: true,
      },
    });

    await prisma.$disconnect();

    // Convert dates to strings for serialization
    const serializedGalleryItems = galleryItems.map((item) => ({
      ...item,
      created_at: item.created_at.toISOString(),
    }));

    return {
      props: {
        initialGalleryItems: serializedGalleryItems,
      },
      // ISR: revalidate every 5 minutes
      revalidate: 300,
    };
  } catch (error) {
    console.error('Error fetching gallery items:', error);

    return {
      props: {
        initialGalleryItems: [],
      },
      // ISR: revalidate every minute if error
      revalidate: 60,
    };
  }
};
