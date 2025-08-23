import {
  compressImage,
  validateImageFile,
} from '@/common/helpers/imageCompression';
import { PROJECTS_BUCKET, supabase } from '@/common/libs/supabase';

export interface UploadImageResult {
  url: string;
  path: string;
}

export const uploadProjectImage = async (
  file: File,
  projectSlug: string,
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
    const filePath = `projects/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
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
