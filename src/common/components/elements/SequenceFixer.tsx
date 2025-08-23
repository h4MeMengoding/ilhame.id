import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiTool, FiRefreshCw } from 'react-icons/fi';

interface SequenceFixerProps {
  onFixComplete?: () => void;
}

const SequenceFixer: React.FC<SequenceFixerProps> = ({ onFixComplete }) => {
  const [isFixing, setIsFixing] = useState(false);

  const fixSequence = async () => {
    setIsFixing(true);

    try {
      const token = localStorage.getItem('auth_token');

      // Try advanced fix first
      let response = await fetch('/api/projects/fix-sequence-advanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      let data = await response.json();

      // If advanced fix fails, try basic fix
      if (!data.status) {
        response = await fetch('/api/projects/fix-sequence', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        data = await response.json();
      }

      if (data.status) {
        toast.success(
          'Database sequence fixed successfully! Try saving again.',
        );
        onFixComplete?.();
      } else {
        toast.error(`Failed to fix sequence: ${data.message}`);
      }
    } catch (error: any) {
      toast.error(`Error fixing sequence: ${error.message}`);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className='rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <FiTool className='h-4 w-4 text-orange-500' />
          <span className='text-sm font-medium text-orange-800 dark:text-orange-200'>
            Database Fix Available
          </span>
        </div>

        <button
          onClick={fixSequence}
          disabled={isFixing}
          className='flex items-center space-x-2 rounded-lg bg-orange-600 px-3 py-1 text-sm text-white transition-colors hover:bg-orange-700 disabled:opacity-50'
        >
          {isFixing ? (
            <FiRefreshCw className='h-4 w-4 animate-spin' />
          ) : (
            <FiTool className='h-4 w-4' />
          )}
          <span>{isFixing ? 'Fixing...' : 'Fix Sequence'}</span>
        </button>
      </div>

      <div className='mt-2'>
        <p className='text-xs text-orange-700 dark:text-orange-300'>
          If you're getting "Unique constraint failed on ID" errors, this will
          fix the database auto-increment sequence.
        </p>
      </div>
    </div>
  );
};

export default SequenceFixer;
