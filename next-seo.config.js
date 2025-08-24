const canonicalUrl = 'https://ilhame.id';
const metaImage = 'https://i.imgur.com/fj8knf5.png';
const metaDescription =
  'Ilham Shofa - Creative, Code and Tech Enthusiast passionate about web development, photography, and videography.';

const author = 'Ilham Shofa';
const siteName = 'Ilham Shofa Portfolio';

const defaultSEOConfig = {
  defaultTitle: `${author} - Code the Future & Capture the Moment`,
  titleTemplate: '%s | Ilham Shofa',
  description: metaDescription,
  canonical: canonicalUrl,
  additionalMetaTags: [
    {
      name: 'author',
      content: author,
    },
    {
      name: 'keywords',
      content:
        'Ilham Shofa, Creative, Code and Tech Enthusiast, Web Developer, JavaScript, TypeScript, React, Next.js, Node.js, Photography, Videography, Content Creator, Blog, Portfolio, Indonesia Developer',
    },
    {
      name: 'robots',
      content: 'index,follow',
    },
    {
      name: 'googlebot',
      content: 'index,follow',
    },
    {
      name: 'language',
      content: 'Indonesian',
    },
    {
      name: 'geo.region',
      content: 'ID',
    },
    {
      name: 'geo.country',
      content: 'Indonesia',
    },
    {
      name: 'distribution',
      content: 'Global',
    },
    {
      name: 'rating',
      content: 'General',
    },
    {
      name: 'instagram:site',
      content: '@ilham.shff',
    },
    {
      name: 'instagram:creator',
      content: '@ilham.shff',
    },
  ],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: canonicalUrl,
    title: `${author} - Code the Future & Capture the Moment`,
    description: metaDescription,
    images: [
      {
        url: metaImage,
        alt: `${author} - Portfolio Website`,
        width: 1200,
        height: 630,
        type: 'image/png',
      },
      {
        url: metaImage,
        alt: `${author} - Portfolio Website`,
        width: 1600,
        height: 900,
        type: 'image/png',
      },
      {
        url: metaImage,
        alt: `${author} - Portfolio Website`,
        width: 800,
        height: 600,
        type: 'image/png',
      },
    ],
    siteName: author, // Menggunakan nama author sebagai site name
  },
  additionalLinkTags: [
    {
      rel: 'me',
      href: 'https://instagram.com/ilham.shff',
    },
  ],
  languageAlternates: [
    {
      hrefLang: 'id',
      href: canonicalUrl,
    },
    {
      hrefLang: 'x-default',
      href: canonicalUrl,
    },
  ],
};

export default defaultSEOConfig;
