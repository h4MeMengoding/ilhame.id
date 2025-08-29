import { useEffect, useState } from 'react';

interface MockTurnstileProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  onLoad?: () => void;
  className?: string;
}

const MockTurnstile = ({
  onSuccess,
  onLoad,
  className = '',
}: MockTurnstileProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Simulate loading
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
      onLoad?.();
    }, 1000);

    return () => clearTimeout(loadTimer);
  }, [onLoad]);

  const handleMockVerify = () => {
    setIsCompleted(true);
    // Generate mock token
    const mockToken = `dev-mock-token-${Date.now()}`;
    onSuccess(mockToken);
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center ${className}`}>
        <div className='h-[65px] w-[300px] animate-pulse rounded border-2 border-dashed border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800'>
          <div className='flex h-full items-center justify-center'>
            <div className='text-sm text-gray-500 dark:text-gray-400'>
              Loading CAPTCHA...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <div className='h-[65px] w-[300px] rounded border-2 border-dashed border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20'>
        <div className='flex h-full flex-col items-center justify-center space-y-1'>
          <div className='text-xs font-medium text-blue-700 dark:text-blue-300'>
            🧪 DEVELOPMENT MODE
          </div>
          {!isCompleted ? (
            <button
              onClick={handleMockVerify}
              className='rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700'
            >
              Mock Verify
            </button>
          ) : (
            <div className='flex items-center space-x-1 text-xs text-green-600 dark:text-green-400'>
              <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
              <span>Verified (Mock)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockTurnstile;
