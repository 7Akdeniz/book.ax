export type PanelBookingStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'checked_out'
  | 'cancelled'
  | 'no_show';

export type PanelBookingSource = 'direct' | 'booking_com' | 'airbnb' | 'expedia' | 'other';

export interface PanelBookingWithDetails {
  id: string;
  booking_reference: string;
  room_category_name: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  num_rooms: number;
  subtotal: string;
  tax_amount: string;
  total_amount: string;
  commission_percentage: string;
  commission_amount: string;
  hotel_payout: string;
  status: PanelBookingStatus;
  source: PanelBookingSource;
  special_requests: string | null;
  cancellation_reason?: string | null;
  cancellation_date?: string | null;
  created_at: string;
  updated_at: string;
}

export const statusTranslationKeyMap: Record<PanelBookingStatus, string> = {
  pending: 'pending',
  confirmed: 'confirmed',
  checked_in: 'checkedIn',
  checked_out: 'checkedOut',
  cancelled: 'cancelled',
  no_show: 'noShow',
};

export const statusBadgeClassMap: Record<PanelBookingStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  checked_in: 'bg-blue-100 text-blue-800',
  checked_out: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  no_show: 'bg-purple-100 text-purple-800',
};

export const sourceTranslationKeyMap: Record<PanelBookingSource, string> = {
  direct: 'direct',
  booking_com: 'bookingCom',
  airbnb: 'airbnb',
  expedia: 'expedia',
  other: 'other',
};

export const sourceBadgeClassMap: Record<PanelBookingSource, string> = {
  direct: 'bg-blue-100 text-blue-800',
  booking_com: 'bg-indigo-100 text-indigo-800',
  airbnb: 'bg-pink-100 text-pink-800',
  expedia: 'bg-yellow-100 text-yellow-800',
  other: 'bg-gray-100 text-gray-800',
};
