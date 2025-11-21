// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// =====================================================
// API: GET /api/cms/pages - List all pages
// API: POST /api/cms/pages - Create new page
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, requireAdmin, type AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';
import type { CMSPageWithTranslation, CreatePageRequest, ListPagesRequest } from '@/types/cms';

// =====================================================
// GET - List Pages with Filters
// =====================================================
export const GET = verifyAuth(async (req: AuthenticatedRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const filters: ListPagesRequest = {
      type: searchParams.get('type') as any || undefined,
      status: searchParams.get('status') as any || undefined,
      category_id: searchParams.get('category_id') || undefined,
      language_code: searchParams.get('language_code') || undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(parseInt(searchParams.get('limit') || '20'), 100),
      sort: searchParams.get('sort') as any || 'updated_at',
      order: searchParams.get('order') as any || 'desc',
    };

    const languageCode = filters.language_code || 'en';

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
    }
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    // Search by slug/title
    if (filters.search?.trim()) {
      const normalizedSearch = filters.search.trim();
      const searchValue = `%${normalizedSearch.replace(/[%_]/g, '\\$&')}%`;
      const [slugMatches, translationMatches] = await Promise.all([
        supabaseAdmin
          .from('cms_pages')
          .select('id')
          .ilike('slug', searchValue),
        supabaseAdmin
          .from('cms_page_translations')
          .select('page_id')
          .ilike('title', searchValue),
      ]);

      if (slugMatches.error) throw slugMatches.error;
      if (translationMatches.error) throw translationMatches.error;

      const searchIds = new Set<string>();
      slugMatches.data?.forEach((row) => row.id && searchIds.add(row.id));
      translationMatches.data?.forEach((row) => row.page_id && searchIds.add(row.page_id));

      if (searchIds.size === 0) {
        return NextResponse.json({
          pages: [],
          total: 0,
          page: filters.page!,
          limit: filters.limit!,
          total_pages: 0,
        });
      }

      query = query.in('id', Array.from(searchIds));
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
      translation: translations?.find(
        t => t.page_id === page.id && t.language_code === languageCode
      ) || translations?.find(t => t.page_id === page.id),
    }));

    return NextResponse.json({
      pages: pagesWithTranslations,
      total: count || 0,
      page: filters.page!,
      limit: filters.limit!,
      total_pages: filters.limit ? Math.ceil((count || 0) / filters.limit) : 0,
    });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
});

// =====================================================
// POST - Create New Page
// =====================================================
export const POST = requireAdmin(async (req: AuthenticatedRequest) => {
  try {
    const body: CreatePageRequest = await req.json();

    // Validate required fields
    if (!body.slug || !body.type || !body.translations || body.translations.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, type, translations' },
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
        { error: 'Page with this slug already exists' },
        { status: 409 }
      );
    }

    // Create page
    const { data: page, error: pageError } = await supabaseAdmin
      .from('cms_pages')
      .insert({
        slug: body.slug,
        type: body.type,
        category_id: body.category_id || null,
        author_id: req.user?.userId || null,
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
      page: {
        ...page,
        translations,
      },
      message: 'Page created successfully',
    }, { status: 201 });
  } catch (error) {
    const { error: message, status } = handleApiError(error);
    return NextResponse.json({ error: message }, { status });
  }
});
