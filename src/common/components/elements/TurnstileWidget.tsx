import { Turnstile } from '@marsidev/react-turnstile';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import MockTurnstile from './MockTurnstile';

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  onLoad?: () => void;
  className?: string;
}

const TurnstileWidget = ({
  onSuccess,
  onError,
  onExpire,
  onLoad,
  className = '',
}: TurnstileWidgetProps) => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [turnstileTheme, setTurnstileTheme] = useState<'light' | 'dark'>(
    'light',
  );

  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.includes('localhost'));

  // Use mock in development or localhost
  const useMock = isDevelopment || isLocalhost || !siteKey;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const currentTheme = theme === 'system' ? systemTheme : theme;
      setTurnstileTheme(currentTheme === 'dark' ? 'dark' : 'light');
    }
  }, [theme, systemTheme, mounted]);

  if (!mounted) {
    return (
      <div
        className={`h-[65px] w-[300px] animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`}
      />
    );
  }

  // Use mock component in development
  if (useMock) {
    return (
      <MockTurnstile
        onSuccess={onSuccess}
        onError={onError}
        onExpire={onExpire}
        onLoad={onLoad}
        className={className}
      />
    );
  }

  if (!siteKey) {
    console.error('Cloudflare Turnstile site key is not configured');
    return (
      <div
        className={`rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-600 dark:bg-red-900/20 dark:text-red-400 ${className}`}
      >
        ⚠️ CAPTCHA configuration error. Please contact administrator.
      </div>
    );
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <Turnstile
        siteKey={siteKey}
        options={{
          theme: turnstileTheme,
          action: 'login',
          cData: 'login-attempt',
        }}
        onSuccess={onSuccess}
        onError={onError}
        onExpire={onExpire}
        onLoad={onLoad}
      />
    </div>
  );
};

export default TurnstileWidget;
