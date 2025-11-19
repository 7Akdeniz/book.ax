'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { authenticatedFetch, isAuthenticated, getUser } from '@/lib/auth/client';
import { calculateNights, formatCurrency } from '@/utils/formatting';

interface BookingData {
  hotelId: string;
  roomCategoryId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}

export default function BookingConfirmPage() {
  const t = useTranslations('booking');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hotelData, setHotelData] = useState<any>(null);
  const [roomData, setRoomData] = useState<any>(null);

  // Guest information form
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  // Booking data from URL params
  const bookingData: BookingData = {
    hotelId: searchParams.get('hotelId') || '',
    roomCategoryId: searchParams.get('roomCategoryId') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: parseInt(searchParams.get('guests') || '2'),
    rooms: parseInt(searchParams.get('rooms') || '1'),
  };

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      toast.error(t('loginRequired'));
      router.push(`/${locale}/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    // Load user data
    const user = getUser();
    if (user) {
      setGuestInfo(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      }));
    }

    // Load hotel and room data
    loadBookingData();
  }, []);

  const loadBookingData = async () => {
    try {
      // Load hotel data
      const hotelResponse = await fetch(`/api/hotels/${bookingData.hotelId}`);
      if (!hotelResponse.ok) throw new Error('Hotel not found');
      const hotel = await hotelResponse.json();
      setHotelData(hotel);

      // Load room category data
      const roomResponse = await fetch(
        `/api/hotels/${bookingData.hotelId}/rooms/${bookingData.roomCategoryId}`
      );
      if (!roomResponse.ok) throw new Error('Room not found');
      const room = await roomResponse.json();
      setRoomData(room);
    } catch (error) {
      console.error('Failed to load booking data:', error);
      toast.error(t('loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email || !guestInfo.phone) {
      toast.error(t('fillAllFields'));
      return;
    }

    try {
      setSubmitting(true);

      // Create booking
      const response = await authenticatedFetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: bookingData.hotelId,
          roomCategoryId: bookingData.roomCategoryId,
          checkInDate: bookingData.checkIn,
          checkOutDate: bookingData.checkOut,
          numGuests: bookingData.guests,
          numRooms: bookingData.rooms,
          guestFirstName: guestInfo.firstName,
          guestLastName: guestInfo.lastName,
          guestEmail: guestInfo.email,
          guestPhone: guestInfo.phone,
          specialRequests: guestInfo.specialRequests,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Booking failed');
      }

      const result = await response.json();
      
      toast.success(t('bookingCreated'));
      
      // Redirect to payment
      router.push(`/${locale}/booking/${result.booking.id}/payment`);
    } catch (error: any) {
      console.error('Booking failed:', error);
      toast.error(error.message || t('bookingFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!hotelData || !roomData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{t('dataNotFound')}</p>
        </div>
      </div>
    );
  }

  const nights = calculateNights(bookingData.checkIn, bookingData.checkOut);
  const roomPrice = roomData.base_price;
  const subtotal = roomPrice * nights * bookingData.rooms;
  const taxAmount = subtotal * 0.07;
  const totalAmount = subtotal + taxAmount;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('confirmBooking')}</h1>
          <p className="text-gray-600 mt-2">{t('reviewDetails')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('guestInformation')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('firstName')} *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={guestInfo.firstName}
                      onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('lastName')} *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={guestInfo.lastName}
                      onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={guestInfo.email}
                      onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('phone')} *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={guestInfo.phone}
                      onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('specialRequests')} ({t('optional')})
                  </label>
                  <textarea
                    id="specialRequests"
                    value={guestInfo.specialRequests}
                    onChange={(e) => setGuestInfo({ ...guestInfo, specialRequests: e.target.value })}
                    rows={4}
                    placeholder={t('specialRequestsPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {submitting ? t('processing') : t('proceedToPayment')}
                </button>
              </div>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{t('bookingSummary')}</h2>

              {/* Hotel Info */}
              <div className="mb-4 pb-4 border-b">
                <h3 className="font-semibold text-gray-900">{hotelData.name}</h3>
                <p className="text-sm text-gray-600">{hotelData.address_city}, {hotelData.address_country}</p>
              </div>

              {/* Room Info */}
              <div className="mb-4 pb-4 border-b">
                <h4 className="font-semibold text-gray-900 mb-1">{roomData.name}</h4>
                <p className="text-sm text-gray-600">
                  {bookingData.rooms} {bookingData.rooms === 1 ? t('room') : t('rooms')} · {bookingData.guests} {t('guests')}
                </p>
              </div>

              {/* Dates */}
              <div className="mb-4 pb-4 border-b space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('checkIn')}</span>
                  <span className="font-medium">{new Date(bookingData.checkIn).toLocaleDateString(locale)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('checkOut')}</span>
                  <span className="font-medium">{new Date(bookingData.checkOut).toLocaleDateString(locale)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('nights')}</span>
                  <span className="font-medium">{nights}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-4 pb-4 border-b">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{formatCurrency(roomPrice, 'EUR', locale)} × {nights} × {bookingData.rooms}</span>
                  <span>{formatCurrency(subtotal, 'EUR', locale)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t('taxes')}</span>
                  <span>{formatCurrency(taxAmount, 'EUR', locale)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>{t('total')}</span>
                <span>{formatCurrency(totalAmount, 'EUR', locale)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
