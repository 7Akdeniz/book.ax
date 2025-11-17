'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { authenticatedFetch, isAuthenticated, getUser } from '@/lib/auth/client';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyAdminAccess = async () => {
    try {
      if (!isAuthenticated()) {
        toast.error('Session expired. Please login again.');
        router.push('/de/login');
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
        router.push('/de/login');
        return;
      }

      setIsAdmin(true);
      fetchUsers();
    } catch (error) {
      console.error('Admin verification failed:', error);
      toast.error('Authentication failed');
      router.push('/de/login');
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch('/api/admin/users');

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
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

    try {
      const response = await authenticatedFetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
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

    try {
      const response = await authenticatedFetch(`/api/admin/users/${userId}/activate`, {
        method: 'POST',
      });

      if (!response.ok) {
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

    try {
      const response = await authenticatedFetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('users.title')}</h1>
        <p className="text-gray-600 mt-1">Manage user accounts and roles</p>
      </div>

      {/* Filter Buttons */}
      <div className="space-y-4">
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
  );
}