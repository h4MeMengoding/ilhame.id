import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiCopy, FiExternalLink, FiCode } from 'react-icons/fi';

const ManualSequenceFix: React.FC = () => {
  const [showSQL, setShowSQL] = useState(false);

  const sqlCommand = `SELECT setval('projects_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM projects), false);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlCommand);
    toast.success('SQL command copied to clipboard!');
  };

  return (
    <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <FiCode className='h-4 w-4 text-blue-500' />
          <span className='text-sm font-medium text-blue-800 dark:text-blue-200'>
            Manual Fix Option
          </span>
        </div>

        <button
          onClick={() => setShowSQL(!showSQL)}
          className='text-sm text-blue-600 hover:text-blue-700'
        >
          {showSQL ? 'Hide' : 'Show'} SQL
        </button>
      </div>

      {showSQL && (
        <div className='mt-3 space-y-3'>
          <div className='rounded bg-gray-900 p-3'>
            <code className='font-mono text-sm text-green-400'>
              {sqlCommand}
            </code>
          </div>

          <div className='flex space-x-3'>
            <button
              onClick={copyToClipboard}
              className='flex items-center space-x-2 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700'
            >
              <FiCopy className='h-4 w-4' />
              <span>Copy SQL</span>
            </button>

            <a
              href='https://app.supabase.com/'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center space-x-2 rounded bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700'
            >
              <FiExternalLink className='h-4 w-4' />
              <span>Open Supabase</span>
            </a>
          </div>

          <div className='text-xs text-blue-700 dark:text-blue-300'>
            <p>
              <strong>Steps:</strong>
            </p>
            <ol className='mt-1 list-inside list-decimal space-y-1'>
              <li>Copy SQL command above</li>
              <li>Go to Supabase Dashboard → SQL Editor</li>
              <li>Paste and run the command</li>
              <li>Come back and try saving again</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualSequenceFix;
