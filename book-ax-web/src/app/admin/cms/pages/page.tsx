import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import Link from 'next/link';

async function getPages() {
  // This would normally be a server-side fetch
  // For now, we'll return empty array
  return [];
}

export default async function CMSPagesListPage() {
  // Verify admin access
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    redirect('/login');
  }

  const decoded = verifyAccessToken(token);
  if (!decoded || decoded.role !== 'admin') {
    redirect('/');
  }

  const pages = await getPages();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CMS Pages</h1>
            <p className="text-gray-600 mt-2">
              Manage all your content pages, blog articles, and legal documents
            </p>
          </div>
          <Link
            href="/admin/cms/pages/new"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
          >
            + New Page
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600 mt-1">Total Pages</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600 mt-1">Published</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-yellow-600">0</div>
            <div className="text-sm text-gray-600 mt-1">Drafts</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600 mt-1">Blog Articles</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search pages..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              <option value="">All Types</option>
              <option value="page">Pages</option>
              <option value="blog">Blog</option>
              <option value="legal">Legal</option>
              <option value="seo">SEO</option>
              <option value="landing">Landing</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Pages List */}
        <div className="bg-white rounded-lg shadow">
          {pages.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No pages yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first page to start building content
              </p>
              <Link
                href="/admin/cms/pages/new"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
              >
                Create First Page
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
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
                  {/* Pages will be listed here */}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
