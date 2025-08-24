import useSWR from 'swr';

import Breakline from '@/common/components/elements/Breakline';
import HTMLContent from '@/common/components/elements/HTMLContent';
import MDXComponent from '@/common/components/elements/MDXComponent';
import { calculateReadingTime } from '@/common/helpers';
import { BlogDetailProps } from '@/common/types/blog';
import { fetcher } from '@/services/fetcher';

import BlogHeader from './BlogHeader';
import CommentSection from './CommentSection';

const BlogDetail = ({
  id,
  title,
  date,
  slug,
  content,
  tags_list,
  featured_image_url,
}: BlogDetailProps) => {
  const { data: viewsData } = useSWR(
    `/api/views?slug=${slug}&id=${id}`,
    fetcher,
  );

  const viewsCount = viewsData?.views || 0;
  const tagList = tags_list || [];

  const readingTimeMinutes = calculateReadingTime(content?.rendered) ?? 0;

  return (
    <>
      <BlogHeader
        title={title?.rendered}
        comments_count={0}
        reading_time_minutes={readingTimeMinutes}
        published_at={date}
        page_views_count={viewsCount}
      />

      {/* Featured Image */}
      {featured_image_url &&
        featured_image_url !== '/images/placeholder.png' && (
          <div className='my-8'>
            <div className='relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800'>
              <img
                src={featured_image_url}
                alt={title?.rendered || 'Blog featured image'}
                className='h-full w-full object-cover transition-opacity duration-300'
                loading='lazy'
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                    <div class="flex h-full w-full items-center justify-center text-neutral-500 dark:text-neutral-400">
                      <span class="text-sm">Failed to load image</span>
                    </div>
                  `;
                  }
                }}
              />
            </div>
            {title?.rendered && (
              <p className='mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400'>
                {title.rendered}
              </p>
            )}
          </div>
        )}

      <div className='space-y-6 leading-[1.8] dark:text-neutral-300 '>
        {content?.rendered && (
          <>
            {/* Check if content is HTML (contains HTML tags) or markdown */}
            {content.rendered.includes('<') ? (
              <HTMLContent>{content.rendered}</HTMLContent>
            ) : (
              <MDXComponent>
                {content?.markdown || content?.rendered}
              </MDXComponent>
            )}
          </>
        )}
      </div>
      {tagList?.length >= 1 && (
        <div className='my-10 space-y-2'>
          <h6 className='text-lg font-medium'>Tag:</h6>
          <div className='flex flex-wrap gap-2 pt-2'>
            {tagList?.map((tag) => (
              <div
                key={tag?.term_id}
                className='rounded-full bg-neutral-200 px-4 py-1 text-[14px] font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-200'
              >
                <span className='mr-1 font-semibold'>#</span>
                {tag?.name.charAt(0).toUpperCase() + tag?.name.slice(1)}
              </div>
            ))}
          </div>
        </div>
      )}
      <Breakline className='!my-10' />

      {/* Comments Section */}
      <CommentSection blogId={id} />
    </>
  );
};

export default BlogDetail;
