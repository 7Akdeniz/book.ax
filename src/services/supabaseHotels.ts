import {supabase, isSupabaseConfigured} from '@services/supabase';
import {Hotel} from '../types/models';

export interface HotelSearchParams {
  location?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
}

class SupabaseHotelService {
  /**
   * Search hotels with filters
   */
  async searchHotels(params: HotelSearchParams = {}): Promise<Hotel[]> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase nicht konfiguriert - verwende Mock-Daten');
      return [];
    }

    let query = supabase.from('hotels').select('*');

    // Filter by location
    if (params.location) {
      query = query.ilike('location', `%${params.location}%`);
    }

    // Filter by price range
    if (params.minPrice !== undefined) {
      query = query.gte('price_per_night', params.minPrice);
    }
    if (params.maxPrice !== undefined) {
      query = query.lte('price_per_night', params.maxPrice);
    }

    // Filter by rating
    if (params.minRating !== undefined) {
      query = query.gte('rating', params.minRating);
    }

    // Order by rating
    query = query.order('rating', {ascending: false});

    const {data, error} = await query;

    if (error) {
      throw new Error('Fehler beim Laden der Hotels: ' + error.message);
    }

    return (data || []).map(this.mapToHotel);
  }

  /**
   * Get hotel by ID
   */
  async getHotelById(id: string): Promise<Hotel | null> {
    if (!isSupabaseConfigured()) {
      console.warn('Supabase nicht konfiguriert');
      return null;
    }

    const {data, error} = await supabase
      .from('hotels')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error('Hotel nicht gefunden: ' + error.message);
    }

    return data ? this.mapToHotel(data) : null;
  }

  /**
   * Get popular hotels (highest rated)
   */
  async getPopularHotels(limit: number = 10): Promise<Hotel[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    const {data, error} = await supabase
      .from('hotels')
      .select('*')
      .order('rating', {ascending: false})
      .order('review_count', {ascending: false})
      .limit(limit);

    if (error) {
      throw new Error('Fehler beim Laden der Hotels: ' + error.message);
    }

    return (data || []).map(this.mapToHotel);
  }

  /**
   * Get hotels near location (requires lat/lng in database)
   */
  async getHotelsNearLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 50
  ): Promise<Hotel[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }

    // Using PostGIS for geospatial queries
    // This requires: CREATE EXTENSION postgis; in Supabase SQL editor
    const {data, error} = await supabase.rpc('hotels_near_location', {
      lat: latitude,
      lng: longitude,
      radius_km: radiusKm,
    });

    if (error) {
      console.warn('Geo-Query failed, falling back to all hotels:', error.message);
      return this.searchHotels();
    }

    return (data || []).map(this.mapToHotel);
  }

  /**
   * Create new hotel (Admin only)
   */
  async createHotel(hotelData: Omit<Hotel, 'id'>): Promise<Hotel> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase nicht konfiguriert');
    }

    const {data, error} = await supabase
      .from('hotels')
      .insert({
        name: hotelData.name,
        description: hotelData.description,
        location: `${hotelData.city}, ${hotelData.country}`,
        price_per_night: hotelData.pricePerNight,
        rating: hotelData.rating,
        review_count: hotelData.reviewCount,
        amenities: hotelData.amenities,
        images: hotelData.images,
        latitude: hotelData.latitude,
        longitude: hotelData.longitude,
      })
      .select()
      .single();

    if (error) {
      throw new Error('Fehler beim Erstellen des Hotels: ' + error.message);
    }

    return this.mapToHotel(data);
  }

  /**
   * Update hotel (Admin only)
   */
  async updateHotel(id: string, updates: Partial<Hotel>): Promise<Hotel> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase nicht konfiguriert');
    }

    const updateData: any = {updated_at: new Date().toISOString()};

    if (updates.name) updateData.name = updates.name;
    if (updates.description) updateData.description = updates.description;
    if (updates.city || updates.country) {
      updateData.location = `${updates.city || ''}, ${updates.country || ''}`.trim();
    }
    if (updates.pricePerNight !== undefined) updateData.price_per_night = updates.pricePerNight;
    if (updates.rating !== undefined) updateData.rating = updates.rating;
    if (updates.reviewCount !== undefined) updateData.review_count = updates.reviewCount;
    if (updates.amenities) updateData.amenities = updates.amenities;
    if (updates.images) updateData.images = updates.images;
    if (updates.latitude !== undefined) updateData.latitude = updates.latitude;
    if (updates.longitude !== undefined) updateData.longitude = updates.longitude;

    const {data, error} = await supabase
      .from('hotels')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error('Fehler beim Aktualisieren des Hotels: ' + error.message);
    }

    return this.mapToHotel(data);
  }

  /**
   * Delete hotel (Admin only)
   */
  async deleteHotel(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase nicht konfiguriert');
    }

    const {error} = await supabase.from('hotels').delete().eq('id', id);

    if (error) {
      throw new Error('Fehler beim Löschen des Hotels: ' + error.message);
    }
  }

  /**
   * Map database row to Hotel model
   */
  private mapToHotel(data: any): Hotel {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      address: data.location || '',
      city: data.location || '',
      country: 'Deutschland',
      latitude: data.latitude || 0,
      longitude: data.longitude || 0,
      pricePerNight: data.price_per_night,
      currency: 'EUR',
      rating: data.rating,
      reviewCount: data.review_count,
      amenities: data.amenities || [],
      images: data.images || [],
    };
  }
}

export const supabaseHotelService = new SupabaseHotelService();
