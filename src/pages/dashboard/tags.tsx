import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useAuth } from '@/common/context/AuthContext';
import TagsManager from '@/modules/dashboard/components/TagsManager';

const TagsPage: NextPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <>
        <NextSeo title='Tags Management - Dashboard' />
        <div className='flex h-screen items-center justify-center'>
          <div className='text-center'>
            <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent'></div>
            <p className='mt-4 text-neutral-600 dark:text-neutral-400'>
              Loading...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <>
      <NextSeo title='Tags Management - Dashboard' />
      <div className='mx-auto max-w-7xl px-6 py-8'>
        <div className='mb-8 space-y-2'>
          <h1 className='text-2xl font-bold text-neutral-900 dark:text-white'>
            Tags Management
          </h1>
          <p className='text-neutral-600 dark:text-neutral-400'>
            Manage blog post tags for better content organization and SEO.
          </p>
        </div>
        <TagsManager />
      </div>
    </>
  );
};

export default TagsPage;
