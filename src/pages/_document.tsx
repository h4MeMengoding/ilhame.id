import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='id'>
      <Head>
        {/* Analytics */}
        <script
          async
          defer
          src='https://analytics.hame.my.id/script.js'
          data-website-id='0d4c5eae-072d-4bba-b65e-8834d24dd45f'
        ></script>

        {/* DNS Prefetch & Preconnect untuk performance */}
        <link rel='dns-prefetch' href='//fonts.googleapis.com' />
        <link rel='dns-prefetch' href='//i.imgur.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />

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

        {/* Google Site Verification */}
        <meta
          name='google-site-verification'
          content='XyIRwcF70qvInoOXmDaZRRGpQMUBd20GFkcXfO1-Tqk'
        />

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

        {/* Schema.org untuk Organization */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Ilham Shofa Portfolio',
              alternateName: 'ilhame.id',
              url: 'https://ilhame.id',
              description:
                'Personal portfolio website of Ilham Shofa - Beginner Developer and Videography',
              author: {
                '@type': 'Person',
                name: 'Ilham Shofa',
                url: 'https://ilhame.id',
                sameAs: [
                  'https://instagram.com/ilham.shff',
                  'https://github.com/h4MeMengoding',
                  'https://linkedin.com/in/ilhamshofa',
                ],
                jobTitle: 'Beginner Developer and Videographer',
                image: 'https://i.imgur.com/fj8knf5.png',
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
            }),
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
