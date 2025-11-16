// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/db/supabase';
import { generateTokens } from '@/lib/auth/jwt';
import { loginSchema } from '@/utils/validation';
import { handleApiError, ValidationError, AuthenticationError } from '@/utils/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      throw new ValidationError(validation.error.errors[0].message);
    }

    const { email, password } = validation.data;

    // Find user by email
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('status', 'active')
      .single();

    if (userError || !user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check if email is verified
    if (!user.email_verified) {
      throw new AuthenticationError('Please verify your email before logging in');
    }

    // Generate tokens
    const tokens = generateTokens(user);

    // Store refresh token in database
    await supabaseAdmin.from('refresh_tokens').insert({
      user_id: user.id,
      token: tokens.refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    });

    // Update last login
    await supabaseAdmin
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Return response (exclude password hash)
    return NextResponse.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
