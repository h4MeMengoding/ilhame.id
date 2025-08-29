import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import Breakline from '@/common/components/elements/Breakline';
import Container from '@/common/components/elements/Container';
import PageHeading from '@/common/components/elements/PageHeading';
// import Status from '@/modules/status';
import GitHubContributions from '@/modules/status/components/GitHubContributions';
import Uptime from '@/modules/uptime';

const PAGE_TITLE = 'Status';
const PAGE_DESCRIPTION = 'Various statuses available in real-time';

const StatusPage: NextPage = () => {
  return (
    <>
      <NextSeo title={`${PAGE_TITLE}`} />
      <Container data-aos='fade-up'>
        <PageHeading title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        {/* <Status /> */}
        {/* <Breakline className='mb-8 mt-10' /> */}
        <GitHubContributions />
        <Breakline className='mb-8 mt-10' />
        <Uptime />
      </Container>
    </>
  );
};

export default StatusPage;
