/**
 * Client-side Authentication Utilities
 * 
 * Handles token storage, refresh, and authentication state
 */

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

const ACCESS_TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

/**
 * Store authentication tokens and user data
 */
export function setAuthData(tokens: AuthTokens, user: AuthUser): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  
  // Trigger storage event for AuthContext
  window.dispatchEvent(new StorageEvent('storage', {
    key: ACCESS_TOKEN_KEY,
    newValue: tokens.accessToken,
  }));
}

/**
 * Get access token
 */
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Get refresh token
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Get stored user data
 */
export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken() && !!getUser();
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    clearAuthData();
    return null;
  }

  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearAuthData();
      return null;
    }

    const data = await response.json();
    
    // Update tokens in localStorage
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    }
    
    // Trigger storage event to notify AuthContext
    window.dispatchEvent(new StorageEvent('storage', {
      key: ACCESS_TOKEN_KEY,
      newValue: data.accessToken,
    }));

    return data.accessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearAuthData();
    return null;
  }
}

/**
 * Make authenticated API request with automatic token refresh
 * Supports both Cookie-based auth and Bearer token auth
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let token = getAccessToken();

  console.log('authenticatedFetch: Starting request to', url);
  console.log('authenticatedFetch: Token from localStorage:', token ? 'present' : 'missing');

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Add Bearer token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('authenticatedFetch: Adding Bearer token to headers');
  } else {
    console.log('authenticatedFetch: No token in localStorage, relying on cookies');
  }

  // Always include credentials for cookie-based auth
  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Important: Include cookies!
  });

  console.log('authenticatedFetch: Response status:', response.status);

  // If 401, try different recovery strategies
  if (response.status === 401) {
    console.warn('authenticatedFetch: Got 401 Unauthorized');
    
    // Strategy 1: If we have a token, try to refresh it
    if (token) {
      console.log('authenticatedFetch: Attempting token refresh...');
      token = await refreshAccessToken();

      if (token) {
        console.log('authenticatedFetch: Token refreshed, retrying request...');
        
        // Retry with new token
        response = await fetch(url, {
          ...options,
          headers: {
            ...(options.headers as Record<string, string>),
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        console.log('authenticatedFetch: Retry response status:', response.status);
        
        if (response.ok) {
          return response;
        }
      }
    }

    // If still 401, user needs to login again
    console.error('authenticatedFetch: Authentication required - please login again');
    throw new Error('Authentication required');
  }

  return response;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    const token = getAccessToken();
    
    if (token) {
      // Call logout endpoint to invalidate refresh token
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearAuthData();
  }
}
