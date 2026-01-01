import { HTMLAttributes } from 'react';

interface HTMLContentProps extends HTMLAttributes<HTMLDivElement> {
  children: string;
  className?: string;
}

const HTMLContent = ({
  children,
  className = '',
  ...props
}: HTMLContentProps) => {
  return (
    <div
      className={`prose prose-neutral max-w-none dark:prose-invert prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-neutral-300 prose-strong:text-neutral-900 prose-code:rounded prose-code:bg-neutral-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-pink-600 prose-pre:bg-neutral-100 prose-li:text-neutral-700 prose-img:rounded-lg prose-img:shadow-md prose-hr:border-neutral-200 dark:prose-headings:text-neutral-100 dark:prose-p:text-neutral-300 dark:prose-a:text-blue-400 dark:prose-blockquote:border-l-neutral-600 dark:prose-strong:text-neutral-100 dark:prose-code:bg-neutral-800 dark:prose-code:text-pink-400 dark:prose-pre:bg-neutral-800 dark:prose-li:text-neutral-300 dark:prose-hr:border-neutral-700 ${className}`}
      dangerouslySetInnerHTML={{ __html: children }}
      {...props}
    />
  );
};

export default HTMLContent;
