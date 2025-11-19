/**
 * Search Service - Supabase Integration
 *
 * Dieser Service wrapped die Supabase Hotels API und bietet eine
 * einheitliche Schnittstelle für Hotel-Suche und -Verwaltung.
 */

import {supabaseHotelService} from '@services/supabaseHotels';
import type {Hotel, SearchFilters} from '../../types/models';

export const searchService = {
  /**
   * Hotels mit Filtern suchen
   */
  async searchHotels(filters: SearchFilters): Promise<Hotel[]> {
    // Supabase Hotel Service unterstützt alle wichtigen Filter
    // Amenities-Filter kann später über Post-Processing hinzugefügt werden
    return await supabaseHotelService.searchHotels({
      location: filters.destination,
      checkIn: filters.checkIn ? new Date(filters.checkIn) : undefined,
      checkOut: filters.checkOut ? new Date(filters.checkOut) : undefined,
      guests: filters.guests,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.rating,
    });
  },

  /**
   * Hotel nach ID abrufen
   */
  async getHotelById(id: string): Promise<Hotel | null> {
    return await supabaseHotelService.getHotelById(id);
  },

  /**
   * Featured/Beliebte Hotels abrufen
   */
  async getFeaturedHotels(): Promise<Hotel[]> {
    return await supabaseHotelService.getPopularHotels(10);
  },

  /**
   * Hotels in der Nähe einer Location finden
   */
  async getNearbyHotels(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
  ): Promise<Hotel[]> {
    return await supabaseHotelService.getHotelsNearLocation(latitude, longitude, radiusKm);
  },
};
