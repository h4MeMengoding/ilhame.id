import { useState } from 'react';

import Breakline from '@/common/components/elements/Breakline';
import SectionHeading from '@/common/components/elements/SectionHeading';
import SectionSubHeading from '@/common/components/elements/SectionSubHeading';

import CreateUrlForm from './components/CreateUrlForm';
import UrlList from './components/UrlList';

const UrlShortener = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUrlCreated = () => {
    setRefreshTrigger((prev) => {
      const newValue = prev + 1;
      return newValue;
    });
  };

  return (
    <div className='space-y-8'>
      {/* Create URL Section */}
      <div className='space-y-4'>
        <div className='flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
          <div>
            <SectionHeading title='URL Shortener Management' />
            <SectionSubHeading>
              Transform your long URLs into short, shareable links
            </SectionSubHeading>
          </div>
        </div>
        <CreateUrlForm onSuccess={handleUrlCreated} />
      </div>

      <Breakline className='my-8' />

      {/* URL List Section */}
      <div className='space-y-4'>
        <UrlList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default UrlShortener;
