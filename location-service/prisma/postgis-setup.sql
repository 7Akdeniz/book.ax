-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create spatial indexes (will be created by Prisma but we ensure they exist)
-- These are supplementary to what Prisma generates

-- Full-text search indexes for better autocomplete performance
CREATE INDEX IF NOT EXISTS idx_countries_name_trgm ON countries USING gin(name_en gin_trgm_ops, name_de gin_trgm_ops, name_es gin_trgm_ops, name_fr gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_cities_name_trgm ON cities USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_districts_name_trgm ON districts USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_pois_name_trgm ON points_of_interest USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_aliases_name_trgm ON location_aliases USING gin(alias_name gin_trgm_ops);

-- Enable pg_trgm extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Function to calculate distance between two points (returns km)
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 DOUBLE PRECISION,
  lon1 DOUBLE PRECISION,
  lat2 DOUBLE PRECISION,
  lon2 DOUBLE PRECISION
)
RETURNS DOUBLE PRECISION AS $$
BEGIN
  RETURN ST_Distance(
    ST_MakePoint(lon1, lat1)::geography,
    ST_MakePoint(lon2, lat2)::geography
  ) / 1000; -- Convert meters to kilometers
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to search nearby locations
CREATE OR REPLACE FUNCTION find_nearby_locations(
  target_lat DOUBLE PRECISION,
  target_lon DOUBLE PRECISION,
  radius_km DOUBLE PRECISION,
  location_table TEXT
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  distance_km DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY EXECUTE format(
    'SELECT id, name, 
     ST_Distance(location::geography, ST_MakePoint($1, $2)::geography) / 1000 as distance_km
     FROM %I
     WHERE ST_DWithin(location::geography, ST_MakePoint($1, $2)::geography, $3 * 1000)
     ORDER BY distance_km',
    location_table
  ) USING target_lon, target_lat, radius_km;
END;
$$ LANGUAGE plpgsql;
