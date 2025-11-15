import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/db/supabase';
import type { CMSPageWithTranslation } from '@/types/cms';
import type { Metadata } from 'next';

interface PageProps {
  params: {
    locale: string;
    slug: string[];
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = params;
  const slugString = slug.join('/');

  // Get page
  const { data: page } = await supabaseAdmin
    .from('cms_pages')
    .select(`
      *,
      translations:cms_page_translations!inner(*)
    `)
    .eq('slug', slugString)
    .eq('status', 'published')
    .eq('translations.language_code', locale)
    .single();

  if (!page || !page.translations || page.translations.length === 0) {
    return {
      title: 'Page Not Found',
    };
  }

  const translation = page.translations[0];

  return {
    title: translation.meta_title || translation.title,
    description: translation.meta_description || translation.excerpt || '',
    keywords: translation.meta_keywords || undefined,
    robots: page.meta_robots || 'index, follow',
    alternates: {
      canonical: page.canonical_url || `https://book.ax/${locale}/${slugString}`,
    },
    openGraph: {
      title: translation.meta_title || translation.title,
      description: translation.meta_description || translation.excerpt || '',
      url: `https://book.ax/${locale}/${slugString}`,
      type: page.type === 'blog' ? 'article' : 'website',
    },
  };
}

export default async function CMSPage({ params }: PageProps) {
  const { locale, slug } = params;
  const slugString = slug.join('/');

  // Get page with translation
  const { data: page, error } = await supabaseAdmin
    .from('cms_pages')
    .select(`
      *,
      translations:cms_page_translations!inner(*),
      featured_image:cms_images!featured_image_id(*),
      author:users!author_id(email)
    `)
    .eq('slug', slugString)
    .eq('status', 'published')
    .eq('translations.language_code', locale)
    .single();

  if (error || !page || !page.translations || page.translations.length === 0) {
    notFound();
  }

  const translation = page.translations[0];

  // Increment view count (fire and forget)
  supabaseAdmin
    .from('cms_pages')
    .update({ view_count: (page.view_count || 0) + 1 })
    .eq('id', page.id)
    .then(() => {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumbs */}
          <nav className="text-sm mb-4">
            <a href={`/${locale}`} className="text-gray-500 hover:text-gray-700">
              Home
            </a>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">{translation.title}</span>
          </nav>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {translation.title}
          </h1>

          {/* Excerpt */}
          {translation.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed">
              {translation.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 mt-6 text-sm text-gray-500">
            {page.type && (
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
                {page.type}
              </span>
            )}
            {page.published_at && (
              <span>
                {new Date(page.published_at).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
            {page.view_count > 0 && (
              <span>{page.view_count.toLocaleString()} views</span>
            )}
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {page.featured_image && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <img
            src={page.featured_image.cdn_url || page.featured_image.storage_path}
            alt={page.featured_image.alt_text || translation.title}
            className="w-full h-auto rounded-lg shadow-lg"
          />
          {page.featured_image.caption && (
            <p className="text-sm text-gray-500 text-center mt-2">
              {page.featured_image.caption}
            </p>
          )}
        </div>
      )}

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: translation.content }}
        />
      </article>

      {/* Related Links */}
      {page.type === 'legal' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Legal Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href={`/${locale}/impressum`}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Impressum</h3>
              <p className="text-sm text-gray-600">Legal Notice</p>
            </a>
            <a
              href={`/${locale}/datenschutz`}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 mb-1">
                Datenschutz
              </h3>
              <p className="text-sm text-gray-600">Privacy Policy</p>
            </a>
            <a
              href={`/${locale}/agb`}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-900 mb-1">AGB</h3>
              <p className="text-sm text-gray-600">Terms & Conditions</p>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// Generate static params for all published pages
export async function generateStaticParams() {
  const { data: pages } = await supabaseAdmin
    .from('cms_pages')
    .select('slug')
    .eq('status', 'published');

  if (!pages) return [];

  // Return all slug combinations with locales
  const locales = ['de', 'en', 'fr', 'es', 'it', 'tr'];
  const params: { locale: string; slug: string[] }[] = [];

  pages.forEach((page) => {
    const slugParts = page.slug.split('/');
    locales.forEach((locale) => {
      params.push({
        locale,
        slug: slugParts,
      });
    });
  });

  return params;
}
