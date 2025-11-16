// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { verifyRefreshToken, generateAccessToken } from '@/lib/auth/jwt';
import { handleApiError, AuthenticationError } from '@/utils/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      throw new AuthenticationError('Refresh token is required');
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }

    // Check if refresh token exists in database and is not revoked
    const { data: tokenRecord, error: tokenError } = await supabaseAdmin
      .from('refresh_tokens')
      .select('*')
      .eq('token', refreshToken)
      .eq('revoked', false)
      .single();

    if (tokenError || !tokenRecord) {
      throw new AuthenticationError('Refresh token not found or revoked');
    }

    // Check if token is expired
    if (new Date(tokenRecord.expires_at) < new Date()) {
      throw new AuthenticationError('Refresh token has expired');
    }

    // Get user
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .eq('status', 'active')
      .single();

    if (userError || !user) {
      throw new AuthenticationError('User not found or inactive');
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    return NextResponse.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
