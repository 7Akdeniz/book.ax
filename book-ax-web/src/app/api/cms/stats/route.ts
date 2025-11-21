export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, type AuthenticatedRequest } from '@/lib/auth/middleware';
import { supabaseAdmin } from '@/lib/db/supabase';
import { handleApiError } from '@/utils/errors';

async function countPages(filter?: (query: any) => any) {
  let query = supabaseAdmin.from('cms_pages').select('id', { count: 'exact', head: true });
  if (filter) {
    query = filter(query);
  }
  const { count, error } = await query;
  if (error) throw error;
  return count || 0;
}

export async function GET(req: NextRequest) {
  return requireAdmin(async () => {
    try {
      const [
        totalPages,
        publishedPages,
        draftPages,
        archivedPages,
        blogPages,
        legalPages,
        mediaFiles,
      ] = await Promise.all([
        countPages(),
        countPages((q) => q.eq('status', 'published')),
        countPages((q) => q.eq('status', 'draft')),
        countPages((q) => q.eq('status', 'archived')),
        countPages((q) => q.eq('type', 'blog')),
        countPages((q) => q.eq('type', 'legal')),
        (async () => {
          const { count, error } = await supabaseAdmin
            .from('cms_images')
            .select('id', { count: 'exact', head: true });
          if (error) throw error;
          return count || 0;
        })(),
      ]);

      return NextResponse.json({
        stats: {
          totalPages,
          publishedPages,
          draftPages,
          archivedPages,
          blogPages,
          legalPages,
          mediaFiles,
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      const { error: message, status } = handleApiError(error);
      return NextResponse.json({ error: message }, { status });
    }
  })(req as AuthenticatedRequest);
}
