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

    // Find user by email (using Supabase for production compatibility)
    console.log('🔍 Looking for user:', email.toLowerCase());
    const { data: users, error: queryError } = await supabaseAdmin
      .from('users')
      .select('id, email, password_hash, first_name, last_name, role, email_verified, status')
      .eq('email', email.toLowerCase())
      .limit(1);

    if (queryError) {
      console.error('❌ Database error:', queryError);
      throw new Error('Database error');
    }

    console.log('📊 Query result:', { 
      found: users && users.length > 0, 
      email: users?.[0]?.email,
      status: users?.[0]?.status,
      email_verified: users?.[0]?.email_verified
    });

    if (!users || users.length === 0) {
      throw new AuthenticationError('Invalid email or password');
    }

    const user = users[0];

    // Check status
    if (user.status !== 'active') {
      throw new AuthenticationError('Account is not active');
    }

    // Verify password
    console.log('🔐 Verifying password...');
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    console.log('🔐 Password valid:', isValidPassword);
    
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
    const { error: refreshTokenError } = await supabaseAdmin
      .from('refresh_tokens')
      .insert({
        user_id: user.id,
        token: tokens.refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
      });

    if (refreshTokenError) {
      console.error('❌ Error storing refresh token:', refreshTokenError);
      throw new Error('Error storing refresh token');
    }

    // Update last login
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    if (updateError) {
      console.error('⚠️ Error updating last login:', updateError);
      // Don't fail login if this fails
    }

    // Create response
    const response = NextResponse.json({
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

    // Set HTTP-Only cookies for additional security
    // This allows Cookie-based auth in addition to Bearer token
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction, // Only HTTPS in production
      sameSite: 'lax' as const, // Allow cookies to be sent with navigation
      path: '/',
      domain: isProduction ? '.book.ax' : undefined, // Share cookies across subdomains in prod
    };

    console.log('🍪 Setting cookies with options:', {
      isProduction,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      domain: cookieOptions.domain,
    });

    // Access token cookie (15 minutes)
    response.cookies.set('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60, // 15 minutes
    });

    // Refresh token cookie (7 days)
    response.cookies.set('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    console.log('✅ Cookies set successfully');

    return response;
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
