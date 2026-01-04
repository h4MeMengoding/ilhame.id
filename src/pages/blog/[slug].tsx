import axios from 'axios';
import { GetServerSideProps, NextPage } from 'next';
import { ArticleJsonLd, BreadcrumbJsonLd, NextSeo } from 'next-seo';
import { useEffect } from 'react';
import { useSWRConfig } from 'swr';

import BackButton from '@/common/components/elements/BackButton';
import Breadcrumb from '@/common/components/elements/Breadcrumb';
import Container from '@/common/components/elements/Container';
import { formatExcerpt } from '@/common/helpers';
import { BlogDetailProps } from '@/common/types/blog';
import BlogDetail from '@/modules/blog/components/BlogDetail';
import ReadingProgressBar from '@/modules/blog/components/ReadingProgressBar';

interface BlogDetailPageProps {
  blog: {
    data: BlogDetailProps;
  };
}

const BlogDetailPage: NextPage<BlogDetailPageProps> = ({ blog }) => {
  const blogData = blog?.data || {};
  const { mutate } = useSWRConfig();

  const slug = `blog/${blogData?.slug}?id=${blogData?.id}`;
  const canonicalUrl = `https://ilhame.id/blog/${blogData?.slug}`;
  const description = formatExcerpt(blogData?.excerpt?.rendered);

  const breadcrumbItems = [
    { name: 'Blog', url: 'https://ilhame.id/blog' },
    {
      name: blogData?.title?.rendered || 'Article',
      url: canonicalUrl,
      isCurrentPage: true,
    },
  ];

  const incrementViews = async () => {
    try {
      const localStorageKey = `viewed_${blogData?.slug}`;
      const hasViewedInLocalStorage = localStorage.getItem(localStorageKey);

      const response = await axios.post(
        `/api/views?slug=${blogData?.slug}`,
        {},
        {
          headers: {
            'x-has-viewed': hasViewedInLocalStorage ? 'true' : 'false',
          },
        },
      );

      if (response.data.incremented) {
        const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem(localStorageKey, expiryTime.toString());
      }

      mutate(`/api/views?slug=${blogData?.slug}&id=${blogData?.id}`);
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
  };

  useEffect(() => {
    const cleanupExpiredViews = () => {
      const now = Date.now();
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('viewed_')) {
          const expiry = localStorage.getItem(key);
          if (expiry && parseInt(expiry) < now) {
            localStorage.removeItem(key);
          }
        }
      });
    };

    cleanupExpiredViews();
    incrementViews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ReadingProgressBar />

      <NextSeo
        title={`${blogData?.title?.rendered} - Blog Ilham Shofa`}
        description={description}
        canonical={canonicalUrl}
        openGraph={{
          type: 'article',
          article: {
            publishedTime: blogData?.date,
            modifiedTime: blogData?.modified || blogData?.date,
            authors: ['Ilham Shofa'],
            tags: blogData?.tags_list?.map((tag: any) => tag.slug || tag) || [],
          },
          url: canonicalUrl,
          images: [
            {
              url:
                blogData?.featured_image_url ||
                'https://res.cloudinary.com/dgbg05oc5/image/upload/v1767529742/og-ilhameid_ootgmj.webp',
              width: 1200,
              height: 630,
              alt: blogData?.title?.rendered,
            },
          ],
          siteName: 'Ilham Shofa Blog',
        }}
        twitter={{
          handle: '@ilhamshofa',
          site: '@ilhamshofa',
          cardType: 'summary_large_image',
        }}
      />

      <ArticleJsonLd
        type='BlogPosting'
        url={canonicalUrl}
        title={blogData?.title?.rendered}
        images={[
          blogData?.featured_image_url ||
            'https://res.cloudinary.com/dgbg05oc5/image/upload/v1767529742/og-ilhameid_ootgmj.webp',
        ]}
        datePublished={blogData?.date}
        dateModified={blogData?.modified || blogData?.date}
        authorName='Ilham Shofa'
        description={description}
        publisherName='Ilham Shofa'
        publisherLogo='https://res.cloudinary.com/dgbg05oc5/image/upload/v1767529742/og-ilhameid_ootgmj.webp'
      />

      <BreadcrumbJsonLd
        itemListElements={breadcrumbItems.map((item, index) => ({
          position: index + 1,
          name: item.name,
          item: item.url,
        }))}
      />

      <Container data-aos='fade-up'>
        <BackButton url='/blog' />
        <Breadcrumb items={breadcrumbItems} />
        <BlogDetail {...blogData} />
      </Container>
    </>
  );
};

export default BlogDetailPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const blogId = context.query?.id as string;

  if (!blogId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  try {
    // Fetch blog detail from internal API
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/blog/${blogId}`,
    );

    if (!response.ok) {
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      };
    }

    const blogData = await response.json();

    return {
      props: {
        blog: blogData,
      },
    };
  } catch (error) {
    console.error('Error fetching blog detail:', error);
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    };
  }
};
