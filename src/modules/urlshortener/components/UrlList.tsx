import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  FiCopy,
  FiExternalLink,
  FiEye,
  FiRefreshCw,
  FiTrash2,
} from 'react-icons/fi';
import useSWR from 'swr';

import Card from '@/common/components/elements/Card';
import SectionHeading from '@/common/components/elements/SectionHeading';
import SectionSubHeading from '@/common/components/elements/SectionSubHeading';
import { useAuth } from '@/common/context/AuthContext';
import { fetcher } from '@/services/fetcher';

interface UrlItem {
  id: number;
  original_url: string;
  slug: string;
  clicks: number;
  created_at: string;
  updated_at: string;
  title?: string;
  description?: string;
}

interface UrlListProps {
  refreshTrigger: number;
}

const UrlList = ({ refreshTrigger }: UrlListProps) => {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [cacheKey, setCacheKey] = useState(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();

  const { data, isLoading, mutate } = useSWR(
    user?.email
      ? `/api/shorturl?user_email=${encodeURIComponent(user.email)}&t=${cacheKey}&refresh=${refreshTrigger}`
      : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
      refreshInterval: 0,
      dedupingInterval: 0,
      revalidateIfStale: true,
    },
  );

  // Refresh when trigger changes with aggressive cache invalidation
  useEffect(() => {
    if (user?.email && refreshTrigger > 0) {
      // Update cache key to force fresh data
      setCacheKey(Date.now());

      // Force complete cache invalidation and fresh fetch
      mutate(undefined, {
        revalidate: true,
        rollbackOnError: false,
        populateCache: false,
        optimisticData: undefined,
      });
    }
  }, [refreshTrigger, mutate, user?.email]);

  const urls: UrlItem[] = data?.data || [];

  const handleManualRefresh = async () => {
    if (!user?.email) return;

    setIsRefreshing(true);
    try {
      // Update cache key to force fresh data
      setCacheKey(Date.now());

      // Force complete cache invalidation and fresh fetch
      await mutate(undefined, {
        revalidate: true,
        rollbackOnError: false,
        populateCache: false,
        optimisticData: undefined,
      });
      toast.success('URLs refreshed successfully!');
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error('Failed to refresh URLs');
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyToClipboard = async (slug: string, id: number) => {
    const shortUrl = `${window.location.origin}/s/${slug}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      toast.success('URL copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error('Failed to copy URL');
    }
  };

  const deleteUrl = async (id: number) => {
    if (!confirm('Are you sure you want to delete this URL?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/shorturl/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        // Update cache key to force fresh data
        setCacheKey(Date.now());

        // Optimistically remove the URL from the list
        const updatedUrls = urls.filter((url) => url.id !== id);
        mutate({ data: updatedUrls }, false);

        // Then force complete revalidation from server
        await mutate(undefined, {
          revalidate: true,
          rollbackOnError: false,
          populateCache: false,
        });

        toast.success('URL deleted successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete URL');
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete URL');
      // Force revalidation to ensure UI consistency
      setCacheKey(Date.now());
      mutate();
    }
  };

  if (!user) {
    return (
      <div className='space-y-4 sm:space-y-6'>
        <div>
          <SectionHeading title='Your URLs' />
          <SectionSubHeading>Manage your shortened URLs</SectionSubHeading>
        </div>
        <Card className='p-6 text-center sm:p-8'>
          <FiExternalLink className='mx-auto h-10 w-10 text-neutral-400 sm:h-12 sm:w-12' />
          <h3 className='mt-3 text-base font-medium text-neutral-900 dark:text-white sm:mt-4 sm:text-lg'>
            Please log in
          </h3>
          <p className='mt-2 text-sm text-neutral-600 dark:text-neutral-400 sm:text-base'>
            You need to be logged in to view your URLs.
          </p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <div>
          <SectionHeading title='Your URLs' />
          <SectionSubHeading>Manage your shortened URLs</SectionSubHeading>
        </div>
        <div className='flex justify-center py-8'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
        <div>
          <SectionHeading title='Your URLs' />
          <SectionSubHeading>Manage your shortened URLs</SectionSubHeading>
        </div>
        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className='flex w-full items-center justify-center space-x-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 sm:w-auto'
        >
          <FiRefreshCw
            className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          <span className='hidden sm:inline'>Refresh</span>
        </button>
      </div>

      {urls.length === 0 ? (
        <Card className='p-6 text-center sm:p-8'>
          <FiExternalLink className='mx-auto h-10 w-10 text-neutral-400 sm:h-12 sm:w-12' />
          <h3 className='mt-3 text-base font-medium text-neutral-900 dark:text-white sm:mt-4 sm:text-lg'>
            No URLs yet
          </h3>
          <p className='mt-2 text-sm text-neutral-600 dark:text-neutral-400 sm:text-base'>
            Create your first short URL to get started.
          </p>
        </Card>
      ) : (
        <div className='space-y-3 sm:space-y-4'>
          {urls.map((url) => (
            <Card key={url.id} className='p-4 sm:p-6'>
              <div className='space-y-3 sm:space-y-4'>
                {/* URL Info */}
                <div className='min-w-0 flex-1'>
                  <div className='flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
                    <div className='min-w-0 flex-1'>
                      <h3 className='text-sm font-medium text-neutral-900 dark:text-white sm:text-base'>
                        {url.title || 'Short URL'}
                      </h3>
                      <p className='text-xs text-blue-600 dark:text-blue-400 sm:text-sm'>
                        {window.location.origin}/s/{url.slug}
                      </p>
                    </div>
                    <div className='flex items-center space-x-2 text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm'>
                      <FiEye className='h-3 w-3 sm:h-4 sm:w-4' />
                      <span>{url.clicks} clicks</span>
                    </div>
                  </div>

                  {url.description && (
                    <div className='mt-2'>
                      <h4 className='text-xs font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm'>
                        Description
                      </h4>
                      <p className='text-xs text-neutral-600 dark:text-neutral-400 sm:text-sm'>
                        {url.description}
                      </p>
                    </div>
                  )}

                  <div className='mt-2'>
                    <h4 className='text-xs font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm'>
                      Original URL
                    </h4>
                    <p className='break-all text-xs text-neutral-600 dark:text-neutral-400 sm:text-sm'>
                      {url.original_url}
                    </p>
                  </div>

                  <div className='mt-2 text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm'>
                    Created {new Date(url.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
                  <div className='flex items-center space-x-2'>
                    <button
                      onClick={() => copyToClipboard(url.slug, url.id)}
                      className={`flex items-center space-x-1 rounded-lg px-3 py-2 text-xs transition-colors sm:text-sm ${
                        copiedId === url.id
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'
                      }`}
                    >
                      <FiCopy className='h-3 w-3 sm:h-4 sm:w-4' />
                      <span>{copiedId === url.id ? 'Copied!' : 'Copy'}</span>
                    </button>

                    <a
                      href={`/s/${url.slug}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center space-x-1 rounded-lg bg-neutral-100 px-3 py-2 text-xs text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 sm:text-sm'
                    >
                      <FiExternalLink className='h-3 w-3 sm:h-4 sm:w-4' />
                      <span>Visit</span>
                    </a>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <button
                      onClick={() => deleteUrl(url.id)}
                      className='flex items-center space-x-1 rounded-lg bg-red-100 px-3 py-2 text-xs text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 sm:text-sm'
                    >
                      <FiTrash2 className='h-3 w-3 sm:h-4 sm:w-4' />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UrlList;
