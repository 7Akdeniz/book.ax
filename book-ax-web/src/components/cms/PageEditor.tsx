'use client';

// =====================================================
// CMS Page Editor - Create/Edit CMS Pages
// =====================================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/cms/RichTextEditor';
import toast from 'react-hot-toast';
import type { CMSPageWithTranslation, PageType, PageStatus } from '@/types/cms';

const PAGE_TYPES: PageType[] = ['page', 'blog', 'legal', 'seo', 'landing'];
const PAGE_STATUSES: PageStatus[] = ['draft', 'published', 'archived'];

interface PageEditorProps {
  pageId?: string;
  initialData?: CMSPageWithTranslation;
}

export default function PageEditor({ pageId, initialData }: PageEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Page Data
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [type, setType] = useState<PageType>(initialData?.type || 'page');
  const [status, setStatus] = useState<PageStatus>(initialData?.status || 'draft');

  // Current Language
  const [currentLanguage, setCurrentLanguage] = useState('de');

  // Translations Map
  const [translations, setTranslations] = useState<{
    [key: string]: {
      title: string;
      excerpt: string;
      content: string;
      meta_title: string;
      meta_description: string;
      meta_keywords: string;
    };
  }>({
    de: {
      title: '',
      excerpt: '',
      content: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
    },
  });

  // Load existing page
  useEffect(() => {
    if (pageId && !initialData) {
      loadPage();
    } else if (initialData) {
      loadFromInitialData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId, initialData]);

  const loadPage = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cms/pages/${pageId}`);
      if (!response.ok) throw new Error('Failed to load page');

      const data = await response.json();
      const page = data.page;

      setSlug(page.slug);
      setType(page.type);
      setStatus(page.status);

      // Load all translations
      const translationsMap: any = {};
      page.translations.forEach((t: any) => {
        translationsMap[t.language_code] = {
          title: t.title,
          excerpt: t.excerpt || '',
          content: t.content,
          meta_title: t.meta_title || '',
          meta_description: t.meta_description || '',
          meta_keywords: t.meta_keywords || '',
        };
      });
      setTranslations(translationsMap);
    } catch (error) {
      console.error('Error loading page:', error);
      toast.error('Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  const loadFromInitialData = () => {
    if (!initialData) return;

    const translationsMap: any = {};
    initialData.translations?.forEach((t) => {
      translationsMap[t.language_code] = {
        title: t.title,
        excerpt: t.excerpt || '',
        content: t.content,
        meta_title: t.meta_title || '',
        meta_description: t.meta_description || '',
        meta_keywords: t.meta_keywords || '',
      };
    });
    setTranslations(translationsMap);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Validate
      if (!slug) {
        toast.error('Slug is required');
        return;
      }

      const currentTranslation = translations[currentLanguage];
      if (!currentTranslation?.title || !currentTranslation?.content) {
        toast.error('Title and content are required for current language');
        return;
      }

      // Prepare translations array
      const translationsArray = Object.keys(translations)
        .filter((lang) => translations[lang].title && translations[lang].content)
        .map((lang) => ({
          language_code: lang,
          ...translations[lang],
        }));

      if (pageId) {
        // Update existing page
        const pageResponse = await fetch(`/api/cms/pages/${pageId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, type, status }),
        });

        if (!pageResponse.ok) throw new Error('Failed to update page');

        // Update translations individually
        for (const translation of translationsArray) {
          const translationResponse = await fetch(
            `/api/cms/pages/${pageId}/translations/${translation.language_code}`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(translation),
            }
          );

          if (!translationResponse.ok) {
            console.error('Failed to update translation:', translation.language_code);
          }
        }

        toast.success('Page updated successfully');
      } else {
        // Create new page
        const response = await fetch('/api/cms/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug,
            type,
            status,
            translations: translationsArray,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create page');
        }

        const data = await response.json();
        toast.success('Page created successfully');

        // Redirect to edit page
        router.push(`/admin/cms/pages/${data.page.id}`);
      }
    } catch (error: any) {
      console.error('Error saving page:', error);
      toast.error(error.message || 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setStatus('published');
    setTimeout(handleSave, 100);
  };

  const updateTranslation = (field: string, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [currentLanguage]: {
        ...prev[currentLanguage],
        [field]: value,
      },
    }));
  };

  const currentTranslation = translations[currentLanguage] || {
    title: '',
    excerpt: '',
    content: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  };

  if (loading) {
    return <div className="p-8 text-center">Loading page...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {pageId ? 'Edit Page' : 'Create New Page'}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Basic Settings */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Basic Settings</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="my-page-url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PageType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {PAGE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PageStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {PAGE_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {['de', 'en', 'fr', 'es', 'it', 'tr'].map((lang) => (
            <button
              key={lang}
              onClick={() => setCurrentLanguage(lang)}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentLanguage === lang
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {lang.toUpperCase()}
              {translations[lang]?.title && (
                <span className="ml-2 text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Editor */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Content ({currentLanguage.toUpperCase()})
        </h2>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={currentTranslation.title}
            onChange={(e) => updateTranslation('title', e.target.value)}
            placeholder="Page title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Excerpt */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt
          </label>
          <textarea
            value={currentTranslation.excerpt}
            onChange={(e) => updateTranslation('excerpt', e.target.value)}
            placeholder="Short description..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Content */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <RichTextEditor
            content={currentTranslation.content}
            onChange={(html) => updateTranslation('content', html)}
            placeholder="Start writing your content..."
            minHeight="400px"
          />
        </div>
      </div>

      {/* SEO Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">SEO Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title
            </label>
            <input
              type="text"
              value={currentTranslation.meta_title}
              onChange={(e) => updateTranslation('meta_title', e.target.value)}
              placeholder="SEO title (defaults to page title)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              value={currentTranslation.meta_description}
              onChange={(e) =>
                updateTranslation('meta_description', e.target.value)
              }
              placeholder="SEO description (max 160 characters)"
              rows={3}
              maxLength={160}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              {currentTranslation.meta_description.length} / 160 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Keywords
            </label>
            <input
              type="text"
              value={currentTranslation.meta_keywords}
              onChange={(e) =>
                updateTranslation('meta_keywords', e.target.value)
              }
              placeholder="keyword1, keyword2, keyword3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
