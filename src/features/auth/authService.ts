/**
 * Authentication Service - Supabase Integration
 *
 * Dieser Service wrapped die Supabase Auth API und bietet eine
 * einheitliche Schnittstelle für die App.
 */

import {supabaseAuthService} from '@services/supabaseAuth';
import type {User} from '../../types/models';

// Re-export types für Kompatibilität
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
  user: User;
  token: string;
}

/**
 * Auth Service - verwendet jetzt Supabase statt Mock-Daten
 */
export const authService = {
  /**
   * Login mit Email und Passwort
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Supabase Service gibt bereits das richtige Format zurück
    return await supabaseAuthService.login(credentials);
  },

  /**
   * Neuen User registrieren
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    // Supabase Service gibt bereits das richtige Format zurück
    return await supabaseAuthService.register(data);
  },

  /**
   * Logout - löscht Session
   */
  async logout(): Promise<void> {
    await supabaseAuthService.logout();
  },

  /**
   * Aktuell eingeloggten User abrufen
   */
  async getCurrentUser(): Promise<User | null> {
    return await supabaseAuthService.getCurrentUser();
  },

  /**
   * Gespeicherte Session abrufen
   */
  async getStoredToken(): Promise<string | null> {
    const session = await supabaseAuthService.getSession();
    return session?.access_token || null;
  },

  /**
   * Passwort zurücksetzen
   */
  async resetPassword(email: string): Promise<void> {
    await supabaseAuthService.resetPassword(email);
  },

  /**
   * User-Profil aktualisieren
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    await supabaseAuthService.updateProfile({
      firstName: updates.firstName,
      lastName: updates.lastName,
    });

    // Aktualisiertes Profil abrufen
    const user = await supabaseAuthService.getCurrentUser();
    if (!user) {
      throw new Error('Fehler beim Abrufen des aktualisierten Profils');
    }
    return user;
  },
};
