import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useState } from 'react';

import {
  GitHubContribution,
  GitHubContributionCalendar,
  GitHubMonth,
} from '@/services/githubContributions';

interface GitHubCalendarProps {
  data: GitHubContributionCalendar;
}

const GitHubCalendar = ({ data }: GitHubCalendarProps) => {
  const [selectedContribution, setSelectedContribution] = useState<{
    count: number | null;
    date: string | null;
  }>({
    count: null,
    date: null,
  });

  const weeks = data?.weeks ?? [];
  const contributionColors = data?.colors ?? [];

  const months =
    data?.months?.map((month: GitHubMonth) => {
      const filterContributionDay = weeks
        .filter(
          (week) => week.firstDay.slice(0, 7) === month.firstDay.slice(0, 7),
        )
        .map((item) => item.contributionDays)
        .flat(1);

      const getContributionsByMonth = filterContributionDay.reduce(
        (previousValue, currentValue) =>
          previousValue + currentValue.contributionCount,
        0,
      );

      return {
        ...month,
        contributionsCount: getContributionsByMonth,
      };
    }) ?? [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className='relative flex flex-col'>
        <ul className='flex justify-end gap-[3px] overflow-hidden text-xs text-neutral-600 dark:text-neutral-400 md:justify-start'>
          {months.map((month) => (
            <li
              key={month.firstDay}
              className={clsx(`${month.totalWeeks < 2 ? 'invisible' : ''}`)}
              style={{ minWidth: 14.3 * month.totalWeeks }}
            >
              {month.name}
            </li>
          ))}
        </ul>

        <div className='flex justify-start gap-[3px] overflow-hidden'>
          {weeks?.map((week) => (
            <div key={week.firstDay}>
              {week.contributionDays.map((contribution: GitHubContribution) => {
                const backgroundColor =
                  contribution.contributionCount > 0 && contribution.color;

                const getRandomDelayAnimate =
                  Math.random() * week.contributionDays.length * 0.15;

                return (
                  <motion.span
                    key={contribution.date}
                    initial='initial'
                    animate='animate'
                    variants={{
                      initial: { opacity: 0, translateY: -20 },
                      animate: {
                        opacity: 1,
                        translateY: 0,
                        transition: { delay: getRandomDelayAnimate },
                      },
                    }}
                    className='my-[2px] block h-[12px] w-[12px] cursor-pointer rounded-sm bg-neutral-200 hover:ring-2 hover:ring-blue-400 dark:bg-neutral-800'
                    style={backgroundColor ? { backgroundColor } : undefined}
                    onMouseEnter={() =>
                      setSelectedContribution({
                        count: contribution.contributionCount,
                        date: contribution.date,
                      })
                    }
                    onMouseLeave={() =>
                      setSelectedContribution({ count: null, date: null })
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400'>
          <span>Less</span>
          <ul className='flex gap-1'>
            <motion.li className='h-[10px] w-[10px] rounded-sm bg-neutral-200 dark:bg-neutral-800' />
            {contributionColors.map((color, index) => (
              <motion.li
                key={color}
                initial='initial'
                animate='animate'
                variants={{
                  initial: { opacity: 0 },
                  animate: {
                    opacity: 1,
                    transition: { delay: index * 0.3 },
                  },
                }}
                className='h-[10px] w-[10px] rounded-sm'
                style={{ backgroundColor: color }}
              />
            ))}
          </ul>
          <span>More</span>
        </div>

        <div
          className={clsx(
            `${selectedContribution?.date ? 'opacity-100' : 'opacity-0'}`,
            'rounded bg-neutral-200 px-2 py-1 text-sm text-neutral-700 transition-opacity dark:bg-neutral-700 dark:text-neutral-300',
          )}
        >
          {selectedContribution?.count}{' '}
          {selectedContribution?.count === 1 ? 'contribution' : 'contributions'}{' '}
          on{' '}
          {selectedContribution?.date && formatDate(selectedContribution.date)}
        </div>
      </div>
    </>
  );
};

export default GitHubCalendar;
