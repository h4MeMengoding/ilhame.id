import React, { useEffect, useState } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const TempImageWarning: React.FC = () => {
  const [tempImageCount, setTempImageCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTempImages = async () => {
      try {
        const response = await fetch('/api/storage/temp-status');
        if (response.ok) {
          const data = await response.json();
          setTempImageCount(data.count || 0);
        }
      } catch (error) {
        console.error('Failed to check temp images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkTempImages();
  }, []);

  if (isLoading || tempImageCount === 0) {
    return null;
  }

  return (
    <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20'>
      <div className='flex items-start space-x-2'>
        <FiAlertTriangle className='mt-0.5 h-4 w-4 text-yellow-600' />
        <div className='flex-1'>
          <h4 className='text-sm font-medium text-yellow-800 dark:text-yellow-200'>
            Temporary Images Found
          </h4>
          <p className='mt-1 text-sm text-yellow-700 dark:text-yellow-300'>
            {tempImageCount} temporary image{tempImageCount > 1 ? 's' : ''}{' '}
            found. These may be from cancelled uploads. Use the cleanup button
            in Storage Status to remove them.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TempImageWarning;
