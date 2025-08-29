import { NextApiRequest, NextApiResponse } from 'next';

import { fetchGitHubContributions } from '@/services/githubContributions';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const contributionsData = await fetchGitHubContributions();

    // Set cache headers
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600', // Cache for 5 minutes
    );

    if (!contributionsData) {
      return res.status(404).json({
        error: 'Unable to fetch GitHub contributions data',
      });
    }

    return res.status(200).json(contributionsData);
  } catch (error) {
    console.error('GitHub contributions API error:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}
