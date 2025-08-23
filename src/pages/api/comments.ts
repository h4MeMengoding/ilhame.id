import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=30',
    );

    // For now, return empty comments since we're using internal blog system
    // In the future, we can implement a comment system if needed
    res.status(200).json({
      status: true,
      data: [],
      message: 'Comments system temporarily disabled - using Giscus instead',
    });
  } catch (error) {
    res.status(200).json({ status: false, error });
  }
}
