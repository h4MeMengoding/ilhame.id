import Script from 'next/script';
import { NextSeo } from 'next-seo';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  structuredData?: object;
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const SEO = ({
  title = 'Ilham Shofa - Videographer & Photographer',
  description = 'Passionate about videography, photography, and creative editing, combining my love for cameras with storytelling through visuals.',
  canonical = 'https://ilhame.id',
  image = 'https://i.imgur.com/fj8knf5.png',
  type = 'website',
  structuredData,
  keywords = 'videographer, photographer, creative editing, visual storytelling, content creator, ilham shofa',
  author = 'Ilham Shofa',
  publishedTime,
  modifiedTime,
}: SEOProps) => {
  const openGraphData: any = {
    type,
    url: canonical,
    title,
    description,
    site_name: 'Ilham Shofa',
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  };

  if (type === 'article' && publishedTime) {
    openGraphData.article = {
      publishedTime,
      modifiedTime,
      authors: [author],
      section: 'Technology',
      tags: keywords.split(', '),
    };
  }

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={canonical}
        openGraph={openGraphData}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: keywords,
          },
          {
            name: 'author',
            content: author,
          },
          {
            name: 'robots',
            content:
              'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
          {
            name: 'googlebot',
            content:
              'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
          {
            name: 'theme-color',
            content: '#000000',
          },
          {
            name: 'msapplication-TileColor',
            content: '#000000',
          },
          {
            name: 'instagram:site',
            content: '@ilham.shff',
          },
          {
            name: 'instagram:creator',
            content: '@ilham.shff',
          },
        ]}
        additionalLinkTags={[
          {
            rel: 'me',
            href: 'https://instagram.com/ilham.shff',
          },
          {
            rel: 'icon',
            href: '/favicon.ico',
          },
          {
            rel: 'apple-touch-icon',
            href: '/favicon/apple-touch-icon.png',
            sizes: '180x180',
          },
          {
            rel: 'manifest',
            href: '/favicon/site.webmanifest',
          },
        ]}
      />

      {structuredData && (
        <Script
          id='structured-data'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </>
  );
};

export default SEO;
