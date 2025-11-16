import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth/jwt';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * Admin Role Verification Endpoint
 * 
 * Security: Verifies JWT token and checks if user has admin role
 * Returns: User data with role information
 * 
 * Used by: All admin pages on mount for authorization
 */
export async function GET(req: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // Verify JWT token
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if user has admin role
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Return user data
    return NextResponse.json({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });
  } catch (error) {
    console.error('Admin verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
