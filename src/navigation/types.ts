// Navigation Type Definitions
import type {NavigatorScreenParams} from '@react-navigation/native';

// Root Stack Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  Search: NavigatorScreenParams<SearchStackParamList>;
  Bookings: NavigatorScreenParams<BookingsStackParamList>;
  Profile: undefined;
};

// Search Stack
export type SearchStackParamList = {
  SearchHome: undefined;
  SearchResults: {
    destination: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  };
  HotelDetails: {
    hotelId: string;
  };
  BookingConfirm: {
    hotelId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  };
};

// Bookings Stack
export type BookingsStackParamList = {
  BookingsList: undefined;
  BookingDetails: {
    bookingId: string;
  };
};

// Declare types for Navigation Props
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
