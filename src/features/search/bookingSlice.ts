/**
 * Booking Redux Slice
 *
 * State Management für Buchungen
 */

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Booking, BookingStatus} from '../../types/models';

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    // Create Booking
    createBookingStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    createBookingSuccess: (state, action: PayloadAction<Booking>) => {
      state.isLoading = false;
      state.currentBooking = action.payload;
      state.bookings.push(action.payload);
      state.error = null;
    },
    createBookingFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Load User Bookings
    loadBookingsStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    loadBookingsSuccess: (state, action: PayloadAction<Booking[]>) => {
      state.isLoading = false;
      state.bookings = action.payload;
      state.error = null;
    },
    loadBookingsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Cancel Booking
    cancelBookingStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    cancelBookingSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      const index = state.bookings.findIndex(b => b.id === action.payload);
      if (index !== -1) {
        state.bookings[index].status = BookingStatus.Cancelled;
      }
      state.error = null;
    },
    cancelBookingFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Clear current booking
    clearCurrentBooking: state => {
      state.currentBooking = null;
    },

    // Clear error
    clearBookingError: state => {
      state.error = null;
    },
  },
});

export const {
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
  clearBookingError,
} = bookingSlice.actions;

export default bookingSlice.reducer;
