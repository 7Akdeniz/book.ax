/**
 * Booking Service - Supabase Integration
 * 
 * Service für Buchungsverwaltung mit Supabase
 */

import {supabaseBookingService} from '@services/supabaseBookings';
import type {Booking} from '../../types/models';

export interface CreateBookingData {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
}

export const bookingService = {
  /**
   * Neue Buchung erstellen
   */
  async createBooking(data: CreateBookingData): Promise<Booking> {
    return await supabaseBookingService.createBooking({
      hotelId: data.hotelId,
      checkIn: new Date(data.checkIn),
      checkOut: new Date(data.checkOut),
      guests: data.guests,
      totalPrice: data.totalPrice,
    });
  },

  /**
   * Alle Buchungen des aktuellen Users abrufen
   */
  async getUserBookings(): Promise<Booking[]> {
    return await supabaseBookingService.getUserBookings();
  },

  /**
   * Buchung nach ID abrufen
   */
  async getBookingById(id: string): Promise<Booking | null> {
    return await supabaseBookingService.getBookingById(id);
  },

  /**
   * Buchung stornieren
   */
  async cancelBooking(id: string): Promise<void> {
    await supabaseBookingService.cancelBooking(id);
  },

  /**
   * Buchung bestätigen
   */
  async confirmBooking(id: string): Promise<void> {
    await supabaseBookingService.confirmBooking(id);
  },

  /**
   * Kommende Buchungen abrufen
   */
  async getUpcomingBookings(): Promise<Booking[]> {
    return await supabaseBookingService.getUpcomingBookings();
  },

  /**
   * Vergangene Buchungen abrufen
   */
  async getPastBookings(): Promise<Booking[]> {
    return await supabaseBookingService.getPastBookings();
  },
};
