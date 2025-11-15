'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authenticatedFetch, isAuthenticated, getUser } from '@/lib/auth/client';
import { useAuth } from '@/contexts/AuthContext';
import { AdminNav } from '@/components/admin/AdminNav';

// 🔒 SECURITY: Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic';

interface AdminStats {
  totalHotels: number;
  pendingApprovals: number;
  totalUsers: number;
  totalRevenue: number;
  activeBookings: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const { user: authUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // 🔒 CRITICAL: Admin role verification
  useEffect(() => {
    verifyAdminAccess();
  }, []);

  const verifyAdminAccess = async () => {
    try {
      // Check if authenticated
      if (!isAuthenticated()) {
        toast.error(t('security.errors.sessionExpired'));
        router.push('/login');
        return;
      }

      const user = getUser();
      
      // Security: Check role on client-side first
      if (!user || user.role !== 'admin') {
        toast.error(t('accessDenied'));
        router.push('/');
        return;
      }

      // Security: Verify admin role with backend
      const res = await authenticatedFetch('/api/admin/verify');

      // Security: Handle auth errors
      if (res.status === 401) {
        toast.error(t('security.errors.unauthorized'));
        router.push('/login');
        return;
      }

      if (res.status === 403) {
        toast.error(t('accessDenied'));
        router.push('/');
        return;
      }

      if (!res.ok) {
        throw new Error('Admin verification failed');
      }

      const data = await res.json();
      
      // Security: Double-check role from backend response
      if (data.role !== 'admin') {
        toast.error(t('accessDenied'));
        router.push('/');
        return;
      }

      setIsAdmin(true);
      fetchAdminStats();
    } catch (error) {
      console.error('Admin verification error:', error);
      toast.error(t('security.errors.unauthorized'));
      router.push('/');
    }
  };

  const fetchAdminStats = async () => {
    try {
      setLoading(true);

      const res = await authenticatedFetch('/api/admin/stats');

      if (res.status === 401 || res.status === 403) {
        toast.error(t('security.errors.unauthorized'));
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error(t('dashboard.stats.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  // Security: Don't render anything until admin role is verified
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
          <p className="text-xs text-red-600 mt-2">{t('security.adminOnly')}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Security Warning Banner */}
      <div className="bg-red-600 text-white px-4 py-2 text-center text-sm font-semibold">
        🔒 {t('security.adminOnly')}
      </div>

      {/* Admin Navigation */}
      <AdminNav />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard.title')}</h1>
          <p className="text-gray-600">{t('dashboard.welcome')}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Hotels */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{t('dashboard.stats.totalHotels')}</h3>
              <span className="text-2xl">🏨</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalHotels || 0}</p>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white rounded-lg shadow p-6 border-2 border-yellow-400">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{t('dashboard.stats.pendingApprovals')}</h3>
              <span className="text-2xl">⏳</span>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{stats?.pendingApprovals || 0}</p>
            {(stats?.pendingApprovals || 0) > 0 && (
              <Link
                href="/admin/hotels?status=pending"
                className="text-sm text-yellow-600 hover:text-yellow-700 font-medium mt-2 block"
              >
                Review now →
              </Link>
            )}
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{t('dashboard.stats.totalUsers')}</h3>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{t('dashboard.stats.totalRevenue')}</h3>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              €{(stats?.totalRevenue || 0).toLocaleString('de-DE', { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Active Bookings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{t('dashboard.stats.activeBookings')}</h3>
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.activeBookings || 0}</p>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">{t('dashboard.stats.systemHealth')}</h3>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-lg font-bold text-green-600">Operational</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/admin/hotels?status=pending"
              className="flex flex-col items-center p-4 border-2 border-yellow-400 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-all"
            >
              <span className="text-3xl mb-2">✅</span>
              <span className="text-sm font-medium text-center">Approve Hotels</span>
            </Link>

            <Link
              href="/admin/users"
              className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all"
            >
              <span className="text-3xl mb-2">👥</span>
              <span className="text-sm font-medium text-center">Manage Users</span>
            </Link>

            <Link
              href="/admin/finances"
              className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all"
            >
              <span className="text-3xl mb-2">💰</span>
              <span className="text-sm font-medium text-center">Financial Reports</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all"
            >
              <span className="text-3xl mb-2">⚙️</span>
              <span className="text-sm font-medium text-center">System Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
