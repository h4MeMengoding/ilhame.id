import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/common/libs/prisma';

type HealthResponse = {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  database: 'connected' | 'disconnected';
  environment: string;
  version: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>,
) {
  const startTime = Date.now();

  try {
    // Check database connection
    let databaseStatus: 'connected' | 'disconnected' = 'disconnected';

    try {
      await prisma.$queryRaw`SELECT 1`;
      databaseStatus = 'connected';
    } catch (error) {
      console.error('Database health check failed:', error);
      databaseStatus = 'disconnected';
    }

    const healthData: HealthResponse = {
      status: databaseStatus === 'connected' ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: databaseStatus,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '0.1.0',
    };

    // Set cache headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const statusCode = databaseStatus === 'connected' ? 200 : 503;
    res.status(statusCode).json(healthData);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'disconnected',
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '0.1.0',
      error: errorMessage,
    });
  }
}
