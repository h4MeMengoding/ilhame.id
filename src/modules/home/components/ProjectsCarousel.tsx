import { motion } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { useDraggable } from 'react-use-draggable-scroll';
import useSWR from 'swr';

import BlogCardNewSkeleton from '@/common/components/skeleton/BlogCardNewSkeleton';
import { ProjectItemProps } from '@/common/types/projects';
import { fetcher } from '@/services/fetcher';

import ProjectCardHome from './ProjectCardHome';

const ProjectsCarousel = () => {
  const { data, isLoading } = useSWR(`/api/projects`, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 0,
  });

  const projectsData: ProjectItemProps[] = useMemo(() => {
    return (
      data?.data
        ?.filter((project: ProjectItemProps) => project.is_show)
        ?.slice(0, 4) || []
    );
  }, [data]);

  const ref =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events } = useDraggable(ref);

  const renderProjectCards = () => {
    if (isLoading) {
      return Array.from({ length: 3 }, (_, index) => (
        <BlogCardNewSkeleton key={index} />
      ));
    }

    return projectsData.map((item, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5 }}
        className='min-w-[326px] gap-x-5'
      >
        <ProjectCardHome {...item} />
      </motion.div>
    ));
  };

  return (
    <div
      className='flex gap-4 overflow-x-scroll p-1 scrollbar-hide'
      {...events}
      ref={ref}
    >
      {renderProjectCards()}
    </div>
  );
};

export default ProjectsCarousel;
