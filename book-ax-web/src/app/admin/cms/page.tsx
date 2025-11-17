'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { DocumentTextIcon, PhotoIcon, FolderIcon } from '@heroicons/react/24/outline';

export default function CMSOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600 mt-1">Manage pages, images, and content</p>
        </div>
      </div>

      {/* CMS Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pages */}
        <Link
          href="/admin/cms/pages"
          className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <DocumentTextIcon className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Manage →</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Pages</h3>
          <p className="text-gray-600 text-sm">
            Create and manage website pages, landing pages, and SEO content
          </p>
        </Link>

        {/* Images */}
        <Link
          href="/admin/cms/images"
          className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-purple-200 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
              <PhotoIcon className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Manage →</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Images</h3>
          <p className="text-gray-600 text-sm">
            Upload and organize images, photos, and media assets
          </p>
          <div className="mt-4 text-xs text-gray-500">
            Coming soon
          </div>
        </Link>

        {/* Files */}
        <Link
          href="/admin/cms/files"
          className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-green-200 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <FolderIcon className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Manage →</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Files</h3>
          <p className="text-gray-600 text-sm">
            Manage documents, PDFs, and downloadable files
          </p>
          <div className="mt-4 text-xs text-gray-500">
            Coming soon
          </div>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Content Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600 mt-1">Total Pages</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600 mt-1">Published</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600 mt-1">Drafts</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-600 mt-1">Media Files</p>
          </div>
        </div>
      </div>
    </div>
  );
}
