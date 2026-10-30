import { NextRequest, NextResponse } from 'next/server';
import {
  areAdminCredentialsConfigured,
  validateAdminCredentials,
} from '../../../../lib/adminConfig';

export async function POST(req: NextRequest) {
  try {
    if (!areAdminCredentialsConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Admin credentials are not configured on the server',
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const isValid = validateAdminCredentials(email, password);

    if (isValid) {
      return NextResponse.json({
        success: true,
        message: 'Admin authenticated successfully',
        email: String(email).trim().toLowerCase(),
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid admin credentials' },
      { status: 401 }
    );
  } catch (err) {
    console.error('Admin login API error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
