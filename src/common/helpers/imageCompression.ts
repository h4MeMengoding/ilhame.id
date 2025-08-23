import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  fileType?: string;
}

export const defaultCompressionOptions: CompressionOptions = {
  maxSizeMB: 2, // Maximum file size 2MB
  maxWidthOrHeight: 1920, // Maximum width or height
  useWebWorker: true,
  fileType: 'image/webp', // Convert to WebP for better compression
};

export const compressImage = async (
  file: File,
  options: CompressionOptions = defaultCompressionOptions,
): Promise<File> => {
  try {
    // Check if file size is already within limit
    if (file.size <= options.maxSizeMB * 1024 * 1024) {
      return file;
    }

    const compressedFile = await imageCompression(file, options);

    // If compression didn't reduce size enough, try with lower quality
    if (compressedFile.size > options.maxSizeMB * 1024 * 1024) {
      const aggressiveOptions = {
        ...options,
        maxSizeMB: options.maxSizeMB * 0.8, // Reduce target size by 20%
        maxWidthOrHeight: Math.floor(options.maxWidthOrHeight * 0.8), // Reduce dimensions by 20%
      };
      return await imageCompression(file, aggressiveOptions);
    }

    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw new Error('Failed to compress image');
  }
};

export const validateImageFile = (file: File): string | null => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return 'Only JPEG, PNG, and WebP images are allowed';
  }

  // Check file size (5MB max before compression)
  const maxSizeBeforeCompression = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSizeBeforeCompression) {
    return 'File size must be less than 5MB';
  }

  return null;
};
