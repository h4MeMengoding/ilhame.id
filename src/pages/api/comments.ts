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

    // Comments system now uses internal authentication - see /api/blog/[id]/comments
    res.status(200).json({
      status: true,
      data: [],
      message: 'Comments system migrated to internal authentication',
    });
  } catch (error) {
    res.status(200).json({ status: false, error });
  }
}
