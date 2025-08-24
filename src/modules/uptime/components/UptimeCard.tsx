import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import 'react-loading-skeleton/dist/skeleton.css';

import SkeletonLoader from '@/common/components/elements/SkeletonLoader';

const UptimeCard = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  return (
    <SkeletonLoader>
      <section>
        <div className='h-auto items-center overflow-visible rounded-2xl bg-neutral-100 p-4 dark:bg-neutral-800'>
          {!iframeLoaded && (
            <Skeleton
              height={500}
              containerClassName='flex'
              className='!rounded-xl'
            />
          )}
          <iframe
            className={`w-full overscroll-auto rounded-lg focus:overscroll-contain ${iframeLoaded ? 'block' : 'hidden'}`}
            height={500}
            src='https://status.ilhame.id'
            onLoad={handleIframeLoad}
          />
        </div>
      </section>
    </SkeletonLoader>
  );
};

export default UptimeCard;
