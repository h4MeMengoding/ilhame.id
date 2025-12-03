const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false, // Removes X-Powered-By header for security
  output: 'standalone', // Enable standalone output for Docker

  // Performance optimizations
  experimental: {
    optimizeCss: true,
    // Enable incremental cache for faster builds
    incrementalCacheHandlerPath: undefined,
    // Skip validation for faster builds in production
    isrMemoryCacheSize: 0,
  },

  // Disable source maps in production for faster builds
  productionBrowserSourceMaps: false,

  // Increase timeout for external requests during build
  staticPageGenerationTimeout: 180,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'], // Modern image formats for better performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // Cache images for 30 days
  },
  compress: true, // Enable gzip compression

  // SEO optimizations
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      // Add any necessary redirects here
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Enable webpack bundle analyzer for development
  webpack: (config, { dev, isServer }) => {
    // Faster builds with proper caching
    config.cache = !dev
      ? false
      : {
          type: 'filesystem',
          buildDependencies: {
            config: [__filename],
          },
        };

    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
            },
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    // Faster module resolution
    config.resolve.symlinks = false;

    return config;
  },
};

module.exports = nextConfig;
