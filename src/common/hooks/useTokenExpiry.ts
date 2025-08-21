import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

import { useAuth } from '@/common/context/AuthContext';

export function useTokenExpiry() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      // Check token validity every 2 minutes (more frequent)
      intervalRef.current = setInterval(
        async () => {
          const token = localStorage.getItem('auth_token');

          if (!token) {
            logout();
            return;
          }

          try {
            const response = await fetch('/api/auth/me', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!response.ok) {
              // Token is invalid or expired - perform logout
              logout();
            }
          } catch (error) {
            // Network error or other issues - perform logout to be safe
            console.error('Token validation error:', error);
            logout();
          }
        },
        2 * 60 * 1000,
      ); // Check every 2 minutes instead of 5
    } else {
      // Clear interval if user is not logged in
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user, logout, router]);

  // Also check on window focus (when user comes back to tab)
  useEffect(() => {
    const handleFocus = async () => {
      if (user) {
        const token = localStorage.getItem('auth_token');

        if (!token) {
          logout();
          return;
        }

        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            // Token is invalid or expired - perform logout
            logout();
          }
        } catch (error) {
          console.error('Token validation on focus error:', error);
          // On network error, perform logout to be safe
          logout();
        }
      }
    };

    // Also check on page load/reload
    const handlePageShow = async () => {
      if (user) {
        const token = localStorage.getItem('auth_token');

        if (!token) {
          logout();
          return;
        }

        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            logout();
          }
        } catch (error) {
          console.error('Token validation on page show error:', error);
          logout();
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [user, logout, router]);
}

export default useTokenExpiry;
