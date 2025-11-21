'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authenticatedFetch, isAuthenticated, getUser } from '@/lib/auth/client';
import type { CMSPageWithTranslation, PageStatus, PageType } from '@/types/cms';
import { defaultLocale } from '@/i18n/config';

interface CMSStats {
  totalPages: number;
  publishedPages: number;
  draftPages: number;
  archivedPages: number;
  blogPages: number;
  legalPages: number;
  mediaFiles: number;
  updatedAt: string;
}

const PAGE_SIZE = 10;
const PAGE_TYPES: PageType[] = ['page', 'blog', 'legal', 'seo', 'landing'];
const PAGE_STATUSES: PageStatus[] = ['draft', 'published', 'archived'];

const statusClasses: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-gray-200 text-gray-700',
};

export default function CMSPagesListPage() {
  const router = useRouter();
  const [initializing, setInitializing] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [pages, setPages] = useState<CMSPageWithTranslation[]>([]);
  const [stats, setStats] = useState<CMSStats | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPagesCount, setTotalPagesCount] = useState(0);

  useEffect(() => {
    verifyAdminAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await authenticatedFetch('/api/cms/stats');
      if (!response.ok) throw new Error('Failed to load stats');
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to load stats', error);
      toast.error('Failed to load stats');
    }
  }, []);

  const fetchPages = useCallback(
    async (pageToLoad: number) => {
      try {
        setTableLoading(true);
        const params = new URLSearchParams({
          page: pageToLoad.toString(),
          limit: PAGE_SIZE.toString(),
          language_code: defaultLocale,
        });

        if (search.trim()) params.append('search', search.trim());
        if (typeFilter) params.append('type', typeFilter);
        if (statusFilter) params.append('status', statusFilter);

        const response = await authenticatedFetch(`/api/cms/pages?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to load pages');

        const data = await response.json();
        setPages(data.pages || []);
        setCurrentPage(data.page);
        setTotalPagesCount(data.total_pages);
      } catch (error) {
        console.error('Failed to fetch pages:', error);
        toast.error('Failed to load pages');
      } finally {
        setTableLoading(false);
      }
    },
    [search, typeFilter, statusFilter]
  );

  const verifyAdminAccess = async () => {
    try {
      if (!isAuthenticated()) {
        toast.error('Session expired. Please login again.');
        router.push(`/${defaultLocale}/login`);
        return;
      }

      const user = getUser();
      if (!user || user.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        router.push('/');
        return;
      }

      const response = await authenticatedFetch('/api/admin/verify');
      if (!response.ok) {
        toast.error('Authentication failed');
        router.push(`/${defaultLocale}/login`);
        return;
      }

      await Promise.all([fetchPages(1), fetchStats()]);
    } catch (error) {
      console.error('Admin verification failed:', error);
      toast.error('Authentication failed');
      router.push(`/${defaultLocale}/login`);
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    if (initializing) return;
    fetchPages(currentPage);
  }, [currentPage, fetchPages, initializing]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleDelete = async (pageId: string) => {
    const confirmed = window.confirm('Delete this page? This action cannot be undone.');
    if (!confirmed) return;

    try {
      const response = await authenticatedFetch(`/api/cms/pages/${pageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete page');

      toast.success('Page deleted');
      fetchPages(1);
      fetchStats();
    } catch (error) {
      console.error('Failed to delete page:', error);
      toast.error('Failed to delete page');
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const hasPages = pages.length > 0;
  const totalPagesDisplay = Math.max(totalPagesCount, 1);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CMS Pages</h1>
            <p className="text-gray-600 mt-2">
              Manage website pages, landing pages, and legal documents
            </p>
          </div>
          <Link
            href="/admin/cms/pages/new"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-center"
          >
            + New Page
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Pages" value={stats?.totalPages ?? 0} accent="text-gray-900" />
          <StatCard label="Published" value={stats?.publishedPages ?? 0} accent="text-green-600" />
          <StatCard label="Drafts" value={stats?.draftPages ?? 0} accent="text-yellow-600" />
          <StatCard label="Blog Articles" value={stats?.blogPages ?? 0} accent="text-blue-600" />
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search pages..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <select
              value={typeFilter}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Types</option>
              {PAGE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Statuses</option>
              {PAGE_STATUSES.map((statusValue) => (
                <option key={statusValue} value={statusValue}>
                  {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {!hasPages && !tableLoading ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No pages found</h3>
              <p className="text-gray-600 mb-6">
                Adjust filters or create a new page to get started.
              </p>
              <Link
                href="/admin/cms/pages/new"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
              >
                Create Page
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title & Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Languages
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        Loading pages...
                      </td>
                    </tr>
                  ) : (
                    pages.map((page) => (
                      <tr key={page.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            {page.translation?.title || 'Untitled page'}
                          </div>
                          <div className="text-sm text-gray-500">/{page.slug}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                            {page.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                              statusClasses[page.status] || 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {page.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {(page.translations || []).map((translation) => (
                              <span
                                key={`${page.id}-${translation.language_code}`}
                                className="px-2 py-0.5 text-xs bg-gray-100 rounded"
                              >
                                {translation.language_code.toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(page.updated_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/cms/pages/${page.id}`}
                              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                            >
                              Edit
                            </Link>
                            <a
                              href={`/${defaultLocale}/${page.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-gray-700 text-sm"
                            >
                              Preview
                            </a>
                            <button
                              onClick={() => handleDelete(page.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {hasPages && (
          <div className="flex items-center justify-between mt-6 text-sm text-gray-600 flex-wrap gap-4">
            <div>
              Showing page {currentPage} of {totalPagesDisplay}
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={currentPage >= totalPagesDisplay}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`text-3xl font-bold ${accent}`}>{value}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
    </div>
  );
}
