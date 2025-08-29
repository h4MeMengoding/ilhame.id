import Link from 'next/link';
import useSWR from 'swr';

import Card from '@/common/components/elements/Card';
import { fetcher } from '@/services/fetcher';
import { GitHubContributionCalendar } from '@/services/githubContributions';

import GitHubCalendar from './GitHubCalendar';
import GitHubOverview from './GitHubOverview';

const GitHubContributionsCard = () => {
  const { data, error, isLoading } = useSWR<GitHubContributionCalendar>(
    '/api/github-contributions',
    fetcher,
    {
      refreshInterval: 300000, // Refresh every 5 minutes
      revalidateOnFocus: false,
    },
  );

  if (error) {
    return (
      <Card className='flex h-[200px] items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
        <div className='text-center'>
          <p className='text-sm text-red-600 dark:text-red-400'>
            Failed to load GitHub contributions
          </p>
          <p className='text-xs text-neutral-500 dark:text-neutral-400'>
            Please try again later
          </p>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className='rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900'>
        <div className='space-y-4'>
          {/* Overview skeleton */}
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className='h-16 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800'
              />
            ))}
          </div>

          {/* Calendar skeleton */}
          <div className='space-y-2'>
            <div className='flex gap-1'>
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className='h-3 w-12 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800'
                />
              ))}
            </div>
            <div className='flex gap-1'>
              {[...Array(53)].map((_, i) => (
                <div key={i} className='flex flex-col gap-1'>
                  {[...Array(7)].map((_, j) => (
                    <div
                      key={j}
                      className='h-3 w-3 animate-pulse rounded-sm bg-neutral-200 dark:bg-neutral-800'
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className='flex h-[200px] items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
        <div className='text-center'>
          <p className='text-sm text-neutral-600 dark:text-neutral-400'>
            No GitHub contributions data available
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className='rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900'>
      <div className='space-y-6'>
        {/* GitHub Profile Link */}
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-sm text-neutral-600 dark:text-neutral-400'>
              Beginner
            </p>
          </div>
          <Link
            href='https://github.com/h4MeMengoding'
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300'
          >
            @h4MeMengoding
          </Link>
        </div>

        {/* Overview Stats */}
        <GitHubOverview data={data} />

        {/* Contributions Calendar */}
        <div className='space-y-3'>
          <GitHubCalendar data={data} />
        </div>
      </div>
    </Card>
  );
};

export default GitHubContributionsCard;
