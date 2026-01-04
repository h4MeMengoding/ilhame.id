import { useEffect, useState } from 'react';

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', updateProgress);
    };
  }, []);

  return (
    <div className='fixed left-0 top-0 z-50 h-1 w-full bg-neutral-200/50 dark:bg-neutral-800/50'>
      <div
        className='h-full bg-gradient-to-r from-blue-400/60 to-purple-500/60 transition-all duration-150 ease-out dark:from-blue-500/40 dark:to-purple-600/40'
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
