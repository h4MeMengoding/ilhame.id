import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, PROJECTS_BUCKET } from '@/common/libs/supabase';

type Data = {
  status: boolean;
  message: string;
  data?: any;
  requiresManualSetup?: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method === 'POST') {
    try {
      // First, try to access the bucket directly to check if it exists
      const { data: testFiles, error: testError } = await supabase.storage
        .from(PROJECTS_BUCKET)
        .list('', { limit: 1 });

      if (!testError) {
        // Bucket exists and is accessible
        return res.status(200).json({
          status: true,
          message: 'Storage bucket is ready and accessible',
          data: { bucketName: PROJECTS_BUCKET, isAccessible: true },
        });
      }

      // If bucket doesn't exist, try to create it
      if (
        testError.message?.includes('The resource was not found') ||
        testError.message?.includes('Bucket not found')
      ) {
        const { data, error: createError } =
          await supabase.storage.createBucket(PROJECTS_BUCKET, {
            public: true,
            fileSizeLimit: 2097152, // 2MB
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
          });

        if (createError) {
          // Check if error is about RLS policy or permission
          if (
            createError.message?.includes('row-level security policy') ||
            createError.message?.includes('permission') ||
            (createError as any).status === 403
          ) {
            return res.status(200).json({
              status: false,
              message:
                'Bucket needs to be created manually in Supabase Dashboard',
              requiresManualSetup: true,
              data: {
                bucketName: PROJECTS_BUCKET,
                errorType: 'PERMISSION_DENIED',
                instructions: [
                  '1. Go to Supabase Dashboard → Storage',
                  '2. Create bucket named: project-images',
                  '3. Make it public',
                  '4. Refresh this page',
                ],
              },
            });
          }

          console.error('Error creating bucket:', createError);
          return res.status(500).json({
            status: false,
            message: `Failed to create storage bucket: ${createError.message}`,
          });
        }

        return res.status(200).json({
          status: true,
          message: 'Storage bucket created successfully',
          data,
        });
      }

      // Other errors
      console.error('Storage access error:', testError);
      return res.status(500).json({
        status: false,
        message: `Storage check failed: ${testError.message}`,
      });
    } catch (error: any) {
      console.error('Storage setup error:', error);
      return res.status(500).json({
        status: false,
        message: error.message || 'Internal server error',
      });
    }
  } else {
    return res.status(405).json({
      status: false,
      message: 'Method not allowed',
    });
  }
}
