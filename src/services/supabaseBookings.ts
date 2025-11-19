import {supabase, isSupabaseConfigured} from '@services/supabase';
import {Booking} from '../types/models';

export interface CreateBookingData {
  hotelId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
}

class SupabaseBookingService {
  /**
   * Create new booking
   */
  async createBooking(bookingData: CreateBookingData): Promise<Booking> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase nicht konfiguriert');
    }

    // Get current user
    const {
      data: {user},
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Nicht angemeldet');
    }

    const {data, error} = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        hotel_id: bookingData.hotelId,
        check_in: bookingData.checkIn.toISOString(),
        check_out: bookingData.checkOut.toISOString(),
        guests: bookingData.guests,
        total_price: bookingData.totalPrice,
        status: 'pending',
      })
      .select(
        `
        *,
        hotels (*)
      `,
      )
      .single();

    if (error) {
      throw new Error('Fehler beim Erstellen der Buchung: ' + error.message);
    }

    return this.mapToBooking(data);
  }

  /**
   * Get user's bookings
   */
  async getUserBookings(): Promise<Booking[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const {
      data: {user},
    } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }

    const {data, error} = await supabase
      .from('bookings')
      .select(
        `
        *,
        hotels (*)
      `,
      )
      .eq('user_id', user.id)
      .order('created_at', {ascending: false});

    if (error) {
      throw new Error('Fehler beim Laden der Buchungen: ' + error.message);
    }

    return (data || []).map(this.mapToBooking);
  }

  /**
   * Get booking by ID
   */
  async getBookingById(id: string): Promise<Booking | null> {
    if (!isSupabaseConfigured()) {
      return null;
    }

    const {data, error} = await supabase
      .from('bookings')
      .select(
        `
        *,
        hotels (*)
      `,
      )
      .eq('id', id)
      .single();

    if (error) {
      throw new Error('Buchung nicht gefunden: ' + error.message);
    }

    return data ? this.mapToBooking(data) : null;
  }

  /**
   * Cancel booking
   */
  async cancelBooking(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase nicht konfiguriert');
    }

    const {error} = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      throw new Error('Fehler beim Stornieren der Buchung: ' + error.message);
    }
  }

  /**
   * Confirm booking (Admin/Auto)
   */
  async confirmBooking(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase nicht konfiguriert');
    }

    const {error} = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      throw new Error('Fehler beim Bestätigen der Buchung: ' + error.message);
    }
  }

  /**
   * Get upcoming bookings
   */
  async getUpcomingBookings(): Promise<Booking[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const {
      data: {user},
    } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }

    const {data, error} = await supabase
      .from('bookings')
      .select(
        `
        *,
        hotels (*)
      `,
      )
      .eq('user_id', user.id)
      .gte('check_in', new Date().toISOString())
      .order('check_in', {ascending: true});

    if (error) {
      throw new Error('Fehler beim Laden der Buchungen: ' + error.message);
    }

    return (data || []).map(this.mapToBooking);
  }

  /**
   * Get past bookings
   */
  async getPastBookings(): Promise<Booking[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const {
      data: {user},
    } = await supabase.auth.getUser();
    if (!user) {
      return [];
    }

    const {data, error} = await supabase
      .from('bookings')
      .select(
        `
        *,
        hotels (*)
      `,
      )
      .eq('user_id', user.id)
      .lt('check_out', new Date().toISOString())
      .order('check_out', {ascending: false});

    if (error) {
      throw new Error('Fehler beim Laden der Buchungen: ' + error.message);
    }

    return (data || []).map(this.mapToBooking);
  }

  /**
   * Map database row to Booking model
   */
  private mapToBooking(data: any): Booking {
    return {
      id: data.id,
      userId: data.user_id,
      hotelId: data.hotel_id,
      roomId: data.room_id || '',
      checkIn: data.check_in,
      checkOut: data.check_out,
      guests: data.guests,
      totalPrice: data.total_price,
      currency: 'EUR',
      status: data.status,
      createdAt: data.created_at,
    };
  }
}

export const supabaseBookingService = new SupabaseBookingService();
