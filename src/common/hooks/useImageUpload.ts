import { useState } from 'react';
import { toast } from 'react-hot-toast';

import {
  deleteProjectImage,
  getPathFromUrl,
  moveImageFromTemp,
  uploadProjectImage,
} from '@/services/imageUpload';

export interface UseImageUploadOptions {
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: string) => void;
  onDeleteSuccess?: () => void;
  onDeleteError?: (error: string) => void;
}

export const useImageUpload = (options: UseImageUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tempImagePath, setTempImagePath] = useState<string | null>(null);

  const uploadImage = async (
    file: File,
    projectSlug: string,
    isTemporary = true,
  ) => {
    if (!projectSlug) {
      const error = 'Project slug is required for image upload';
      toast.error(error);
      options.onUploadError?.(error);
      return null;
    }

    setIsUploading(true);
    try {
      const result = await uploadProjectImage(file, projectSlug, isTemporary);
      toast.success('Image uploaded successfully!');

      if (isTemporary) {
        setTempImagePath(result.path);
      }

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

  const moveToPermament = async (tempImageUrl: string) => {
    if (!tempImageUrl || !tempImageUrl.includes('/temp/')) {
      return null;
    }

    try {
      const tempPath = getPathFromUrl(tempImageUrl);
      if (!tempPath) {
        throw new Error('Cannot extract path from temp image URL');
      }

      const result = await moveImageFromTemp(tempPath);
      return result;
    } catch (error: any) {
      console.error('Error moving image to permanent:', error);
      throw error;
    }
  };

  const cleanupTempImage = async (tempImageUrl?: string) => {
    let pathToCleanup = tempImagePath;

    if (tempImageUrl && tempImageUrl.includes('/temp/')) {
      pathToCleanup = getPathFromUrl(tempImageUrl);
    }

    if (pathToCleanup) {
      try {
        await deleteProjectImage(pathToCleanup);
        setTempImagePath(null);
      } catch (error: any) {
        console.error('Error cleaning up temp image:', error);
      }
    }
  };

  const deleteImage = async (imageUrl: string) => {
    setIsDeleting(true);
    try {
      const filePath = getPathFromUrl(imageUrl);
      if (!filePath) {
        throw new Error('Invalid image URL');
      }

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
    moveToPermament,
    cleanupTempImage,
    isUploading,
    isDeleting,
    tempImagePath,
  };
};
