import Image from 'next/image';
import { NextSeo } from 'next-seo';
import { FiLogOut, FiUser } from 'react-icons/fi';

import Breakline from '@/common/components/elements/Breakline';
import Card from '@/common/components/elements/Card';
import Container from '@/common/components/elements/Container';
import PageHeading from '@/common/components/elements/PageHeading';
import withAuth from '@/common/components/hoc/withAuth';
import { useAuth } from '@/common/context/AuthContext';
import UrlShortener from '@/modules/urlshortener';

const PAGE_TITLE = 'URL Shortener';
const PAGE_DESCRIPTION = 'Create and manage your short URLs with analytics';

const UrlDashboard = () => {
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
  };

  return (
    <>
      <NextSeo title={`${PAGE_TITLE} - Ilham Shofa`} />
      <Container data-aos='fade-up'>
        <PageHeading title={PAGE_TITLE} description={PAGE_DESCRIPTION} />

        {/* User Profile Card */}
        <Card className='mb-8 border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
          <div className='flex items-center justify-between p-6'>
            <div className='flex items-center space-x-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-semibold text-white shadow-lg'>
                {user?.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.name || 'User'}
                    width={48}
                    height={48}
                    className='h-12 w-12 rounded-full object-cover'
                  />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() ||
                  user?.email?.charAt(0)?.toUpperCase() || (
                    <FiUser className='h-6 w-6' />
                  )
                )}
              </div>
              <div>
                <h3 className='text-lg font-semibold text-neutral-900 dark:text-white'>
                  Welcome back, {user?.name || user?.email?.split('@')[0]}
                </h3>
                <p className='text-sm text-neutral-600 dark:text-neutral-400'>
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className='flex items-center space-x-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 transition-all duration-200 hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'
            >
              <FiLogOut className='h-4 w-4' />
              <span>Sign Out</span>
            </button>
          </div>
        </Card>

        <Breakline className='mb-8' />

        {/* URL Shortener */}
        <UrlShortener />
      </Container>
    </>
  );
};

export default withAuth(UrlDashboard, {
  redirectTo: '/login',
});
