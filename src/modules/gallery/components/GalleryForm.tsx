import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

import ImageUpload from '@/common/components/elements/ImageUpload';
import ImageUploadErrorBoundary from '@/common/components/elements/ImageUploadErrorBoundary';
import { useImageUpload } from '@/common/hooks/useImageUpload';
import { GalleryItemProps } from '@/common/types/gallery';
import { deleteProjectImage, getPathFromUrl } from '@/services/imageUpload';

import CategoryDropdown from './CategoryDropdown';

interface GalleryFormProps {
  gallery?: GalleryItemProps | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const GalleryForm = ({ gallery, onSuccess, onCancel }: GalleryFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: '',
    is_featured: false,
    is_published: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { moveToPermament } = useImageUpload();

  // Generate a slug for image folder based on title
  const generateSlug = (title: string) => {
    return (
      title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') || 'gallery-item'
    );
  };

  // Initialize form data when editing
  useEffect(() => {
    if (gallery) {
      setFormData({
        title: gallery.title || '',
        description: gallery.description || '',
        image_url: gallery.image_url || '',
        category: gallery.category || '',
        is_featured: gallery.is_featured || false,
        is_published: gallery.is_published ?? true,
      });
    }
  }, [gallery]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const cleanupTempImages = async () => {
    if (formData.image_url && formData.image_url.includes('/temp/')) {
      try {
        const tempPath = getPathFromUrl(formData.image_url);
        if (tempPath) {
          await deleteProjectImage(tempPath);
        }
      } catch (error) {
        console.error('Failed to cleanup temp image:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.image_url.trim()) {
      toast.error('Image is required');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = formData.image_url;

      // Move image from temp to permanent if it's a temp upload
      if (formData.image_url.includes('/temp/')) {
        const moveResult = await moveToPermament(formData.image_url);
        if (moveResult) {
          finalImageUrl = moveResult.url;
        }
      }

      const token = localStorage.getItem('auth_token');
      const payload = {
        ...formData,
        image_url: finalImageUrl,
      };

      const url = gallery ? `/api/gallery/${gallery.id}` : '/api/gallery';
      const method = gallery ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save gallery item');
      }

      toast.success(
        gallery
          ? 'Gallery item updated successfully!'
          : 'Gallery item created successfully!',
      );
      onSuccess();
    } catch (error) {
      console.error('Submit error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save gallery item';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    // Cleanup any temp images if form is cancelled
    await cleanupTempImages();
    onCancel();
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <button
            onClick={handleCancel}
            className='rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
          >
            <FiArrowLeft className='h-5 w-5' />
          </button>
          <h2 className='text-xl font-semibold text-neutral-900 dark:text-white'>
            {gallery ? 'Edit Gallery Item' : 'Add New Gallery Item'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Title */}
        <div>
          <label
            htmlFor='title'
            className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'
          >
            Title *
          </label>
          <input
            type='text'
            id='title'
            name='title'
            value={formData.title}
            onChange={handleInputChange}
            className='mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white'
            placeholder='Enter gallery item title'
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <ImageUploadErrorBoundary>
            <ImageUpload
              value={formData.image_url}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, image_url: value }))
              }
              projectSlug={generateSlug(formData.title)}
              label='Image'
              required
            />
          </ImageUploadErrorBoundary>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor='description'
            className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'
          >
            Description
          </label>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className='mt-1 block w-full rounded-md border border-neutral-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white'
            placeholder='Enter gallery item description'
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor='category'
            className='block text-sm font-medium text-neutral-700 dark:text-neutral-300'
          >
            Category
          </label>
          <CategoryDropdown
            value={formData.category}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, category: value }))
            }
            className='mt-1'
          />
        </div>

        {/* Options */}
        <div className='space-y-4'>
          <div className='flex items-center'>
            <input
              type='checkbox'
              id='is_featured'
              name='is_featured'
              checked={formData.is_featured}
              onChange={handleInputChange}
              className='h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800'
            />
            <label
              htmlFor='is_featured'
              className='ml-2 text-sm text-neutral-700 dark:text-neutral-300'
            >
              Featured item
            </label>
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              id='is_published'
              name='is_published'
              checked={formData.is_published}
              onChange={handleInputChange}
              className='h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800'
            />
            <label
              htmlFor='is_published'
              className='ml-2 text-sm text-neutral-700 dark:text-neutral-300'
            >
              Published
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className='flex space-x-3 pt-6'>
          <button
            type='submit'
            disabled={isSubmitting}
            className='flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50'
          >
            <FiSave className='h-4 w-4' />
            <span>
              {isSubmitting
                ? gallery
                  ? 'Updating...'
                  : 'Creating...'
                : gallery
                  ? 'Update Gallery Item'
                  : 'Create Gallery Item'}
            </span>
          </button>
          <button
            type='button'
            onClick={handleCancel}
            className='rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default GalleryForm;
