/**
 * useBooking Hook
 *
 * Custom Hook für Buchungsverwaltung
 */

import {useAppDispatch, useAppSelector} from '@store/hooks';
import {
  createBookingStart,
  createBookingSuccess,
  createBookingFailure,
  loadBookingsStart,
  loadBookingsSuccess,
  loadBookingsFailure,
  cancelBookingStart,
  cancelBookingSuccess,
  cancelBookingFailure,
  clearCurrentBooking,
} from '../bookingSlice';
import {bookingService, CreateBookingData} from '../bookingService';

export const useBooking = () => {
  const dispatch = useAppDispatch();
  const {bookings, currentBooking, isLoading, error} = useAppSelector(state => state.booking);

  /**
   * Neue Buchung erstellen
   */
  const createBooking = async (data: CreateBookingData) => {
    try {
      dispatch(createBookingStart());
      const booking = await bookingService.createBooking(data);
      dispatch(createBookingSuccess(booking));
      return {success: true, booking};
    } catch (err: any) {
      const errorMessage = err.message || 'Buchung fehlgeschlagen';
      dispatch(createBookingFailure(errorMessage));
      return {success: false, error: errorMessage};
    }
  };

  /**
   * Alle Buchungen des Users laden
   */
  const loadUserBookings = async () => {
    try {
      dispatch(loadBookingsStart());
      const fetchedBookings = await bookingService.getUserBookings();
      dispatch(loadBookingsSuccess(fetchedBookings));
      return {success: true, bookings: fetchedBookings};
    } catch (err: any) {
      const errorMessage = err.message || 'Fehler beim Laden der Buchungen';
      dispatch(loadBookingsFailure(errorMessage));
      return {success: false, error: errorMessage};
    }
  };

  /**
   * Buchung stornieren
   */
  const cancelBooking = async (bookingId: string) => {
    try {
      dispatch(cancelBookingStart());
      await bookingService.cancelBooking(bookingId);
      dispatch(cancelBookingSuccess(bookingId));
      return {success: true};
    } catch (err: any) {
      const errorMessage = err.message || 'Stornierung fehlgeschlagen';
      dispatch(cancelBookingFailure(errorMessage));
      return {success: false, error: errorMessage};
    }
  };

  /**
   * Kommende Buchungen laden
   */
  const loadUpcomingBookings = async () => {
    try {
      dispatch(loadBookingsStart());
      const fetchedBookings = await bookingService.getUpcomingBookings();
      dispatch(loadBookingsSuccess(fetchedBookings));
      return {success: true, bookings: fetchedBookings};
    } catch (err: any) {
      const errorMessage = err.message || 'Fehler beim Laden der Buchungen';
      dispatch(loadBookingsFailure(errorMessage));
      return {success: false, error: errorMessage};
    }
  };

  /**
   * Vergangene Buchungen laden
   */
  const loadPastBookings = async () => {
    try {
      dispatch(loadBookingsStart());
      const fetchedBookings = await bookingService.getPastBookings();
      dispatch(loadBookingsSuccess(fetchedBookings));
      return {success: true, bookings: fetchedBookings};
    } catch (err: any) {
      const errorMessage = err.message || 'Fehler beim Laden der Buchungen';
      dispatch(loadBookingsFailure(errorMessage));
      return {success: false, error: errorMessage};
    }
  };

  /**
   * Aktuelle Buchung zurücksetzen
   */
  const clearCurrent = () => {
    dispatch(clearCurrentBooking());
  };

  return {
    bookings,
    currentBooking,
    isLoading,
    error,
    createBooking,
    loadUserBookings,
    cancelBooking,
    loadUpcomingBookings,
    loadPastBookings,
    clearCurrent,
  };
};
