import https from 'node:https';
import { NextRequest } from 'next/server';

type TurnstileResponse = {
  success: boolean;
  'error-codes'?: string[];
};

function postSiteverify(secret: string, response: string): Promise<TurnstileResponse> {
  const body = new URLSearchParams({ secret, response }).toString();

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'challenges.cloudflare.com',
        path: '/turnstile/v0/siteverify',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body),
        },
        family: 4,
        timeout: 15_000,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8');
          try {
            resolve(JSON.parse(raw) as TurnstileResponse);
          } catch {
            reject(new Error(`Invalid siteverify response (HTTP ${res.statusCode})`));
          }
        });
      }
    );

    req.on('timeout', () => {
      req.destroy(new Error('siteverify timed out'));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function isLocalNetworkBlock(detail: string) {
  return /EACCES|ECONNREFUSED|ENOTFOUND|ETIMEDOUT|fetch failed/i.test(detail);
}

export async function verifyTurnstileToken(_req: NextRequest, token: unknown) {
  const secret = String(process.env.TURNSTILE_SECRET_KEY || '').trim();
  const response = typeof token === 'string' ? token.trim() : '';

  if (!secret) {
    return {
      success: false,
      reason: 'Turnstile is not configured on the server (missing TURNSTILE_SECRET_KEY).',
    };
  }
  if (!response) {
    return { success: false, reason: 'Please complete the security check.' };
  }

  try {
    const data = await postSiteverify(secret, response);

    if (data.success) return { success: true };

    const codes = data['error-codes'] || [];
    console.warn('[Turnstile] siteverify failed:', codes);

    if (codes.includes('invalid-input-secret')) {
      return {
        success: false,
        reason: 'Turnstile secret key is invalid. Check TURNSTILE_SECRET_KEY in .env and restart the server.',
      };
    }
    if (codes.includes('timeout-or-duplicate') || codes.includes('invalid-input-response')) {
      return {
        success: false,
        reason: 'Security check expired or already used. Wait for a fresh check, then submit again.',
      };
    }
    if (codes.includes('bad-request')) {
      return {
        success: false,
        reason: 'Security check request was rejected. Please refresh and try again.',
      };
    }

    return {
      success: false,
      reason: `Security verification failed${codes.length ? ` (${codes.join(', ')})` : ''}. Please try again.`,
    };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.warn('[Turnstile] siteverify network error:', err);

    // Windows often blocks Next.js outbound HTTPS (EACCES) while the browser widget still works.
    // Allow local development to proceed; production Workers can reach Cloudflare normally.
    if (process.env.NODE_ENV === 'development' && isLocalNetworkBlock(detail)) {
      console.warn(
        '[Turnstile] Dev bypass: siteverify blocked by OS/network. Widget token accepted locally only.'
      );
      return { success: true };
    }

    return {
      success: false,
      reason: 'Security verification is temporarily unavailable. Please try again.',
    };
  }
}
