import { NextPage } from 'next';

import Container from '@/common/components/elements/Container';
import PageHeading from '@/common/components/elements/PageHeading';
import SEO from '@/common/components/SEO';
import {
  generateBreadcrumbSchema,
  generatePersonSchema,
} from '@/common/libs/structured-data';
import About from '@/modules/about';

const PAGE_TITLE = 'About';
const PAGE_DESCRIPTION =
  'A brief overview of who I am - get to know and understand me better';

const AboutPage: NextPage = () => {
  const structuredData = [
    generatePersonSchema(),
    generateBreadcrumbSchema([
      { name: 'Home', url: 'https://ilhame.id' },
      { name: 'About', url: 'https://ilhame.id/about' },
    ]),
  ];

  return (
    <>
      <SEO
        title={`${PAGE_TITLE}`}
        description={PAGE_DESCRIPTION}
        canonical='https://ilhame.id/about'
        openGraph={{
          type: 'profile',
          locale: 'id_ID',
          url: 'https://ilhame.id/about',
          title: `${PAGE_TITLE} - Ilham Shofa`,
          description: PAGE_DESCRIPTION,
          images: [
            {
              url: 'https://i.imgur.com/fj8knf5.png',
              width: 1200,
              height: 630,
              alt: 'Ilham Shofa',
            },
          ],
          siteName: 'Ilham Shofa',
        }}
        structuredData={structuredData}
      />
      <Container data-aos='fade-up'>
        <PageHeading title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <About />
      </Container>
    </>
  );
};

export default AboutPage;
