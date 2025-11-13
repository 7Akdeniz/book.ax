import { z } from 'zod';

// Email validation
export const emailSchema = z.string().email('Invalid email address');

export const isValidEmail = (email: string): boolean => {
  return emailSchema.safeParse(email).success;
};

// Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const isValidPassword = (password: string): boolean => {
  return passwordSchema.safeParse(password).success;
};

// Phone validation
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number');

export const isValidPhone = (phone: string): boolean => {
  return phoneSchema.safeParse(phone).success;
};

// Date validation
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format');

export const isValidDate = (date: string): boolean => {
  return dateSchema.safeParse(date).success;
};

export const isFutureDate = (date: string): boolean => {
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dateObj >= today;
};

export const isDateAfter = (date1: string, date2: string): boolean => {
  return new Date(date1) > new Date(date2);
};

// Booking validation
export const bookingSchema = z.object({
  hotelId: z.string().uuid(),
  roomCategoryId: z.string().uuid(),
  checkInDate: dateSchema.refine(isFutureDate, 'Check-in date must be in the future'),
  checkOutDate: dateSchema,
  numGuests: z.number().int().min(1).max(10),
  numRooms: z.number().int().min(1).max(10),
  guestFirstName: z.string().min(1).max(100),
  guestLastName: z.string().min(1).max(100),
  guestEmail: emailSchema,
  guestPhone: phoneSchema.optional(),
  specialRequests: z.string().max(500).optional(),
}).refine(
  (data) => isDateAfter(data.checkOutDate, data.checkInDate),
  {
    message: 'Check-out date must be after check-in date',
    path: ['checkOutDate'],
  }
);

// Hotel validation
export const hotelSchema = z.object({
  propertyType: z.enum(['hotel', 'hostel', 'apartment', 'villa', 'resort', 'guesthouse']),
  email: emailSchema,
  phone: phoneSchema,
  website: z.string().url().optional(),
  addressStreet: z.string().min(1).max(255),
  addressCity: z.string().min(1).max(100),
  addressState: z.string().max(100).optional(),
  addressPostalCode: z.string().max(20).optional(),
  addressCountry: z.string().min(1).max(100),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  checkInTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  checkOutTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  starRating: z.number().int().min(1).max(5).optional(),
  totalRooms: z.number().int().min(1),
  commissionPercentage: z.number().min(0).max(100),
  translations: z.array(z.object({
    language: z.string().length(2),
    name: z.string().min(1).max(255),
    description: z.string().max(2000).optional(),
    policies: z.string().max(2000).optional(),
  })).min(1),
});

// Review validation
export const reviewSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  cleanlinessRating: z.number().int().min(1).max(5).optional(),
  locationRating: z.number().int().min(1).max(5).optional(),
  serviceRating: z.number().int().min(1).max(5).optional(),
  valueRating: z.number().int().min(1).max(5).optional(),
  comment: z.string().min(10).max(1000).optional(),
});

// Login validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Register validation
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: z.enum(['guest', 'hotelier']),
});

// Search validation
export const searchSchema = z.object({
  destination: z.string().min(1).optional(),
  checkIn: dateSchema.optional(),
  checkOut: dateSchema.optional(),
  guests: z.number().int().min(1).max(10).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  minRating: z.number().min(1).max(5).optional(),
  amenities: z.array(z.string()).optional(),
  propertyType: z.array(z.string()).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  sortBy: z.enum(['price', 'rating', 'distance']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
