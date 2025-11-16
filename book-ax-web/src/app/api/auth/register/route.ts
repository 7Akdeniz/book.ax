// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/db/supabase';
import { generateTokens } from '@/lib/auth/jwt';
import { registerSchema } from '@/utils/validation';
import { handleApiError, ValidationError, ConflictError } from '@/utils/errors';
import { withLogging } from '@/lib/api-logger';
import { logger } from '@/lib/logger';
import { sendEmail } from '@/lib/email/mailer';
import { verificationEmail } from '@/lib/email/templates';

async function registerHandler(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      throw new ValidationError(validation.error.errors[0].message);
    }

    const { email, password, firstName, lastName, role } = validation.data;

    logger.debug('Registration attempt', {
      context: 'Auth Register',
      data: { email: email.toLowerCase(), role },
    });

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
      logger.error('Failed to create user', createError as Error, {
        context: 'Supabase Insert',
        data: { email: email.toLowerCase() },
      });
      throw createError;
    }

    logger.success('User created successfully', {
      data: { userId: user.id, email: user.email },
    });

    // Generate tokens
    const tokens = generateTokens(user);

    // Store refresh token
    await supabaseAdmin.from('refresh_tokens').insert({
      user_id: user.id,
      token: tokens.refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // Send verification email
    try {
      const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/de/verify-email?token=${user.id}`;
      
      await sendEmail({
        to: user.email,
        subject: 'E-Mail-Adresse bestätigen - Book.ax',
        html: verificationEmail({
          firstName: user.first_name,
          verificationUrl,
        }),
      });

      logger.success('Verification email sent', {
        context: 'Registration',
        data: { email: user.email },
      });
    } catch (emailError) {
      // Email-Fehler loggen, aber nicht die Registrierung abbrechen
      logger.warn('Failed to send verification email', {
        context: 'Registration',
        data: { 
          email: user.email,
          error: emailError instanceof Error ? emailError.message : 'Unknown error',
        },
      });
    }

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

export const POST = withLogging(registerHandler);
