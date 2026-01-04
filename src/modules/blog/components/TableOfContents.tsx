import { useEffect, useState } from 'react';
import { FiList } from 'react-icons/fi';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    const headingElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const extractedHeadings: Heading[] = [];

    headingElements.forEach((heading, index) => {
      const text = heading.textContent || '';
      const level = parseInt(heading.tagName.charAt(1));

      // Create slug from heading text (same logic as HTMLContent)
      const slug = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
      const id = slug || `heading-${index}`;

      extractedHeadings.push({ id, text, level });
    });

    setHeadings(extractedHeadings);

    // Intersection Observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' },
    );

    // Observe all headings in the actual document
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      observer.disconnect();
    };
  }, [content]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Account for: navbar (64px) + progress bar (4px) + padding (40px)
      const headerOffset = 108;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      // Smooth scroll animation
      const startPosition = window.pageYOffset;
      const distance = offsetPosition - startPosition;
      const duration = 800; // 800ms for smooth animation
      let startTime: number | null = null;

      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className='sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900'>
      <div className='mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-700 dark:text-neutral-300'>
        Table of Contents
      </div>
      <nav className='space-y-2'>
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => handleClick(heading.id)}
            className={`flex w-full items-start gap-2 text-left text-sm transition-colors ${
              activeId === heading.id
                ? 'font-medium text-blue-600 dark:text-blue-400'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
            }`}
            style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
          >
            <span className='mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current opacity-50' />
            <span className='flex-1'>{heading.text}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
