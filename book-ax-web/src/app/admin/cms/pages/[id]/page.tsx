import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import PageEditor from '@/components/cms/PageEditor';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { supabaseAdmin } from '@/lib/db/supabase';
import type { CMSPageWithTranslation } from '@/types/cms';

interface EditPageProps {
  params: {
    id: string;
  };
}

export default async function EditCMSPage({ params }: EditPageProps) {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    redirect('/login');
  }

  const decoded = verifyAccessToken(token);
  if (!decoded || decoded.role !== 'admin') {
    redirect('/');
  }

  const { data: page, error } = await supabaseAdmin
    .from('cms_pages')
    .select(`
      *,
      translations:cms_page_translations(*),
      featured_image:cms_images!featured_image_id(*)
    `)
    .eq('id', params.id)
    .single();

  if (error || !page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageEditor pageId={params.id} initialData={page as CMSPageWithTranslation} />
    </div>
  );
}
