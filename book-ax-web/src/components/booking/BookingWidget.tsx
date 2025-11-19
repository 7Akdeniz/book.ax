'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import DateRangePicker from './DateRangePicker';
import GuestSelector from './GuestSelector';
import RoomSelector from './RoomSelector';
import { calculateNights, formatCurrency } from '@/utils/formatting';
import { authenticatedFetch, isAuthenticated } from '@/lib/auth/client';

interface Room {
  id: string;
  name: string;
  base_price: number;
  max_occupancy: number;
  total_rooms: number;
}

interface BookingWidgetProps {
  hotelId: string;
  hotelName: string;
  rooms: Room[];
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  initialRooms?: number;
  locale: string;
}

export default function BookingWidget({
  hotelId,
  hotelName,
  rooms,
  initialCheckIn,
  initialCheckOut,
  initialGuests = 2,
  initialRooms = 1,
  locale,
}: BookingWidgetProps) {
  const t = useTranslations('booking');
  const router = useRouter();

  // Date states
  const [checkInDate, setCheckInDate] = useState<string>(initialCheckIn || '');
  const [checkOutDate, setCheckOutDate] = useState<string>(initialCheckOut || '');
  
  // Guest & Room states
  const [numGuests, setNumGuests] = useState(initialGuests);
  const [numRooms, setNumRooms] = useState(initialRooms);
  
  // Room selection
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || '');
  
  // Availability
  const [availability, setAvailability] = useState<any>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  
  // Booking state
  const [isBooking, setIsBooking] = useState(false);

  // Get selected room
  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  // Calculate pricing
  const nights = checkInDate && checkOutDate ? calculateNights(checkInDate, checkOutDate) : 0;
  const roomPrice = selectedRoom?.base_price || 0;
  const subtotal = roomPrice * nights * numRooms;
  const taxAmount = subtotal * 0.07; // 7% tax
  const totalAmount = subtotal + taxAmount;

  // Check availability when dates or room changes
  useEffect(() => {
    if (checkInDate && checkOutDate && selectedRoomId) {
      checkAvailability();
    }
  }, [checkInDate, checkOutDate, selectedRoomId, numRooms]);

  const checkAvailability = async () => {
    try {
      setCheckingAvailability(true);
      
      const response = await fetch(
        `/api/hotels/${hotelId}/availability?` +
        new URLSearchParams({
          checkIn: checkInDate,
          checkOut: checkOutDate,
          roomCategoryId: selectedRoomId,
          numRooms: numRooms.toString(),
        })
      );

      if (!response.ok) {
        throw new Error('Failed to check availability');
      }

      const data = await response.json();
      setAvailability(data);
    } catch (error) {
      console.error('Availability check failed:', error);
      toast.error(t('availabilityCheckFailed'));
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleBookNow = async () => {
    // Validate dates
    if (!checkInDate || !checkOutDate) {
      toast.error(t('selectDates'));
      return;
    }

    if (nights < 1) {
      toast.error(t('invalidDateRange'));
      return;
    }

    // Check authentication
    if (!isAuthenticated()) {
      toast.error(t('loginRequired'));
      router.push(`/${locale}/login?redirect=${encodeURIComponent(`/${locale}/hotel/${hotelId}`)}`);
      return;
    }

    // Check availability
    if (!availability?.available) {
      toast.error(t('roomNotAvailable'));
      return;
    }

    // Redirect to booking confirmation page with all data
    const bookingParams = new URLSearchParams({
      hotelId,
      roomCategoryId: selectedRoomId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: numGuests.toString(),
      rooms: numRooms.toString(),
    });

    router.push(`/${locale}/booking/confirm?${bookingParams.toString()}`);
  };

  const isAvailable = availability?.available && !checkingAvailability;
  const availableRooms = availability?.availableRooms || 0;

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 sticky top-4">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {t('bookYourStay')}
        </h3>
        <p className="text-gray-600">{hotelName}</p>
      </div>

      {/* Date Selection */}
      <div className="mb-6">
        <DateRangePicker
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          onCheckInChange={setCheckInDate}
          onCheckOutChange={setCheckOutDate}
          minDate={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Guest Selection */}
      <div className="mb-6">
        <GuestSelector
          numGuests={numGuests}
          numRooms={numRooms}
          onGuestsChange={setNumGuests}
          onRoomsChange={setNumRooms}
          maxGuests={selectedRoom ? selectedRoom.max_occupancy * numRooms : 10}
        />
      </div>

      {/* Room Selection */}
      <div className="mb-6">
        <RoomSelector
          rooms={rooms}
          selectedRoomId={selectedRoomId}
          onRoomChange={setSelectedRoomId}
          locale={locale}
        />
      </div>

      {/* Availability Status */}
      {checkInDate && checkOutDate && (
        <div className="mb-6">
          {checkingAvailability ? (
            <div className="flex items-center justify-center py-3 text-gray-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600 mr-2"></div>
              {t('checkingAvailability')}
            </div>
          ) : availability ? (
            isAvailable ? (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-lg p-3">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">
                  {t('available')} ({availableRooms} {t('roomsLeft')})
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg p-3">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{t('notAvailable')}</span>
              </div>
            )
          ) : null}
        </div>
      )}

      {/* Price Summary */}
      {nights > 0 && selectedRoom && (
        <div className="mb-6 border-t border-gray-200 pt-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>{formatCurrency(roomPrice, 'EUR', locale)} × {nights} {t('nights')} × {numRooms} {t('rooms')}</span>
              <span>{formatCurrency(subtotal, 'EUR', locale)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{t('taxes')}</span>
              <span>{formatCurrency(taxAmount, 'EUR', locale)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t">
              <span>{t('total')}</span>
              <span>{formatCurrency(totalAmount, 'EUR', locale)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Book Now Button */}
      <button
        onClick={handleBookNow}
        disabled={!isAvailable || checkingAvailability || !checkInDate || !checkOutDate}
        className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
          !isAvailable || checkingAvailability || !checkInDate || !checkOutDate
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
        }`}
      >
        {isBooking ? t('processing') : t('bookNow')}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        {t('freeCancel24h')}
      </p>
    </div>
  );
}
