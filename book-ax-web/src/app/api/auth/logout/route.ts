// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { verifyAuth, AuthenticatedRequest } from '@/lib/auth/middleware';
import { handleApiError } from '@/utils/errors';

async function logoutHandler(req: AuthenticatedRequest) {
  try {
    const body = await req.json();
    const { refreshToken } = body;

    if (refreshToken && req.user) {
      // Revoke refresh token
      await supabaseAdmin
        .from('refresh_tokens')
        .update({ revoked: true })
        .eq('token', refreshToken)
        .eq('user_id', req.user.userId);
    }

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

export const POST = verifyAuth(logoutHandler);
