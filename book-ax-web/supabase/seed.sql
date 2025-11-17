-- =====================================================
-- BOOK.AX SEED DATA FOR LOCAL DEVELOPMENT
-- Demo Users, Hotels, and Bookings (Schema-Kompatibel)
-- =====================================================

-- Demo Users
-- Password for all: "Password123!" (bcrypt hash)
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, email_verified, preferred_language) VALUES
-- Guest User
('11111111-1111-1111-1111-111111111111', 'guest@bookax.local', '$2a$10$U4z.SJ8IZpU2vVQ6sWzWjOdSeOpOMlx0ShChu6TVooMTGBMLapZSm', 'Max', 'Mustermann', '+49 170 1234567', 'guest', TRUE, 'de'),

-- Hotelier User
('22222222-2222-2222-2222-222222222222', 'hotelier@bookax.local', '$2a$10$IeCTEsA1WKdJxGpOKX66kuXz199E6xkW6vUl22XwgZtzcmiIjUmJ.', 'Anna', 'Schmidt', '+49 170 7654321', 'hotelier', TRUE, 'de'),

-- Admin User
('33333333-3333-3333-3333-333333333333', 'admin@bookax.local', '$2a$10$Xd2HQVhJN21.Shfo58Rv6.g65vf9Ob6cq253MsEpnv9chb6tyjMza', 'Super', 'Admin', '+49 170 9999999', 'admin', TRUE, 'en');

-- Demo Hotel (ohne name/slug - die sind in hotel_translations!)
INSERT INTO hotels (
    id, 
    owner_id, 
    property_type,
    status,
    email, 
    phone, 
    website,
    address_street,
    address_city, 
    address_state, 
    address_country, 
    address_postal_code, 
    latitude, 
    longitude, 
    star_rating, 
    total_rooms,
    commission_percentage,
    check_in_time, 
    check_out_time
) VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
    '22222222-2222-2222-2222-222222222222', 
    'hotel',
    'approved',
    'info@grandhotel-berlin.de', 
    '+49 30 12345678', 
    'https://grandhotel-berlin.example',
    'Unter den Linden 77',
    'Berlin', 
    'Berlin', 
    'DE', 
    '10117', 
    52.5170365, 
    13.3888599, 
    5,
    50, 
    15.00,
    '15:00', 
    '11:00'
);

-- Hotel Translations (Name + Description sind hier!)
INSERT INTO hotel_translations (hotel_id, language, name, description) VALUES
-- Deutsch
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'de', 'Grand Hotel Berlin',
'Luxuriöses 5-Sterne Hotel im Herzen Berlins. Direkt an der berühmten Straße Unter den Linden gelegen, bietet unser Hotel erstklassigen Service und modernen Komfort. Ideal für Geschäfts- und Urlaubsreisende.'),

-- Englisch
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'en', 'Grand Hotel Berlin',
'Luxurious 5-star hotel in the heart of Berlin. Located directly on the famous Unter den Linden boulevard, our hotel offers first-class service and modern comfort. Ideal for business and leisure travelers.');

-- Amenities (Features die Hotels haben können)
INSERT INTO amenities (id, code, category, icon) VALUES
('91111111-1111-1111-1111-111111111111', 'WIFI', 'facility', 'wifi'),
('92222222-2222-2222-2222-222222222222', 'POOL', 'facility', 'pool'),
('93333333-3333-3333-3333-333333333333', 'SPA', 'facility', 'spa'),
('94444444-4444-4444-4444-444444444444', 'FITNESS', 'facility', 'fitness'),
('95555555-5555-5555-5555-555555555555', 'RESTAURANT', 'facility', 'restaurant'),
('96666666-6666-6666-6666-666666666666', 'BAR', 'facility', 'bar'),
('97777777-7777-7777-7777-777777777777', 'PARKING', 'facility', 'parking'),
('98888888-8888-8888-8888-888888888888', 'CONCIERGE', 'facility', 'concierge');

-- Amenity Translations
INSERT INTO amenity_translations (amenity_id, language, name) VALUES
-- WiFi
('91111111-1111-1111-1111-111111111111', 'de', 'WLAN'),
('91111111-1111-1111-1111-111111111111', 'en', 'WiFi'),
-- Pool
('92222222-2222-2222-2222-222222222222', 'de', 'Pool'),
('92222222-2222-2222-2222-222222222222', 'en', 'Pool'),
-- Spa
('93333333-3333-3333-3333-333333333333', 'de', 'Spa'),
('93333333-3333-3333-3333-333333333333', 'en', 'Spa'),
-- Fitness
('94444444-4444-4444-4444-444444444444', 'de', 'Fitness'),
('94444444-4444-4444-4444-444444444444', 'en', 'Fitness'),
-- Restaurant
('95555555-5555-5555-5555-555555555555', 'de', 'Restaurant'),
('95555555-5555-5555-5555-555555555555', 'en', 'Restaurant'),
-- Bar
('96666666-6666-6666-6666-666666666666', 'de', 'Bar'),
('96666666-6666-6666-6666-666666666666', 'en', 'Bar'),
-- Parking
('97777777-7777-7777-7777-777777777777', 'de', 'Parkplatz'),
('97777777-7777-7777-7777-777777777777', 'en', 'Parking'),
-- Concierge
('98888888-8888-8888-8888-888888888888', 'de', 'Concierge'),
('98888888-8888-8888-8888-888888888888', 'en', 'Concierge');

-- Hotel Amenities (Verknüpfung)
INSERT INTO hotel_amenities (hotel_id, amenity_id) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '91111111-1111-1111-1111-111111111111'), -- WiFi
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '92222222-2222-2222-2222-222222222222'), -- Pool
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '93333333-3333-3333-3333-333333333333'), -- Spa
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '94444444-4444-4444-4444-444444444444'), -- Fitness
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '95555555-5555-5555-5555-555555555555'), -- Restaurant
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '96666666-6666-6666-6666-666666666666'), -- Bar
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '97777777-7777-7777-7777-777777777777'), -- Parking
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '98888888-8888-8888-8888-888888888888'); -- Concierge

-- Room Categories (ohne name/slug - die sind in room_category_translations!)
INSERT INTO room_categories (
    id, 
    hotel_id, 
    code,
    max_occupancy, 
    base_price,
    total_rooms,
    size_sqm,
    bed_type
) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'STD', 2, 120.00, 20, 25.00, 'double'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'DLX', 2, 180.00, 15, 35.00, 'king'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'JSU', 3, 250.00, 10, 50.00, 'king'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ESU', 4, 400.00, 5, 80.00, 'king');

-- Room Category Translations
INSERT INTO room_category_translations (room_category_id, language, name, description) VALUES
-- Standard Room
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'de', 'Standard Zimmer',
'Komfortables Standardzimmer mit modernem Design. Ausgestattet mit allem, was Sie für einen angenehmen Aufenthalt benötigen.'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'en', 'Standard Room',
'Comfortable standard room with modern design. Equipped with everything you need for a pleasant stay.'),

-- Deluxe Room
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'de', 'Deluxe Zimmer',
'Geräumiges Deluxe-Zimmer mit gehobener Ausstattung und herrlichem Stadtblick.'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'en', 'Deluxe Room',
'Spacious deluxe room with upscale amenities and stunning city views.'),

-- Junior Suite
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'de', 'Junior Suite',
'Elegante Suite mit separatem Wohnbereich. Perfekt für längere Aufenthalte oder besondere Anlässe.'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'en', 'Junior Suite',
'Elegant suite with separate living area. Perfect for extended stays or special occasions.'),

-- Executive Suite
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'de', 'Executive Suite',
'Luxuriöse Executive Suite mit Premium-Ausstattung, großzügigem Wohnbereich und atemberaubendem Panoramablick.'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'en', 'Executive Suite',
'Luxurious executive suite with premium amenities, spacious living area, and breathtaking panoramic views.');

-- Room Amenities (z.B. TV, Minibar, etc.)
INSERT INTO amenities (id, code, category, icon) VALUES
('a1111111-1111-1111-1111-111111111111', 'TV', 'room', 'tv'),
('a2222222-2222-2222-2222-222222222222', 'MINIBAR', 'room', 'minibar'),
('a3333333-3333-3333-3333-333333333333', 'SAFE', 'room', 'safe'),
('a4444444-4444-4444-4444-444444444444', 'DESK', 'room', 'desk'),
('a5555555-5555-5555-5555-555555555555', 'COFFEE', 'room', 'coffee-machine');

INSERT INTO amenity_translations (amenity_id, language, name) VALUES
('a1111111-1111-1111-1111-111111111111', 'de', 'TV'),
('a1111111-1111-1111-1111-111111111111', 'en', 'TV'),
('a2222222-2222-2222-2222-222222222222', 'de', 'Minibar'),
('a2222222-2222-2222-2222-222222222222', 'en', 'Minibar'),
('a3333333-3333-3333-3333-333333333333', 'de', 'Safe'),
('a3333333-3333-3333-3333-333333333333', 'en', 'Safe'),
('a4444444-4444-4444-4444-444444444444', 'de', 'Schreibtisch'),
('a4444444-4444-4444-4444-444444444444', 'en', 'Desk'),
('a5555555-5555-5555-5555-555555555555', 'de', 'Kaffeemaschine'),
('a5555555-5555-5555-5555-555555555555', 'en', 'Coffee Machine');

-- Room Category Amenities (alle Zimmer haben diese Features)
INSERT INTO room_category_amenities (room_category_id, amenity_id) VALUES
-- Standard Room
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'a1111111-1111-1111-1111-111111111111'), -- TV
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'a2222222-2222-2222-2222-222222222222'), -- Minibar
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'a3333333-3333-3333-3333-333333333333'), -- Safe
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'a4444444-4444-4444-4444-444444444444'), -- Desk

-- Deluxe Room (alle von Standard + Kaffeemaschine)
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'a1111111-1111-1111-1111-111111111111'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'a2222222-2222-2222-2222-222222222222'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'a3333333-3333-3333-3333-333333333333'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'a4444444-4444-4444-4444-444444444444'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'a5555555-5555-5555-5555-555555555555'),

-- Junior Suite (alle)
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'a1111111-1111-1111-1111-111111111111'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'a2222222-2222-2222-2222-222222222222'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'a3333333-3333-3333-3333-333333333333'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'a4444444-4444-4444-4444-444444444444'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'a5555555-5555-5555-5555-555555555555'),

-- Executive Suite (alle)
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'a1111111-1111-1111-1111-111111111111'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'a2222222-2222-2222-2222-222222222222'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'a3333333-3333-3333-3333-333333333333'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'a4444444-4444-4444-4444-444444444444'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'a5555555-5555-5555-5555-555555555555');

-- Demo Booking (Gast bucht Standard Room)
INSERT INTO bookings (
    id,
    booking_reference,
    user_id,
    hotel_id,
    room_category_id,
    check_in_date,
    check_out_date,
    num_guests,
    num_rooms,
    guest_first_name,
    guest_last_name,
    guest_email,
    guest_phone,
    subtotal,
    tax_amount,
    total_amount,
    commission_percentage,
    commission_amount,
    hotel_payout,
    status
) VALUES (
    'f1111111-1111-1111-1111-111111111111',
    'BKX-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-001',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    CURRENT_DATE + INTERVAL '7 days',
    CURRENT_DATE + INTERVAL '10 days',
    2,
    1,
    'Max',
    'Mustermann',
    'guest@bookax.local',
    '+49 170 1234567',
    360.00, -- 3 Nächte à 120€
    0.00,   -- Keine Tax für Demo
    360.00, -- Total
    15.00,  -- 15% Commission
    54.00,  -- Commission Amount
    306.00, -- Hotel Payout
    'confirmed'
);

-- Rates (Preise für die nächsten 90 Tage)
-- Wir setzen für alle Zimmer dynamische Preise
DO $$
DECLARE
    room_cat UUID;
    d DATE;
BEGIN
    FOR room_cat IN 
        SELECT id FROM room_categories WHERE hotel_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    LOOP
        FOR d IN 
            SELECT generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', '1 day')::DATE
        LOOP
            INSERT INTO rates (room_category_id, date, price)
            SELECT 
                room_cat,
                d,
                CASE room_cat
                    WHEN 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' THEN 120.00 -- Standard
                    WHEN 'cccccccc-cccc-cccc-cccc-cccccccccccc' THEN 180.00 -- Deluxe
                    WHEN 'dddddddd-dddd-dddd-dddd-dddddddddddd' THEN 250.00 -- Junior Suite
                    WHEN 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee' THEN 400.00 -- Executive Suite
                END;
        END LOOP;
    END LOOP;
END $$;

-- Inventory (Verfügbarkeit für die nächsten 90 Tage)
DO $$
DECLARE
    room_cat UUID;
    total INTEGER;
    d DATE;
BEGIN
    FOR room_cat, total IN 
        SELECT id, total_rooms FROM room_categories WHERE hotel_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    LOOP
        FOR d IN 
            SELECT generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', '1 day')::DATE
        LOOP
            INSERT INTO inventory (room_category_id, date, total_rooms, available_rooms)
            VALUES (room_cat, d, total, total);
        END LOOP;
    END LOOP;
END $$;

-- Success Message
DO $$
BEGIN
    RAISE NOTICE '✅ Seed data erfolgreich eingefügt!';
    RAISE NOTICE '';
    RAISE NOTICE '🔑 Demo Users:';
    RAISE NOTICE '   Guest:    guest@bookax.local / Password123!';
    RAISE NOTICE '   Hotelier: hotelier@bookax.local / Password123!';
    RAISE NOTICE '   Admin:    admin@bookax.local / Password123!';
    RAISE NOTICE '';
    RAISE NOTICE '🏨 Demo Hotel: Grand Hotel Berlin (50 Zimmer, 4 Kategorien)';
    RAISE NOTICE '📅 Rates & Inventory: Nächste 90 Tage verfügbar';
    RAISE NOTICE '🎫 Demo Booking: 1 bestätigte Buchung';
END $$;
