import {supabase, isSupabaseConfigured} from '@services/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token: string;
}

class SupabaseAuthService {
  /**
   * Login with Email & Password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase ist nicht konfiguriert. Bitte .env Datei ausfüllen.');
    }

    const {data, error} = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      throw new Error('Login fehlgeschlagen');
    }

    // Get user profile from users table
    const {data: profile, error: profileError} = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      // If no profile exists, create one
      const {data: newProfile, error: createError} = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          first_name: '',
          last_name: '',
        })
        .select()
        .single();

      if (createError) {
        throw new Error('Fehler beim Erstellen des Profils');
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email!,
          firstName: newProfile.first_name,
          lastName: newProfile.last_name,
        },
        token: data.session.access_token,
      };
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        firstName: profile.first_name,
        lastName: profile.last_name,
      },
      token: data.session.access_token,
    };
  }

  /**
   * Register new user
   */
  async register(registerData: RegisterData): Promise<AuthResponse> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase ist nicht konfiguriert. Bitte .env Datei ausfüllen.');
    }

    // 1. Create auth user
    const {data, error} = await supabase.auth.signUp({
      email: registerData.email,
      password: registerData.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      throw new Error('Registrierung fehlgeschlagen');
    }

    // 2. Create user profile
    const {error: profileError} = await supabase.from('users').insert({
      id: data.user.id,
      email: registerData.email,
      first_name: registerData.firstName,
      last_name: registerData.lastName,
    });

    if (profileError) {
      throw new Error('Fehler beim Erstellen des Profils: ' + profileError.message);
    }

    return {
      user: {
        id: data.user.id,
        email: registerData.email,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
      },
      token: data.session.access_token,
    };
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    const {error} = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    await AsyncStorage.removeItem('token');
  }

  /**
   * Get current session
   */
  async getSession() {
    const {data, error} = await supabase.auth.getSession();
    if (error) {
      throw new Error(error.message);
    }
    return data.session;
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    const {data, error} = await supabase.auth.getUser();
    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      return null;
    }

    // Get user profile
    const {data: profile} = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (!profile) {
      return {
        id: data.user.id,
        email: data.user.email!,
        firstName: '',
        lastName: '',
      };
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      firstName: profile.first_name,
      lastName: profile.last_name,
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: {firstName?: string; lastName?: string}) {
    const {
      data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('Nicht angemeldet');
    }

    const {error} = await supabase
      .from('users')
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string) {
    const {error} = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      throw new Error(error.message);
    }
  }
}

export const supabaseAuthService = new SupabaseAuthService();
