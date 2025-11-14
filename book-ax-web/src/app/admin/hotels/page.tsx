'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

// 🔒 SECURITY: Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic';

interface Hotel {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  starRating: number;
  totalRooms: number;
  commissionPercentage: number;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  createdAt: string;
  ownerName?: string;
}

function AdminHotelsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('admin.hotels');
  const tSecurity = useTranslations('admin.security');

  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all');
  const [isAdmin, setIsAdmin] = useState(false);

  // 🔒 CRITICAL: Verify admin access
  useEffect(() => {
    verifyAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchHotels();
    }
  }, [isAdmin]);

  useEffect(() => {
    filterHotels();
  }, [statusFilter, hotels]);

  const verifyAdminAccess = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error(tSecurity('errors.sessionExpired'));
        router.push('/login');
        return;
      }

      const res = await fetch('/api/admin/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        toast.error(tSecurity('errors.unauthorized'));
        router.push('/');
        return;
      }

      if (!res.ok) {
        throw new Error('Verification failed');
      }

      const data = await res.json();
      if (data.role !== 'admin') {
        toast.error(tSecurity('errors.unauthorized'));
        router.push('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Admin verification error:', error);
      toast.error(tSecurity('errors.unauthorized'));
      router.push('/');
    }
  };

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const res = await fetch('/api/admin/hotels', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        toast.error(tSecurity('errors.unauthorized'));
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch hotels');
      }

      const data = await res.json();
      setHotels(data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      toast.error(t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const filterHotels = () => {
    if (statusFilter === 'all') {
      setFilteredHotels(hotels);
    } else {
      setFilteredHotels(hotels.filter(h => h.status === statusFilter));
    }
  };

  const handleApprove = async (hotelId: string) => {
    const confirmed = confirm(t('confirmApprove'));
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`/api/admin/hotels/${hotelId}/approve`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401 || res.status === 403) {
        toast.error(tSecurity('errors.unauthorized'));
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to approve hotel');
      }

      toast.success(t('success.approved'));
      fetchHotels();
    } catch (error) {
      console.error('Error approving hotel:', error);
      toast.error(t('errors.approveFailed'));
    }
  };

  const handleReject = async (hotelId: string) => {
    const confirmed = confirm(t('confirmReject'));
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`/api/admin/hotels/${hotelId}/reject`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401 || res.status === 403) {
        toast.error(tSecurity('errors.unauthorized'));
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to reject hotel');
      }

      toast.success(t('success.rejected'));
      fetchHotels();
    } catch (error) {
      console.error('Error rejecting hotel:', error);
      toast.error(t('errors.rejectFailed'));
    }
  };

  const handleSuspend = async (hotelId: string) => {
    const confirmed = confirm(t('confirmSuspend'));
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`/api/admin/hotels/${hotelId}/suspend`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401 || res.status === 403) {
        toast.error(tSecurity('errors.unauthorized'));
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to suspend hotel');
      }

      toast.success(t('success.suspended'));
      fetchHotels();
    } catch (error) {
      console.error('Error suspending hotel:', error);
      toast.error(t('errors.suspendFailed'));
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      suspended: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles]}`}>
        {t(status)}
      </span>
    );
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-red-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hotels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Security Banner */}
      <div className="bg-red-600 text-white px-4 py-2 text-center text-sm font-semibold">
        🔒 {tSecurity('adminOnly')}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h1>
          
          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t('all')} ({hotels.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t('pending')} ({hotels.filter(h => h.status === 'pending').length})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'approved'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t('approved')} ({hotels.filter(h => h.status === 'approved').length})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'rejected'
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t('rejected')} ({hotels.filter(h => h.status === 'rejected').length})
            </button>
          </div>
        </div>

        {/* Hotels Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hotel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('commission')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHotels.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{hotel.name}</div>
                      <div className="text-sm text-gray-500">
                        ⭐ {hotel.starRating} • 🛏️ {hotel.totalRooms} rooms
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {hotel.city}, {hotel.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {hotel.commissionPercentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(hotel.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {hotel.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(hotel.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          {t('approve')}
                        </button>
                        <button
                          onClick={() => handleReject(hotel.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          {t('reject')}
                        </button>
                      </>
                    )}
                    {hotel.status === 'approved' && (
                      <button
                        onClick={() => handleSuspend(hotel.id)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        {t('suspend')}
                      </button>
                    )}
                    {hotel.status === 'suspended' && (
                      <button
                        onClick={() => handleApprove(hotel.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        {t('reactivate')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredHotels.length === 0 && (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🏨</span>
              <p className="text-gray-600">No hotels found with status: {statusFilter}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminHotelsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AdminHotelsContent />
    </Suspense>
  );
}
