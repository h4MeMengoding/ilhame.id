import React, { useState } from 'react';
import { FiChevronDown, FiChevronRight, FiInfo } from 'react-icons/fi';

const ImageUploadInfo: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20'>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='flex w-full items-center justify-between'
      >
        <div className='flex items-center space-x-2'>
          <FiInfo className='h-4 w-4 text-blue-600' />
          <span className='text-sm font-medium text-blue-800 dark:text-blue-200'>
            Image Upload System (Optimized)
          </span>
        </div>
        {isExpanded ? (
          <FiChevronDown className='h-4 w-4 text-blue-600' />
        ) : (
          <FiChevronRight className='h-4 w-4 text-blue-600' />
        )}
      </button>

      {isExpanded && (
        <div className='mt-3 space-y-2 text-sm text-blue-700 dark:text-blue-300'>
          <p className='font-medium'>How it works now:</p>
          <ul className='list-inside list-disc space-y-1 pl-2'>
            <li>Images are uploaded to temporary folder first</li>
            <li>Only moved to permanent location when project is saved</li>
            <li>
              Temporary images are cleaned up if project save fails or is
              cancelled
            </li>
            <li>
              Manual cleanup available via "Cleanup" button in Storage Status
            </li>
          </ul>
          <p className='mt-2 font-medium text-green-700 dark:text-green-300'>
            ✅ This prevents orphaned images in storage bucket
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploadInfo;
