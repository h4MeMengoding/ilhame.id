import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { withAdminAuth } from '../projects';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: number;
    email: string;
    name?: string;
    role?: string;
  };
}

type Data = {
  status: boolean;
  message: string;
  data?: any;
};

async function handler(req: AuthenticatedRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    try {
      // Get the maximum ID from projects table
      const maxIdResult = (await prisma.$queryRaw`
        SELECT COALESCE(MAX(id), 0) as max_id FROM projects
      `) as [{ max_id: number }];

      const maxId = maxIdResult[0]?.max_id || 0;
      const nextId = maxId + 1;

      // Reset the sequence to the next available ID
      await prisma.$executeRaw`
        SELECT setval('projects_id_seq', ${nextId}, false)
      `;

      // Get the current sequence value (use a separate query without currval)
      const seqResult = (await prisma.$queryRaw`
        SELECT last_value, is_called FROM projects_id_seq
      `) as [{ last_value: number; is_called: boolean }];

      return res.status(200).json({
        status: true,
        message: 'Auto-increment sequence fixed successfully',
        data: {
          maxId,
          nextId,
          sequenceValue: seqResult[0]?.last_value,
          sequenceIsCalled: seqResult[0]?.is_called,
        },
      });
    } catch (error: any) {
      console.error('Error fixing sequence:', error);
      return res.status(500).json({
        status: false,
        message: `Failed to fix sequence: ${error.message}`,
      });
    }
  } else {
    return res.status(405).json({
      status: false,
      message: 'Method not allowed',
    });
  }
}

export default withAdminAuth(handler);
