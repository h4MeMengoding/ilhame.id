import { useEffect, useState } from 'react';
import { FaRegEye as ViewIcon } from 'react-icons/fa';
import { HiOutlineClock as ClockIcon } from 'react-icons/hi';
import { IoCalendarOutline as CalendarIcon } from 'react-icons/io5';
import { FiShare2 } from 'react-icons/fi';

import { formatDate } from '@/common/helpers';

import ShareModal from './ShareModal';

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface BlogTag {
  tag: Tag;
}

interface BlogSidebarProps {
  published_at?: string;
  reading_time_minutes?: number;
  page_views_count?: number | null;
  tags_list?: any[]; // Accept any array type for backward compatibility
  title?: string;
  slug?: string;
}

const BlogSidebar = ({
  published_at,
  reading_time_minutes,
  page_views_count,
  tags_list,
  title,
  slug,
}: BlogSidebarProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const blogUrl = `https://ilhame.id/blog/${slug}`;

  return (
    <div className='space-y-6'>
      {/* Article Info */}
      <div className='rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900'>
        <h3 className='mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-300'>
          Article Info
        </h3>
        <div className='space-y-4'>
          <div className='flex items-center space-x-3 text-neutral-700 dark:text-neutral-300'>
            <CalendarIcon className='h-5 w-5 text-neutral-500 dark:text-neutral-400' />
            <div className='flex-1'>
              <p className='text-sm font-medium' suppressHydrationWarning>
                {published_at ? formatDate(published_at) : '-'}
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-3 text-neutral-700 dark:text-neutral-300'>
            <ClockIcon className='h-5 w-5 text-neutral-500 dark:text-neutral-400' />
            <div className='flex-1'>
              <p className='text-sm font-medium' suppressHydrationWarning>
                {reading_time_minutes} min read
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-3 text-neutral-700 dark:text-neutral-300'>
            <ViewIcon className='h-5 w-5 text-neutral-500 dark:text-neutral-400' />
            <div className='flex-1'>
              <p className='text-sm font-medium' suppressHydrationWarning>
                {isMounted ? page_views_count || 0 : 0} views
              </p>
            </div>
          </div>

          {/* Share Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className='mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800'
          >
            <FiShare2 className='h-4 w-4' />
            Share Article
          </button>
        </div>
      </div>

      {/* Tags */}
      {tags_list && tags_list.length > 0 && (
        <div className='rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900'>
          <h3 className='mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-300'>
            Tags
          </h3>
          <div className='flex flex-wrap gap-2'>
            {tags_list.map((item, index) => {
              // Handle different structures:
              // 1. String (old data): "ubuntu"
              // 2. Tag object: { id, name, slug }
              // 3. BlogTag object: { tag: { id, name, slug } }
              let tagName = '';
              let tagId = index;

              if (typeof item === 'string') {
                // Old data - plain string
                tagName = item;
              } else if (item && typeof item === 'object') {
                // Check if it's BlogTag structure
                if ('tag' in item && item.tag) {
                  tagName = item.tag.name || '';
                  tagId = item.tag.id;
                } else if ('name' in item) {
                  // Direct Tag structure
                  tagName = item.name || '';
                  tagId = item.id || index;
                }
              }

              if (!tagName) return null;

              return (
                <div
                  key={tagId}
                  className='inline-flex items-center rounded-full bg-neutral-200 px-3 py-1 text-sm font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200'
                >
                  <span className='mr-1'>#</span>
                  {tagName}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          url={blogUrl}
          title={title || 'Blog Post'}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default BlogSidebar;
