/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../common/SearchBar';

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      searchPlaceholder: 'Where are you going?',
      searchPlaceholderExample: 'e.g. Berlin, Germany',
      destination: 'Destination',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      guests: 'Guests',
      numberOfGuests: 'Number of guests',
      searchHotels: 'Search hotels',
      searchHotelsButton: 'Search hotels',
      searchButton: 'Search',
    };
    return messages[key] ?? key;
  },
  useLocale: () => 'en',
}));

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useLocale: () => 'en',
}));

describe('SearchBar Component', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders all form fields', () => {
    render(<SearchBar />);
    
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/check-in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/check-out/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/guests/i)).toBeInTheDocument();
  });

  it('renders search button', () => {
    render(<SearchBar />);
    
    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeInTheDocument();
  });

  it('updates destination input value', () => {
    render(<SearchBar />);
    
    const input = screen.getByLabelText(/destination/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Berlin' } });
    
    expect(input.value).toBe('Berlin');
  });

  it('updates check-in date', () => {
    render(<SearchBar />);
    
    const input = screen.getByLabelText(/check-in/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '2025-12-01' } });
    
    expect(input.value).toBe('2025-12-01');
  });

  it('updates number of guests', () => {
    render(<SearchBar />);
    
    const input = screen.getByLabelText(/guests/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '4' } });
    
    expect(input.value).toBe('4');
  });

  it('submits form and navigates to search page', () => {
    render(<SearchBar />);
    
    // Fill form
    const destinationInput = screen.getByLabelText(/destination/i);
    const checkInInput = screen.getByLabelText(/check-in/i);
    const checkOutInput = screen.getByLabelText(/check-out/i);
    const guestsInput = screen.getByLabelText(/guests/i);
    
    fireEvent.change(destinationInput, { target: { value: 'Berlin' } });
    fireEvent.change(checkInInput, { target: { value: '2025-12-01' } });
    fireEvent.change(checkOutInput, { target: { value: '2025-12-05' } });
    fireEvent.change(guestsInput, { target: { value: '3' } });
    
    // Submit
    const form = screen.getByRole('search');
    fireEvent.submit(form);
    
    // Check navigation
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('/en/search?')
    );
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('destination=Berlin')
    );
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('guests=3')
    );
  });

  it('has proper ARIA labels for accessibility', () => {
    render(<SearchBar />);
    
    const form = screen.getByRole('search');
    expect(form).toHaveAttribute('aria-label');
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
  });

  it('enforces min and max guests', () => {
    render(<SearchBar />);
    
    const input = screen.getByLabelText(/guests/i) as HTMLInputElement;
    
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('max', '10');
  });
});
