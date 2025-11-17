'use client';'use client';



import { useEffect } from 'react';import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';import { useRouter, useParams } from 'next/navigation';

import { useTranslations } from 'next-intl';

export default function AdminRedirect() {

  const router = useRouter();interface User {

  id: string;

  useEffect(() => {  email: string;

    // Redirect to the new locale-independent admin panel  firstName: string;

    router.replace('/admin');  lastName: string;

  }, [router]);  role: 'guest' | 'hotelier' | 'admin';

}

  return (

    <div className="flex items-center justify-center min-h-screen">interface DashboardStats {

      <div className="text-center">  totalHotels: number;

        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>  pendingApprovals: number;

        <p className="text-gray-600">Redirecting to Admin Panel...</p>  totalUsers: number;

      </div>  totalBookings: number;

    </div>  totalRevenue: number;

  );}

}

export default function AdminDashboard() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations();
  
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push(`/${locale}/login`);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    
    // Check if user is admin
    if (parsedUser.role !== 'admin') {
      router.push(`/${locale}`);
      return;
    }

    setUser(parsedUser);
    loadStats();
  }, [router, locale]);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      // TODO: Implement API endpoints for admin stats
      // For now, showing mock data
      setStats({
        totalHotels: 0,
        pendingApprovals: 0,
        totalUsers: 1,
        totalBookings: 0,
        totalRevenue: 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push(`/${locale}/login`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.firstName} {user?.lastName}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Hotels</p>
              <p className="text-3xl font-bold">{stats?.totalHotels || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
              <p className="text-3xl font-bold text-orange-600">{stats?.pendingApprovals || 0}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold">€{stats?.totalRevenue.toFixed(2) || '0.00'}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
            <div className="font-semibold mb-1">Approve Hotels</div>
            <div className="text-sm text-gray-600">Review pending hotel submissions</div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left">
            <div className="font-semibold mb-1">Manage Users</div>
            <div className="text-sm text-gray-600">View and manage user accounts</div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left">
            <div className="font-semibold mb-1">Finance Reports</div>
            <div className="text-sm text-gray-600">View revenue and commission reports</div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-left">
            <div className="font-semibold mb-1">System Settings</div>
            <div className="text-sm text-gray-600">Configure platform settings</div>
          </button>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="bg-blue-500 p-2 rounded-lg mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Admin Portal - In Development</h3>
            <p className="text-gray-700">
              This is the basic admin dashboard. Full features are currently being implemented:
            </p>
            <ul className="list-disc list-inside mt-2 text-sm text-gray-600 space-y-1">
              <li>Hotel approval workflow</li>
              <li>User management</li>
              <li>Finance & commission reports</li>
              <li>System configuration</li>
              <li>OTA connection management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
