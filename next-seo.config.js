const canonicalUrl = 'https://ilhame.id';
const metaImage = 'https://i.imgur.com/fj8knf5.png';
const metaDescription =
  'Passionate about videography, photography, and creative editing, combining my love for cameras with storytelling through visuals.';

const defaultSEOConfig = {
  defaultTitle: 'Ilham Shofa - Personal Website',
  description: metaDescription,
  canonical: canonicalUrl,
  openGraph: {
    canonical: canonicalUrl,
    title: 'Ilham Shofa - Personal Website',
    description: metaDescription,
    type: 'website',
    images: [
      {
        url: metaImage,
        alt: 'ilhame.id og-image',
        width: 800,
        height: 600,
      },
      {
        url: metaImage,
        alt: 'ilhame.id og-image',
        width: 1200,
        height: 630,
      },
      {
        url: metaImage,
        alt: 'ilhame.id og-image',
        width: 1600,
        height: 900,
      },
    ],
    site_name: 'ilhame.id',
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
};

export default defaultSEOConfig;
