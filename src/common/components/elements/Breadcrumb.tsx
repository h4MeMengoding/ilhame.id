import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';

interface BreadcrumbItem {
  name: string;
  url: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      className='mb-6 flex items-center space-x-2 text-sm'
      aria-label='Breadcrumb'
    >
      <Link
        href='/'
        className='flex items-center text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
        aria-label='Home'
      >
        <FiHome className='h-4 w-4' />
      </Link>
      {items.map((item, index) => (
        <div key={index} className='flex items-center space-x-2'>
          <FiChevronRight className='h-4 w-4 text-neutral-400 dark:text-neutral-600' />
          {item.isCurrentPage || index === items.length - 1 ? (
            <span
              className='line-clamp-1 font-medium text-neutral-900 dark:text-neutral-100'
              aria-current='page'
            >
              {item.name}
            </span>
          ) : (
            <Link
              href={item.url}
              className='line-clamp-1 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
