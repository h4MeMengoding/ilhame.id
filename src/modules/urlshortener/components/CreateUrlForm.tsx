import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiCopy, FiExternalLink } from 'react-icons/fi';

import Card from '@/common/components/elements/Card';
import { useAuth } from '@/common/context/AuthContext';

interface CreateUrlFormProps {
  onSuccess: () => void;
}

const CreateUrlForm = ({ onSuccess }: CreateUrlFormProps) => {
  const [formData, setFormData] = useState({
    original_url: '',
    custom_slug: '',
    title: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/shorturl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...formData,
          user_email: user?.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create short URL');
      }

      setResult(data);
      setFormData({
        original_url: '',
        custom_slug: '',
        title: '',
        description: '',
      });
      onSuccess();
      toast.success('Short URL created successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Card className='space-y-4 border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900 sm:space-y-6 sm:p-6'>
      {result && (
        <div className='rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20 sm:p-4'>
          <h4 className='mb-2 font-medium text-green-800 dark:text-green-200 sm:mb-3'>
            ✨ URL Created Successfully!
          </h4>
          <div className='space-y-2 sm:space-y-3'>
            <div className='flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0'>
              <code className='flex-1 break-all rounded bg-green-100 px-2 py-2 font-mono text-xs text-green-800 dark:bg-green-800/30 dark:text-green-200 sm:px-3 sm:text-sm'>
                {result.short_url}
              </code>
              <div className='flex space-x-2'>
                <button
                  onClick={() => copyToClipboard(result.short_url)}
                  className='flex flex-1 items-center justify-center space-x-1 rounded-lg bg-green-600 px-3 py-2 text-xs text-white transition-colors hover:bg-green-700 sm:flex-initial sm:text-sm'
                >
                  <FiCopy className='h-3 w-3 sm:h-4 sm:w-4' />
                  <span>Copy</span>
                </button>
                <a
                  href={result.short_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex flex-1 items-center justify-center space-x-1 rounded-lg bg-blue-600 px-3 py-2 text-xs text-white transition-colors hover:bg-blue-700 sm:flex-initial sm:text-sm'
                >
                  <FiExternalLink className='h-3 w-3 sm:h-4 sm:w-4' />
                  <span>Visit</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-3 sm:space-y-4'>
        <div>
          <label
            htmlFor='original_url'
            className='mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm'
          >
            Original URL *
          </label>
          <input
            type='url'
            id='original_url'
            name='original_url'
            value={formData.original_url}
            onChange={handleInputChange}
            required
            placeholder='https://example.com'
            className='w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400'
          />
        </div>

        <div>
          <label
            htmlFor='custom_slug'
            className='mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm'
          >
            Custom Slug (optional)
          </label>
          <div className='flex flex-col space-y-1 sm:flex-row sm:space-y-0'>
            <span className='inline-flex items-center rounded-t-lg border border-b-0 border-neutral-300 bg-neutral-50 px-3 py-2 text-xs text-neutral-500 dark:border-neutral-600 dark:bg-neutral-600 dark:text-neutral-400 sm:rounded-l-lg sm:rounded-tr-none sm:border-b sm:border-r-0 sm:text-sm'>
              ilhame.id/s/
            </span>
            <input
              type='text'
              id='custom_slug'
              name='custom_slug'
              value={formData.custom_slug}
              onChange={handleInputChange}
              placeholder='my-custom-link'
              className='flex-1 rounded-b-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400 sm:rounded-r-lg sm:rounded-bl-none'
            />
          </div>
          <p className='mt-1 text-xs text-neutral-500 dark:text-neutral-400'>
            Leave empty for auto-generated slug
          </p>
        </div>

        <div>
          <label
            htmlFor='title'
            className='mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm'
          >
            Title (optional)
          </label>
          <input
            type='text'
            id='title'
            name='title'
            value={formData.title}
            onChange={handleInputChange}
            placeholder='Enter a title for your URL'
            className='w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400'
          />
        </div>

        <div>
          <label
            htmlFor='description'
            className='mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm'
          >
            Description (optional)
          </label>
          <textarea
            id='description'
            name='description'
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            placeholder='Add a description for your URL'
            className='w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400'
          />
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='flex w-full justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:py-3'
        >
          {isLoading ? (
            <div className='flex items-center space-x-2'>
              <div className='h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent sm:h-4 sm:w-4'></div>
              <span>Creating...</span>
            </div>
          ) : (
            'Create Short URL'
          )}
        </button>
      </form>
    </Card>
  );
};

export default CreateUrlForm;
