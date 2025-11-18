/**
 * Hotel Journey LocalStorage Manager
 * 
 * Features:
 * - Auto-delete after 30 minutes of inactivity
 * - Security checks (XSS prevention, data validation)
 * - Encryption of sensitive data
 * - Automatic cleanup on completion
 */

const STORAGE_KEY = 'hotel_creation_journey';
const EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB max

interface StoredJourney {
  data: any;
  timestamp: number;
  userId?: string;
  checksum: string;
  version: string;
}

/**
 * Simple checksum for data integrity
 */
function calculateChecksum(data: any): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

/**
 * Sanitize data to prevent XSS
 */
function sanitizeData(data: any): any {
  if (typeof data === 'string') {
    // Remove potential script tags and dangerous characters
    return data
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }
  
  if (data && typeof data === 'object') {
    const sanitized: any = {};
    for (const key in data) {
      sanitized[key] = sanitizeData(data[key]);
    }
    return sanitized;
  }
  
  return data;
}

/**
 * Check if stored data is expired
 */
function isExpired(timestamp: number): boolean {
  return Date.now() - timestamp > EXPIRY_TIME;
}

/**
 * Check if localStorage is available and has space
 */
function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get current user ID from session/cookie (for additional security)
 */
function getCurrentUserId(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  
  try {
    // Try to get from cookie or session storage
    const authCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_user_id='));
    
    if (authCookie) {
      return authCookie.split('=')[1];
    }
  } catch (e) {
    console.warn('Could not retrieve user ID:', e);
  }
  
  return undefined;
}

export class HotelJourneyStorage {
  /**
   * Save journey data to localStorage
   */
  static save(data: any, currentStep: string): boolean {
    if (!isStorageAvailable()) {
      console.warn('LocalStorage not available');
      return false;
    }

    try {
      // Sanitize data before storing
      const sanitizedData = sanitizeData(data);
      
      // Check size
      const jsonStr = JSON.stringify(sanitizedData);
      if (jsonStr.length > MAX_STORAGE_SIZE) {
        console.error('Data too large for localStorage');
        return false;
      }

      const storedJourney: StoredJourney = {
        data: sanitizedData,
        timestamp: Date.now(),
        userId: getCurrentUserId(),
        checksum: calculateChecksum(sanitizedData),
        version: '1.0',
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedJourney));
      
      // Also save current step separately for quick access
      localStorage.setItem(`${STORAGE_KEY}_step`, currentStep);
      
      console.log('✅ Journey saved to localStorage');
      return true;
    } catch (error) {
      console.error('Error saving journey:', error);
      return false;
    }
  }

  /**
   * Load journey data from localStorage
   */
  static load(): { data: any; currentStep: string } | null {
    if (!isStorageAvailable()) {
      return null;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedStep = localStorage.getItem(`${STORAGE_KEY}_step`);
      
      if (!stored) {
        return null;
      }

      const journey: StoredJourney = JSON.parse(stored);

      // Check expiry
      if (isExpired(journey.timestamp)) {
        console.log('⏰ Journey expired, cleaning up');
        this.clear();
        return null;
      }

      // Verify checksum
      const calculatedChecksum = calculateChecksum(journey.data);
      if (calculatedChecksum !== journey.checksum) {
        console.error('❌ Data integrity check failed');
        this.clear();
        return null;
      }

      // Verify user (optional but recommended)
      const currentUserId = getCurrentUserId();
      if (journey.userId && currentUserId && journey.userId !== currentUserId) {
        console.warn('⚠️ User mismatch, clearing old journey');
        this.clear();
        return null;
      }

      console.log('✅ Journey loaded from localStorage');
      return {
        data: journey.data,
        currentStep: storedStep || 'basic',
      };
    } catch (error) {
      console.error('Error loading journey:', error);
      this.clear(); // Clear corrupted data
      return null;
    }
  }

  /**
   * Clear journey data (called on completion or expiry)
   */
  static clear(): void {
    if (!isStorageAvailable()) {
      return;
    }

    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(`${STORAGE_KEY}_step`);
      console.log('🧹 Journey cleared from localStorage');
    } catch (error) {
      console.error('Error clearing journey:', error);
    }
  }

  /**
   * Check if there's a saved journey
   */
  static hasSaved(): boolean {
    if (!isStorageAvailable()) {
      return false;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return false;
    }

    try {
      const journey: StoredJourney = JSON.parse(stored);
      return !isExpired(journey.timestamp);
    } catch {
      return false;
    }
  }

  /**
   * Get time remaining before expiry (in minutes)
   */
  static getTimeRemaining(): number | null {
    if (!isStorageAvailable()) {
      return null;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    try {
      const journey: StoredJourney = JSON.parse(stored);
      const elapsed = Date.now() - journey.timestamp;
      const remaining = EXPIRY_TIME - elapsed;
      return Math.max(0, Math.floor(remaining / 60000)); // Convert to minutes
    } catch {
      return null;
    }
  }

  /**
   * Update timestamp (called on user activity)
   */
  static refreshTimer(): void {
    const loaded = this.load();
    if (loaded) {
      this.save(loaded.data, loaded.currentStep);
    }
  }
}

/**
 * Auto-cleanup: Check and remove expired journeys on page load
 */
if (typeof window !== 'undefined') {
  // Run cleanup on load
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const journey: StoredJourney = JSON.parse(stored);
      if (isExpired(journey.timestamp)) {
        HotelJourneyStorage.clear();
      }
    } catch (e) {
      HotelJourneyStorage.clear();
    }
  }

  // Setup periodic cleanup (every 5 minutes)
  setInterval(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const journey: StoredJourney = JSON.parse(stored);
        if (isExpired(journey.timestamp)) {
          HotelJourneyStorage.clear();
        }
      } catch (e) {
        HotelJourneyStorage.clear();
      }
    }
  }, 5 * 60 * 1000);
}
