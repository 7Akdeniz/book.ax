// Database Models

export type UserRole = 'guest' | 'hotelier' | 'admin';
export type UserStatus = 'active' | 'suspended' | 'deleted';

export interface User {
  id: string;
  email: string;
  password_hash?: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  email_verified: boolean;
  preferred_language: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export type HotelStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type PropertyType = 'hotel' | 'hostel' | 'apartment' | 'villa' | 'resort' | 'guesthouse';

export interface Hotel {
  id: string;
  owner_id: string;
  property_type: PropertyType;
  status: HotelStatus;
  email: string;
  phone: string;
  website?: string;
  address_street: string;
  address_city: string;
  address_state?: string;
  address_postal_code?: string;
  address_country: string;
  latitude?: number;
  longitude?: number;
  check_in_time: string;
  check_out_time: string;
  star_rating?: number;
  total_rooms: number;
  commission_percentage: number;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  approved_by?: string;
}

export interface HotelTranslation {
  id: string;
  hotel_id: string;
  language: string;
  name: string;
  description?: string;
  policies?: string;
  created_at: string;
  updated_at: string;
}

export interface RoomCategory {
  id: string;
  hotel_id: string;
  code: string;
  max_occupancy: number;
  base_price: number;
  total_rooms: number;
  size_sqm?: number;
  bed_type?: string;
  smoking_allowed: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoomCategoryTranslation {
  id: string;
  room_category_id: string;
  language: string;
  name: string;
  description?: string;
  created_at: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
export type BookingSource = 'direct' | 'booking_com' | 'airbnb' | 'expedia' | 'agoda' | 'other';

export interface Booking {
  id: string;
  booking_reference: string;
  hotel_id: string;
  room_category_id: string;
  user_id?: string;
  guest_first_name: string;
  guest_last_name: string;
  guest_email: string;
  guest_phone?: string;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  num_rooms: number;
  status: BookingStatus;
  source: BookingSource;
  ota_booking_id?: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  commission_percentage: number;
  commission_amount: number;
  hotel_payout: number;
  special_requests?: string;
  cancellation_date?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'cash';

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: PaymentMethod;
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  transaction_id?: string;
  paid_at?: string;
  refunded_at?: string;
  refund_amount?: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  hotel_id: string;
  user_id?: string;
  rating: number;
  cleanliness_rating?: number;
  location_rating?: number;
  service_rating?: number;
  value_rating?: number;
  comment?: string;
  response?: string;
  response_date?: string;
  is_verified: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Amenity {
  id: string;
  code: string;
  icon?: string;
  category?: string;
}

// Extended types with relations
export interface HotelWithTranslations extends Hotel {
  translations: HotelTranslation[];
  amenities?: Amenity[];
  images?: HotelImage[];
  room_categories?: RoomCategoryWithTranslations[];
  reviews?: Review[];
  average_rating?: number;
  total_reviews?: number;
}

export interface RoomCategoryWithTranslations extends RoomCategory {
  translations: RoomCategoryTranslation[];
  amenities?: Amenity[];
}

export interface BookingWithDetails extends Booking {
  hotel?: HotelWithTranslations;
  room_category?: RoomCategoryWithTranslations;
  user?: User;
  payment?: Payment;
}

export interface HotelImage {
  id: string;
  hotel_id: string;
  url: string;
  alt_text?: string;
  display_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface Rate {
  id: string;
  room_category_id: string;
  date: string;
  price: number;
  min_stay: number;
  max_stay?: number;
  closed_to_arrival: boolean;
  closed_to_departure: boolean;
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  id: string;
  room_category_id: string;
  date: string;
  total_rooms: number;
  available_rooms: number;
  created_at: string;
  updated_at: string;
}

export type RoomStatus = 'clean' | 'dirty' | 'inspected' | 'out_of_order' | 'occupied';

export interface Housekeeping {
  id: string;
  hotel_id: string;
  room_number: string;
  room_category_id: string;
  status: RoomStatus;
  assigned_to?: string;
  notes?: string;
  last_cleaned?: string;
  created_at: string;
  updated_at: string;
}
