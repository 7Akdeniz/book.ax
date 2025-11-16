// =====================================================
// API TOKEN AUTHENTICATION MIDDLEWARE
// =====================================================
// Für technische Integrationen (MCP Server, Automation, etc.)
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db/supabase';

// =====================================================
// TYPES
// =====================================================

export interface ApiTokenData {
  id: string;
  token: string;
  name: string;
  user_id: string;
  scopes: string[];
  is_active: boolean;
  expires_at: string | null;
  rate_limit: number;
  requests_count: number;
  requests_reset_at: string | null;
  allowed_ips: string[];
}

export interface ApiTokenRequest extends NextRequest {
  apiToken?: ApiTokenData;
  tokenUserId?: string;
}

export interface TokenValidationResult {
  is_valid: boolean;
  token_id: string | null;
  user_id: string | null;
  scopes: string[] | null;
  error_message: string | null;
}

// =====================================================
// TOKEN EXTRACTION
// =====================================================

/**
 * Extract API token from request headers
 * Supports:
 * - Authorization: Bearer bax_live_xxxxx
 * - X-API-Token: bax_live_xxxxx
 */
export function extractApiToken(req: NextRequest): string | null {
  // Try Authorization header first
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token.startsWith('bax_')) {
      return token;
    }
  }

  // Try X-API-Token header
  const apiTokenHeader = req.headers.get('x-api-token');
  if (apiTokenHeader && apiTokenHeader.startsWith('bax_')) {
    return apiTokenHeader;
  }

  return null;
}

// =====================================================
// TOKEN VALIDATION
// =====================================================

/**
 * Validate API token and check required scopes
 */
export async function validateApiToken(
  token: string,
  requiredScopes: string[] = []
): Promise<{ valid: boolean; data?: ApiTokenData; error?: string }> {
  try {
    // Get token from database
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('api_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      return { valid: false, error: 'Invalid token' };
    }

    // Check if token is active
    if (!tokenData.is_active) {
      return { valid: false, error: 'Token is inactive' };
    }

    // Check if token is expired
    if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
      return { valid: false, error: 'Token has expired' };
    }

    // Parse scopes (handle JSONB)
    const scopes: string[] = Array.isArray(tokenData.scopes) 
      ? tokenData.scopes 
      : [];

    // Check if token has required scopes
    const hasAdminScope = scopes.includes('admin');
    const hasRequiredScopes = requiredScopes.every(
      scope => scopes.includes(scope) || hasAdminScope
    );

    if (!hasRequiredScopes) {
      return { 
        valid: false, 
        error: `Insufficient permissions. Required: ${requiredScopes.join(', ')}` 
      };
    }

    // Check rate limit
    if (tokenData.rate_limit > 0) {
      const now = new Date();
      const resetTime = tokenData.requests_reset_at 
        ? new Date(tokenData.requests_reset_at) 
        : null;

      // Reset counter if hour has passed
      if (!resetTime || resetTime < now) {
        await supabaseAdmin
          .from('api_tokens')
          .update({
            requests_count: 1,
            requests_reset_at: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
            last_used_at: now.toISOString(),
            updated_at: now.toISOString(),
          })
          .eq('id', tokenData.id);
      } else if (tokenData.requests_count >= tokenData.rate_limit) {
        return { 
          valid: false, 
          error: `Rate limit exceeded. Resets at ${resetTime.toISOString()}` 
        };
      } else {
        // Increment counter
        await supabaseAdmin
          .from('api_tokens')
          .update({
            requests_count: tokenData.requests_count + 1,
            last_used_at: now.toISOString(),
            updated_at: now.toISOString(),
          })
          .eq('id', tokenData.id);
      }
    } else {
      // No rate limit, just update last_used_at
      await supabaseAdmin
        .from('api_tokens')
        .update({
          last_used_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', tokenData.id);
    }

    return {
      valid: true,
      data: {
        ...tokenData,
        scopes,
      },
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return { valid: false, error: 'Token validation failed' };
  }
}

// =====================================================
// MIDDLEWARE: Verify API Token
// =====================================================

/**
 * Middleware to verify API token authentication
 * Usage:
 * export const GET = verifyApiToken(['cms:read'])(async (req: ApiTokenRequest) => {
 *   // req.apiToken is available
 *   // req.tokenUserId is available
 * });
 */
export function verifyApiToken(requiredScopes: string[] = []) {
  return function (handler: (req: ApiTokenRequest) => Promise<NextResponse>) {
    return async (req: NextRequest): Promise<NextResponse> => {
      // Extract token
      const token = extractApiToken(req);

      if (!token) {
        return NextResponse.json(
          { error: 'Missing API token. Provide token in Authorization header or X-API-Token header.' },
          { status: 401 }
        );
      }

      // Validate token
      const { valid, data, error } = await validateApiToken(token, requiredScopes);

      if (!valid) {
        return NextResponse.json(
          { error: error || 'Unauthorized' },
          { status: 401 }
        );
      }

      // Attach token data to request
      const apiTokenReq = req as ApiTokenRequest;
      apiTokenReq.apiToken = data;
      apiTokenReq.tokenUserId = data?.user_id;

      // Log request (optional, can be disabled for performance)
      logApiTokenUsage(req, data!).catch(err => 
        console.error('Failed to log API token usage:', err)
      );

      // Call handler
      return handler(apiTokenReq);
    };
  };
}

// =====================================================
// LOGGING
// =====================================================

/**
 * Log API token usage
 */
async function logApiTokenUsage(
  req: NextRequest,
  tokenData: ApiTokenData
): Promise<void> {
  try {
    const url = new URL(req.url);
    const startTime = Date.now();

    await supabaseAdmin.from('api_token_logs').insert({
      token_id: tokenData.id,
      endpoint: url.pathname,
      method: req.method,
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
      user_agent: req.headers.get('user-agent') || 'unknown',
      response_time_ms: Date.now() - startTime,
    });
  } catch (error) {
    // Silently fail - don't block request if logging fails
    console.error('Failed to log API token usage:', error);
  }
}

// =====================================================
// HELPER: Generate API Token
// =====================================================

/**
 * Generate a new API token
 * Format: bax_live_<32 hex chars>
 */
export function generateApiToken(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(24));
  const hexString = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `bax_live_${hexString}`;
}

// =====================================================
// SCOPE DEFINITIONS
// =====================================================

export const API_SCOPES = {
  // Admin
  ADMIN: 'admin',

  // CMS
  CMS_READ: 'cms:read',
  CMS_WRITE: 'cms:write',
  CMS_DELETE: 'cms:delete',

  // Hotels
  HOTELS_READ: 'hotels:read',
  HOTELS_WRITE: 'hotels:write',
  HOTELS_DELETE: 'hotels:delete',

  // Bookings
  BOOKINGS_READ: 'bookings:read',
  BOOKINGS_WRITE: 'bookings:write',

  // Users
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',

  // Payments
  PAYMENTS_READ: 'payments:read',

  // Analytics
  ANALYTICS_READ: 'analytics:read',
} as const;

export type ApiScope = typeof API_SCOPES[keyof typeof API_SCOPES];
