import { useAuth } from '@/common/context/AuthContext';

export const useAuthenticatedFetch = () => {
  const { user } = useAuth();

  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('auth_token');

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };

  return { authenticatedFetch, isAuthenticated: !!user };
};

export default useAuthenticatedFetch;
