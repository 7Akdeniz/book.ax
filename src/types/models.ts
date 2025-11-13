// Common Type Definitions

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImage?: string;
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  pricePerNight: number;
  currency: string;
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  type: RoomType;
  maxGuests: number;
  pricePerNight: number;
  images: string[];
  amenities: string[];
  available: boolean;
}

export enum RoomType {
  Single = 'single',
  Double = 'double',
  Suite = 'suite',
  Deluxe = 'deluxe',
}

export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  currency: string;
  status: BookingStatus;
  createdAt: string;
  hotel?: Hotel;
  room?: Room;
}

export enum BookingStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
  Completed = 'completed',
}

export interface SearchFilters {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  amenities?: string[];
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
