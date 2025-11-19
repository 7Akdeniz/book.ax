// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { verifyAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { handleApiError } from '@/utils/errors';

async function logoutHandler(req: AuthenticatedRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let refreshToken = body.refreshToken;

    // Try to get refresh token from cookie if not in body
    if (!refreshToken) {
      refreshToken = req.cookies.get('refreshToken')?.value;
    }

    if (refreshToken && req.user) {
      // Revoke refresh token
      await supabaseAdmin
        .from('refresh_tokens')
        .update({ revoked: true })
        .eq('token', refreshToken)
        .eq('user_id', req.user.userId);
    }

    // Create response
    const response = NextResponse.json({ message: 'Logged out successfully' });

    // Clear cookies
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');

    return response;
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

export const POST = verifyAuth(logoutHandler);
