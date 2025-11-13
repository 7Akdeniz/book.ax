import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError, ValidationError } from '@/utils/errors';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      throw new ValidationError('E-Mail-Adresse erforderlich');
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name')
      .eq('email', normalizedEmail)
      .eq('status', 'active')
      .single();

    // Don't reveal if email exists or not for security reasons
    // Always return success to prevent email enumeration attacks
    if (!user || userError) {
      return NextResponse.json(
        { 
          success: true,
          message: 'Wenn diese E-Mail-Adresse registriert ist, wurde ein Reset-Link gesendet.'
        },
        { status: 200 }
      );
    }

    // Generate password reset token (valid for 1 hour)
    const resetToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token in database
    const { error: tokenError } = await supabaseAdmin
      .from('password_reset_tokens')
      .insert({
        user_id: user.id,
        token: resetToken,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error('Error storing reset token:', tokenError);
      throw new Error('Fehler beim Erstellen des Reset-Tokens');
    }

    // TODO: Send email with reset link
    // For now, just log the token (in production, use an email service)
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    console.log('Password Reset URL:', resetUrl);
    console.log('User:', user.email);

    // In production, you would send an email here:
    // await sendPasswordResetEmail(user.email, user.first_name, resetUrl);

    return NextResponse.json(
      { 
        success: true,
        message: 'Wenn diese E-Mail-Adresse registriert ist, wurde ein Reset-Link gesendet.',
        // Remove in production! Only for development
        ...(process.env.NODE_ENV === 'development' && { resetUrl })
      },
      { status: 200 }
    );

  } catch (error) {
    return handleApiError(error);
  }
}
