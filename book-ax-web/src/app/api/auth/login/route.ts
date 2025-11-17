// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db/postgres';
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

    // Find user by email (using direct PostgreSQL)
    console.log('🔍 Looking for user:', email.toLowerCase());
    const result = await query(
      `SELECT id, email, password_hash, first_name, last_name, role, email_verified, status
       FROM users 
       WHERE email = $1
       LIMIT 1`,
      [email.toLowerCase()]
    );

    console.log('📊 Query result:', { 
      found: result.rows.length > 0, 
      email: result.rows[0]?.email,
      status: result.rows[0]?.status,
      email_verified: result.rows[0]?.email_verified
    });

    if (!result.rows || result.rows.length === 0) {
      throw new AuthenticationError('Invalid email or password');
    }

    const user = result.rows[0];

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
    await query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [
        user.id,
        tokens.refreshToken,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      ]
    );

    // Update last login
    await query(
      `UPDATE users SET last_login = NOW() WHERE id = $1`,
      [user.id]
    );

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
