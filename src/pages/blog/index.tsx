import { GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';

import Container from '@/common/components/elements/Container';
import BlogListNew from '@/modules/blog';

const PAGE_TITLE = 'Blog';

interface BlogPageProps {
  initialBlogData?: any;
}

const BlogPage: NextPage<BlogPageProps> = ({ initialBlogData }) => {
  return (
    <>
      <NextSeo title={`${PAGE_TITLE}`} />
      <Container className='xl:!-mt-5' data-aos='fade-up'>
        <BlogListNew initialData={initialBlogData} />
      </Container>
    </>
  );
};

// Pre-fetch first page of blog posts
export const getStaticProps: GetStaticProps = async () => {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const [posts, total] = await Promise.all([
      prisma.blog.findMany({
        where: { status: 'published' },
        orderBy: { updated_at: 'desc' },
        take: 6,
        select: {
          id: true,
          title: true,
          content: true,
          excerpt: true,
          slug: true,
          featured_image_url: true,
          is_featured: true,
          updated_at: true,
          created_at: true,
        },
      }),
      prisma.blog.count({ where: { status: 'published' } }),
    ]);

    // Get view counts from contentmeta table
    const postsWithViews = await Promise.all(
      posts.map(async (post) => {
        const contentMeta = await prisma.contentmeta.findFirst({
          where: { slug: post.slug, type: 'blog' },
        });

        return {
          ...post,
          total_views_count: contentMeta?.views || 0,
        };
      }),
    );

    await prisma.$disconnect();

    const serializedPosts = postsWithViews.map((post) => ({
      ...post,
      created_at: post.created_at.toISOString(),
      updated_at: post.updated_at.toISOString(),
      date: post.created_at.toISOString(),
      modified: post.updated_at.toISOString(),
      link: `/blog/${post.slug}`,
      title: {
        rendered: post.title,
      },
      content: {
        rendered: post.content,
        protected: false,
      },
      excerpt: {
        rendered: post.excerpt || '',
        protected: false,
      },
      tags_list: [], // Empty array for now, can be populated if needed
    }));

    return {
      props: {
        initialBlogData: {
          status: true,
          data: {
            posts: serializedPosts,
            total_pages: Math.ceil(total / 6),
            total_posts: total,
            page: 1,
            per_page: 6,
          },
        },
      },
      revalidate: 300, // Revalidate every 5 minutes
    };
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return {
      props: {
        initialBlogData: {
          status: false,
          data: {
            posts: [],
            total_pages: 0,
            total_posts: 0,
            page: 1,
            per_page: 6,
          },
        },
      },
      revalidate: 60,
    };
  }
};

export default BlogPage;
