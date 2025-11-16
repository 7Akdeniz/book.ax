// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// =====================================================
// API: GET /api/cms/pages/[id] - Get page by ID
// API: PUT /api/cms/pages/[id] - Update page
// API: DELETE /api/cms/pages/[id] - Delete page
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, requireAdmin, type AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';
import type { UpdatePageRequest } from '@/types/cms';

// =====================================================
// GET - Get Single Page with Translations
// =====================================================
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const language = searchParams.get('language');

    // Get page
    const { data: page, error: pageError } = await supabaseAdmin
      .from('cms_pages')
      .select(`
        *,
        featured_image:cms_images!featured_image_id(*),
        category:cms_categories!category_id(
          *,
          translations:cms_category_translations(*)
        ),
        author:users!author_id(email)
      `)
      .eq('id', id)
      .single();

    if (pageError) throw pageError;
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Get translations
    let translationsQuery = supabaseAdmin
      .from('cms_page_translations')
      .select('*')
      .eq('page_id', id);

    if (language) {
      translationsQuery = translationsQuery.eq('language_code', language);
    }

    const { data: translations, error: translationsError } = await translationsQuery;

    if (translationsError) throw translationsError;

    // Get content blocks
    let blocksQuery = supabaseAdmin
      .from('cms_content_blocks')
      .select('*')
      .eq('page_id', id)
      .order('sort_order', { ascending: true });

    if (language) {
      blocksQuery = blocksQuery.eq('language_code', language);
    }

    const { data: blocks, error: blocksError } = await blocksQuery;

    if (blocksError) throw blocksError;

    return NextResponse.json({
      page: {
        ...page,
        translations: translations || [],
        blocks: blocks || [],
      },
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
}

// =====================================================
// PUT - Update Page
// =====================================================
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAdmin(async (authReq: AuthenticatedRequest) => {
    try {
      const { id } = params;
      const body: UpdatePageRequest = await authReq.json();

      // Check if page exists
      const { data: existingPage, error: checkError } = await supabaseAdmin
        .from('cms_pages')
        .select('id, status')
        .eq('id', id)
        .single();

      if (checkError || !existingPage) {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 });
      }

      // If status changed to published, set published_at
      const updates: any = { ...body };
      if (body.status === 'published' && existingPage.status !== 'published') {
        updates.published_at = new Date().toISOString();
      }

      // Update page
      const { data: page, error: updateError } = await supabaseAdmin
        .from('cms_pages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      return NextResponse.json({
        page,
        message: 'Page updated successfully',
      });
    } catch (error) {
      const { error: message, status } = handleApiError(error);
      return NextResponse.json({ error: message }, { status });
    }
  })(req as AuthenticatedRequest);
}

// =====================================================
// DELETE - Delete Page
// =====================================================
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAdmin(async (authReq: AuthenticatedRequest) => {
    try {
      const { id } = params;

      // Delete page (cascades to translations and blocks)
      const { error: deleteError } = await supabaseAdmin
        .from('cms_pages')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      return NextResponse.json({
        message: 'Page deleted successfully',
      });
    } catch (error) {
      const { error: message, status } = handleApiError(error);
      return NextResponse.json({ error: message }, { status });
    }
  })(req as AuthenticatedRequest);
}
