// =====================================================
// API: Manage API Tokens
// GET /api/admin/api-tokens - List all tokens
// POST /api/admin/api-tokens - Create new token
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, type AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';
import { generateApiToken, API_SCOPES } from '@/lib/auth/api-token';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// =====================================================
// GET - List All API Tokens
// =====================================================
export const GET = requireAdmin(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const isActive = searchParams.get('is_active');

    let query = supabaseAdmin
      .from('api_tokens')
      .select(`
        *,
        user:users!user_id(id, email, role)
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data: tokens, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      tokens: tokens || [],
      total: tokens?.length || 0,
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
});

// =====================================================
// POST - Create New API Token
// =====================================================
export const POST = requireAdmin(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.name || !body.scopes || !Array.isArray(body.scopes)) {
      return NextResponse.json(
        { error: 'Missing required fields: name, scopes (array)' },
        { status: 400 }
      );
    }

    // Validate scopes
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

    // Generate token
    const token = generateApiToken();

    // Parse expires_at
    let expiresAt = null;
    if (body.expires_at) {
      expiresAt = new Date(body.expires_at).toISOString();
    } else if (body.expires_in_days) {
      const daysFromNow = new Date();
      daysFromNow.setDate(daysFromNow.getDate() + parseInt(body.expires_in_days));
      expiresAt = daysFromNow.toISOString();
    }

    // Create token
    const { data: newToken, error } = await supabaseAdmin
      .from('api_tokens')
      .insert({
        token,
        name: body.name,
        description: body.description || null,
        user_id: body.user_id || req.user?.userId,
        scopes: body.scopes,
        is_active: body.is_active !== false, // Default true
        expires_at: expiresAt,
        rate_limit: body.rate_limit || 1000,
        allowed_ips: body.allowed_ips || [],
      })
      .select(`
        *,
        user:users!user_id(id, email, role)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json({
      token: newToken,
      message: 'API token created successfully',
      warning: 'Save this token securely. It will not be shown again.',
    }, { status: 201 });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
});
