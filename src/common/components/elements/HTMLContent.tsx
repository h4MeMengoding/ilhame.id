import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import {
  HiCheckCircle as CheckIcon,
  HiOutlineClipboardCopy as CopyIcon,
} from 'react-icons/hi';

interface HTMLContentProps extends HTMLAttributes<HTMLDivElement> {
  children: string;
  className?: string;
}

const HTMLContent = ({
  children,
  className = '',
  ...props
}: HTMLContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Add IDs to all headings for Table of Contents
    const headings = contentRef.current.querySelectorAll(
      'h1, h2, h3, h4, h5, h6',
    );
    headings.forEach((heading, index) => {
      if (!heading.id) {
        const text = heading.textContent || '';
        // Create slug from heading text
        const slug = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/--+/g, '-')
          .trim();
        heading.id = slug || `heading-${index}`;
      }
    });

    // Find all code blocks with ql-syntax class
    const codeBlocks = contentRef.current.querySelectorAll('pre.ql-syntax');

    codeBlocks.forEach((block, index) => {
      // Skip if already has copy button
      if (block.parentElement?.classList.contains('code-block-wrapper')) return;

      // Check number of lines
      const codeText = block.textContent || '';
      const lineCount = codeText.split('\n').length;
      const isSingleLine = lineCount <= 1;

      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper group relative';

      // Create copy button with dynamic positioning
      const copyButton = document.createElement('button');
      copyButton.className = isSingleLine
        ? 'copy-code-button absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-lg border border-neutral-600 bg-neutral-700 p-2 opacity-0 transition-all hover:bg-neutral-600 group-hover:opacity-100'
        : 'copy-code-button absolute right-3 top-3 z-10 rounded-lg border border-neutral-600 bg-neutral-700 p-2 opacity-0 transition-all hover:bg-neutral-600 group-hover:opacity-100';
      copyButton.type = 'button';
      copyButton.setAttribute('aria-label', 'Copy to Clipboard');
      copyButton.innerHTML = `<svg class="w-[18px] h-[18px] text-neutral-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>`;

      // Add click handler
      copyButton.addEventListener('click', () => {
        const code = block.textContent || '';
        navigator.clipboard.writeText(code).then(() => {
          // Show checkmark
          copyButton.innerHTML = `<svg class="w-[18px] h-[18px] text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
          setTimeout(() => {
            copyButton.innerHTML = `<svg class="w-[18px] h-[18px] text-neutral-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>`;
          }, 2000);
        });
      });

      // Wrap the code block
      block.parentNode?.insertBefore(wrapper, block);
      wrapper.appendChild(block);
      wrapper.appendChild(copyButton);
    });
  }, [children]);

  return (
    <div
      ref={contentRef}
      className={`prose prose-neutral max-w-none dark:prose-invert prose-headings:border-l-4 prose-headings:border-l-blue-500 prose-headings:pl-4 prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-neutral-300 prose-strong:text-neutral-900 prose-code:rounded prose-code:bg-neutral-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-pink-600 prose-pre:relative prose-pre:bg-neutral-100 prose-li:text-neutral-700 prose-img:rounded-lg prose-img:shadow-md prose-hr:border-neutral-200 dark:prose-headings:border-l-blue-400 dark:prose-headings:text-neutral-100 dark:prose-p:text-neutral-300 dark:prose-a:text-blue-400 dark:prose-blockquote:border-l-neutral-600 dark:prose-strong:text-neutral-100 dark:prose-code:bg-neutral-800 dark:prose-code:text-pink-400 dark:prose-pre:bg-neutral-800 dark:prose-li:text-neutral-300 dark:prose-hr:border-neutral-700 ${className}`}
      dangerouslySetInnerHTML={{ __html: children }}
      {...props}
    />
  );
};

export default HTMLContent;
