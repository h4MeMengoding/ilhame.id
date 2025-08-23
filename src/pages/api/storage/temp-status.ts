import type { NextApiRequest, NextApiResponse } from 'next';

import { PROJECTS_BUCKET, supabase } from '@/common/libs/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { data: files, error } = await supabase.storage
      .from(PROJECTS_BUCKET)
      .list('temp');

    if (error) {
      console.error('Error listing temp files:', error);
      return res.status(500).json({
        message: 'Failed to check temp images',
        count: 0,
      });
    }

    const count = files?.length || 0;

    res.status(200).json({
      success: true,
      count,
      files:
        files?.map((f) => ({
          name: f.name,
          size: f.metadata?.size,
          created_at: f.created_at,
          updated_at: f.updated_at,
        })) || [],
    });
  } catch (error: any) {
    console.error('Temp status error:', error);
    res.status(500).json({
      message: error.message || 'Failed to check temp images',
      count: 0,
    });
  }
}
