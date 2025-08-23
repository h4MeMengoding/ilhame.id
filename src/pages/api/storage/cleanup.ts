import type { NextApiRequest, NextApiResponse } from 'next';

import {
  cleanupAllTempImages,
  cleanupTempImages,
} from '@/services/imageUpload';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if force cleanup is requested
    const { force } = req.body || {};

    const deletedCount = force
      ? await cleanupAllTempImages()
      : await cleanupTempImages();

    res.status(200).json({
      success: true,
      message: force
        ? `Force cleaned up ${deletedCount} temporary images`
        : `Cleaned up ${deletedCount} old temporary images`,
      deletedCount,
      force: !!force,
    });
  } catch (error: any) {
    console.error('Cleanup error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cleanup temporary images',
    });
  }
}
