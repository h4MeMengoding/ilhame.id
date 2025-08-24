import { NextPage } from 'next';
import { NextSeo } from 'next-seo';

import Container from '@/common/components/elements/Container';
import PageHeading from '@/common/components/elements/PageHeading';
import Chat from '@/modules/chat';

const PAGE_TITLE = 'Guestbook';
const PAGE_DESCRIPTION = 'Leave a message for me, say what you want to say!';

const GuestBookPage: NextPage = () => {
  return (
    <>
      <NextSeo title={`${PAGE_TITLE}`} />
      <Container data-aos='fade-up'>
        <PageHeading title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <Chat />
      </Container>
    </>
  );
};

export default GuestBookPage;
