import {
  compressImage,
  validateImageFile,
} from '@/common/helpers/imageCompression';
import { PROJECTS_BUCKET, supabase } from '@/common/libs/supabase';

export interface UploadImageResult {
  url: string;
  path: string;
  isTemporary?: boolean;
}

export const uploadProjectImage = async (
  file: File,
  projectSlug: string,
  isTemporary = true,
): Promise<UploadImageResult> => {
  try {
    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      throw new Error(validationError);
    }

    // Compress image
    const compressedFile = await compressImage(file);

    // Generate unique filename
    const fileExtension = compressedFile.type.split('/')[1];
    const timestamp = Date.now();
    const fileName = `${projectSlug}-${timestamp}.${fileExtension}`;

    // Upload to temporary folder first to prevent orphaned files
    const basePath = isTemporary ? 'temp' : 'projects';
    const filePath = `${basePath}/${fileName}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from(PROJECTS_BUCKET)
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(PROJECTS_BUCKET)
      .getPublicUrl(filePath);

    return {
      url: publicUrlData.publicUrl,
      path: filePath,
      isTemporary,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteProjectImage = async (filePath: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from(PROJECTS_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export const getImageUrlFromPath = (filePath: string): string => {
  const { data } = supabase.storage
    .from(PROJECTS_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
};

// Move image from temporary to permanent location
export const moveImageFromTemp = async (
  tempPath: string,
): Promise<UploadImageResult> => {
  try {
    console.log('Moving from temp path:', tempPath);

    // Extract filename from temp path
    const tempFileName = tempPath.split('/').pop();
    if (!tempFileName) {
      throw new Error('Invalid temp path');
    }

    // Generate new permanent path
    const permanentPath = `projects/${tempFileName}`;
    console.log('Moving to permanent path:', permanentPath);

    // Download the file from temp location
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(PROJECTS_BUCKET)
      .download(tempPath);

    if (downloadError) {
      console.error('Download error:', downloadError);
      throw new Error(`Failed to download temp file: ${downloadError.message}`);
    }

    console.log('Downloaded file size:', fileData?.size);

    // Upload to permanent location
    const { error: uploadError } = await supabase.storage
      .from(PROJECTS_BUCKET)
      .upload(permanentPath, fileData, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(
        `Failed to move to permanent location: ${uploadError.message}`,
      );
    }

    console.log('Successfully uploaded to permanent location');

    // Delete the temporary file
    await deleteProjectImage(tempPath);
    console.log('Deleted temporary file');

    // Get public URL for permanent location
    const { data: publicUrlData } = supabase.storage
      .from(PROJECTS_BUCKET)
      .getPublicUrl(permanentPath);

    console.log('New permanent URL:', publicUrlData.publicUrl);

    return {
      url: publicUrlData.publicUrl,
      path: permanentPath,
      isTemporary: false,
    };
  } catch (error) {
    console.error('Error moving image from temp:', error);
    throw error;
  }
};

// Clean up orphaned temporary files (files older than 1 hour)
export const cleanupTempImages = async (): Promise<number> => {
  try {
    const { data: files, error } = await supabase.storage
      .from(PROJECTS_BUCKET)
      .list('temp');

    if (error) {
      console.error('Error listing temp files:', error);
      return 0;
    }

    if (!files || files.length === 0) {
      return 0;
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const filesToDelete: string[] = [];

    for (const file of files) {
      const fileDate = new Date(file.created_at || file.updated_at || 0);
      if (fileDate < oneHourAgo) {
        filesToDelete.push(`temp/${file.name}`);
      }
    }

    if (filesToDelete.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from(PROJECTS_BUCKET)
        .remove(filesToDelete);

      if (deleteError) {
        console.error('Error deleting temp files:', deleteError);
        return 0;
      }
    }

    return filesToDelete.length;
  } catch (error) {
    console.error('Error cleaning up temp images:', error);
    return 0;
  }
};

// Clean up ALL temporary files (for force cleanup)
export const cleanupAllTempImages = async (): Promise<number> => {
  try {
    const { data: files, error } = await supabase.storage
      .from(PROJECTS_BUCKET)
      .list('temp');

    if (error) {
      console.error('Error listing temp files:', error);
      return 0;
    }

    if (!files || files.length === 0) {
      return 0;
    }

    const filesToDelete: string[] = files.map((file) => `temp/${file.name}`);

    if (filesToDelete.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from(PROJECTS_BUCKET)
        .remove(filesToDelete);

      if (deleteError) {
        console.error('Error deleting all temp files:', deleteError);
        return 0;
      }
    }

    return filesToDelete.length;
  } catch (error) {
    console.error('Error cleaning up all temp images:', error);
    return 0;
  }
};

// Extract path from URL (for cleanup purposes)
export const getPathFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/object\/public\/[^/]+\/(.+)$/);
    return pathMatch ? pathMatch[1] : null;
  } catch {
    return null;
  }
};

// Delete project image by URL
export const deleteProjectImageByUrl = async (
  imageUrl: string,
): Promise<boolean> => {
  try {
    const path = getPathFromUrl(imageUrl);
    if (!path) {
      return false;
    }

    const { error } = await supabase.storage
      .from(PROJECTS_BUCKET)
      .remove([path]);

    if (error) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};
