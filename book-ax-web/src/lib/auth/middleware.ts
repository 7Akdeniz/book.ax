import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from './jwt';
import { AuthenticationError, AuthorizationError } from '@/utils/errors';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

// Middleware to verify JWT token
export const verifyAuth = (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
  return async (req: AuthenticatedRequest): Promise<NextResponse> => {
    try {
      let token: string | undefined;

      // 1. Try to get token from Authorization header
      const authHeader = req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }

      // 2. If no header, try to get token from cookies
      if (!token) {
        token = req.cookies.get('accessToken')?.value;
      }

      if (!token) {
        throw new AuthenticationError('No authentication token provided');
      }
      
      // Verify token
      const decoded = verifyAccessToken(token);
      
      if (!decoded) {
        throw new AuthenticationError('Invalid or expired token');
      }

      // Attach user to request
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };

      // Call the handler
      return await handler(req);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        );
      }

      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
};

// Middleware to check user role
export const requireRole = (allowedRoles: string[]) => {
  return (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
    return verifyAuth(async (req: AuthenticatedRequest): Promise<NextResponse> => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        throw new AuthorizationError('Insufficient permissions');
      }

      return await handler(req);
    });
  };
};

// Middleware for admin-only routes
export const requireAdmin = (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
  return requireRole(['admin'])(handler);
};

// Middleware for hotelier or admin routes
export const requireHotelier = (handler: (req: AuthenticatedRequest) => Promise<NextResponse>) => {
  return requireRole(['hotelier', 'admin'])(handler);
};
