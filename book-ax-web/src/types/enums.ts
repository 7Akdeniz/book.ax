// Enums for the application

export enum UserRole {
  GUEST = 'guest',
  HOTELIER = 'hotelier',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

export enum HotelStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
}

export enum PropertyType {
  HOTEL = 'hotel',
  HOSTEL = 'hostel',
  APARTMENT = 'apartment',
  VILLA = 'villa',
  RESORT = 'resort',
  GUESTHOUSE = 'guesthouse',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export enum BookingSource {
  DIRECT = 'direct',
  BOOKING_COM = 'booking_com',
  AIRBNB = 'airbnb',
  EXPEDIA = 'expedia',
  AGODA = 'agoda',
  OTHER = 'other',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
}

export enum RoomStatus {
  CLEAN = 'clean',
  DIRTY = 'dirty',
  INSPECTED = 'inspected',
  OUT_OF_ORDER = 'out_of_order',
  OCCUPIED = 'occupied',
}

export enum OTAStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
}

export enum SyncType {
  RATE_PUSH = 'rate_push',
  INVENTORY_PUSH = 'inventory_push',
  RESERVATION_PULL = 'reservation_pull',
}
