import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  FiEdit,
  FiEye,
  FiEyeOff,
  FiImage,
  FiPlus,
  FiRefreshCw,
  FiStar,
  FiTrash2,
} from 'react-icons/fi';
import useSWR from 'swr';

import Card from '@/common/components/elements/Card';
import SectionHeading from '@/common/components/elements/SectionHeading';
import SectionSubHeading from '@/common/components/elements/SectionSubHeading';
import { GalleryItemProps } from '@/common/types/gallery';
import { fetcher } from '@/services/fetcher';

import GalleryForm from './GalleryForm';

const GalleryManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryItemProps | null>(
    null,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, mutate } = useSWR('/api/gallery', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 1000, // Short deduping for real-time feel
    refreshInterval: 10000, // Auto refresh every 10 seconds
    revalidateIfStale: true,
    revalidateOnMount: true,
    errorRetryCount: 2,
  });

  const galleryItems: GalleryItemProps[] = data?.data || [];

  const handleCreateGallery = () => {
    setEditingGallery(null);
    setShowForm(true);
  };

  const handleEditGallery = (gallery: GalleryItemProps) => {
    setEditingGallery(gallery);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGallery(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingGallery(null);

    // Force immediate refresh untuk menampilkan perubahan
    mutate();

    toast.success(
      editingGallery
        ? 'Gallery item updated successfully!'
        : 'Gallery item created successfully!',
    );
  };

  const handleHardSync = async () => {
    setIsRefreshing(true);
    try {
      // Force complete cache invalidation and fresh fetch
      await mutate(undefined, {
        revalidate: true,
        rollbackOnError: false,
      });
      toast.success('Gallery synchronized with database successfully!');
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to synchronize gallery');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleToggleVisibility = async (
    galleryId: number,
    currentVisibility: boolean,
  ) => {
    try {
      // Optimistic update: Change visibility immediately
      const optimisticData = galleryItems.map((item) =>
        item.id === galleryId
          ? { ...item, is_published: !currentVisibility }
          : item,
      );

      // Update cache immediately for instant UI feedback
      mutate({ data: optimisticData }, false);

      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/gallery/${galleryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          is_published: !currentVisibility,
        }),
      });

      if (response.ok) {
        // Success: Revalidate to ensure consistency
        await mutate();
        toast.success(
          `Gallery item ${!currentVisibility ? 'published' : 'unpublished'} successfully!`,
        );
      } else {
        // Error: Revert optimistic update
        await mutate();
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update gallery item');
      }
    } catch (error) {
      console.error('Toggle visibility error:', error);

      // Revert optimistic update on error
      await mutate();
      toast.error('Failed to update gallery item visibility');
    }
  };

  const handleToggleFeatured = async (
    galleryId: number,
    currentFeatured: boolean,
  ) => {
    try {
      // Optimistic update: Change featured status immediately
      const optimisticData = galleryItems.map((item) =>
        item.id === galleryId
          ? { ...item, is_featured: !currentFeatured }
          : item,
      );

      // Update cache immediately for instant UI feedback
      mutate({ data: optimisticData }, false);

      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/gallery/${galleryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          is_featured: !currentFeatured,
        }),
      });

      if (response.ok) {
        // Success: Revalidate to ensure consistency
        await mutate();
        toast.success(
          `Gallery item ${!currentFeatured ? 'featured' : 'unfeatured'} successfully!`,
        );
      } else {
        // Error: Revert optimistic update
        await mutate();
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update gallery item');
      }
    } catch (error) {
      console.error('Toggle featured error:', error);

      // Revert optimistic update on error
      await mutate();
      toast.error('Failed to update gallery item featured status');
    }
  };

  const handleDeleteGallery = async (galleryId: number) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) {
      return;
    }

    try {
      // Optimistic update: Remove item from UI immediately
      const optimisticData = galleryItems.filter(
        (item) => item.id !== galleryId,
      );

      // Update cache immediately for instant UI feedback
      mutate({ data: optimisticData }, false);

      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/gallery/${galleryId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        // Success: Revalidate to ensure consistency
        await mutate();
        toast.success('Gallery item deleted successfully!');
      } else if (response.status === 404) {
        // Item already deleted - keep optimistic update
        await mutate();
        toast.success('Gallery item was already deleted');
      } else {
        // Error: Revert optimistic update
        await mutate();
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete gallery item');
      }
    } catch (error) {
      console.error('Delete gallery error:', error);

      // Revert optimistic update on error
      await mutate();

      if (error instanceof Error && !error.message.includes('404')) {
        toast.error('Failed to delete gallery item');
      }
    }
  };

  if (showForm) {
    return (
      <GalleryForm
        key={editingGallery?.id || 'new'}
        gallery={editingGallery}
        onSuccess={handleFormSuccess}
        onCancel={handleCloseForm}
      />
    );
  }

  return (
    <div className='space-y-4 sm:space-y-6'>
      <div className='flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0'>
        <div>
          <SectionHeading title='Gallery Management' />
          <SectionSubHeading>Manage your photo gallery</SectionSubHeading>
        </div>
        <div className='flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0'>
          <button
            onClick={handleHardSync}
            disabled={isRefreshing}
            className='flex w-full items-center justify-center space-x-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 sm:w-auto'
          >
            <FiRefreshCw
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span>{isRefreshing ? 'Syncing...' : 'Hard Sync'}</span>
          </button>
          <button
            onClick={handleCreateGallery}
            className='flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 sm:w-auto'
          >
            <FiPlus className='h-4 w-4' />
            <span>Add Photo</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-8'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600'></div>
        </div>
      ) : (
        <div className='grid gap-3 sm:gap-4'>
          {galleryItems.map((item) => (
            <Card key={item.id} className='p-4 sm:p-6'>
              <div className='flex flex-col space-y-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0'>
                <div className='flex min-w-0 flex-1 space-x-4'>
                  {/* Image Preview */}
                  <div className='flex-shrink-0'>
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className='h-16 w-16 rounded-lg object-cover sm:h-20 sm:w-20'
                    />
                  </div>

                  {/* Content */}
                  <div className='min-w-0 flex-1'>
                    <div className='flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0'>
                      <h3 className='text-base font-semibold text-neutral-900 dark:text-white sm:text-lg'>
                        {item.title}
                      </h3>
                      <div className='flex items-center space-x-2'>
                        {item.is_featured && (
                          <FiStar className='h-4 w-4 text-yellow-500' />
                        )}
                        {!item.is_published && (
                          <span className='rounded-full bg-red-100 px-2 py-1 text-xs text-red-800 dark:bg-red-900 dark:text-red-300'>
                            Draft
                          </span>
                        )}
                        {item.category && (
                          <span className='rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-300'>
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>
                    {item.description && (
                      <p className='mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400'>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className='flex items-center justify-end space-x-1 sm:hidden'>
                  <button
                    onClick={() => handleEditGallery(item)}
                    className='rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                    title='Edit gallery item'
                  >
                    <FiEdit className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() =>
                      handleToggleVisibility(item.id!, item.is_published)
                    }
                    className='rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                    title={
                      item.is_published
                        ? 'Unpublish gallery item'
                        : 'Publish gallery item'
                    }
                  >
                    {item.is_published ? (
                      <FiEye className='h-4 w-4' />
                    ) : (
                      <FiEyeOff className='h-4 w-4' />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      handleToggleFeatured(item.id!, item.is_featured)
                    }
                    className={`rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                      item.is_featured
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                    }`}
                    title={
                      item.is_featured
                        ? 'Remove from featured'
                        : 'Add to featured'
                    }
                  >
                    <FiStar className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => handleDeleteGallery(item.id!)}
                    className='rounded-lg p-2 text-red-600 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900 dark:hover:text-red-300'
                    title='Delete gallery item'
                  >
                    <FiTrash2 className='h-4 w-4' />
                  </button>
                </div>

                {/* Desktop Action Buttons */}
                <div className='hidden items-center space-x-2 sm:flex'>
                  <button
                    onClick={() => handleEditGallery(item)}
                    className='rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                    title='Edit gallery item'
                  >
                    <FiEdit className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() =>
                      handleToggleVisibility(item.id!, item.is_published)
                    }
                    className='rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white'
                    title={
                      item.is_published
                        ? 'Unpublish gallery item'
                        : 'Publish gallery item'
                    }
                  >
                    {item.is_published ? (
                      <FiEye className='h-4 w-4' />
                    ) : (
                      <FiEyeOff className='h-4 w-4' />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      handleToggleFeatured(item.id!, item.is_featured)
                    }
                    className={`rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                      item.is_featured
                        ? 'text-yellow-500 hover:text-yellow-600'
                        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                    }`}
                    title={
                      item.is_featured
                        ? 'Remove from featured'
                        : 'Add to featured'
                    }
                  >
                    <FiStar className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => handleDeleteGallery(item.id!)}
                    className='rounded-lg p-2 text-red-600 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900 dark:hover:text-red-300'
                    title='Delete gallery item'
                  >
                    <FiTrash2 className='h-4 w-4' />
                  </button>
                </div>
              </div>
            </Card>
          ))}
          {galleryItems.length === 0 && (
            <Card className='p-6 text-center sm:p-8'>
              <FiImage className='mx-auto h-10 w-10 text-neutral-400 sm:h-12 sm:w-12' />
              <h3 className='mt-3 text-base font-medium text-neutral-900 dark:text-white sm:mt-4 sm:text-lg'>
                No photos yet
              </h3>
              <p className='mt-2 text-sm text-neutral-600 dark:text-neutral-400 sm:text-base'>
                Upload your first photo to get started.
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
