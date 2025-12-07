import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import Container from '@/common/components/elements/Container';
import TurnstileWidget from '@/common/components/elements/TurnstileWidget';
import withAuth from '@/common/components/hoc/withAuth';
import { useAuth } from '@/common/context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate CAPTCHA
    if (!turnstileToken) {
      toast.error('Please complete the CAPTCHA verification');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(
        formData.email,
        formData.password,
        turnstileToken,
      );
      if (success) {
        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        toast.error('Invalid email or password');
        // Reset CAPTCHA on failed login
        setTurnstileToken(null);
        setTurnstileError(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      // Reset CAPTCHA on error
      setTurnstileToken(null);
      setTurnstileError(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
    setTurnstileError(false);
  };

  const handleTurnstileError = () => {
    setTurnstileToken(null);
    setTurnstileError(true);
    toast.error('CAPTCHA verification failed. Please try again.');
  };

  const handleTurnstileExpire = () => {
    setTurnstileToken(null);
    setTurnstileError(false);
    toast.error('CAPTCHA expired. Please verify again.');
  };

  return (
    <>
      <NextSeo title='Login - Ilham Shofa' />
      <Container>
        <div className='flex min-h-screen items-center justify-center'>
          <div className='w-full max-w-md space-y-8'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
                Login to Dashboard
              </h2>
              <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                Access your dashboard and content management
              </p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Email Address
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className='mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  placeholder='Enter your email'
                />
              </div>

              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  Password
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className='mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                  placeholder='Enter your password'
                />
              </div>

              {/* Turnstile CAPTCHA */}
              <div className='space-y-2'>
                <TurnstileWidget
                  onSuccess={handleTurnstileSuccess}
                  onError={handleTurnstileError}
                  onExpire={handleTurnstileExpire}
                  className='mb-4'
                />
                {turnstileError && (
                  <p className='text-sm text-red-600 dark:text-red-400'>
                    CAPTCHA verification failed. Please try again.
                  </p>
                )}
              </div>

              <div>
                <button
                  type='submit'
                  disabled={isLoading}
                  className='group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            <div className='text-center'>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Don't have an account?{' '}
                <Link
                  href='/register'
                  className='font-medium text-blue-600 hover:text-blue-500'
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default withAuth(LoginPage, {
  redirectIfAuthenticated: true,
});
