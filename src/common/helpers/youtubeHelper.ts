/**
 * Extract YouTube video ID from various YouTube URL formats
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 */
export const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;

  // Match various YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Generate YouTube thumbnail URL from video ID or URL
 * Quality options: maxresdefault (highest), hqdefault, mqdefault, sddefault, default
 */
export const getYouTubeThumbnail = (
  urlOrVideoId: string,
  quality:
    | 'maxresdefault'
    | 'hqdefault'
    | 'mqdefault'
    | 'sddefault'
    | 'default' = 'maxresdefault',
): string | null => {
  const videoId = extractYouTubeVideoId(urlOrVideoId);

  if (!videoId) return null;

  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

/**
 * Check if a URL is a valid YouTube URL
 */
export const isYouTubeUrl = (url: string): boolean => {
  if (!url) return false;

  const youtubePattern = /(?:youtube\.com|youtu\.be)/;
  return youtubePattern.test(url);
};
