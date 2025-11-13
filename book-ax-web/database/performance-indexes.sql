-- ==============================================
-- Book.ax - Database Performance Indexes
-- ==============================================
-- Run this in Supabase SQL Editor
-- Execution Time: ~2-5 minutes (depending on data size)
-- ==============================================

-- Enable pg_trgm extension for full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ==============================================
-- HOTELS TABLE INDEXES
-- ==============================================

-- Primary search filters
CREATE INDEX IF NOT EXISTS idx_hotels_city 
  ON hotels(city) 
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_hotels_country 
  ON hotels(country) 
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_hotels_rating 
  ON hotels(rating) 
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_hotels_price 
  ON hotels(price_per_night) 
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_hotels_status 
  ON hotels(status);

-- Composite index for complex search queries
-- Covers: city + country + rating + price filters
CREATE INDEX IF NOT EXISTS idx_hotels_search_composite 
  ON hotels(city, country, status, rating, price_per_night)
  WHERE status = 'active';

-- Full-text search indexes (Trigram)
CREATE INDEX IF NOT EXISTS idx_hotels_name_trgm 
  ON hotels USING gin(name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_hotels_description_trgm 
  ON hotels USING gin(description gin_trgm_ops);

-- Geolocation search (if you have lat/lng columns)
-- CREATE INDEX IF NOT EXISTS idx_hotels_location 
--   ON hotels USING gist(ll_to_earth(latitude, longitude));

-- ==============================================
-- BOOKINGS TABLE INDEXES
-- ==============================================

-- User bookings lookup
CREATE INDEX IF NOT EXISTS idx_bookings_user_id 
  ON bookings(user_id);

-- Hotel bookings lookup
CREATE INDEX IF NOT EXISTS idx_bookings_hotel_id 
  ON bookings(hotel_id);

-- Booking status filter
CREATE INDEX IF NOT EXISTS idx_bookings_status 
  ON bookings(status);

-- Date range searches
CREATE INDEX IF NOT EXISTS idx_bookings_check_in 
  ON bookings(check_in_date);

CREATE INDEX IF NOT EXISTS idx_bookings_check_out 
  ON bookings(check_out_date);

-- Composite index for availability checks
-- Critical for: "Is room available for these dates?"
CREATE INDEX IF NOT EXISTS idx_bookings_availability 
  ON bookings(hotel_id, check_in_date, check_out_date, status)
  WHERE status IN ('confirmed', 'checked_in');

-- User bookings with status filter
CREATE INDEX IF NOT EXISTS idx_bookings_user_status 
  ON bookings(user_id, status, created_at DESC);

-- ==============================================
-- USERS TABLE INDEXES
-- ==============================================

-- Email lookup (case-insensitive, unique)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower 
  ON users(LOWER(email));

-- Status filter
CREATE INDEX IF NOT EXISTS idx_users_status 
  ON users(status);

-- Role filter (for admin queries)
CREATE INDEX IF NOT EXISTS idx_users_role 
  ON users(role);

-- Last login tracking
CREATE INDEX IF NOT EXISTS idx_users_last_login 
  ON users(last_login DESC NULLS LAST);

-- ==============================================
-- PAYMENTS TABLE INDEXES
-- ==============================================

-- Booking payment lookup
CREATE INDEX IF NOT EXISTS idx_payments_booking_id 
  ON payments(booking_id);

-- User payments history
CREATE INDEX IF NOT EXISTS idx_payments_user_id 
  ON payments(user_id);

-- Payment status filter
CREATE INDEX IF NOT EXISTS idx_payments_status 
  ON payments(status);

-- Stripe payment intent lookup
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent 
  ON payments(stripe_payment_intent_id);

-- Stripe charge ID lookup
CREATE INDEX IF NOT EXISTS idx_payments_stripe_charge 
  ON payments(stripe_charge_id);

-- Payment date for reports
CREATE INDEX IF NOT EXISTS idx_payments_paid_at 
  ON payments(paid_at DESC NULLS LAST);

-- ==============================================
-- REFRESH_TOKENS TABLE INDEXES
-- ==============================================

-- User tokens lookup
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id 
  ON refresh_tokens(user_id);

-- Token lookup (for validation)
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token 
  ON refresh_tokens(token);

-- Expired tokens cleanup
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at 
  ON refresh_tokens(expires_at) 
  WHERE NOT revoked;

-- ==============================================
-- REVIEWS TABLE INDEXES (if exists)
-- ==============================================

-- CREATE INDEX IF NOT EXISTS idx_reviews_hotel_id 
--   ON reviews(hotel_id);

-- CREATE INDEX IF NOT EXISTS idx_reviews_user_id 
--   ON reviews(user_id);

-- CREATE INDEX IF NOT EXISTS idx_reviews_rating 
--   ON reviews(rating);

-- ==============================================
-- HOTEL_AMENITIES TABLE INDEXES (if exists)
-- ==============================================

-- CREATE INDEX IF NOT EXISTS idx_hotel_amenities_hotel_id 
--   ON hotel_amenities(hotel_id);

-- CREATE INDEX IF NOT EXISTS idx_hotel_amenities_amenity_type 
--   ON hotel_amenities(amenity_type);

-- ==============================================
-- CLEANUP FUNCTIONS
-- ==============================================

-- Automatic cleanup for expired refresh tokens
CREATE OR REPLACE FUNCTION cleanup_expired_refresh_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM refresh_tokens
  WHERE expires_at < NOW() - INTERVAL '30 days'
  OR (revoked = true AND updated_at < NOW() - INTERVAL '7 days');
  
  RAISE NOTICE 'Cleaned up expired refresh tokens';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Automatic cleanup for abandoned bookings
CREATE OR REPLACE FUNCTION cleanup_abandoned_bookings()
RETURNS void AS $$
BEGIN
  UPDATE bookings
  SET status = 'cancelled'
  WHERE status = 'pending'
  AND created_at < NOW() - INTERVAL '24 hours';
  
  RAISE NOTICE 'Cleaned up abandoned bookings';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- CRONJOBS (requires pg_cron extension)
-- ==============================================

-- Enable pg_cron extension (run as superuser in Supabase dashboard)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule cleanup jobs (run daily at 2 AM UTC)
-- SELECT cron.schedule(
--   'cleanup-refresh-tokens',
--   '0 2 * * *',
--   'SELECT cleanup_expired_refresh_tokens()'
-- );

-- SELECT cron.schedule(
--   'cleanup-abandoned-bookings',
--   '0 3 * * *',
--   'SELECT cleanup_abandoned_bookings()'
-- );

-- ==============================================
-- VACUUM & ANALYZE
-- ==============================================

-- Optimize tables after creating indexes
VACUUM ANALYZE hotels;
VACUUM ANALYZE bookings;
VACUUM ANALYZE users;
VACUUM ANALYZE payments;
VACUUM ANALYZE refresh_tokens;

-- ==============================================
-- VERIFICATION QUERIES
-- ==============================================

-- Check all indexes
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check index usage statistics (run after some production traffic)
-- SELECT 
--   schemaname,
--   tablename,
--   indexname,
--   idx_scan as index_scans,
--   idx_tup_read as tuples_read,
--   idx_tup_fetch as tuples_fetched
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'public'
-- ORDER BY idx_scan DESC;

-- ==============================================
-- PERFORMANCE TIPS
-- ==============================================

/*
1. Monitor slow queries:
   - Enable Supabase slow query log
   - Use EXPLAIN ANALYZE for query planning

2. Index maintenance:
   - Reindex periodically: REINDEX TABLE hotels;
   - Monitor index bloat

3. Composite index order matters:
   - Most selective column first
   - Match your WHERE clause order

4. Avoid over-indexing:
   - Each index slows down INSERT/UPDATE
   - Monitor write performance

5. Partial indexes (WHERE clauses):
   - Save space
   - Faster for filtered queries
*/

-- ==============================================
-- SUCCESS MESSAGE
-- ==============================================

DO $$
BEGIN
  RAISE NOTICE '✅ All indexes created successfully!';
  RAISE NOTICE '📊 Run EXPLAIN ANALYZE on your queries to verify index usage';
  RAISE NOTICE '⚡ Expected performance improvement: 10-100x faster queries';
END $$;
