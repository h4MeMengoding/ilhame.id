import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiUpload, FiCheck, FiX } from 'react-icons/fi';

interface BucketTestProps {
  onSuccess?: () => void;
}

const BucketTest: React.FC<BucketTestProps> = ({ onSuccess }) => {
  const [isTestingBucket, setIsTestingBucket] = useState(false);
  const [bucketStatus, setBucketStatus] = useState<
    'unknown' | 'ready' | 'error'
  >('unknown');

  const testBucketAccess = async () => {
    setIsTestingBucket(true);

    try {
      const response = await fetch('/api/storage/setup', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.status) {
        setBucketStatus('ready');
        toast.success('Bucket is ready!');
        onSuccess?.();
      } else {
        setBucketStatus('error');
        if (data.requiresManualSetup) {
          toast.error('Manual setup required');
        } else {
          toast.error('Bucket test failed');
        }
      }
    } catch (error) {
      setBucketStatus('error');
      toast.error('Failed to test bucket');
    } finally {
      setIsTestingBucket(false);
    }
  };

  const getStatusIcon = () => {
    switch (bucketStatus) {
      case 'ready':
        return <FiCheck className='h-4 w-4 text-green-500' />;
      case 'error':
        return <FiX className='h-4 w-4 text-red-500' />;
      default:
        return <FiUpload className='h-4 w-4 text-neutral-400' />;
    }
  };

  const getStatusText = () => {
    switch (bucketStatus) {
      case 'ready':
        return 'Ready for upload';
      case 'error':
        return 'Setup required';
      default:
        return 'Test bucket';
    }
  };

  return (
    <button
      onClick={testBucketAccess}
      disabled={isTestingBucket}
      className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm transition-colors ${
        bucketStatus === 'ready'
          ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300'
          : bucketStatus === 'error'
            ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300'
            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
      } disabled:opacity-50`}
    >
      {isTestingBucket ? (
        <div className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
      ) : (
        getStatusIcon()
      )}
      <span>{isTestingBucket ? 'Testing...' : getStatusText()}</span>
    </button>
  );
};

export default BucketTest;
