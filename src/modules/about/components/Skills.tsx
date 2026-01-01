import { memo, ReactNode } from 'react';

import { STACKS } from '@/common/constant/stacks';

const Tag = memo(({ icon, title }: { icon: ReactNode; title: string }) => (
  <div className='inline-flex items-center gap-2.5 rounded-xl bg-neutral-800 px-4 py-2.5 shadow-lg ring-1 ring-neutral-700 transition-all duration-300 hover:scale-105 hover:ring-neutral-600 dark:bg-neutral-800 dark:ring-neutral-700'>
    <span className='flex items-center text-base'>{icon}</span>
    <span className='whitespace-nowrap text-sm font-semibold text-neutral-100'>
      {title}
    </span>
  </div>
));

const MarqueeRow = ({
  skills,
  reverse = false,
}: {
  skills: Array<[string, ReactNode]>;
  reverse?: boolean;
}) => {
  // Duplicate the skills array multiple times for seamless loop
  const duplicatedSkills = [...skills, ...skills, ...skills];

  return (
    <div className='relative flex overflow-hidden'>
      <div
        className={`flex min-w-full shrink-0 animate-marquee items-center gap-4 ${
          reverse ? '[animation-direction:reverse]' : ''
        }`}
      >
        {duplicatedSkills.map(([title, icon], index) => (
          <Tag key={`${title}-${index}`} icon={icon} title={title} />
        ))}
      </div>
      <div
        className={`flex min-w-full shrink-0 animate-marquee items-center gap-4 ${
          reverse ? '[animation-direction:reverse]' : ''
        }`}
        aria-hidden='true'
      >
        {duplicatedSkills.map(([title, icon], index) => (
          <Tag key={`${title}-duplicate-${index}`} icon={icon} title={title} />
        ))}
      </div>
    </div>
  );
};

const Skills = () => {
  const skillsArray = Object.entries(STACKS);

  // Distribute skills across 3 rows
  const row1 = skillsArray.slice(0, 5);
  const row2 = skillsArray.slice(5, 9);
  const row3 = skillsArray.slice(9, 13);

  return (
    <div className='relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 py-8'>
      {/* Animated background orbs for depth */}
      <div className='absolute -left-20 -top-20 h-64 w-64 animate-pulse rounded-full bg-gradient-to-br from-purple-600 to-pink-600 opacity-10 blur-3xl'></div>
      <div
        className='absolute -bottom-20 -right-20 h-72 w-72 animate-pulse rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 opacity-10 blur-3xl'
        style={{ animationDelay: '1s', animationDuration: '4s' }}
      ></div>

      {/* Marquee rows */}
      <div className='flex flex-col gap-4'>
        {/* Row 1 - scrolls left */}
        <MarqueeRow skills={row1} reverse={false} />

        {/* Row 2 - scrolls right */}
        <MarqueeRow skills={row2} reverse={true} />

        {/* Row 3 - scrolls left */}
        <MarqueeRow skills={row3} reverse={false} />
      </div>

      {/* Gradient fade on edges */}
      <div className='pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-neutral-900 to-transparent'></div>
      <div className='pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-neutral-900 to-transparent'></div>
    </div>
  );
};

export default Skills;
