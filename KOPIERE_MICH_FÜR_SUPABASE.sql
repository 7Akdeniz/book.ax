-- ============================================
-- 🎯 KOPIERE ALLES VON HIER BIS ZUM ENDE
-- ============================================
-- 
-- WAS DU TUN MUSST:
-- 1. Markiere ALLES in dieser Datei (Cmd+A)
-- 2. Kopiere ALLES (Cmd+C)
-- 3. Gehe zu Supabase → SQL Editor → New Query
-- 4. Füge ALLES ein (Cmd+V)
-- 5. Klicke "Run"
-- 6. FERTIG! ✅
--
-- ============================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  phone_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 2. HOTELS TABLE
CREATE TABLE IF NOT EXISTS hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  price_per_night DECIMAL(10, 2) NOT NULL,
  rating DECIMAL(2, 1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER NOT NULL DEFAULT 0,
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hotels are viewable by everyone"
  ON hotels FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert hotels"
  ON hotels FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Only admins can update hotels"
  ON hotels FOR UPDATE
  USING (false);

CREATE POLICY "Only admins can delete hotels"
  ON hotels FOR DELETE
  USING (false);

CREATE INDEX idx_hotels_location ON hotels (location);
CREATE INDEX idx_hotels_price ON hotels (price_per_night);
CREATE INDEX idx_hotels_rating ON hotels (rating DESC);

CREATE TRIGGER update_hotels_updated_at
  BEFORE UPDATE ON hotels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 3. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE RESTRICT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL CHECK (check_out > check_in),
  guests INTEGER NOT NULL CHECK (guests > 0),
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX idx_bookings_user_id ON bookings (user_id);
CREATE INDEX idx_bookings_hotel_id ON bookings (hotel_id);
CREATE INDEX idx_bookings_check_in ON bookings (check_in);
CREATE INDEX idx_bookings_status ON bookings (status);

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(hotel_id, user_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_reviews_hotel_id ON reviews (hotel_id);
CREATE INDEX idx_reviews_user_id ON reviews (user_id);
CREATE INDEX idx_reviews_rating ON reviews (rating);

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. AUTO-UPDATE HOTEL RATING
CREATE OR REPLACE FUNCTION update_hotel_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE hotels
  SET 
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM reviews
      WHERE hotel_id = NEW.hotel_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE hotel_id = NEW.hotel_id
    )
  WHERE id = NEW.hotel_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_hotel_rating
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_hotel_rating();

-- 6. GEO-SPATIAL QUERIES
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE OR REPLACE FUNCTION hotels_near_location(
  lat DECIMAL,
  lng DECIMAL,
  radius_km INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  location TEXT,
  price_per_night DECIMAL,
  rating DECIMAL,
  review_count INTEGER,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    h.id,
    h.name,
    h.location,
    h.price_per_night,
    h.rating,
    h.review_count,
    ROUND(
      ST_DistanceSphere(
        ST_MakePoint(h.longitude, h.latitude),
        ST_MakePoint(lng, lat)
      ) / 1000
    )::DECIMAL AS distance_km
  FROM hotels h
  WHERE 
    h.latitude IS NOT NULL 
    AND h.longitude IS NOT NULL
    AND ST_DWithin(
      ST_MakePoint(h.longitude, h.latitude)::geography,
      ST_MakePoint(lng, lat)::geography,
      radius_km * 1000
    )
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;

-- 7. SAMPLE HOTELS (zum Testen)
INSERT INTO hotels (name, description, location, latitude, longitude, price_per_night, rating, review_count, amenities, images)
SELECT 
  'Grand Hotel Berlin',
  'Luxuriöses 5-Sterne Hotel im Herzen von Berlin mit atemberaubender Aussicht.',
  'Berlin, Deutschland',
  52.5200,
  13.4050,
  250.00,
  4.8,
  342,
  ARRAY['WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Parkplatz', 'Fitnessstudio'],
  ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b']
WHERE NOT EXISTS (SELECT 1 FROM hotels LIMIT 1);

INSERT INTO hotels (name, description, location, latitude, longitude, price_per_night, rating, review_count, amenities, images)
SELECT
  'Seaside Resort München',
  'Modernes Hotel mit Blick auf die Berge, perfekt für Business und Freizeit.',
  'München, Deutschland',
  48.1351,
  11.5820,
  180.00,
  4.6,
  278,
  ARRAY['WiFi', 'Restaurant', 'Bar', 'Parkplatz', 'Fitnessstudio', 'Konferenzräume'],
  ARRAY['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9']
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE name = 'Seaside Resort München');

-- ============================================
-- ✅ FERTIG!
-- ============================================
