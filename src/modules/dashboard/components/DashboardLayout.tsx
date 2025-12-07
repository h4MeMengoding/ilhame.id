import Image from 'next/image';
import { FiEdit3, FiFolder, FiImage, FiLogOut, FiUser } from 'react-icons/fi';

import Card from '@/common/components/elements/Card';
import { useAuth } from '@/common/context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: 'projects' | 'blogs' | 'gallery';
  onTabChange: (tab: 'projects' | 'blogs' | 'gallery') => void;
}

const DashboardLayout = ({
  children,
  activeTab,
  onTabChange,
}: DashboardLayoutProps) => {
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
  };

  const menuItems = [
    {
      id: 'projects' as const,
      label: 'Projects',
      icon: <FiFolder className='h-5 w-5' />,
      description: 'Manage your projects',
    },
    {
      id: 'blogs' as const,
      label: 'Blog Posts',
      icon: <FiEdit3 className='h-5 w-5' />,
      description: 'Manage blog posts',
    },
    {
      id: 'gallery' as const,
      label: 'Gallery',
      icon: <FiImage className='h-5 w-5' />,
      description: 'Manage photo gallery',
    },
  ];

  return (
    <div className='space-y-4 sm:space-y-6 lg:space-y-8'>
      {/* User Profile Card */}
      <Card className='border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900'>
        <div className='flex flex-col space-y-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:p-6'>
          <div className='flex items-center space-x-3 sm:space-x-4'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white shadow-lg sm:h-12 sm:w-12 sm:text-lg'>
              {user?.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.name || 'User'}
                  width={48}
                  height={48}
                  className='h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12'
                />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() ||
                user?.email?.charAt(0)?.toUpperCase() || (
                  <FiUser className='h-5 w-5 sm:h-6 sm:w-6' />
                )
              )}
            </div>
            <div className='min-w-0 flex-1'>
              <h3 className='text-base font-semibold text-neutral-900 dark:text-white sm:text-lg'>
                <span className='block truncate sm:inline'>
                  {user?.name || user?.email?.split('@')[0]}
                </span>
                {user?.role === 'admin' && (
                  <span className='ml-0 mt-1 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300 sm:ml-2 sm:mt-0'>
                    Admin
                  </span>
                )}
              </h3>
              <p className='text-xs text-neutral-600 dark:text-neutral-400 sm:text-sm'>
                <span className='block truncate sm:inline'>{user?.email}</span>
                <span className='hidden sm:inline'> • </span>
                <span className='block sm:inline'>
                  {user?.role === 'admin'
                    ? 'Full access to all features'
                    : 'Limited access'}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className='flex w-full items-center justify-center space-x-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-700 transition-all duration-200 hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white sm:w-auto sm:px-4'
          >
            <FiLogOut className='h-4 w-4' />
            <span>Sign Out</span>
          </button>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className='flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0'>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-1 items-center space-x-3 rounded-lg border p-3 transition-all duration-200 sm:p-4 ${
              activeTab === item.id
                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400'
                : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-800'
            }`}
          >
            {item.icon}
            <div className='text-left'>
              <div className='font-medium'>{item.label}</div>
              <div className='text-xs opacity-75 sm:text-sm'>
                {item.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
};

export default DashboardLayout;
