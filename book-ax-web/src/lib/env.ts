/**
 * Environment Variables Validation with Zod
 * 
 * This file validates all required environment variables at build/runtime
 * and provides type-safe exports.
 * 
 * Benefits:
 * - Fail-fast if critical env vars are missing
 * - Type-safe environment variable access
 * - Runtime validation with helpful error messages
 * - No more process.env.* scattered throughout the codebase
 */

import { z } from 'zod';

// Define environment variable schema
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Supabase (Public - can be exposed to client)
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL')
    .min(1, 'NEXT_PUBLIC_SUPABASE_URL is required'),
  
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  
  // Supabase (Server-only - NEVER expose to client!)
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, 'SUPABASE_SERVICE_ROLE_KEY is required for server-side operations'),
  
  // JWT Secrets (Server-only)
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters for security')
    .describe('Secret key for signing access tokens'),
  
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters for security')
    .describe('Secret key for signing refresh tokens'),
  
  // Stripe (Public)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .startsWith('pk_', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with pk_')
    .optional(),
  
  // Stripe (Server-only)
  STRIPE_SECRET_KEY: z
    .string()
    .startsWith('sk_', 'STRIPE_SECRET_KEY must start with sk_')
    .optional(),
  
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .startsWith('whsec_', 'STRIPE_WEBHOOK_SECRET must start with whsec_')
    .optional(),
  
  // App Configuration
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url('NEXT_PUBLIC_APP_URL must be a valid URL')
    .default('http://localhost:3000'),
  
  // Optional: Rate Limiting (Upstash Redis)
  UPSTASH_REDIS_REST_URL: z
    .string()
    .url('UPSTASH_REDIS_REST_URL must be a valid URL')
    .optional(),
  
  UPSTASH_REDIS_REST_TOKEN: z
    .string()
    .optional(),
});

// Parse and validate environment variables
function validateEnv() {
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      JWT_SECRET: process.env.JWT_SECRET,
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => {
        return `  ❌ ${err.path.join('.')}: ${err.message}`;
      }).join('\n');
      
      throw new Error(
        `\n🔴 ENVIRONMENT VARIABLES VALIDATION FAILED:\n\n${missingVars}\n\n` +
        `💡 Please check your .env.local file or Vercel environment variables.\n`
      );
    }
    throw error;
  }
}

// Export validated environment variables
export const env = validateEnv();

// TypeScript type for environment variables
export type Env = z.infer<typeof envSchema>;

// Helper function to check if a feature is enabled
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';

// Helper to check if optional features are configured
export const hasStripeConfigured = !!(
  env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && 
  env.STRIPE_SECRET_KEY
);

export const hasRateLimitingConfigured = !!(
  env.UPSTASH_REDIS_REST_URL && 
  env.UPSTASH_REDIS_REST_TOKEN
);
