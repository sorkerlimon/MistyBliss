import { NextRequest, NextResponse } from 'next/server';
import { verifyTurnstileToken } from '../../../../lib/turnstile';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const verification = await verifyTurnstileToken(req, body?.token);
  return NextResponse.json(verification, { status: verification.success ? 200 : 400 });
}
