import { NextPage } from 'next';

import Container from '@/common/components/elements/Container';
import SEO from '@/common/components/SEO';
import {
  generateOrganizationSchema,
  generatePersonSchema,
} from '@/common/libs/structured-data';
import Home from '@/modules/home';

const HomePage: NextPage = () => {
  const structuredData = [generatePersonSchema(), generateOrganizationSchema()];

  return (
    <>
      <SEO
        title='Home | Code the Future & Capture the Moment'
        description='Personal website of Ilham Shofa - Creative, Code and Tech Enthusiast passionate about web development, photography, and videography.'
        canonical='https://ilhame.id'
        openGraph={{
          type: 'website',
          locale: 'id_ID',
          url: 'https://ilhame.id',
          title: 'Ilham Shofa - Code the Future & Capture the Moment',
          description:
            'Personal website of Ilham Shofa - Creative, Code and Tech Enthusiast passionate about web development, photography, and videography.',
          images: [
            {
              url: 'https://dmbxunmzyqsdrucjjerq.supabase.co/storage/v1/object/public/project-images/og/og%20(1).png',
              width: 1200,
              height: 630,
              alt: 'Ilham Shofa',
            },
          ],
          siteName: 'Ilham Shofa',
        }}
        twitter={{
          handle: '@ilhamontwt',
          site: '@ilhamontwt',
          cardType: 'summary_large_image',
        }}
        structuredData={structuredData}
      />
      <Container data-aos='fade-up'>
        <Home />
      </Container>
    </>
  );
};

export default HomePage;
