// =====================================================
// HYBRID AUTH MIDDLEWARE
// =====================================================
// Unterstützt sowohl JWT (User Sessions) als auch API Tokens
// Für APIs, die von Web-UI UND technischen Clients genutzt werden
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, requireAdmin, type AuthenticatedRequest } from '@/lib/auth/middleware';
import { verifyApiToken, extractApiToken, type ApiTokenRequest } from '@/lib/auth/api-token';

// =====================================================
// HYBRID REQUEST TYPE
// =====================================================
export interface HybridAuthRequest extends NextRequest {
  // JWT Auth
  user?: {
    userId: string;
    email: string;
    role: string;
  };
  userId?: string;
  userRole?: string;

  // API Token Auth
  apiToken?: {
    id: string;
    name: string;
    user_id: string;
    scopes: string[];
  };
  tokenUserId?: string;

  // Hybrid info
  authType?: 'jwt' | 'api-token';
}

// =====================================================
// MIDDLEWARE: Verify JWT or API Token
// =====================================================

/**
 * Middleware für Hybrid-Auth: Akzeptiert JWT ODER API-Token
 * Usage:
 * export const GET = verifyJwtOrApiToken(['cms:read'])(async (req: HybridAuthRequest) => {
 *   if (req.authType === 'jwt') {
 *     // JWT User
 *     console.log('User:', req.user);
 *   } else {
 *     // API Token
 *     console.log('Token:', req.apiToken);
 *   }
 * });
 */
export function verifyJwtOrApiToken(requiredScopes: string[] = []) {
  return function (handler: (req: HybridAuthRequest) => Promise<NextResponse>) {
    return async (req: NextRequest): Promise<NextResponse> => {
      const hybridReq = req as HybridAuthRequest;

      // Try API Token first (if present)
      const apiToken = extractApiToken(req);

      if (apiToken) {
        // Use API Token auth
        return verifyApiToken(requiredScopes)(async (tokenReq: ApiTokenRequest) => {
          hybridReq.authType = 'api-token';
          hybridReq.apiToken = tokenReq.apiToken;
          hybridReq.tokenUserId = tokenReq.tokenUserId;
          return handler(hybridReq);
        })(req);
      }

      // Fallback to JWT auth
      return verifyAuth(async (authReq: AuthenticatedRequest) => {
        hybridReq.authType = 'jwt';
        hybridReq.user = authReq.user;
        hybridReq.userId = authReq.user?.userId;
        hybridReq.userRole = authReq.user?.role;

        // Check if user has required scopes (map role to scopes)
        if (requiredScopes.length > 0) {
          const userScopes = getUserScopes(authReq.user?.role || 'guest');
          const hasRequiredScopes = requiredScopes.every(scope => 
            userScopes.includes(scope) || userScopes.includes('admin')
          );

          if (!hasRequiredScopes) {
            return NextResponse.json(
              { error: `Insufficient permissions. Required: ${requiredScopes.join(', ')}` },
              { status: 403 }
            );
          }
        }

        return handler(hybridReq);
      })(req as AuthenticatedRequest);
    };
  };
}

// =====================================================
// MIDDLEWARE: Require Admin (JWT or API Token)
// =====================================================

export function requireAdminOrApiToken(requiredScopes: string[] = ['admin']) {
  return verifyJwtOrApiToken(requiredScopes);
}

// =====================================================
// HELPER: Map User Role to Scopes
// =====================================================

function getUserScopes(role: string): string[] {
  switch (role) {
    case 'admin':
      return ['admin'];
    case 'hotelier':
      return ['hotels:read', 'hotels:write', 'bookings:read', 'analytics:read'];
    case 'guest':
      return ['bookings:read'];
    default:
      return [];
  }
}

// =====================================================
// HELPER: Get User/Token ID
// =====================================================

export function getUserId(req: HybridAuthRequest): string | undefined {
  if (req.authType === 'jwt') {
    return req.userId;
  } else if (req.authType === 'api-token') {
    return req.tokenUserId;
  }
  return undefined;
}

export function isAdmin(req: HybridAuthRequest): boolean {
  if (req.authType === 'jwt') {
    return req.userRole === 'admin';
  } else if (req.authType === 'api-token') {
    return req.apiToken?.scopes.includes('admin') || false;
  }
  return false;
}
