'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { DocumentTextIcon, PhotoIcon, FolderIcon } from '@heroicons/react/24/outline';
import { authenticatedFetch, getUser, isAuthenticated } from '@/lib/auth/client';
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

export default function CMSOverview() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CMSStats | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
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

        const response = await authenticatedFetch('/api/cms/stats');
        if (!response.ok) throw new Error('Failed to load stats');
        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.error('Unable to load CMS overview', error);
        toast.error('Failed to load CMS overview');
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-1">Manage pages, media, and legal content in one place</p>
        </div>
        <p className="text-xs text-gray-500">
          Last updated {stats?.updatedAt ? new Date(stats.updatedAt).toLocaleString() : '—'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <OverviewCard label="Total Pages" value={stats?.totalPages ?? 0} accent="text-gray-900" />
        <OverviewCard label="Published" value={stats?.publishedPages ?? 0} accent="text-green-600" />
        <OverviewCard label="Drafts" value={stats?.draftPages ?? 0} accent="text-yellow-600" />
        <OverviewCard label="Media Files" value={stats?.mediaFiles ?? 0} accent="text-blue-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OverviewTile
          href="/admin/cms/pages"
          title="Pages"
          description="Create and manage marketing pages, landing pages, and SEO content"
          icon={<DocumentTextIcon className="w-6 h-6 text-blue-600" />}
          accent="blue"
        />
        <OverviewTile
          href="/admin/cms/images"
          title="Images"
          description="Upload, organize, and reuse CMS images across pages"
          icon={<PhotoIcon className="w-6 h-6 text-purple-600" />}
          accent="purple"
          badge="Coming soon"
        />
        <OverviewTile
          href="/admin/cms/files"
          title="Files"
          description="Manage documents, PDFs, and downloadable assets"
          icon={<FolderIcon className="w-6 h-6 text-green-600" />}
          accent="green"
          badge="Coming soon"
        />
      </div>
    </div>
  );
}

function OverviewCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <p className={`text-3xl font-bold ${accent}`}>{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
}

function OverviewTile({
  href,
  title,
  description,
  icon,
  accent,
  badge,
}: {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  accent: 'blue' | 'purple' | 'green';
  badge?: string;
}) {
  const accentClasses: Record<'blue' | 'purple' | 'green', { bg: string; hover: string }> = {
    blue: { bg: 'bg-blue-100', hover: 'hover:border-blue-200' },
    purple: { bg: 'bg-purple-100', hover: 'hover:border-purple-200' },
    green: { bg: 'bg-green-100', hover: 'hover:border-green-200' },
  } as const;

  const palette = accentClasses[accent];

  return (
    <Link
      href={href}
      className={`group bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all ${palette.hover}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${palette.bg} rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform`}>
          {icon}
        </div>
        <span className="text-sm text-gray-500">Manage →</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      {badge && <div className="mt-4 text-xs text-gray-500">{badge}</div>}
    </Link>
  );
}
