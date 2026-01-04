import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface BlogHeaderProps {
  title: string;
  comments_count?: number;
  reading_time_minutes?: number;
  page_views_count?: number | null;
  published_at?: string;
}

const BlogHeader = ({ title }: BlogHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 250);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const transition = { duration: 0.3, ease: 'easeInOut' as const };
  const titleVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <>
      {!isScrolled ? (
        <motion.h1
          className='mb-8 text-3xl font-bold lg:text-4xl'
          initial='initial'
          animate='animate'
          variants={titleVariants}
          transition={transition}
        >
          {title}
        </motion.h1>
      ) : (
        <motion.div
          className='shadow-bottom top-0 z-10 border-b border-neutral-300 bg-light py-6 backdrop-blur dark:border-neutral-600 dark:bg-dark lg:sticky'
          initial='initial'
          animate='animate'
          variants={titleVariants}
          transition={transition}
        >
          <h1 className='text-lg font-semibold lg:text-xl'>{title}</h1>
        </motion.div>
      )}
    </>
  );
};

export default BlogHeader;
