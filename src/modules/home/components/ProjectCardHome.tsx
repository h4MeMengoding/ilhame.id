import clsx from 'clsx';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { BsArrowRight as MoreIcon } from 'react-icons/bs';

import Breakline from '@/common/components/elements/Breakline';
import Card from '@/common/components/elements/Card';
import Image from '@/common/components/elements/Image';
import Tooltip from '@/common/components/elements/Tooltip';
import { ProjectItemProps } from '@/common/types/projects';

const ProjectCardHome = ({
  title,
  slug,
  description,
  image,
  stacks,
  updated_at,
}: ProjectItemProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const stacksArray = JSON.parse(stacks);
  const defaultImage = '/images/placeholder.png';

  const slideDownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Link href={`/projects/${slug}`}>
      <Card
        className='group relative flex h-[400px] w-full flex-col rounded-lg border shadow-sm dark:border-neutral-800'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className='relative rounded-xl duration-500'
          style={{
            height: '400px',
            overflow: 'hidden',
          }}
        >
          <Image
            src={image || defaultImage}
            alt={title}
            fill={true}
            sizes='100vw, 100vh'
            className='h-full w-full transform object-cover object-center transition-transform duration-300 group-hover:scale-105 group-hover:blur-sm'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-black/20 to-black opacity-80 transition-opacity duration-300'></div>
        </div>

        <div className='absolute flex h-full flex-col justify-between space-y-4 p-5'>
          <div className='flex flex-wrap gap-2'>
            {stacksArray?.slice(0, 3).map((stack: string, index: number) => (
              <div
                key={index}
                className='rounded-full bg-neutral-900/50 px-2.5 py-1 font-mono text-xs text-neutral-400'
              >
                <span className='mr-1 font-semibold'>#</span>
                {stack}
              </div>
            ))}
          </div>

          <div className='flex flex-col justify-end'>
            <div className='flex flex-col space-y-3'>
              <h3 className='text-lg font-medium text-neutral-100 group-hover:underline group-hover:underline-offset-4'>
                {title}
              </h3>
              <p className='text-sm leading-relaxed text-neutral-400'>
                {description}
              </p>
            </div>
            <Breakline className='!border-neutral-700' />
            <div className='flex justify-between gap-4 px-0.5 text-neutral-400'>
              <Tooltip title='by hamevryd'>
                <Image
                  src='/images/ilhamnew.png'
                  alt='Ilham Shofa'
                  width={25}
                  height={25}
                  rounded='rounded-full'
                  className='rotate-3 border border-neutral-500'
                />
              </Tooltip>

              <motion.div
                variants={slideDownVariants}
                initial='visible'
                animate={isHovered ? 'hidden' : 'visible'}
                className={clsx(
                  'flex justify-between gap-4',
                  isHovered && 'hidden',
                )}
              >
                <div className='flex items-center gap-1'>
                  <span className='ml-0.5 text-xs font-medium'>#PROJCT</span>
                </div>
              </motion.div>
              <motion.div
                variants={slideDownVariants}
                initial='hidden'
                animate={isHovered ? 'visible' : 'hidden'}
                className={clsx(
                  'flex items-center gap-1',
                  !isHovered && 'hidden',
                )}
              >
                <span className='mr-0.5 text-xs font-medium'>VIEW PROJECT</span>
                <MoreIcon size={16} />
              </motion.div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProjectCardHome;
