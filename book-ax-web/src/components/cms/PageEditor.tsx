'use client';

// =====================================================
// CMS Page Editor - Create/Edit CMS Pages
// =====================================================

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/cms/RichTextEditor';
import toast from 'react-hot-toast';
import type { CMSPageWithTranslation, PageType, PageStatus } from '@/types/cms';
import { locales, languageNames } from '@/i18n/config';

const PAGE_TYPES: PageType[] = ['page', 'blog', 'legal', 'seo', 'landing'];
const PAGE_STATUSES: PageStatus[] = ['draft', 'published', 'archived'];

type TranslationState = {
  title: string;
  excerpt: string;
  content: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
};

const createEmptyTranslation = (): TranslationState => ({
  title: '',
  excerpt: '',
  content: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
});

const DEFAULT_LANGUAGE = locales[0] ?? 'en';

const getLanguageLabel = (languageCode: string) =>
  languageNames[languageCode as keyof typeof languageNames] || languageCode.toUpperCase();

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

  const initialLanguage = initialData?.translations?.[0]?.language_code || DEFAULT_LANGUAGE;

  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);
  const [activeLanguages, setActiveLanguages] = useState<string[]>(() => {
    if (initialData?.translations?.length) {
      const langs = Array.from(new Set(initialData.translations.map((t) => t.language_code)));
      return langs.length ? langs : [initialLanguage];
    }
    return [initialLanguage];
  });

  const [translations, setTranslations] = useState<Record<string, TranslationState>>(() => {
    if (initialData?.translations?.length) {
      return initialData.translations.reduce((acc, translation) => {
        acc[translation.language_code] = {
          title: translation.title,
          excerpt: translation.excerpt || '',
          content: translation.content,
          meta_title: translation.meta_title || '',
          meta_description: translation.meta_description || '',
          meta_keywords: translation.meta_keywords || '',
        };
        return acc;
      }, {} as Record<string, TranslationState>);
    }
    return { [initialLanguage]: createEmptyTranslation() };
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

  const inactiveLanguages = useMemo(
    () => locales.filter((lang) => !activeLanguages.includes(lang)),
    [activeLanguages]
  );

  const upsertTranslationState = (language: string, translation?: TranslationState) => {
    setTranslations((prev) => ({
      ...prev,
      [language]: translation || prev[language] || createEmptyTranslation(),
    }));
  };

  const syncFromPage = (page: CMSPageWithTranslation) => {
    setSlug(page.slug);
    setType(page.type);
    setStatus(page.status);

    const langs = page.translations?.map((t) => t.language_code) || [DEFAULT_LANGUAGE];
    const uniqueLanguages = Array.from(new Set(langs.length ? langs : [DEFAULT_LANGUAGE]));
    setActiveLanguages(uniqueLanguages);
    setCurrentLanguage((prev) => (uniqueLanguages.includes(prev) ? prev : uniqueLanguages[0]));

    const map = uniqueLanguages.reduce((acc, lang) => {
      const translation = page.translations?.find((t) => t.language_code === lang);
      acc[lang] = translation
        ? {
            title: translation.title,
            excerpt: translation.excerpt || '',
            content: translation.content,
            meta_title: translation.meta_title || '',
            meta_description: translation.meta_description || '',
            meta_keywords: translation.meta_keywords || '',
          }
        : createEmptyTranslation();
      return acc;
    }, {} as Record<string, TranslationState>);

    setTranslations(map);
  };

  const loadPage = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cms/pages/${pageId}`);
      if (!response.ok) throw new Error('Failed to load page');

      const data = await response.json();
      const page = data.page as CMSPageWithTranslation;
      syncFromPage(page);
    } catch (error) {
      console.error('Error loading page:', error);
      toast.error('Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  const loadFromInitialData = () => {
    if (!initialData) return;
    syncFromPage(initialData);
  };

  const handleSave = async (nextStatus?: PageStatus) => {
    try {
      setSaving(true);
      const targetStatus = nextStatus || status;
      if (nextStatus && nextStatus !== status) {
        setStatus(nextStatus);
      }

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
      const translationsArray = activeLanguages
        .map((lang) => ({
          language_code: lang,
          ...(translations[lang] || createEmptyTranslation()),
        }))
        .filter(
          (translation) => translation?.title?.trim() && translation?.content?.trim()
        );

      if (pageId) {
        // Update existing page
        const pageResponse = await fetch(`/api/cms/pages/${pageId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, type, status: targetStatus }),
        });

        if (!pageResponse.ok) throw new Error('Failed to update page');

        await Promise.all(
          translationsArray.map((translation) =>
            fetch(`/api/cms/pages/${pageId}/translations/${translation.language_code}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(translation),
            }).then((response) => {
              if (!response.ok) {
                console.error('Failed to sync translation', translation.language_code);
              }
            })
          )
        );

        toast.success('Page updated successfully');
      } else {
        // Create new page
        const response = await fetch('/api/cms/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug,
            type,
            status: targetStatus,
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
    await handleSave('published');
  };

  const updateTranslation = (field: string, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [currentLanguage]: {
        ...(prev[currentLanguage] || createEmptyTranslation()),
        [field]: value,
      },
    }));
  };

  const currentTranslation = translations[currentLanguage] || createEmptyTranslation();

  const handleAddLanguage = (language: string) => {
    if (!language) return;
    setActiveLanguages((prev) => (prev.includes(language) ? prev : [...prev, language]));
    upsertTranslationState(language);
    setCurrentLanguage(language);
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
            onClick={() => handleSave()}
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
        <div className="flex gap-2 flex-wrap items-center">
          {activeLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => setCurrentLanguage(lang)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                currentLanguage === lang
                  ? 'bg-primary-600 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getLanguageLabel(lang)}
              {translations[lang]?.title && (
                <span className="ml-2 text-xs">✓</span>
              )}
            </button>
          ))}
          {inactiveLanguages.length > 0 && (
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              value=""
              onChange={(e) => handleAddLanguage(e.target.value)}
            >
              <option value="" disabled>
                + Add language
              </option>
              {inactiveLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {getLanguageLabel(lang)}
                </option>
              ))}
            </select>
          )}
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
