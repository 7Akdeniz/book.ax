// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// =====================================================
// API: CMS API with Hybrid Auth (JWT + API Token)
// GET /api/v1/cms/pages - List pages (public)
// POST /api/v1/cms/pages - Create page (auth required)
// GET /api/v1/cms/pages/[id] - Get page (public)
// PUT /api/v1/cms/pages/[id] - Update page (auth required)
// DELETE /api/v1/cms/pages/[id] - Delete page (auth required)
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyJwtOrApiToken, type HybridAuthRequest } from '@/lib/auth/hybrid-auth';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';
import type { CMSPageWithTranslation, CreatePageRequest, ListPagesRequest } from '@/types/cms';

// =====================================================
// GET - List Pages (Public - No Auth Required)
// =====================================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const filters: ListPagesRequest = {
      type: searchParams.get('type') as any || undefined,
      status: searchParams.get('status') as any || undefined,
      category_id: searchParams.get('category_id') || undefined,
      language_code: searchParams.get('language_code') || 'en',
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(parseInt(searchParams.get('limit') || '20'), 100),
      sort: searchParams.get('sort') as any || 'updated_at',
      order: searchParams.get('order') as any || 'desc',
    };

    // Base query
    let query = supabaseAdmin
      .from('cms_pages')
      .select(`
        *,
        featured_image:cms_images!featured_image_id(*),
        category:cms_categories!category_id(
          *,
          translations:cms_category_translations(*)
        )
      `, { count: 'exact' });

    // Apply filters
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    } else {
      // Default: only published for public API
      query = query.eq('status', 'published');
    }
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    // Sorting
    const sortColumn = filters.sort || 'updated_at';
    const sortOrder = filters.order === 'asc' ? { ascending: true } : { ascending: false };
    query = query.order(sortColumn, sortOrder);

    // Pagination
    const from = (filters.page! - 1) * filters.limit!;
    const to = from + filters.limit! - 1;
    query = query.range(from, to);

    const { data: pages, error, count } = await query;

    if (error) throw error;

    // Fetch translations for each page
    const pageIds = pages?.map(p => p.id) || [];
    const { data: translations } = await supabaseAdmin
      .from('cms_page_translations')
      .select('*')
      .in('page_id', pageIds);

    // Merge translations
    const pagesWithTranslations: CMSPageWithTranslation[] = (pages || []).map(page => ({
      ...page,
      translations: translations?.filter(t => t.page_id === page.id) || [],
      translation: filters.language_code
        ? translations?.find(t => t.page_id === page.id && t.language_code === filters.language_code)
        : translations?.find(t => t.page_id === page.id), // First available
    }));

    // Search filter (client-side for simplicity)
    let filteredPages = pagesWithTranslations;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredPages = pagesWithTranslations.filter(page => 
        page.slug.toLowerCase().includes(searchLower) ||
        page.translation?.title?.toLowerCase().includes(searchLower) ||
        page.translation?.content?.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        pages: filteredPages,
        total: count || 0,
        page: filters.page!,
        limit: filters.limit!,
        total_pages: Math.ceil((count || 0) / filters.limit!),
      },
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

// =====================================================
// POST - Create New Page (Auth Required)
// =====================================================
export const POST = verifyJwtOrApiToken(['cms:write'])(async (req: HybridAuthRequest) => {
  try {
    const body: CreatePageRequest = await req.json();

    // Validate required fields
    if (!body.slug || !body.type || !body.translations || body.translations.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields: slug, type, translations' 
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existingPage } = await supabaseAdmin
      .from('cms_pages')
      .select('id')
      .eq('slug', body.slug)
      .single();

    if (existingPage) {
      return NextResponse.json(
        { success: false, error: 'Page with this slug already exists' },
        { status: 409 }
      );
    }

    // Get user ID
    const authorId = req.authType === 'jwt' ? req.user?.userId : req.tokenUserId;

    // Create page
    const { data: page, error: pageError } = await supabaseAdmin
      .from('cms_pages')
      .insert({
        slug: body.slug,
        type: body.type,
        category_id: body.category_id || null,
        author_id: authorId || null,
        status: body.status || 'draft',
        featured_image_id: body.featured_image_id || null,
        published_at: body.status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (pageError) throw pageError;

    // Create translations
    const translationsToInsert = body.translations.map(t => ({
      page_id: page.id,
      language_code: t.language_code,
      title: t.title,
      excerpt: t.excerpt || null,
      content: t.content,
      meta_title: t.meta_title || t.title,
      meta_description: t.meta_description || t.excerpt || null,
      meta_keywords: t.meta_keywords || null,
    }));

    const { data: translations, error: translationsError } = await supabaseAdmin
      .from('cms_page_translations')
      .insert(translationsToInsert)
      .select();

    if (translationsError) throw translationsError;

    return NextResponse.json({
      success: true,
      data: {
        page: {
          ...page,
          translations,
        },
      },
      message: 'Page created successfully',
    }, { status: 201 });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ success: false, error: message }, { status });
  }
});
