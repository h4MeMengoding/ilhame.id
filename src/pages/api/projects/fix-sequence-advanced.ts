import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
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
      // Method 1: Get max ID and fix sequence
      const maxIdResult = (await prisma.$queryRaw`
        SELECT COALESCE(MAX(id), 0) as max_id FROM projects
      `) as [{ max_id: number }];

      const maxId = maxIdResult[0]?.max_id || 0;
      const nextId = maxId + 1;

      // Method 2: Multiple approaches to fix sequence
      const fixMethods = [
        // Method A: Direct sequence name
        () =>
          prisma.$executeRaw`SELECT setval('projects_id_seq', ${nextId}, false)`,

        // Method B: Using pg_get_serial_sequence function
        () =>
          prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('projects', 'id'), ${nextId}, false)`,

        // Method C: ALTER SEQUENCE (more forceful)
        () =>
          prisma.$executeRaw`ALTER SEQUENCE projects_id_seq RESTART WITH ${nextId}`,
      ];

      let fixSuccess = false;
      let lastError = null;

      for (let i = 0; i < fixMethods.length; i++) {
        try {
          await fixMethods[i]();
          fixSuccess = true;
          break;
        } catch (error: any) {
          lastError = error;
          continue;
        }
      }

      if (!fixSuccess) {
        throw lastError || new Error('All fix methods failed');
      }

      // Verify the fix by checking sequence info
      let sequenceInfo = null;
      try {
        const seqResult = (await prisma.$queryRaw`
          SELECT last_value, is_called FROM projects_id_seq
        `) as [{ last_value: number; is_called: boolean }];
        sequenceInfo = seqResult[0];
      } catch (error) {
        // Sequence info is optional for response
      }

      // Test the fix by checking if we can get the next value
      let nextValue = null;
      try {
        const nextResult = (await prisma.$queryRaw`
          SELECT nextval('projects_id_seq') as next_val
        `) as [{ next_val: number }];
        nextValue = nextResult[0]?.next_val;

        // Reset it back since we just used it for testing
        await prisma.$executeRaw`SELECT setval('projects_id_seq', ${nextId}, false)`;
      } catch (error) {
        // Could not test next value, but sequence was updated
      }

      return res.status(200).json({
        status: true,
        message:
          'Database sequence fixed successfully! Try saving your project again.',
        data: {
          maxId,
          nextId,
          sequenceInfo,
          testNextValue: nextValue,
          fixApplied: true,
        },
      });
    } catch (error: any) {
      console.error('Error in advanced sequence fix:', error);
      return res.status(500).json({
        status: false,
        message: `Failed to fix sequence: ${error.message}. Try manual fix in Supabase Dashboard.`,
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
