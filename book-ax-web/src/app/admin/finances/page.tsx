'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import Link from 'next/link';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface FinancialData {
  totalRevenue: number;
  totalCommissions: number;
  totalPayouts: number;
  pendingPayouts: number;
  bookingCount: number;
}

interface Transaction {
  id: string;
  bookingId: string;
  hotelName: string;
  guestEmail: string;
  totalAmount: number;
  commissionAmount: number;
  hotelPayout: number;
  commissionPercentage: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
  paidAt?: string;
}

export default function AdminFinancesPage() {
  const t = useTranslations('admin');
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');

  // Admin verification on mount
  useEffect(() => {
    verifyAdminAccess();
  }, []);

  // Fetch data when filters change
  useEffect(() => {
    if (isAdmin) {
      fetchFinancialData();
    }
  }, [isAdmin, dateRange, statusFilter]);

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
    } catch (error) {
      console.error('Admin verification error:', error);
      toast.error(t('security.unauthorized'));
      router.push('/login');
    }
  };

  const fetchFinancialData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const params = new URLSearchParams({
        dateRange,
        status: statusFilter,
      });

      const res = await fetch(`/api/admin/finances?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        toast.error(t('security.unauthorized'));
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch financial data');
      }

      const data = await res.json();
      setFinancialData(data.summary);
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Fetch financial data error:', error);
      toast.error(t('finances.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      toast.loading('Exporting report...');
      
      const params = new URLSearchParams({
        dateRange,
        status: statusFilter,
        format: 'csv',
      });

      const res = await fetch(`/api/admin/finances/export?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Export failed');
      }

      // Download file
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial-report-${dateRange}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.dismiss();
      toast.success('Report exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.dismiss();
      toast.error(t('finances.errors.exportFailed'));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

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
              <Link href="/admin/users" className="inline-flex items-center px-1 pt-1 text-gray-700 hover:text-primary-600">
                {t('navigation.users')}
              </Link>
              <Link href="/admin/finances" className="inline-flex items-center px-1 pt-1 text-primary-600 border-b-2 border-primary-600 font-semibold">
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {t('finances.title')}
            </h1>
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              📥 {t('finances.export')}
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6 bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('finances.dateRange')}
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setDateRange('7d')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      dateRange === '7d'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    7 Days
                  </button>
                  <button
                    onClick={() => setDateRange('30d')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      dateRange === '30d'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    30 Days
                  </button>
                  <button
                    onClick={() => setDateRange('90d')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      dateRange === '90d'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    90 Days
                  </button>
                  <button
                    onClick={() => setDateRange('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      dateRange === 'all'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Time
                  </button>
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('finances.status')}
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      statusFilter === 'all'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setStatusFilter('confirmed')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      statusFilter === 'confirmed'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Confirmed
                  </button>
                  <button
                    onClick={() => setStatusFilter('pending')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      statusFilter === 'pending'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setStatusFilter('cancelled')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      statusFilter === 'cancelled'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Cancelled
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Overview Cards */}
          {loading ? (
            <div className="bg-white shadow rounded-lg p-8 text-center mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading financial data...</p>
            </div>
          ) : financialData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Total Revenue */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('finances.totalRevenue')}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(financialData.totalRevenue)}
                    </p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{financialData.bookingCount} bookings</p>
              </div>

              {/* Total Commissions */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('finances.totalCommissions')}</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {formatCurrency(financialData.totalCommissions)}
                    </p>
                  </div>
                  <div className="text-4xl">💵</div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {((financialData.totalCommissions / financialData.totalRevenue) * 100).toFixed(1)}% of revenue
                </p>
              </div>

              {/* Total Payouts */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('finances.completedPayouts')}</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                      {formatCurrency(financialData.totalPayouts)}
                    </p>
                  </div>
                  <div className="text-4xl">🏦</div>
                </div>
                <p className="text-xs text-gray-500 mt-2">To hoteliers</p>
              </div>

              {/* Pending Payouts */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('finances.pendingPayouts')}</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">
                      {formatCurrency(financialData.pendingPayouts)}
                    </p>
                  </div>
                  <div className="text-4xl">⏳</div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Awaiting processing</p>
              </div>
            </div>
          ) : null}

          {/* Transactions Table */}
          {loading ? null : transactions.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <p className="text-gray-500">No transactions found for selected filters</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Transaction Details
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {transactions.length} transactions
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('finances.bookingId')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('finances.hotel')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guest
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('finances.amount')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('finances.commission')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('finances.hotelPayout')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('finances.status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('finances.date')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{tx.bookingId.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {tx.hotelName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tx.guestEmail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatCurrency(tx.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          {formatCurrency(tx.commissionAmount)}
                          <span className="text-xs text-gray-500 ml-1">({tx.commissionPercentage}%)</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                          {formatCurrency(tx.hotelPayout)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            tx.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : tx.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(tx.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
