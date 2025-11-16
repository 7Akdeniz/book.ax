// =====================================================
// API: Manage Single API Token
// GET /api/admin/api-tokens/[id] - Get token details
// PUT /api/admin/api-tokens/[id] - Update token
// DELETE /api/admin/api-tokens/[id] - Delete token
// =====================================================


// =====================================================
// GET - Get Token Details
// =====================================================
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, type AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';
import { API_SCOPES } from '@/lib/auth/api-token';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAdmin(async (authReq: AuthenticatedRequest) => {
    try {
      const { id } = params;

      const { data: token, error } = await supabaseAdmin
        .from('api_tokens')
        .select(`
          *,
          user:users!user_id(id, email, role)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!token) {
        return NextResponse.json({ error: 'Token not found' }, { status: 404 });
      }

      // Get usage stats
      const { data: logs, error: logsError } = await supabaseAdmin
        .from('api_token_logs')
        .select('*')
        .eq('token_id', id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (logsError) console.error('Failed to fetch logs:', logsError);

      return NextResponse.json({
        token: {
          ...token,
          // Never expose the actual token value after creation
          token: token.token.substring(0, 15) + '...' + token.token.substring(token.token.length - 4),
        },
        recent_usage: logs || [],
      });
    } catch (error) {
      const { error: message, status } = handleApiError(error);
      return NextResponse.json({ error: message }, { status });
    }
  })(req as AuthenticatedRequest);
}

// =====================================================
// PUT - Update Token
// =====================================================
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAdmin(async (authReq: AuthenticatedRequest) => {
    try {
      const { id } = params;
      const body = await authReq.json();

      // Validate scopes if provided
      if (body.scopes) {
        const validScopes = Object.values(API_SCOPES);
        const invalidScopes = body.scopes.filter((s: string) => !validScopes.includes(s as any));
        
        if (invalidScopes.length > 0) {
          return NextResponse.json(
            { 
              error: `Invalid scopes: ${invalidScopes.join(', ')}`,
              valid_scopes: validScopes 
            },
            { status: 400 }
          );
        }
      }

      // Prepare updates
      const updates: any = {
        updated_at: new Date().toISOString(),
      };

      if (body.name !== undefined) updates.name = body.name;
      if (body.description !== undefined) updates.description = body.description;
      if (body.scopes !== undefined) updates.scopes = body.scopes;
      if (body.is_active !== undefined) updates.is_active = body.is_active;
      if (body.rate_limit !== undefined) updates.rate_limit = body.rate_limit;
      if (body.allowed_ips !== undefined) updates.allowed_ips = body.allowed_ips;
      
      if (body.expires_at !== undefined) {
        updates.expires_at = body.expires_at ? new Date(body.expires_at).toISOString() : null;
      }

      // Update token
      const { data: token, error } = await supabaseAdmin
        .from('api_tokens')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          user:users!user_id(id, email, role)
        `)
        .single();

      if (error) throw error;

      return NextResponse.json({
        token,
        message: 'Token updated successfully',
      });
    } catch (error) {
      const { error: message, status } = handleApiError(error);
      return NextResponse.json({ error: message }, { status });
    }
  })(req as AuthenticatedRequest);
}

// =====================================================
// DELETE - Delete Token
// =====================================================
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAdmin(async (authReq: AuthenticatedRequest) => {
    try {
      const { id } = params;

      const { error } = await supabaseAdmin
        .from('api_tokens')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return NextResponse.json({
        message: 'Token deleted successfully',
      });
    } catch (error) {
      const { error: message, status } = handleApiError(error);
      return NextResponse.json({ error: message }, { status });
    }
  })(req as AuthenticatedRequest);
}
