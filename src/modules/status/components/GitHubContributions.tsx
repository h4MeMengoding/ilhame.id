import React from 'react';
import { BsGithub } from 'react-icons/bs';

import SectionHeading from '@/common/components/elements/SectionHeading';
import SectionSubHeading from '@/common/components/elements/SectionSubHeading';

import GitHubContributionsCard from './GitHubContributionsCard';

const GitHubContributions = () => {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <SectionHeading
          title='GitHub Contributions'
          icon={<BsGithub size={22} />}
        />
        <SectionSubHeading>
          <p>Last year contribution activity</p>
        </SectionSubHeading>
      </div>
      <GitHubContributionsCard />
    </div>
  );
};

export default GitHubContributions;
