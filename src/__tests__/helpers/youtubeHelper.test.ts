import {
  extractYouTubeVideoId,
  getYouTubeThumbnail,
  isYouTubeUrl,
} from '@/common/helpers/youtubeHelper';

describe('youtubeHelper', () => {
  describe('extractYouTubeVideoId', () => {
    it('should extract video ID from standard watch URL', () => {
      const url = 'https://www.youtube.com/watch?v=hYgs5POm-9I';
      expect(extractYouTubeVideoId(url)).toBe('hYgs5POm-9I');
    });

    it('should extract video ID from short URL', () => {
      const url = 'https://youtu.be/hYgs5POm-9I';
      expect(extractYouTubeVideoId(url)).toBe('hYgs5POm-9I');
    });

    it('should extract video ID from embed URL', () => {
      const url = 'https://www.youtube.com/embed/hYgs5POm-9I';
      expect(extractYouTubeVideoId(url)).toBe('hYgs5POm-9I');
    });

    it('should extract video ID from watch URL without www', () => {
      const url = 'https://youtube.com/watch?v=hYgs5POm-9I';
      expect(extractYouTubeVideoId(url)).toBe('hYgs5POm-9I');
    });

    it('should extract video ID with additional query parameters', () => {
      const url = 'https://www.youtube.com/watch?v=hYgs5POm-9I&t=10s';
      expect(extractYouTubeVideoId(url)).toBe('hYgs5POm-9I');
    });

    it('should return null for invalid URL', () => {
      const url = 'https://example.com';
      expect(extractYouTubeVideoId(url)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(extractYouTubeVideoId('')).toBeNull();
    });
  });

  describe('getYouTubeThumbnail', () => {
    it('should generate maxresdefault thumbnail URL by default', () => {
      const url = 'https://www.youtube.com/watch?v=hYgs5POm-9I';
      const expected =
        'https://img.youtube.com/vi/hYgs5POm-9I/maxresdefault.jpg';
      expect(getYouTubeThumbnail(url)).toBe(expected);
    });

    it('should generate thumbnail URL with specified quality', () => {
      const url = 'https://youtu.be/hYgs5POm-9I';
      const expected = 'https://img.youtube.com/vi/hYgs5POm-9I/hqdefault.jpg';
      expect(getYouTubeThumbnail(url, 'hqdefault')).toBe(expected);
    });

    it('should work with direct video ID', () => {
      const videoId = 'hYgs5POm-9I';
      const expected =
        'https://img.youtube.com/vi/hYgs5POm-9I/maxresdefault.jpg';
      expect(getYouTubeThumbnail(videoId)).toBe(expected);
    });

    it('should return null for invalid URL', () => {
      const url = 'https://example.com';
      expect(getYouTubeThumbnail(url)).toBeNull();
    });

    it('should return null for empty string', () => {
      expect(getYouTubeThumbnail('')).toBeNull();
    });
  });

  describe('isYouTubeUrl', () => {
    it('should return true for youtube.com URL', () => {
      expect(isYouTubeUrl('https://www.youtube.com/watch?v=hYgs5POm-9I')).toBe(
        true,
      );
    });

    it('should return true for youtu.be URL', () => {
      expect(isYouTubeUrl('https://youtu.be/hYgs5POm-9I')).toBe(true);
    });

    it('should return false for non-YouTube URL', () => {
      expect(isYouTubeUrl('https://example.com')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isYouTubeUrl('')).toBe(false);
    });
  });
});
