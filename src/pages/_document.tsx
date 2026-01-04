import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='id'>
      <Head>
        {/* Analytics */}
        <script
          async
          defer
          src='https://anly.ilhame.id/script.js'
          data-website-id='0d4c5eae-072d-4bba-b65e-8834d24dd45f'
        ></script>

        {/* DNS Prefetch & Preconnect untuk performance */}
        <link rel='dns-prefetch' href='//fonts.googleapis.com' />
        <link rel='dns-prefetch' href='//i.imgur.com' />
        <link rel='dns-prefetch' href='//dmbxunmzyqsdrucjjerq.supabase.co' />
        <link rel='dns-prefetch' href='//api.github.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />

        {/* RSS Feed */}
        <link
          rel='alternate'
          type='application/rss+xml'
          title='Ilham Shofa Blog RSS Feed'
          href='https://ilhame.id/api/rss.xml'
        />

        {/* Preload critical CSS and fonts */}
        <link
          rel='preload'
          href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
          as='style'
        />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
          media='print'
          onLoad={() => "this.media='all'"}
        />
        <noscript>
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
          />
        </noscript>

        {/* Favicon dan Icons */}
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/favicon/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon/favicon-16x16.png'
        />
        <link rel='manifest' href='/favicon/site.webmanifest' />
        <link
          rel='mask-icon'
          href='/favicon/safari-pinned-tab.svg'
          color='#121212'
        />

        {/* Meta Tags untuk SEO */}
        <meta name='theme-color' content='#121212' />
        <meta name='msapplication-TileColor' content='#121212' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta
          name='apple-mobile-web-app-status-bar-style'
          content='black-translucent'
        />
        <meta name='format-detection' content='telephone=no' />

        {/* Social Media Meta Tags */}
        <meta name='instagram:site' content='@ilham.shff' />
        <meta name='instagram:creator' content='@ilham.shff' />

        {/* Bing Verification - Tambahkan jika diperlukan */}
        {/* <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" /> */}

        {/* Performance Hints */}
        {/* <link rel="preload" as="style" href="/_next/static/css/styles.css" /> */}

        {/* Security Headers */}
        <meta httpEquiv='X-Content-Type-Options' content='nosniff' />
        <meta
          httpEquiv='Referrer-Policy'
          content='strict-origin-when-cross-origin'
        />

        {/* Schema.org untuk Person & Organization - Prioritas nama author */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Person',
                name: 'Ilham Shofa',
                url: 'https://ilhame.id',
                image:
                  'https://res.cloudinary.com/dgbg05oc5/image/upload/v1767529742/og-ilhameid_ootgmj.webp',
                sameAs: [
                  'https://github.com/h4MeMengoding',
                  'https://instagram.com/ilham.shff',
                  'https://linkedin.com/in/ilhamshofa',
                ],
                jobTitle: 'Code the Future & Capture the Moment',
                worksFor: {
                  '@type': 'Organization',
                  name: 'Freelancer',
                },
                knowsAbout: [
                  'Web Development',
                  'JavaScript',
                  'TypeScript',
                  'React',
                  'Next.js',
                  'Node.js',
                  'Photography',
                  'Videography',
                  'Content Creation',
                ],
                alumniOf: {
                  '@type': 'EducationalOrganization',
                  name: 'Universitas Negeri Semarang',
                },
                birthPlace: 'Indonesia',
                nationality: 'Indonesian',
                description:
                  'Creative, Code and Tech Enthusiast passionate about web development, photography, and videography.',
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'Ilham Shofa',
                alternateName: 'Ilham Shofa Portfolio',
                url: 'https://ilhame.id',
                description:
                  'Personal portfolio website of Ilham Shofa - Code the Future & Capture the Moment',
                author: {
                  '@type': 'Person',
                  name: 'Ilham Shofa',
                  url: 'https://ilhame.id',
                },
                inLanguage: 'id-ID',
                copyrightYear: new Date().getFullYear(),
                copyrightHolder: {
                  '@type': 'Person',
                  name: 'Ilham Shofa',
                },
                potentialAction: {
                  '@type': 'SearchAction',
                  target: {
                    '@type': 'EntryPoint',
                    urlTemplate:
                      'https://ilhame.id/blog?search={search_term_string}',
                  },
                  'query-input': 'required name=search_term_string',
                },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Ilham Shofa',
                alternateName: 'ilhame.id',
                url: 'https://ilhame.id',
                logo: 'https://res.cloudinary.com/dgbg05oc5/image/upload/v1767529742/og-ilhameid_ootgmj.webp',
                description:
                  'Personal portfolio and blog of Ilham Shofa - Code the Future & Capture the Moment',
                foundingDate: '2023',
                founder: {
                  '@type': 'Person',
                  name: 'Ilham Shofa',
                },
                contactPoint: {
                  '@type': 'ContactPoint',
                  contactType: 'Customer Service',
                  url: 'https://ilhame.id/contact',
                  availableLanguage: ['Indonesian', 'English'],
                },
                sameAs: [
                  'https://github.com/h4MeMengoding',
                  'https://instagram.com/ilham.shff',
                  'https://linkedin.com/in/ilhamshofa',
                ],
              },
            ]),
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
