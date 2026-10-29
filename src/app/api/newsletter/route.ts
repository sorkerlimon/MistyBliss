import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const RATE_LIMIT_MS = 60_000;
const MIN_FILL_MS = 1_500;

/** In-memory rate buckets (email + IP). Resets when the worker/process recycles. */
const rateBuckets = new Map<string, number>();

function pruneBuckets(now: number) {
  if (rateBuckets.size < 500) return;
  for (const [key, ts] of rateBuckets) {
    if (now - ts > RATE_LIMIT_MS) rateBuckets.delete(key);
  }
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, message: 'Invalid request.' }, { status: 400 });
    }

    const email = String(body.email || '')
      .trim()
      .toLowerCase();
    const source = String(body.source || 'footer').slice(0, 64);
    const honeypot = String(body.company || body.website || '').trim();
    const formStartedAt = Number(body.formStartedAt || 0);
    const now = Date.now();
    const ip = getClientIp(req);

    // Bot: honeypot filled
    if (honeypot) {
      return NextResponse.json({
        success: true,
        message: 'Thanks for joining the Design Circle.',
      });
    }

    // Bot: submitted too quickly
    if (!formStartedAt || now - formStartedAt < MIN_FILL_MS) {
      return NextResponse.json(
        {
          success: false,
          code: 'bot_detected',
          message: 'That looked automated. Please wait a moment and try again.',
        },
        { status: 400 }
      );
    }

    // Bot: form open far too long (stale / scripted replay)
    if (now - formStartedAt > 60 * 60 * 1000) {
      return NextResponse.json(
        {
          success: false,
          code: 'expired',
          message: 'This form expired. Please refresh the page and try again.',
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, code: 'invalid_email', message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    pruneBuckets(now);
    const keys = [`email:${email}`, `ip:${ip}`];
    for (const key of keys) {
      const last = rateBuckets.get(key);
      if (last && now - last < RATE_LIMIT_MS) {
        const waitSec = Math.ceil((RATE_LIMIT_MS - (now - last)) / 1000);
        return NextResponse.json(
          {
            success: false,
            code: 'rate_limited',
            message: `Please wait ${waitSec} second${waitSec === 1 ? '' : 's'} before subscribing again. Only one request per minute is allowed.`,
            retryAfterSeconds: waitSec,
          },
          {
            status: 429,
            headers: { 'Retry-After': String(waitSec) },
          }
        );
      }
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { success: false, message: 'Newsletter service is temporarily unavailable.' },
        { status: 503 }
      );
    }

    const { error } = await supabase.from('newsletter_subscribers').upsert(
      {
        email,
        source,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    );

    if (error) {
      console.warn('Newsletter save error:', error.message);
      return NextResponse.json(
        { success: false, message: 'Could not save your email right now. Please try again shortly.' },
        { status: 500 }
      );
    }

    for (const key of keys) rateBuckets.set(key, now);

    return NextResponse.json({
      success: true,
      message: 'Welcome to the Misty Bliss Design Circle. Check your inbox for code WELCOME10.',
    });
  } catch (err) {
    console.error('Newsletter API error:', err);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
