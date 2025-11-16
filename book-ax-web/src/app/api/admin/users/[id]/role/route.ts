
import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/db/supabase';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * Admin User Role Change
 * 
 * Security: Admin-only, changes user role
 * Warning: Changing role affects user permissions
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin access
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const userId = params.id;

    // Check if trying to change own role
    if (decoded.userId === userId) {
      return NextResponse.json(
        { error: 'Cannot change your own role' },
        { status: 400 }
      );
    }

    // Get new role from request body
    const body = await req.json();
    const { role } = body;

    if (!role || !['guest', 'hotelier', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be: guest, hotelier, or admin' },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: user, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('id, email, role')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user role
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ 
        role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Update role error:', updateError);
      return NextResponse.json(
        { error: 'Failed to change user role' },
        { status: 500 }
      );
    }

    // TODO: Send email notification to user (role changed)
    // TODO: Log action in audit_logs table
    // TODO: Revoke all refresh tokens to force re-login with new role

    console.log(`🔄 Admin ${decoded.email} changed role of ${user.email} from ${user.role} to ${role} (ID: ${userId})`);

    return NextResponse.json({
      message: 'User role changed successfully',
      user: {
        id: userId,
        email: user.email,
        oldRole: user.role,
        newRole: role,
      },
    });
  } catch (error) {
    console.error('Role change error:', error);
    return NextResponse.json(
      { error: 'Failed to change user role' },
      { status: 500 }
    );
  }
}
