import Link from 'next/link';
import { FiArrowRight, FiClock } from 'react-icons/fi';
import useSWR from 'swr';

import { fetcher } from '@/services/fetcher';

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string;
  created_at: string;
  reading_time?: number;
}

interface RelatedPostsProps {
  currentPostId: number;
  tags?: string[];
}

export default function RelatedPosts({
  currentPostId,
  tags = [],
}: RelatedPostsProps) {
  const { data, isLoading } = useSWR<{ data: RelatedPost[] }>(
    `/api/blog/related?id=${currentPostId}&tags=${tags.join(',')}`,
    fetcher,
  );

  if (isLoading) {
    return (
      <div className='mt-12 animate-pulse'>
        <h2 className='mb-6 text-2xl font-bold'>Related Posts</h2>
        <div className='grid gap-6 md:grid-cols-3'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='h-64 rounded-lg bg-neutral-200 dark:bg-neutral-800'
            />
          ))}
        </div>
      </div>
    );
  }

  const relatedPosts = data?.data || [];

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className='mt-12 border-t border-neutral-200 pt-12 dark:border-neutral-800'>
      <h2 className='mb-6 text-2xl font-bold text-neutral-900 dark:text-neutral-100'>
        Related Posts
      </h2>
      <div className='grid gap-6 md:grid-cols-3'>
        {relatedPosts.slice(0, 3).map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}?id=${post.id}`}
            className='group overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900'
          >
            {post.featured_image_url && (
              <div className='aspect-video overflow-hidden'>
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                />
              </div>
            )}
            <div className='p-4'>
              <h3 className='mb-2 line-clamp-2 font-semibold text-neutral-900 group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400'>
                {post.title}
              </h3>
              <p className='mb-3 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400'>
                {post.excerpt}
              </p>
              <div className='flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-500'>
                {post.reading_time && (
                  <div className='flex items-center gap-1'>
                    <FiClock className='h-3 w-3' />
                    <span>{post.reading_time} min read</span>
                  </div>
                )}
                <div className='flex items-center gap-1 text-blue-600 dark:text-blue-400'>
                  <span>Read more</span>
                  <FiArrowRight className='h-3 w-3 transition-transform group-hover:translate-x-1' />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
