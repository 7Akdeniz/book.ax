// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { verifyRefreshToken, generateAccessToken } from '@/lib/auth/jwt';
import { handleApiError, AuthenticationError } from '@/utils/errors';

export async function POST(req: NextRequest) {
  try {
    // Try to get refresh token from multiple sources
    let refreshToken: string | undefined;

    // 1. From request body
    const body = await req.json().catch(() => ({}));
    refreshToken = body.refreshToken;

    // 2. Fallback to cookie
    if (!refreshToken) {
      refreshToken = req.cookies.get('refreshToken')?.value;
    }

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

    // Create response with new access token
    const response = NextResponse.json({
      accessToken: newAccessToken,
    });

    // Update access token cookie
    const isProduction = process.env.NODE_ENV === 'production';
    response.cookies.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60, // 15 minutes
    });

    return response;
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
