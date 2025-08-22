import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useAuth } from '@/common/context/AuthContext';

interface WithAuthProps {
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
}

export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  options: WithAuthProps = {},
) {
  const { redirectTo = '/', redirectIfAuthenticated = false } = options;

  const AuthenticatedComponent = (props: T) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (redirectIfAuthenticated && user) {
          // Redirect authenticated users away from login/register pages to dashboard
          router.replace('/dashboard');
        } else if (!redirectIfAuthenticated && !user) {
          // Redirect unauthenticated users away from protected pages
          router.replace(redirectTo);
        }
      }
    }, [user, loading, router]);

    // Show loading state while checking authentication
    if (loading) {
      return (
        <div className='flex min-h-screen items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600'></div>
        </div>
      );
    }

    // Don't render component if user should be redirected
    if (redirectIfAuthenticated && user) {
      return null;
    }

    if (!redirectIfAuthenticated && !user) {
      return null;
    }

    return <Component {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;

  return AuthenticatedComponent;
}

export default withAuth;
