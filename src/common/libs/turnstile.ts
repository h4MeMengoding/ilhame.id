import axios from 'axios';

export interface TurnstileVerificationResult {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

/**
 * Verify Cloudflare Turnstile token
 * @param token - The turnstile token from the client
 * @param ip - Client IP address (optional)
 * @returns Promise<TurnstileVerificationResult>
 */
export async function verifyTurnstileToken(
  token: string,
  ip?: string,
): Promise<TurnstileVerificationResult> {
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (!secretKey && !isDevelopment) {
    throw new Error('Cloudflare Turnstile secret key is not configured');
  }

  if (!token) {
    return {
      success: false,
      'error-codes': ['missing-input-response'],
    };
  }

  // Handle development mock tokens
  if (isDevelopment && token.startsWith('dev-mock-token-')) {
    console.log('🧪 Development mode: Using mock Turnstile verification');
    return {
      success: true,
      challenge_ts: new Date().toISOString(),
      hostname: 'localhost',
      action: 'login',
      cdata: 'development-mock',
    };
  }

  // If no secret key in development, allow all tokens
  if (isDevelopment && !secretKey) {
    console.log(
      '🧪 Development mode: No secret key configured, allowing token',
    );
    return {
      success: true,
      challenge_ts: new Date().toISOString(),
      hostname: 'localhost',
      action: 'login',
    };
  }

  // Production verification with real Cloudflare API
  if (!secretKey) {
    throw new Error(
      'Cloudflare Turnstile secret key is required for production',
    );
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);

    if (ip) {
      formData.append('remoteip', ip);
    }

    const response = await axios.post(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000, // 10 seconds timeout
      },
    );

    return response.data;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return {
      success: false,
      'error-codes': ['internal-error'],
    };
  }
}

/**
 * Get client IP address from request headers
 * @param req - Next.js API request object
 * @returns string | undefined
 */
export function getClientIP(req: any): string | undefined {
  return (
    req.headers['cf-connecting-ip'] ||
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress
  );
}
