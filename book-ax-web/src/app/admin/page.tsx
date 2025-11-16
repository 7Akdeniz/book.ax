'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authenticatedFetch, isAuthenticated, getUser } from '@/lib/auth/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  BuildingOfficeIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

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
  const { user: authUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // 🔒 CRITICAL: Admin role verification
  useEffect(() => {
    verifyAdminAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyAdminAccess = async () => {
    try {
      // Check if authenticated
      if (!isAuthenticated()) {
        toast.error('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      const user = getUser();
      
      // Security: Check role on client-side first
      if (!user || user.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        router.push('/');
        return;
      }

      // Security: Verify admin role with backend
      const res = await authenticatedFetch('/api/admin/verify');

      // Security: Handle auth errors
      if (res.status === 401) {
        toast.error('Unauthorized access');
        router.push('/login');
        return;
      }

      if (res.status === 403) {
        toast.error('Access denied. Admin only.');
        router.push('/');
        return;
      }

      if (!res.ok) {
        throw new Error('Admin verification failed');
      }

      const data = await res.json();
      
      // Security: Double-check role from backend response
      if (data.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        router.push('/');
        return;
      }

      setIsAdmin(true);
      fetchAdminStats();
    } catch (error) {
      console.error('Admin verification error:', error);
      toast.error('Unauthorized access');
      router.push('/');
    }
  };

  const fetchAdminStats = async () => {
    try {
      setLoading(true);

      const res = await authenticatedFetch('/api/admin/stats');

      if (res.status === 401 || res.status === 403) {
        toast.error('Unauthorized access');
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
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  // Security: Don't render anything until admin role is verified
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
          <p className="text-xs text-red-600 mt-2">🔒 Admin access only</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header with Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* Total Hotels */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hotels</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.totalHotels || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center text-sm text-green-600">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            <span>12% increase</span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm p-6 border-2 border-yellow-300 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-yellow-800">Pending Approvals</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">{stats?.pendingApprovals || 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-200 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-yellow-700" />
            </div>
          </div>
          {(stats?.pendingApprovals || 0) > 0 && (
            <Link
              href="/admin/hotels?status=pending"
              className="inline-flex items-center text-sm font-medium text-yellow-700 hover:text-yellow-900"
            >
              Review now
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.totalUsers || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center text-sm text-green-600">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            <span>8% increase</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-sm p-6 border border-green-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-green-800">Total Revenue</p>
              <p className="text-3xl font-bold text-green-900 mt-1">
                €{(stats?.totalRevenue || 0).toLocaleString('de-DE', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-green-700" />
            </div>
          </div>
          <div className="flex items-center text-sm text-green-700">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            <span>23% increase</span>
          </div>
        </div>

        {/* Active Bookings */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Bookings</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.activeBookings || 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <CalendarDaysIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span>Last 30 days</span>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <p className="text-2xl font-bold text-green-600 mt-1">Operational</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center text-sm text-green-600">
            <span>All systems running</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/hotels?status=pending"
            className="group flex flex-col items-center p-6 border-2 border-yellow-300 bg-yellow-50 rounded-xl hover:bg-yellow-100 hover:border-yellow-400 transition-all"
          >
            <div className="w-14 h-14 bg-yellow-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <CheckCircleIcon className="w-8 h-8 text-yellow-700" />
            </div>
            <span className="text-sm font-semibold text-gray-900 text-center">Approve Hotels</span>
          </Link>

          <Link
            href="/admin/users"
            className="group flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all"
          >
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-100 transition-all">
              <UserGroupIcon className="w-8 h-8 text-gray-600 group-hover:text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-gray-900 text-center">Manage Users</span>
          </Link>

          <Link
            href="/admin/finances"
            className="group flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all"
          >
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-green-100 transition-all">
              <CurrencyDollarIcon className="w-8 h-8 text-gray-600 group-hover:text-green-600" />
            </div>
            <span className="text-sm font-semibold text-gray-900 text-center">Financial Reports</span>
          </Link>

          <Link
            href="/admin/settings"
            className="group flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all"
          >
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-purple-100 transition-all">
              <Cog6ToothIcon className="w-8 h-8 text-gray-600 group-hover:text-purple-600" />
            </div>
            <span className="text-sm font-semibold text-gray-900 text-center">System Settings</span>
          </Link>
        </div>
      </div>
    </>
  );
}
