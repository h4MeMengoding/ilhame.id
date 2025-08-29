import AnimateCounter from '@/common/components/elements/AnimateCounter';
import Card from '@/common/components/elements/Card';
import { GitHubContributionCalendar } from '@/services/githubContributions';

interface GitHubOverviewProps {
  data: GitHubContributionCalendar;
}

const GitHubOverview = ({ data }: GitHubOverviewProps) => {
  const totalContributions = data?.totalContributions || 0;
  const weeks = data?.weeks || [];

  // Calculate this week contributions
  const totalThisWeekContribution =
    weeks[weeks.length - 1]?.contributionDays
      ?.map((item) => item.contributionCount)
      ?.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0,
      ) || 0;

  // Calculate all contribution counts for statistics
  const totalContributionList = weeks
    .map((week) =>
      week.contributionDays.map(
        (contributionDay) => contributionDay.contributionCount,
      ),
    )
    .flat();

  const bestContribution = Math.max(...totalContributionList) || 0;
  const averageContribution =
    Math.round(totalContributions / totalContributionList.length) || 0;

  const stats = [
    {
      label: 'Total Contributions',
      value: totalContributions,
      unit: '',
    },
    {
      label: 'This Week',
      value: totalThisWeekContribution,
      unit: '',
    },
    {
      label: 'Best Day',
      value: bestContribution,
      unit: '',
    },
    {
      label: 'Daily Average',
      value: averageContribution,
      unit: '',
    },
  ];

  return (
    <div className='grid grid-cols-2 gap-3 py-2 sm:grid-cols-4'>
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className='flex flex-col items-center rounded-xl border border-neutral-200 bg-neutral-100 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900'
        >
          <span className='text-sm text-neutral-600 dark:text-neutral-400'>
            {stat.label}
          </span>
          <div className='flex items-baseline space-x-1'>
            <AnimateCounter
              className='text-xl font-medium text-emerald-600 dark:text-emerald-400 lg:text-2xl'
              total={stat.value}
            />
            {stat.unit && (
              <span className='text-sm text-neutral-600 dark:text-neutral-400'>
                {stat.unit}
              </span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default GitHubOverview;
