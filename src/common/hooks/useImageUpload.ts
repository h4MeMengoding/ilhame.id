import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { uploadProjectImage, deleteProjectImage } from '@/services/imageUpload';

export interface UseImageUploadOptions {
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: string) => void;
  onDeleteSuccess?: () => void;
  onDeleteError?: (error: string) => void;
}

export const useImageUpload = (options: UseImageUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const uploadImage = async (file: File, projectSlug: string) => {
    if (!projectSlug) {
      const error = 'Project slug is required for image upload';
      toast.error(error);
      options.onUploadError?.(error);
      return null;
    }

    setIsUploading(true);
    try {
      const result = await uploadProjectImage(file, projectSlug);
      toast.success('Image uploaded successfully!');
      options.onUploadSuccess?.(result.url);
      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to upload image';
      toast.error(errorMessage);
      options.onUploadError?.(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (filePath: string) => {
    setIsDeleting(true);
    try {
      await deleteProjectImage(filePath);
      toast.success('Image deleted successfully!');
      options.onDeleteSuccess?.();
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to delete image';
      toast.error(errorMessage);
      options.onDeleteError?.(errorMessage);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    uploadImage,
    deleteImage,
    isUploading,
    isDeleting,
  };
};
