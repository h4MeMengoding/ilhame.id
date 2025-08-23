import React, { useRef, useState } from 'react';
import { FiImage, FiLink, FiUpload, FiX } from 'react-icons/fi';

import { useImageUpload } from '@/common/hooks/useImageUpload';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  projectSlug: string;
  label?: string;
  required?: boolean;
}

type UploadMode = 'url' | 'upload';

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  projectSlug,
  label = 'Image',
  required = false,
}) => {
  const [mode, setMode] = useState<UploadMode>('url');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadImage, isUploading } = useImageUpload({
    onUploadSuccess: (url) => {
      onChange(url);
    },
  });

  const handleFileSelect = async (file: File) => {
    await uploadImage(file, projectSlug);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'>
          {label} {required && '*'}
        </label>
        <div className='flex rounded-lg border border-neutral-300 dark:border-neutral-600'>
          <button
            type='button'
            onClick={() => setMode('url')}
            className={`flex items-center space-x-1 rounded-l-lg px-3 py-1 text-xs font-medium transition-colors ${
              mode === 'url'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
            }`}
          >
            <FiLink className='h-3 w-3' />
            <span>URL</span>
          </button>
          <button
            type='button'
            onClick={() => setMode('upload')}
            className={`flex items-center space-x-1 rounded-r-lg px-3 py-1 text-xs font-medium transition-colors ${
              mode === 'upload'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-neutral-600 hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700'
            }`}
          >
            <FiUpload className='h-3 w-3' />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {mode === 'url' ? (
        <div className='relative'>
          <input
            type='url'
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className='block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 pr-10 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400'
            placeholder='https://example.com/image.jpg'
          />
          {value && (
            <button
              type='button'
              onClick={clearImage}
              className='absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
            >
              <FiX className='h-4 w-4' />
            </button>
          )}
        </div>
      ) : (
        <div className='space-y-3'>
          <div
            className={`relative rounded-lg border-2 border-dashed p-6 transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-neutral-300 hover:border-neutral-400 dark:border-neutral-600 dark:hover:border-neutral-500'
            } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleFileInputChange}
              className='hidden'
              disabled={isUploading}
            />

            <div className='text-center'>
              {isUploading ? (
                <div className='space-y-3'>
                  <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600'></div>
                  <div className='space-y-1'>
                    <p className='text-sm text-neutral-600 dark:text-neutral-400'>
                      Uploading and compressing...
                    </p>
                    <div className='mx-auto h-2 w-full max-w-xs rounded-full bg-gray-200 dark:bg-gray-700'>
                      <div
                        className='h-2 rounded-full bg-blue-600 transition-all duration-300'
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='space-y-2'>
                  <FiUpload className='mx-auto h-8 w-8 text-neutral-400' />
                  <div>
                    <button
                      type='button'
                      onClick={openFileDialog}
                      className='text-sm font-medium text-blue-600 hover:text-blue-500'
                    >
                      Choose a file
                    </button>
                    <span className='text-sm text-neutral-600 dark:text-neutral-400'>
                      {' '}
                      or drag and drop
                    </span>
                  </div>
                  <p className='text-xs text-neutral-500 dark:text-neutral-400'>
                    PNG, JPG, WebP up to 5MB (will be compressed to 2MB max)
                  </p>
                </div>
              )}
            </div>
          </div>

          {value && (
            <div className='relative'>
              <input
                type='url'
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                className='block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 pr-10 text-neutral-900 placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400'
                placeholder='Uploaded image URL will appear here'
                readOnly
              />
              <button
                type='button'
                onClick={clearImage}
                className='absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
              >
                <FiX className='h-4 w-4' />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Image Preview */}
      {value && (
        <div className='relative'>
          <div className='flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400'>
            <FiImage className='h-4 w-4' />
            <span>Preview:</span>
          </div>
          <div className='relative mt-2 inline-block'>
            <img
              src={value}
              alt='Preview'
              className='h-32 w-auto rounded-lg border border-neutral-300 object-cover dark:border-neutral-600'
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
