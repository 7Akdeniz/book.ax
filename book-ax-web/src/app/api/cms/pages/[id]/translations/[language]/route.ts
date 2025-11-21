export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, type AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';
import type { UpdatePageTranslationRequest } from '@/types/cms';

const notFound = () =>
  NextResponse.json({ error: 'Translation not found' }, { status: 404 });

function isRowNotFound(error: any) {
  return error?.code === 'PGRST116' || error?.message?.includes('No rows found');
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; language: string } }
) {
  return requireAdmin(async () => {
    try {
      const { id, language } = params;
      const { data, error } = await supabaseAdmin
        .from('cms_page_translations')
        .select('*')
        .eq('page_id', id)
        .eq('language_code', language)
        .single();

      if (error) {
        if (isRowNotFound(error)) return notFound();
        throw error;
      }

      return NextResponse.json({ translation: data });
    } catch (error) {
      const { error: message, status } = handleApiError(error);
      return NextResponse.json({ error: message }, { status });
    }
  })(req as AuthenticatedRequest);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; language: string } }
) {
  return requireAdmin(async (authReq: AuthenticatedRequest) => {
    try {
      const { id, language } = params;
      const body: UpdatePageTranslationRequest = await authReq.json();

      if (!body.title || !body.content) {
        return NextResponse.json(
          { error: 'Title and content are required for translations' },
          { status: 400 }
        );
      }

      const basePayload = {
        title: body.title,
        excerpt: body.excerpt || null,
        content: body.content,
        meta_title: body.meta_title || body.title,
        meta_description: body.meta_description || body.excerpt || null,
        meta_keywords: body.meta_keywords || null,
        updated_at: new Date().toISOString(),
      };

      const { data: existingRows, error: existingError } = await supabaseAdmin
        .from('cms_page_translations')
        .select('id')
        .eq('page_id', id)
        .eq('language_code', language)
        .limit(1);

      if (existingError) throw existingError;
      const existing = existingRows?.[0];

      let translation;
      if (existing) {
        const { data, error } = await supabaseAdmin
          .from('cms_page_translations')
          .update(basePayload)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        translation = data;
      } else {
        const { data, error } = await supabaseAdmin
          .from('cms_page_translations')
          .insert({
            page_id: id,
            language_code: language,
            ...basePayload,
          })
          .select()
          .single();

        if (error) throw error;
        translation = data;
      }

      return NextResponse.json({ translation, message: 'Translation saved' });
    } catch (error) {
      const { error: message, status } = handleApiError(error);
      return NextResponse.json({ error: message }, { status });
    }
  })(req as AuthenticatedRequest);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; language: string } }
) {
  return requireAdmin(async () => {
    try {
      const { id, language } = params;
      const { error } = await supabaseAdmin
        .from('cms_page_translations')
        .delete()
        .eq('page_id', id)
        .eq('language_code', language);

      if (error) throw error;

      return NextResponse.json({ message: 'Translation removed' });
    } catch (error) {
      const { error: message, status } = handleApiError(error);
      return NextResponse.json({ error: message }, { status });
    }
  })(req as AuthenticatedRequest);
}
