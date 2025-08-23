import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  FiAlertTriangle,
  FiCheck,
  FiExternalLink,
  FiInfo,
  FiRefreshCw,
  FiX,
} from 'react-icons/fi';

interface StorageStatusProps {
  onSetupComplete?: () => void;
}

const StorageStatus: React.FC<StorageStatusProps> = ({ onSetupComplete }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [requiresManualSetup, setRequiresManualSetup] = useState(false);
  const [manualInstructions, setManualInstructions] = useState<string[]>([]);

  const checkStorageSetup = async () => {
    setIsChecking(true);
    setSetupError(null);
    setRequiresManualSetup(false);
    setManualInstructions([]);

    try {
      const response = await fetch('/api/storage/setup', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.status) {
        setIsSetupComplete(true);
        toast.success('Storage setup completed!');
        onSetupComplete?.();
      } else {
        if (data.requiresManualSetup) {
          setRequiresManualSetup(true);
          setManualInstructions(data.data?.instructions || []);
          setSetupError(data.message);
          toast.error('Manual setup required - see instructions below');
        } else {
          setSetupError(data.message);
          toast.error(`Storage setup failed: ${data.message}`);
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to setup storage';
      setSetupError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Auto-check on mount
    checkStorageSetup();
  }, []);

  return (
    <div className='rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          {requiresManualSetup ? (
            <FiAlertTriangle className='h-4 w-4 text-yellow-500' />
          ) : (
            <FiInfo className='h-4 w-4 text-blue-500' />
          )}
          <span className='text-sm font-medium text-neutral-700 dark:text-neutral-300'>
            Storage Setup
          </span>
        </div>

        <div className='flex items-center space-x-2'>
          {isChecking ? (
            <div className='flex items-center space-x-2 text-blue-600'>
              <FiRefreshCw className='h-4 w-4 animate-spin' />
              <span className='text-sm'>Checking...</span>
            </div>
          ) : isSetupComplete ? (
            <div className='flex items-center space-x-2 text-green-600'>
              <FiCheck className='h-4 w-4' />
              <span className='text-sm'>Ready</span>
            </div>
          ) : (
            <div className='flex items-center space-x-2 text-red-600'>
              <FiX className='h-4 w-4' />
              <span className='text-sm'>
                {requiresManualSetup ? 'Manual Setup Required' : 'Error'}
              </span>
            </div>
          )}

          <button
            onClick={checkStorageSetup}
            disabled={isChecking}
            className='text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50'
          >
            {requiresManualSetup ? 'Check Again' : 'Retry'}
          </button>
        </div>
      </div>

      {setupError && (
        <div className='mt-3'>
          <p className='text-xs text-red-600'>{setupError}</p>
        </div>
      )}

      {requiresManualSetup && manualInstructions.length > 0 && (
        <div className='mt-3 rounded-md border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20'>
          <div className='flex items-start space-x-2'>
            <FiAlertTriangle className='mt-0.5 h-4 w-4 text-yellow-600' />
            <div className='flex-1'>
              <h4 className='text-sm font-medium text-yellow-800 dark:text-yellow-200'>
                Manual Setup Required
              </h4>
              <div className='mt-2 text-sm text-yellow-700 dark:text-yellow-300'>
                <p className='mb-2'>
                  Please create the storage bucket manually:
                </p>
                <ol className='list-inside list-decimal space-y-1'>
                  {manualInstructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
                <div className='mt-3'>
                  <a
                    href='https://app.supabase.com/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700'
                  >
                    <span>Open Supabase Dashboard</span>
                    <FiExternalLink className='h-3 w-3' />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='mt-2'>
        <p className='text-xs text-neutral-600 dark:text-neutral-400'>
          {isSetupComplete
            ? 'Supabase Storage is configured and ready for image uploads.'
            : requiresManualSetup
              ? 'Complete the manual setup steps above, then click "Check Again".'
              : 'Setting up Supabase Storage bucket for project images...'}
        </p>
      </div>
    </div>
  );
};

export default StorageStatus;
