/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://ilhame.id',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  generateIndexSitemap: true,
  exclude: [
    '/api/*',
    '/dashboard*',
    '/url/dashboard*',
    '/login',
    '/register',
    '/learn*',
    '/playground*',
    '/_*',
    '/404',
    '/500',
  ],
  additionalPaths: async (config) => [
    await config.transform(config, '/'),
    await config.transform(config, '/about'),
    await config.transform(config, '/blog'),
    await config.transform(config, '/projects'),
    await config.transform(config, '/contact'),
    await config.transform(config, '/status'),
    await config.transform(config, '/gallery'),
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard',
          '/url/dashboard',
          '/login',
          '/register',
          '/learn',
          '/playground',
          '/_next/',
          '/admin',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard',
          '/url/dashboard',
          '/learn',
          '/playground',
        ],
      },
    ],
  },
  transform: async (config, path) => {
    // Customize priority and changefreq based on path
    let priority = 0.7;
    let changefreq = 'daily';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.includes('/blog')) {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (path.includes('/projects')) {
      priority = 0.8;
      changefreq = 'monthly';
    } else if (path.includes('/learn')) {
      priority = 0.9;
      changefreq = 'weekly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
};
