// =====================================================
// API: Single CMS Page with Hybrid Auth
// GET /api/v1/cms/pages/[id] - Get page (public)
// PUT /api/v1/cms/pages/[id] - Update page (auth required)
// DELETE /api/v1/cms/pages/[id] - Delete page (auth required)
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtOrApiToken, type HybridAuthRequest } from '@/lib/auth/hybrid-auth';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';
import type { UpdatePageRequest } from '@/types/cms';

// =====================================================
// GET - Get Single Page (Public)
// =====================================================
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const language = searchParams.get('language') || 'en';

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
      return NextResponse.json({ 
        success: false,
        error: 'Page not found' 
      }, { status: 404 });
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
      success: true,
      data: {
        page: {
          ...page,
          translations: translations || [],
          blocks: blocks || [],
        },
      },
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

// =====================================================
// PUT - Update Page (Auth Required)
// =====================================================
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return verifyJwtOrApiToken(['cms:write'])(async (authReq: HybridAuthRequest) => {
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
      return NextResponse.json({ 
        success: false,
        error: 'Page not found' 
      }, { status: 404 });
    }

    // If status changed to published, set published_at
    const updates: any = { ...body };
    if (body.status === 'published' && existingPage.status !== 'published') {
      updates.published_at = new Date().toISOString();
    }
    updates.updated_at = new Date().toISOString();

    // Update page
    const { data: page, error: updateError } = await supabaseAdmin
      .from('cms_pages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      data: { page },
      message: 'Page updated successfully',
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ success: false, error: message }, { status });
  }
  })(req as HybridAuthRequest);
}

// =====================================================
// DELETE - Delete Page (Auth Required)
// =====================================================
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return verifyJwtOrApiToken(['cms:delete'])(async (authReq: HybridAuthRequest) => {
    try {
      const { id } = params;

    // Check if page exists
    const { data: existingPage, error: checkError } = await supabaseAdmin
      .from('cms_pages')
      .select('id, slug')
      .eq('id', id)
      .single();

    if (checkError || !existingPage) {
      return NextResponse.json({ 
        success: false,
        error: 'Page not found' 
      }, { status: 404 });
    }

    // Delete page (cascades to translations and blocks)
    const { error: deleteError } = await supabaseAdmin
      .from('cms_pages')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    return NextResponse.json({
      success: true,
      message: 'Page deleted successfully',
      data: {
        deleted_page_id: id,
        deleted_page_slug: existingPage.slug,
      },
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ success: false, error: message }, { status });
  }
  })(req as HybridAuthRequest);
}
