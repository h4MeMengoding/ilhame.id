import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    res.status(200).json({
      message: 'Test API is working',
      timestamp: new Date().toISOString(),
      method: req.method,
    });
  } else if (req.method === 'POST') {
    const loginData = {
      email: 'adm@ilhame.id',
      password: 'admin123',
    };

    try {
      const loginResponse = await fetch(
        `${req.headers.origin}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        },
      );

      const loginResult = await loginResponse.json();

      res.status(200).json({
        loginStatus: loginResponse.status,
        loginResult,
        testData: loginData,
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to test login',
        details: error.message,
      });
    }
  }
}
