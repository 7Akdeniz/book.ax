'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

interface RoomCategory {
  id: string;
  name: string;
  basePrice: number;
  totalRooms: number;
}

interface RateData {
  date: string;
  price: number;
  availableRooms: number;
  minStay?: number;
  maxStay?: number;
  closedToArrival?: boolean;
  closedToDeparture?: boolean;
}

interface BulkUpdateData {
  startDate: string;
  endDate: string;
  priceChange?: number;
  priceChangeType?: 'amount' | 'percentage';
  availabilityChange?: number;
}

export default function RatesPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const t = useTranslations('panel.hotels.rates');
  const tCommon = useTranslations('common');

  const [loading, setLoading] = useState(true);
  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rates, setRates] = useState<Record<string, RateData>>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkData, setBulkData] = useState<BulkUpdateData>({
    startDate: '',
    endDate: '',
  });

  // Security: Verify JWT token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error(t('errors.sessionExpired'));
      router.push(`/${params.locale}/login`);
      return;
    }
    
    fetchRoomCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchRates();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoom, currentDate]);

  const fetchRoomCategories = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token');
      }

      // Security: Always include Authorization header
      const res = await fetch('/api/hotels?my=true', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Security: Check for auth errors
      if (res.status === 401) {
        toast.error(t('errors.unauthorized'));
        router.push(`/${params.locale}/login`);
        return;
      }

      if (res.status === 403) {
        toast.error(t('errors.forbidden'));
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch hotels');
      }

      const hotels = await res.json();
      
      if (hotels.length > 0) {
        const hotelId = hotels[0].id;
        
        // Fetch room categories for first hotel
        const roomsRes = await fetch(`/api/hotels/${hotelId}/rooms`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (roomsRes.ok) {
          const roomsData = await roomsRes.json();
          setRoomCategories(roomsData);
          
          if (roomsData.length > 0) {
            setSelectedRoom(roomsData[0].id);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching room categories:', error);
      toast.error(t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const fetchRates = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      // Security: Include auth token and validate response
      const res = await fetch(
        `/api/hotels/rates?roomCategoryId=${selectedRoom}&year=${year}&month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        toast.error(t('errors.unauthorized'));
        router.push(`/${params.locale}/login`);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        
        // Transform array to object keyed by date
        const ratesMap: Record<string, RateData> = {};
        data.forEach((rate: any) => {
          ratesMap[rate.date] = rate;
        });
        
        setRates(ratesMap);
      }
    } catch (error) {
      console.error('Error fetching rates:', error);
      toast.error(t('errors.loadFailed'));
    }
  };

  const updateRate = async (date: string, updates: Partial<RateData>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error(t('errors.sessionExpired'));
        return;
      }

      // Security: Validate input before sending
      if (updates.price !== undefined && updates.price <= 0) {
        toast.error(t('errors.invalidPrice'));
        return;
      }

      const selectedRoomData = roomCategories.find(r => r.id === selectedRoom);
      if (updates.availableRooms !== undefined && selectedRoomData) {
        if (updates.availableRooms > selectedRoomData.totalRooms) {
          toast.error(t('errors.invalidAvailability'));
          return;
        }
      }

      // Security: Send with auth header
      const res = await fetch(`/api/hotels/rates`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomCategoryId: selectedRoom,
          date,
          ...updates,
        }),
      });

      // Security: Handle auth errors explicitly
      if (res.status === 401) {
        toast.error(t('errors.unauthorized'));
        router.push(`/${params.locale}/login`);
        return;
      }

      if (res.status === 403) {
        toast.error(t('errors.forbidden'));
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to update rate');
      }

      toast.success(t('success.updated'));
      
      // Refresh rates
      fetchRates();
      setSelectedDate(null);
    } catch (error) {
      console.error('Error updating rate:', error);
      toast.error(t('errors.updateFailed'));
    }
  };

  const bulkUpdateRates = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error(t('errors.sessionExpired'));
        return;
      }

      // Security: Validate date range
      if (!bulkData.startDate || !bulkData.endDate) {
        toast.error(t('errors.invalidDateRange'));
        return;
      }

      const start = new Date(bulkData.startDate);
      const end = new Date(bulkData.endDate);
      
      if (end <= start) {
        toast.error(t('errors.invalidDateRange'));
        return;
      }

      // Calculate affected days
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      // Security: Confirm large operations
      if (daysDiff > 30) {
        const confirmed = confirm(
          t('warnings.priceChange', { count: daysDiff }) + '\n\n' + t('warnings.confirm')
        );
        if (!confirmed) return;
      }

      const res = await fetch(`/api/hotels/rates/bulk`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomCategoryId: selectedRoom,
          ...bulkData,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        toast.error(t('errors.unauthorized'));
        router.push(`/${params.locale}/login`);
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to bulk update rates');
      }

      toast.success(t('success.bulkUpdated'));
      setBulkMode(false);
      setBulkData({ startDate: '', endDate: '' });
      fetchRates();
    } catch (error) {
      console.error('Error bulk updating rates:', error);
      toast.error(t('errors.updateFailed'));
    }
  };

  const applyPreset = (presetType: 'weekend' | 'peak' | 'lowSeason' | 'lastMinute') => {
    const multipliers = {
      weekend: 1.2,
      peak: 1.5,
      lowSeason: 0.8,
      lastMinute: 0.7,
    };

    setBulkData({
      ...bulkData,
      priceChangeType: 'percentage',
      priceChange: (multipliers[presetType] - 1) * 100,
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const renderRateCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];
    const selectedRoomData = roomCategories.find(r => r.id === selectedRoom);

    // Empty cells
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="border border-gray-200 bg-gray-50 min-h-[100px]" />);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateStr = date.toISOString().split('T')[0];
      const rateData = rates[dateStr];
      const price = rateData?.price || selectedRoomData?.basePrice || 0;
      const availability = rateData?.availableRooms ?? selectedRoomData?.totalRooms ?? 0;

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`border border-gray-200 min-h-[100px] p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
            selectedDate?.toDateString() === date.toDateString() ? 'ring-2 ring-primary-500 bg-primary-50' : 'bg-white'
          }`}
        >
          <div className="text-sm font-semibold text-gray-900 mb-2">{day}</div>
          <div className="space-y-1">
            <div className="text-xs font-medium text-primary-600">€{price}</div>
            <div className="text-xs text-gray-600">
              {availability}/{selectedRoomData?.totalRooms || 0} {t('available')}
            </div>
          </div>
        </div>
      );
    }

    return days;
  };

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

  if (roomCategories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🛏️</span>
          <p className="text-gray-600 mb-4">No room categories yet. Please add rooms first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('selectRoom')}
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              {roomCategories.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} - €{room.basePrice}/night
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setBulkMode(!bulkMode)}
              className={`w-full px-4 py-2 font-medium rounded-lg transition-colors ${
                bulkMode
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {t('bulkUpdate')}
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Update Mode */}
      {bulkMode && (
        <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('bulkUpdate')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('startDate')}
              </label>
              <input
                type="date"
                value={bulkData.startDate}
                onChange={(e) => setBulkData({ ...bulkData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('endDate')}
              </label>
              <input
                type="date"
                value={bulkData.endDate}
                onChange={(e) => setBulkData({ ...bulkData, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <button
              onClick={() => applyPreset('weekend')}
              className="px-4 py-2 bg-white border-2 border-primary-300 text-primary-700 font-medium rounded-lg hover:bg-primary-100"
            >
              {t('presets.weekend')}
            </button>
            <button
              onClick={() => applyPreset('peak')}
              className="px-4 py-2 bg-white border-2 border-primary-300 text-primary-700 font-medium rounded-lg hover:bg-primary-100"
            >
              {t('presets.peak')}
            </button>
            <button
              onClick={() => applyPreset('lowSeason')}
              className="px-4 py-2 bg-white border-2 border-primary-300 text-primary-700 font-medium rounded-lg hover:bg-primary-100"
            >
              {t('presets.lowSeason')}
            </button>
            <button
              onClick={() => applyPreset('lastMinute')}
              className="px-4 py-2 bg-white border-2 border-primary-300 text-primary-700 font-medium rounded-lg hover:bg-primary-100"
            >
              {t('presets.lastMinute')}
            </button>
          </div>

          <button
            onClick={bulkUpdateRates}
            className="w-full px-6 py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700"
          >
            {t('applyToRange')}
          </button>
        </div>
      )}

      {/* Rate Calendar */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            className="px-4 py-2 hover:bg-gray-200 rounded-lg"
          >
            ← Previous
          </button>
          <h2 className="text-xl font-bold text-gray-900">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
            className="px-4 py-2 hover:bg-gray-200 rounded-lg"
          >
            Next →
          </button>
        </div>

        <div className="grid grid-cols-7 bg-gray-100 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-semibold text-gray-700">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">{renderRateCalendar()}</div>
      </div>
    </div>
  );
}
