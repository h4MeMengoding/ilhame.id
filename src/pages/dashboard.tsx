import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import Container from '@/common/components/elements/Container';
import PageHeading from '@/common/components/elements/PageHeading';
import withAuth from '@/common/components/hoc/withAuth';
import Dashboard from '@/modules/dashboard';

const PAGE_TITLE = 'Dashboard';
const PAGE_DESCRIPTION =
  'Manage your projects, blogs, and gallery from one place.';

const DashboardPage: NextPage = () => {
  return (
    <>
      <NextSeo title={`${PAGE_TITLE}`} />
      <Container data-aos='fade-up'>
        <PageHeading title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <Dashboard />
      </Container>
    </>
  );
};

export default withAuth(DashboardPage, {
  redirectTo: '/login',
});
