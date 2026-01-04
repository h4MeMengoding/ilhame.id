import useSWR from 'swr';

import Breakline from '@/common/components/elements/Breakline';
import HTMLContent from '@/common/components/elements/HTMLContent';
import MDXComponent from '@/common/components/elements/MDXComponent';
import { calculateReadingTime } from '@/common/helpers';
import { BlogDetailProps } from '@/common/types/blog';
import { fetcher } from '@/services/fetcher';

import BlogHeader from './BlogHeader';
import BlogSidebar from './BlogSidebar';
import CommentSection from './CommentSection';
import RelatedPosts from './RelatedPosts';
import TableOfContents from './TableOfContents';

const BlogDetail = ({
  id,
  title,
  date,
  slug,
  content,
  excerpt,
  tags_list,
  featured_image_url,
}: BlogDetailProps) => {
  const { data: viewsData } = useSWR(
    `/api/views?slug=${slug}&id=${id}`,
    fetcher,
  );

  const viewsCount = viewsData?.views || 0;

  // tags_list can be array of strings (slugs) or array of tag objects
  // Extract slugs for RelatedPosts component
  const tagSlugs = Array.isArray(tags_list)
    ? tags_list.map((item: any) =>
        typeof item === 'string' ? item : item.slug || item.name,
      )
    : [];

  const readingTimeMinutes = calculateReadingTime(content?.rendered) ?? 0;

  return (
    <div className='flex flex-col gap-8 lg:flex-row'>
      {/* Main Content */}
      <div className='flex-1 lg:max-w-3xl'>
        <BlogHeader
          title={title?.rendered}
          comments_count={0}
          reading_time_minutes={readingTimeMinutes}
          published_at={date}
          page_views_count={viewsCount}
        />

        {/* Description/Excerpt */}
        {excerpt?.rendered && (
          <div className='my-6'>
            <div
              className='text-base leading-relaxed text-neutral-700 dark:text-neutral-300'
              dangerouslySetInnerHTML={{ __html: excerpt.rendered }}
              suppressHydrationWarning
            />
          </div>
        )}

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

        <div className='space-y-6 leading-[1.8] dark:text-neutral-300'>
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

        <Breakline className='!my-10' />

        {/* Related Posts */}
        <RelatedPosts currentPostId={id} tags={tagSlugs} />

        <Breakline className='!my-10' />

        {/* Comments Section */}
        <CommentSection blogId={id} />
      </div>

      {/* Sidebar */}
      <aside className='w-full lg:sticky lg:top-24 lg:h-fit lg:w-80'>
        <div className='space-y-6'>
          {/* Table of Contents */}
          {content?.rendered && <TableOfContents content={content.rendered} />}

          {/* Blog Sidebar */}
          <BlogSidebar
            published_at={date}
            reading_time_minutes={readingTimeMinutes}
            page_views_count={viewsCount}
            tags_list={tags_list}
            title={title?.rendered}
            slug={slug}
          />
        </div>
      </aside>
    </div>
  );
};

export default BlogDetail;
