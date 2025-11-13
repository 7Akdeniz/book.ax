// API Request & Response Types

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Auth API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'guest' | 'hotelier';
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Hotel Search API
export interface SearchHotelsRequest {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  amenities?: string[];
  propertyType?: string[];
  locale?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'rating' | 'distance';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchHotelsResponse {
  hotels: any[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Booking API
export interface CreateBookingRequest {
  hotelId: string;
  roomCategoryId: string;
  checkInDate: string;
  checkOutDate: string;
  numGuests: number;
  numRooms: number;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone?: string;
  specialRequests?: string;
}

export interface CreateBookingResponse {
  booking: any;
  paymentIntentClientSecret?: string;
}

// Payment API
export interface CreatePaymentIntentRequest {
  bookingId: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  amount: number;
  currency: string;
}

// Admin API
export interface ApproveHotelRequest {
  hotelId: string;
  approvedBy: string;
}

export interface UpdateCommissionRequest {
  hotelId: string;
  commissionPercentage: number;
}

// Channel Manager API
export interface PushRatesRequest {
  hotelId: string;
  roomCategoryId: string;
  rates: Array<{
    date: string;
    price: number;
    minStay?: number;
    closedToArrival?: boolean;
  }>;
}

export interface PushInventoryRequest {
  hotelId: string;
  roomCategoryId: string;
  inventory: Array<{
    date: string;
    totalRooms: number;
    availableRooms: number;
  }>;
}

// Revenue Management API
export interface GetPriceRecommendationsRequest {
  roomCategoryId: string;
  startDate: string;
  endDate: string;
}

export interface PriceRecommendation {
  date: string;
  currentPrice: number;
  recommendedPrice: number;
  confidenceScore: number;
  factors: {
    occupancy?: number;
    dayOfWeek?: number;
    events?: number;
    [key: string]: any;
  };
}

export interface ApplyPriceRecommendationsRequest {
  recommendationIds: string[];
}
