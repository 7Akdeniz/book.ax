// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key) => key,
  useLocale: () => 'en',
}));

// Mock environment variables for tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key-for-testing-only-min-32-chars';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key-for-testing-only-min-32-chars';
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only-min-32-characters';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-for-testing-only-min-32-chars';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
