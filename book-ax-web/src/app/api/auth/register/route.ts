import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/db/supabase';
import { generateTokens } from '@/lib/auth/jwt';
import { registerSchema } from '@/utils/validation';
import { handleApiError, ValidationError, ConflictError } from '@/utils/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      throw new ValidationError(validation.error.errors[0].message);
    }

    const { email, password, firstName, lastName, role } = validation.data;

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const { data: user, error: createError } = await supabaseAdmin
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        role,
        status: 'active',
        email_verified: false,
        preferred_language: 'en',
      })
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    // Generate tokens
    const tokens = generateTokens(user);

    // Store refresh token
    await supabaseAdmin.from('refresh_tokens').insert({
      user_id: user.id,
      token: tokens.refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // TODO: Send verification email
    // await sendVerificationEmail(user.email, user.id);

    // Return response
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
    }, { status: 201 });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}
