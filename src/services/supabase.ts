import 'react-native-url-polyfill/auto';
import {createClient} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase Configuration
// Die Werte werden aus der .env Datei geladen
const SUPABASE_URL = 'https://cmoohnktsgszmuxxnobd.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtb29obmt0c2dzem14enhub2JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMDQ1MzEsImV4cCI6MjA3ODU4MDUzMX0.L7kr_rSTdcm_cBGquI9HkpbdW0oQgY2xqv0XhrvMru8';

// Supabase Client mit AsyncStorage für React Native
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper: Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  // Credentials sind jetzt hardcoded und immer konfiguriert
  return SUPABASE_URL.includes('supabase.co');
};

// Database Types (Auto-generiert aus Supabase Schema später)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          avatar_url?: string;
          updated_at?: string;
        };
      };
      hotels: {
        Row: {
          id: string;
          name: string;
          description: string;
          location: string;
          price_per_night: number;
          rating: number;
          review_count: number;
          amenities: string[];
          images: string[];
          latitude?: number;
          longitude?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          location: string;
          price_per_night: number;
          rating?: number;
          review_count?: number;
          amenities?: string[];
          images?: string[];
          latitude?: number;
          longitude?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          location?: string;
          price_per_night?: number;
          rating?: number;
          review_count?: number;
          amenities?: string[];
          images?: string[];
          latitude?: number;
          longitude?: number;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          hotel_id: string;
          check_in: string;
          check_out: string;
          guests: number;
          total_price: number;
          status: 'pending' | 'confirmed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          hotel_id: string;
          check_in: string;
          check_out: string;
          guests: number;
          total_price: number;
          status?: 'pending' | 'confirmed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          hotel_id?: string;
          check_in?: string;
          check_out?: string;
          guests?: number;
          total_price?: number;
          status?: 'pending' | 'confirmed' | 'cancelled';
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          hotel_id: string;
          user_id: string;
          rating: number;
          comment: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hotel_id: string;
          user_id: string;
          rating: number;
          comment: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hotel_id?: string;
          user_id?: string;
          rating?: number;
          comment?: string;
          updated_at?: string;
        };
      };
    };
  };
}
