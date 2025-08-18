import { useState } from 'react';
import { FiLink2, FiList } from 'react-icons/fi';

import Breakline from '@/common/components/elements/Breakline';
import SectionHeading from '@/common/components/elements/SectionHeading';
import SectionSubHeading from '@/common/components/elements/SectionSubHeading';

import CreateUrlForm from './components/CreateUrlForm';
import UrlList from './components/UrlList';

const UrlShortener = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUrlCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className='space-y-8'>
      {/* Create URL Section */}
      <div className='space-y-4'>
        <SectionHeading title='Create Short URL' icon={<FiLink2 size={22} />} />
        <SectionSubHeading>
          Transform your long URLs into short, shareable links
        </SectionSubHeading>
        <CreateUrlForm onSuccess={handleUrlCreated} />
      </div>

      <Breakline className='my-8' />

      {/* URL List Section */}
      <div className='space-y-4'>
        <SectionHeading title='Your URLs' icon={<FiList size={22} />} />
        <SectionSubHeading>
          Manage and track your shortened URLs
        </SectionSubHeading>
        <UrlList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default UrlShortener;
