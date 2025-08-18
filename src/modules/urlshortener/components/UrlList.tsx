import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiCopy, FiExternalLink, FiEye } from 'react-icons/fi';

import Card from '@/common/components/elements/Card';

interface ShortUrl {
  id: number;
  slug: string;
  original_url: string;
  title?: string;
  description?: string;
  clicks: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

interface UrlListProps {
  refreshTrigger: number;
}

const UrlList = ({ refreshTrigger }: UrlListProps) => {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchUrls = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(
        `/api/shorturl?page=${pagination.page}&limit=${pagination.limit}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );
      const data = await response.json();

      if (response.ok) {
        setUrls(data.data);
        setPagination((prev) => ({ ...prev, ...data.pagination }));
      } else {
        toast.error(data.error || 'Failed to fetch URLs');
      }
    } catch (error) {
      toast.error('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls, refreshTrigger]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const getShortUrl = (slug: string) => `${window.location.origin}/s/${slug}`;

  if (loading) {
    return (
      <Card className='space-y-4 rounded-xl border border-neutral-200 bg-neutral-100 p-6 dark:border-neutral-900 dark:bg-neutral-800'>
        <div className='animate-pulse space-y-4'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='flex space-x-4'>
              <div className='flex-1 space-y-2'>
                <div className='h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-600'></div>
                <div className='h-3 w-1/2 rounded bg-neutral-200 dark:bg-neutral-600'></div>
              </div>
              <div className='h-4 w-20 rounded bg-neutral-200 dark:bg-neutral-600'></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className='rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-900 dark:bg-neutral-800'>
      <div className='border-b border-neutral-200 p-6 dark:border-neutral-700'>
        <h3 className='text-lg font-semibold text-neutral-900 dark:text-white'>
          Your Short URLs
        </h3>
        <p className='mt-1 text-sm text-neutral-600 dark:text-neutral-400'>
          Total: {pagination.total} URLs
        </p>
      </div>

      {urls.length === 0 ? (
        <div className='p-6 text-center'>
          <p className='text-neutral-500 dark:text-neutral-400'>
            No URLs created yet.
          </p>
        </div>
      ) : (
        <>
          <div className='divide-y divide-neutral-200 dark:divide-neutral-700'>
            {urls.map((url) => (
              <div
                key={url.id}
                className='p-6 hover:bg-neutral-50 dark:hover:bg-neutral-900'
              >
                <div className='flex items-start justify-between'>
                  <div className='min-w-0 flex-1'>
                    <div className='mb-2 flex items-center space-x-2'>
                      <h4 className='truncate text-sm font-medium text-neutral-900 dark:text-white'>
                        {url.title || url.original_url}
                      </h4>
                      {!url.is_active && (
                        <span className='inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200'>
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className='space-y-1'>
                      <div className='flex items-center space-x-2'>
                        <span className='text-xs text-neutral-500 dark:text-neutral-400'>
                          Short:
                        </span>
                        <code className='rounded bg-neutral-100 px-2 py-1 text-xs text-blue-600 dark:bg-neutral-700 dark:text-blue-400'>
                          {getShortUrl(url.slug)}
                        </code>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <span className='text-xs text-neutral-500 dark:text-neutral-400'>
                          Original:
                        </span>
                        <a
                          href={url.original_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='max-w-md truncate text-xs text-blue-600 hover:underline dark:text-blue-400'
                        >
                          {url.original_url}
                        </a>
                      </div>
                    </div>

                    {url.description && (
                      <p className='mt-1 text-xs text-neutral-600 dark:text-neutral-400'>
                        {url.description}
                      </p>
                    )}

                    <div className='mt-3 flex items-center space-x-4 text-xs text-neutral-500 dark:text-neutral-400'>
                      <div className='flex items-center space-x-1'>
                        <FiEye className='h-3 w-3' />
                        <span>{url.clicks} clicks</span>
                      </div>
                      <span>
                        Created{' '}
                        {format(new Date(url.created_at), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>

                  <div className='ml-4 flex items-center space-x-2'>
                    <button
                      onClick={() => copyToClipboard(getShortUrl(url.slug))}
                      className='p-2 text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300'
                      title='Copy short URL'
                    >
                      <FiCopy className='h-4 w-4' />
                    </button>
                    <a
                      href={getShortUrl(url.slug)}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='p-2 text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-300'
                      title='Visit short URL'
                    >
                      <FiExternalLink className='h-4 w-4' />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className='border-t border-neutral-200 px-6 py-4 dark:border-neutral-700'>
              <div className='flex items-center justify-between'>
                <div className='text-sm text-neutral-700 dark:text-neutral-300'>
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}{' '}
                  of {pagination.total} results
                </div>
                <div className='flex space-x-2'>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                    disabled={pagination.page === 1}
                    className='rounded bg-neutral-100 px-3 py-1 text-sm text-neutral-700 transition-colors hover:bg-neutral-200 disabled:bg-neutral-50 disabled:text-neutral-400 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600 dark:disabled:bg-neutral-800'
                  >
                    Previous
                  </button>
                  <span className='px-3 py-1 text-sm text-neutral-700 dark:text-neutral-300'>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    disabled={pagination.page === pagination.totalPages}
                    className='rounded bg-neutral-100 px-3 py-1 text-sm text-neutral-700 transition-colors hover:bg-neutral-200 disabled:bg-neutral-50 disabled:text-neutral-400 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600 dark:disabled:bg-neutral-800'
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default UrlList;
