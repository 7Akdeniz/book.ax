'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface User {
  id: string;
  email: string;
  role: 'guest' | 'hotelier' | 'admin';
  status: 'active' | 'suspended';
  fullName?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export default function AdminUsersPage() {
  const t = useTranslations('admin');
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<'all' | 'guest' | 'hotelier' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  // Admin verification on mount
  useEffect(() => {
    verifyAdminAccess();
  }, []);

  const verifyAdminAccess = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error(t('security.unauthorized'));
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        toast.error(t('security.sessionExpired'));
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (res.status === 403) {
        toast.error(t('security.forbidden'));
        router.push('/');
        return;
      }

      if (!res.ok) {
        throw new Error('Verification failed');
      }

      const data = await res.json();
      if (data.role !== 'admin') {
        toast.error(t('security.adminOnly'));
        router.push('/');
        return;
      }

      setIsAdmin(true);
      fetchUsers();
    } catch (error) {
      console.error('Admin verification error:', error);
      toast.error(t('security.unauthorized'));
      router.push('/login');
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        toast.error(t('security.unauthorized'));
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (userId: string, email: string) => {
    if (!confirm(t('users.actions.suspendConfirm', { email }))) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401 || res.status === 403) {
        toast.error(t('security.unauthorized'));
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to suspend user');
      }

      toast.success(t('users.actions.suspendSuccess'));
      fetchUsers(); // Refresh list
    } catch (error: any) {
      console.error('Suspend user error:', error);
      toast.error(error.message || t('users.actions.suspendError'));
    }
  };

  const handleActivate = async (userId: string, email: string) => {
    if (!confirm(t('users.actions.activateConfirm', { email }))) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}/activate`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401 || res.status === 403) {
        toast.error(t('security.unauthorized'));
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to activate user');
      }

      toast.success(t('users.actions.activateSuccess'));
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('Activate user error:', error);
      toast.error(t('users.actions.activateError'));
    }
  };

  const handleChangeRole = async (userId: string, email: string, newRole: 'guest' | 'hotelier' | 'admin') => {
    if (!confirm(t('users.actions.changeRoleConfirm', { email, role: t(`users.roles.${newRole}`) }))) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.status === 401 || res.status === 403) {
        toast.error(t('security.unauthorized'));
        return;
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to change role');
      }

      toast.success(t('users.actions.changeRoleSuccess'));
      fetchUsers(); // Refresh list
    } catch (error: any) {
      console.error('Change role error:', error);
      toast.error(error.message || t('users.actions.changeRoleError'));
    }
  };

  // Filter users based on selected filters
  const filteredUsers = users.filter(user => {
    const matchRole = roleFilter === 'all' || user.role === roleFilter;
    const matchStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchRole && matchStatus;
  });

  // Count users by role
  const guestCount = users.filter(u => u.role === 'guest').length;
  const hotelierCount = users.filter(u => u.role === 'hotelier').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  // Count users by status
  const activeCount = users.filter(u => u.status === 'active').length;
  const suspendedCount = users.filter(u => u.status === 'suspended').length;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="ml-4 text-gray-600">{t('security.verifying')}...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Security Warning Banner */}
      <div className="bg-red-600 text-white py-2 px-4 text-center font-semibold">
        {t('security.adminOnly')} - {t('security.auditLog.enabled')}
      </div>

      {/* Admin Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link href="/admin" className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-primary-600">
                {t('navigation.dashboard')}
              </Link>
              <Link href="/admin/hotels" className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-primary-600">
                {t('navigation.hotels')}
              </Link>
              <Link href="/admin/users" className="inline-flex items-center px-1 pt-1 text-primary-600 border-b-2 border-primary-600 font-semibold">
                {t('navigation.users')}
              </Link>
              <Link href="/admin/finances" className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-primary-600">
                {t('navigation.finances')}
              </Link>
              <Link href="/admin/settings" className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-primary-600">
                {t('navigation.settings')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {t('users.title')}
          </h1>

          {/* Filter Buttons */}
          <div className="mb-6 space-y-4">
            {/* Role Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">{t('users.filterByRole')}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setRoleFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    roleFilter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {t('users.allUsers')} ({users.length})
                </button>
                <button
                  onClick={() => setRoleFilter('guest')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    roleFilter === 'guest'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {t('users.roles.guest')} ({guestCount})
                </button>
                <button
                  onClick={() => setRoleFilter('hotelier')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    roleFilter === 'hotelier'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {t('users.roles.hotelier')} ({hotelierCount})
                </button>
                <button
                  onClick={() => setRoleFilter('admin')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    roleFilter === 'admin'
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {t('users.roles.admin')} ({adminCount})
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">{t('users.filterByStatus')}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {t('users.allStatuses')} ({users.length})
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    statusFilter === 'active'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {t('users.status.active')} ({activeCount})
                </button>
                <button
                  onClick={() => setStatusFilter('suspended')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    statusFilter === 'suspended'
                      ? 'bg-gray-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {t('users.status.suspended')} ({suspendedCount})
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          {loading ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">{t('users.loading')}...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <p className="text-gray-500">{t('users.noUsers')}</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.table.user')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.table.role')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.table.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.table.joined')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.table.lastLogin')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('users.table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.fullName || user.email}</div>
                          {user.fullName && <div className="text-sm text-gray-500">{user.email}</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => handleChangeRole(user.id, user.email, e.target.value as any)}
                          className="text-sm border-gray-300 rounded-md"
                        >
                          <option value="guest">{t('users.roles.guest')}</option>
                          <option value="hotelier">{t('users.roles.hotelier')}</option>
                          <option value="admin">{t('users.roles.admin')}</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {t(`users.status.${user.status}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleSuspend(user.id, user.email)}
                            className="text-red-600 hover:text-red-900 font-medium"
                          >
                            {t('users.actions.suspend')}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(user.id, user.email)}
                            className="text-green-600 hover:text-green-900 font-medium"
                          >
                            {t('users.actions.activate')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
