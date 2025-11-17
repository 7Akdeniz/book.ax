-- =====================================================
-- BOOK.AX COMPLETE DATABASE SCHEMA
-- Production-ready PostgreSQL schema for hotel platform
-- Supports: Multi-language, PMS, Channel Manager, Revenue AI
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search
CREATE EXTENSION IF NOT EXISTS "cube"; -- Required for earthdistance
CREATE EXTENSION IF NOT EXISTS "earthdistance"; -- For geographic searches

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

CREATE TYPE user_role AS ENUM ('guest', 'hotelier', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'deleted');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    role user_role NOT NULL DEFAULT 'guest',
    status user_status NOT NULL DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    preferred_language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Refresh tokens for JWT
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_password_reset_tokens_user ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_expires ON password_reset_tokens(expires_at);

-- =====================================================
-- HOTELS & PROPERTIES
-- =====================================================

CREATE TYPE hotel_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE property_type AS ENUM ('hotel', 'hostel', 'apartment', 'villa', 'resort', 'guesthouse');

CREATE TABLE hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_type property_type NOT NULL DEFAULT 'hotel',
    status hotel_status NOT NULL DEFAULT 'pending',
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    website VARCHAR(255),
    address_street VARCHAR(255) NOT NULL,
    address_city VARCHAR(100) NOT NULL,
    address_state VARCHAR(100),
    address_postal_code VARCHAR(20),
    address_country VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    check_in_time TIME DEFAULT '14:00',
    check_out_time TIME DEFAULT '11:00',
    star_rating INTEGER CHECK (star_rating BETWEEN 1 AND 5),
    total_rooms INTEGER DEFAULT 0,
    commission_percentage DECIMAL(5, 2) DEFAULT 15.00 CHECK (commission_percentage BETWEEN 10.00 AND 50.00),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES users(id)
);

CREATE INDEX idx_hotels_owner ON hotels(owner_id);
CREATE INDEX idx_hotels_status ON hotels(status);
CREATE INDEX idx_hotels_city ON hotels(address_city);
CREATE INDEX idx_hotels_country ON hotels(address_country);
CREATE INDEX idx_hotels_location ON hotels USING gist (ll_to_earth(latitude, longitude));

-- Hotel translations (i18n support)
CREATE TABLE hotel_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    policies TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(hotel_id, language)
);

CREATE INDEX idx_hotel_translations_hotel ON hotel_translations(hotel_id);
CREATE INDEX idx_hotel_translations_language ON hotel_translations(language);

-- Hotel amenities
CREATE TABLE amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    icon VARCHAR(50),
    category VARCHAR(50)
);

CREATE TABLE amenity_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    UNIQUE(amenity_id, language)
);

CREATE INDEX idx_amenity_translations_amenity ON amenity_translations(amenity_id);

CREATE TABLE hotel_amenities (
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (hotel_id, amenity_id)
);

-- Hotel images
CREATE TABLE hotel_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hotel_images_hotel ON hotel_images(hotel_id);

-- =====================================================
-- ROOM CATEGORIES & INVENTORY
-- =====================================================

CREATE TABLE room_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    max_occupancy INTEGER NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL,
    total_rooms INTEGER NOT NULL,
    size_sqm DECIMAL(6, 2),
    bed_type VARCHAR(50),
    smoking_allowed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(hotel_id, code)
);

CREATE INDEX idx_room_categories_hotel ON room_categories(hotel_id);

-- Room category translations
CREATE TABLE room_category_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_category_id UUID NOT NULL REFERENCES room_categories(id) ON DELETE CASCADE,
    language VARCHAR(10) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(room_category_id, language)
);

CREATE INDEX idx_room_category_translations_category ON room_category_translations(room_category_id);

-- Room category amenities
CREATE TABLE room_category_amenities (
    room_category_id UUID NOT NULL REFERENCES room_categories(id) ON DELETE CASCADE,
    amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (room_category_id, amenity_id)
);

-- =====================================================
-- RATES & AVAILABILITY (INVENTORY CALENDAR)
-- =====================================================

CREATE TABLE rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_category_id UUID NOT NULL REFERENCES room_categories(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    min_stay INTEGER DEFAULT 1,
    max_stay INTEGER,
    closed_to_arrival BOOLEAN DEFAULT FALSE,
    closed_to_departure BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(room_category_id, date)
);

CREATE INDEX idx_rates_category_date ON rates(room_category_id, date);
CREATE INDEX idx_rates_date ON rates(date);

CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_category_id UUID NOT NULL REFERENCES room_categories(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_rooms INTEGER NOT NULL,
    available_rooms INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(room_category_id, date),
    CHECK (available_rooms >= 0 AND available_rooms <= total_rooms)
);

CREATE INDEX idx_inventory_category_date ON inventory(room_category_id, date);
CREATE INDEX idx_inventory_date ON inventory(date);

-- =====================================================
-- BOOKINGS & RESERVATIONS
-- =====================================================

CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show');
CREATE TYPE booking_source AS ENUM ('direct', 'booking_com', 'airbnb', 'expedia', 'agoda', 'other');

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(20) UNIQUE NOT NULL,
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    room_category_id UUID NOT NULL REFERENCES room_categories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    guest_first_name VARCHAR(100) NOT NULL,
    guest_last_name VARCHAR(100) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    guest_phone VARCHAR(50),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    num_guests INTEGER NOT NULL,
    num_rooms INTEGER NOT NULL DEFAULT 1,
    status booking_status NOT NULL DEFAULT 'pending',
    source booking_source NOT NULL DEFAULT 'direct',
    ota_booking_id VARCHAR(100),
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    commission_percentage DECIMAL(5, 2) NOT NULL,
    commission_amount DECIMAL(10, 2) NOT NULL,
    hotel_payout DECIMAL(10, 2) NOT NULL,
    special_requests TEXT,
    cancellation_date TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (check_out_date > check_in_date),
    CHECK (num_guests > 0),
    CHECK (num_rooms > 0)
);

CREATE INDEX idx_bookings_hotel ON bookings(hotel_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX idx_bookings_check_in ON bookings(check_in_date);
CREATE INDEX idx_bookings_check_out ON bookings(check_out_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_source ON bookings(source);

-- =====================================================
-- PAYMENTS
-- =====================================================

CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash');

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status payment_status NOT NULL DEFAULT 'pending',
    payment_method payment_method NOT NULL,
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    transaction_id VARCHAR(255),
    paid_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    refund_amount DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);

-- =====================================================
-- COMMISSIONS & PAYOUTS
-- =====================================================

CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');

CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    commission_amount DECIMAL(10, 2) NOT NULL,
    hotel_payout DECIMAL(10, 2) NOT NULL,
    commission_percentage DECIMAL(5, 2) NOT NULL,
    payout_status payout_status NOT NULL DEFAULT 'pending',
    payout_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_commissions_booking ON commissions(booking_id);
CREATE INDEX idx_commissions_hotel ON commissions(hotel_id);
CREATE INDEX idx_commissions_status ON commissions(payout_status);

-- =====================================================
-- PMS - HOUSEKEEPING
-- =====================================================

CREATE TYPE room_status AS ENUM ('clean', 'dirty', 'inspected', 'out_of_order', 'occupied');

CREATE TABLE housekeeping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    room_number VARCHAR(20) NOT NULL,
    room_category_id UUID NOT NULL REFERENCES room_categories(id) ON DELETE CASCADE,
    status room_status NOT NULL DEFAULT 'clean',
    assigned_to VARCHAR(100),
    notes TEXT,
    last_cleaned TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(hotel_id, room_number)
);

CREATE INDEX idx_housekeeping_hotel ON housekeeping(hotel_id);
CREATE INDEX idx_housekeeping_status ON housekeeping(status);

-- =====================================================
-- CHANNEL MANAGER - OTA CONNECTIONS
-- =====================================================

CREATE TYPE ota_status AS ENUM ('active', 'inactive', 'error');
CREATE TYPE sync_type AS ENUM ('rate_push', 'inventory_push', 'reservation_pull');

CREATE TABLE ota_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    ota_name VARCHAR(100) NOT NULL,
    ota_property_id VARCHAR(255) NOT NULL,
    ota_api_key VARCHAR(500),
    ota_api_secret VARCHAR(500),
    status ota_status NOT NULL DEFAULT 'inactive',
    last_sync TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(hotel_id, ota_name)
);

CREATE INDEX idx_ota_connections_hotel ON ota_connections(hotel_id);
CREATE INDEX idx_ota_connections_status ON ota_connections(status);

-- OTA room mapping (map local room categories to OTA room types)
CREATE TABLE ota_room_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ota_connection_id UUID NOT NULL REFERENCES ota_connections(id) ON DELETE CASCADE,
    room_category_id UUID NOT NULL REFERENCES room_categories(id) ON DELETE CASCADE,
    ota_room_type_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(ota_connection_id, room_category_id)
);

-- OTA sync logs
CREATE TABLE ota_sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ota_connection_id UUID NOT NULL REFERENCES ota_connections(id) ON DELETE CASCADE,
    sync_type sync_type NOT NULL,
    status VARCHAR(20) NOT NULL,
    request_payload JSONB,
    response_payload JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ota_sync_logs_connection ON ota_sync_logs(ota_connection_id);
CREATE INDEX idx_ota_sync_logs_created ON ota_sync_logs(created_at DESC);

-- =====================================================
-- REVENUE MANAGEMENT & AI PRICING
-- =====================================================

CREATE TABLE revenue_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    room_category_id UUID REFERENCES room_categories(id) ON DELETE CASCADE,
    rule_name VARCHAR(100) NOT NULL,
    min_price DECIMAL(10, 2),
    max_price DECIMAL(10, 2),
    occupancy_threshold DECIMAL(5, 2),
    price_adjustment_percentage DECIMAL(5, 2),
    days_before_arrival INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_revenue_rules_hotel ON revenue_rules(hotel_id);
CREATE INDEX idx_revenue_rules_active ON revenue_rules(is_active);

CREATE TABLE price_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_category_id UUID NOT NULL REFERENCES room_categories(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    current_price DECIMAL(10, 2) NOT NULL,
    recommended_price DECIMAL(10, 2) NOT NULL,
    confidence_score DECIMAL(3, 2),
    factors JSONB,
    applied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(room_category_id, date)
);

CREATE INDEX idx_price_recommendations_category_date ON price_recommendations(room_category_id, date);

-- Market intelligence data
CREATE TABLE market_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    average_price DECIMAL(10, 2),
    occupancy_rate DECIMAL(5, 2),
    event_name VARCHAR(255),
    event_impact VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(city, country, date)
);

CREATE INDEX idx_market_data_city_date ON market_data(city, date);

-- =====================================================
-- REVIEWS & RATINGS
-- =====================================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    cleanliness_rating INTEGER CHECK (cleanliness_rating BETWEEN 1 AND 5),
    location_rating INTEGER CHECK (location_rating BETWEEN 1 AND 5),
    service_rating INTEGER CHECK (service_rating BETWEEN 1 AND 5),
    value_rating INTEGER CHECK (value_rating BETWEEN 1 AND 5),
    comment TEXT,
    response TEXT,
    response_date TIMESTAMPTZ,
    is_verified BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_hotel ON reviews(hotel_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_published ON reviews(is_published);

-- =====================================================
-- SYSTEM SETTINGS & CONFIGURATION
-- =====================================================

CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locales and translations
CREATE TABLE locales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    locale_code VARCHAR(10) NOT NULL REFERENCES locales(code) ON DELETE CASCADE,
    key VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    namespace VARCHAR(50) DEFAULT 'common',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(locale_code, key, namespace)
);

CREATE INDEX idx_translations_locale ON translations(locale_code);
CREATE INDEX idx_translations_key ON translations(key);

-- =====================================================
-- TRIGGERS & FUNCTIONS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON hotels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_categories_updated_at BEFORE UPDATE ON room_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calculate commission on booking insert/update
CREATE OR REPLACE FUNCTION calculate_commission()
RETURNS TRIGGER AS $$
BEGIN
    NEW.commission_amount = NEW.total_amount * (NEW.commission_percentage / 100);
    NEW.hotel_payout = NEW.total_amount - NEW.commission_amount;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER booking_commission_trigger BEFORE INSERT OR UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION calculate_commission();

-- Auto-generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_reference IS NULL THEN
        NEW.booking_reference = 'BKX' || to_char(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER booking_reference_trigger BEFORE INSERT ON bookings
    FOR EACH ROW EXECUTE FUNCTION generate_booking_reference();

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Insert all 75 locales
INSERT INTO locales (code, name, native_name, is_active) VALUES
('en', 'English', 'English', TRUE),
('zh', 'Chinese', '中文', TRUE),
('hi', 'Hindi', 'हिन्दी', TRUE),
('es', 'Spanish', 'Español', TRUE),
('ar', 'Arabic', 'العربية', TRUE),
('fr', 'French', 'Français', TRUE),
('bn', 'Bengali', 'বাংলা', TRUE),
('pt', 'Portuguese', 'Português', TRUE),
('ru', 'Russian', 'Русский', TRUE),
('ur', 'Urdu', 'اردو', TRUE),
('id', 'Indonesian', 'Bahasa Indonesia', TRUE),
('de', 'German', 'Deutsch', TRUE),
('ja', 'Japanese', '日本語', TRUE),
('sw', 'Swahili', 'Kiswahili', TRUE),
('mr', 'Marathi', 'मराठी', TRUE),
('te', 'Telugu', 'తెలుగు', TRUE),
('tr', 'Turkish', 'Türkçe', TRUE),
('ta', 'Tamil', 'தமிழ்', TRUE),
('pa', 'Punjabi', 'ਪੰਜਾਬੀ', TRUE),
('vi', 'Vietnamese', 'Tiếng Việt', TRUE),
('ko', 'Korean', '한국어', TRUE),
('it', 'Italian', 'Italiano', TRUE),
('jv', 'Javanese', 'Basa Jawa', TRUE),
('yo', 'Yoruba', 'Yorùbá', TRUE),
('ha', 'Hausa', 'Hausa', TRUE),
('th', 'Thai', 'ไทย', TRUE),
('gu', 'Gujarati', 'ગુજરાતી', TRUE),
('fa', 'Persian', 'فارسی', TRUE),
('pl', 'Polish', 'Polski', TRUE),
('uk', 'Ukrainian', 'Українська', TRUE),
('my', 'Burmese', 'မြန်မာ', TRUE),
('ml', 'Malayalam', 'മലയാളം', TRUE),
('kn', 'Kannada', 'ಕನ್ನಡ', TRUE),
('am', 'Amharic', 'አማርኛ', TRUE),
('om', 'Oromo', 'Afaan Oromoo', TRUE),
('fil', 'Filipino', 'Filipino', TRUE),
('sd', 'Sindhi', 'سنڌي', TRUE),
('ne', 'Nepali', 'नेपाली', TRUE),
('si', 'Sinhala', 'සිංහල', TRUE),
('he', 'Hebrew', 'עברית', TRUE),
('nl', 'Dutch', 'Nederlands', TRUE),
('ro', 'Romanian', 'Română', TRUE),
('cs', 'Czech', 'Čeština', TRUE),
('el', 'Greek', 'Ελληνικά', TRUE),
('sv', 'Swedish', 'Svenska', TRUE),
('hu', 'Hungarian', 'Magyar', TRUE),
('az', 'Azerbaijani', 'Azərbaycan', TRUE),
('ps', 'Pashto', 'پښتو', TRUE),
('ms', 'Malay', 'Bahasa Melayu', TRUE),
('zu', 'Zulu', 'isiZulu', TRUE),
('so', 'Somali', 'Soomaali', TRUE),
('ig', 'Igbo', 'Igbo', TRUE),
('uz', 'Uzbek', 'Oʻzbekcha', TRUE),
('kk', 'Kazakh', 'Қазақша', TRUE),
('be', 'Belarusian', 'Беларуская', TRUE),
('km', 'Khmer', 'ខ្មែរ', TRUE),
('lo', 'Lao', 'ລາວ', TRUE),
('mg', 'Malagasy', 'Malagasy', TRUE),
('bg', 'Bulgarian', 'Български', TRUE),
('da', 'Danish', 'Dansk', TRUE),
('fi', 'Finnish', 'Suomi', TRUE),
('no', 'Norwegian', 'Norsk', TRUE),
('sk', 'Slovak', 'Slovenčina', TRUE),
('hr', 'Croatian', 'Hrvatski', TRUE),
('sr', 'Serbian', 'Српски', TRUE),
('bs', 'Bosnian', 'Bosanski', TRUE),
('hy', 'Armenian', 'Հայերեն', TRUE),
('sq', 'Albanian', 'Shqip', TRUE),
('lt', 'Lithuanian', 'Lietuvių', TRUE),
('lv', 'Latvian', 'Latviešu', TRUE),
('ka', 'Georgian', 'ქართული', TRUE),
('mn', 'Mongolian', 'Монгол', TRUE),
('ku', 'Kurdish', 'Kurdî', TRUE),
('ht', 'Haitian Creole', 'Kreyòl', TRUE),
('ca', 'Catalan', 'Català', TRUE);

-- Insert common amenities
INSERT INTO amenities (code, icon, category) VALUES
('wifi', 'wifi', 'internet'),
('parking', 'parking', 'general'),
('pool', 'pool', 'recreation'),
('gym', 'dumbbell', 'fitness'),
('restaurant', 'restaurant', 'dining'),
('bar', 'wine-glass', 'dining'),
('spa', 'spa', 'wellness'),
('air_conditioning', 'snowflake', 'comfort'),
('room_service', 'bell-concierge', 'service'),
('laundry', 'shirt', 'service'),
('pets_allowed', 'paw', 'policy'),
('non_smoking', 'ban-smoking', 'policy'),
('wheelchair_accessible', 'wheelchair', 'accessibility'),
('elevator', 'elevator', 'general'),
('24hr_reception', 'clock', 'service');

-- Insert default admin user (password: Admin123!)
-- Hash generated with bcrypt (10 rounds)
INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified) 
VALUES ('admin@book.ax', '$2a$10$z1wL8JooKL4FwBEmtM0rmOohB8RlfDVUfrr314UPBtPMm2SsuJDi', 'Admin', 'User', 'admin', TRUE)
ON CONFLICT (email) DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  email_verified = EXCLUDED.email_verified,
  status = 'active';

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
('default_commission', '{"percentage": 15.0}', 'Default commission percentage for new hotels'),
('tax_rate', '{"percentage": 19.0}', 'Default VAT/tax rate'),
('currencies', '{"default": "EUR", "supported": ["EUR", "USD", "GBP", "JPY", "CNY"]}', 'Supported currencies'),
('booking_buffer_days', '{"days": 0}', 'Minimum days before booking allowed'),
('cancellation_window_hours', '{"hours": 24}', 'Hours before check-in for free cancellation');

