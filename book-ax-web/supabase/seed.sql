-- =====================================================
-- BOOK.AX TEST DATA
-- Comprehensive test data for integration testing
-- =====================================================
-- WICHTIG: Diese Datei enthält Testdaten für die Produktion
-- Passwörter: Test123! (bcrypt hash verwendet)
-- =====================================================

-- =====================================================
-- USERS (verschiedene Rollen)
-- =====================================================

-- Admin User (bereits in schema.sql vorhanden, hier als Referenz)
-- Email: admin@book.ax | Password: Admin123!

-- Hotelier Users
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, status, email_verified, preferred_language) VALUES
('11111111-1111-1111-1111-111111111111', 'hotelier1@book.ax', '$2a$10$z1wL8JooKL4FwBEmtM0rmOohB8RlfDVUfrr314UPBtPMm2SsuJDi', 'Maria', 'Schmidt', '+49 30 12345678', 'hotelier', 'active', TRUE, 'de'),
('22222222-2222-2222-2222-222222222222', 'hotelier2@book.ax', '$2a$10$z1wL8JooKL4FwBEmtM0rmOohB8RlfDVUfrr314UPBtPMm2SsuJDi', 'Thomas', 'Müller', '+49 89 87654321', 'hotelier', 'active', TRUE, 'de');

-- Guest Users (normale Gäste)
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, status, email_verified, preferred_language) VALUES
('33333333-3333-3333-3333-333333333333', 'guest1@book.ax', '$2a$10$z1wL8JooKL4FwBEmtM0rmOohB8RlfDVUfrr314UPBtPMm2SsuJDi', 'Anna', 'Weber', '+49 40 11111111', 'guest', 'active', TRUE, 'de'),
('44444444-4444-4444-4444-444444444444', 'guest2@book.ax', '$2a$10$z1wL8JooKL4FwBEmtM0rmOohB8RlfDVUfrr314UPBtPMm2SsuJDi', 'Michael', 'Fischer', '+49 221 22222222', 'guest', 'active', TRUE, 'de'),
('55555555-5555-5555-5555-555555555555', 'guest3@book.ax', '$2a$10$z1wL8JooKL4FwBEmtM0rmOohB8RlfDVUfrr314UPBtPMm2SsuJDi', 'Sarah', 'Becker', '+49 711 33333333', 'guest', 'active', TRUE, 'en'),
('66666666-6666-6666-6666-666666666666', 'guest4@book.ax', '$2a$10$z1wL8JooKL4FwBEmtM0rmOohB8RlfDVUfrr314UPBtPMm2SsuJDi', 'David', 'Meyer', '+49 69 44444444', 'guest', 'active', TRUE, 'en');

-- =====================================================
-- HOTELS (2 Test-Hotels)
-- =====================================================

-- Hotel 1: Grand Hotel Berlin
INSERT INTO hotels (id, owner_id, property_type, status, email, phone, website, address_street, address_city, address_state, address_postal_code, address_country, latitude, longitude, check_in_time, check_out_time, star_rating, total_rooms, commission_percentage, approved_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'hotel', 'approved', 'info@grandhotel-berlin.de', '+49 30 20000000', 'https://grandhotel-berlin.de', 'Unter den Linden 77', 'Berlin', 'Berlin', '10117', 'Deutschland', 52.5200, 13.4050, '15:00', '11:00', 5, 120, 15.00, NOW());

-- Hotel 2: Boutique Hotel München
INSERT INTO hotels (id, owner_id, property_type, status, email, phone, website, address_street, address_city, address_state, address_postal_code, address_country, latitude, longitude, check_in_time, check_out_time, star_rating, total_rooms, commission_percentage, approved_at) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'hotel', 'approved', 'info@boutique-muenchen.de', '+49 89 30000000', 'https://boutique-muenchen.de', 'Maximilianstraße 15', 'München', 'Bayern', '80539', 'Deutschland', 48.1351, 11.5820, '14:00', '12:00', 4, 45, 15.00, NOW());

-- =====================================================
-- HOTEL TRANSLATIONS
-- =====================================================

-- Grand Hotel Berlin (Deutsch)
INSERT INTO hotel_translations (hotel_id, language, name, description, policies) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'de', 'Grand Hotel Berlin', 
'Das Grand Hotel Berlin ist ein luxuriöses 5-Sterne-Hotel im Herzen der Hauptstadt. Mit seiner erstklassigen Lage Unter den Linden bietet es perfekten Zugang zu allen Sehenswürdigkeiten. Genießen Sie exzellenten Service, elegante Zimmer und ein Michelin-Stern-Restaurant.',
'Check-in: 15:00 Uhr | Check-out: 11:00 Uhr | Haustiere auf Anfrage | Nichtraucher-Hotel | Kostenfreies WLAN');

-- Grand Hotel Berlin (English)
INSERT INTO hotel_translations (hotel_id, language, name, description, policies) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'en', 'Grand Hotel Berlin', 
'The Grand Hotel Berlin is a luxurious 5-star hotel in the heart of the capital. With its prime location on Unter den Linden, it offers perfect access to all attractions. Enjoy excellent service, elegant rooms and a Michelin-starred restaurant.',
'Check-in: 3:00 PM | Check-out: 11:00 AM | Pets on request | Non-smoking hotel | Free WiFi');

-- Boutique Hotel München (Deutsch)
INSERT INTO hotel_translations (hotel_id, language, name, description, policies) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'de', 'Boutique Hotel München', 
'Charmantes 4-Sterne Boutique-Hotel in bester Lage am Maximilianplatz. Individuell gestaltete Zimmer mit modernem Design treffen auf bayerische Gemütlichkeit. Perfekt für Geschäfts- und Urlaubsreisende.',
'Check-in: 14:00 Uhr | Check-out: 12:00 Uhr | Keine Haustiere | Nichtraucher-Hotel | Kostenfreies WLAN');

-- Boutique Hotel München (English)
INSERT INTO hotel_translations (hotel_id, language, name, description, policies) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'en', 'Boutique Hotel Munich', 
'Charming 4-star boutique hotel in a prime location at Maximilianplatz. Individually designed rooms with modern design meet Bavarian coziness. Perfect for business and leisure travelers.',
'Check-in: 2:00 PM | Check-out: 12:00 PM | No pets | Non-smoking hotel | Free WiFi');

-- =====================================================
-- HOTEL AMENITIES
-- =====================================================

-- Grand Hotel Berlin Amenities
INSERT INTO hotel_amenities (hotel_id, amenity_id) 
SELECT 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', id FROM amenities WHERE code IN ('wifi', 'parking', 'pool', 'gym', 'restaurant', 'bar', 'spa', 'air_conditioning', 'room_service', 'laundry', 'non_smoking', 'wheelchair_accessible', 'elevator', '24hr_reception');

-- Boutique Hotel München Amenities
INSERT INTO hotel_amenities (hotel_id, amenity_id) 
SELECT 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', id FROM amenities WHERE code IN ('wifi', 'parking', 'gym', 'restaurant', 'bar', 'air_conditioning', 'room_service', 'laundry', 'non_smoking', 'elevator', '24hr_reception');

-- =====================================================
-- HOTEL IMAGES
-- =====================================================

-- Grand Hotel Berlin Images
INSERT INTO hotel_images (hotel_id, url, alt_text, display_order, is_primary) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1566073771259-6a8506099945', 'Grand Hotel Berlin Außenansicht', 1, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', 'Luxus Suite', 2, FALSE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7', 'Restaurant', 3, FALSE);

-- Boutique Hotel München Images
INSERT INTO hotel_images (hotel_id, url, alt_text, display_order, is_primary) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', 'Boutique Hotel München Fassade', 1, TRUE),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32', 'Designer Zimmer', 2, FALSE);

-- =====================================================
-- ROOM CATEGORIES
-- =====================================================

-- Grand Hotel Berlin - Zimmer Kategorien
INSERT INTO room_categories (id, hotel_id, code, max_occupancy, base_price, total_rooms, size_sqm, bed_type, smoking_allowed) VALUES
('c1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'STANDARD', 2, 150.00, 50, 25.00, 'Queen', FALSE),
('c2222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'DELUXE', 2, 220.00, 40, 35.00, 'King', FALSE),
('c3333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'SUITE', 4, 450.00, 20, 65.00, 'King + Sofa', FALSE),
('c4444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'PRESIDENTIAL', 6, 850.00, 10, 120.00, '2x King + Living', FALSE);

-- Boutique Hotel München - Zimmer Kategorien
INSERT INTO room_categories (id, hotel_id, code, max_occupancy, base_price, total_rooms, size_sqm, bed_type, smoking_allowed) VALUES
('c5555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'COZY', 2, 120.00, 25, 22.00, 'Queen', FALSE),
('c6666666-6666-6666-6666-666666666666', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'SUPERIOR', 2, 180.00, 15, 30.00, 'King', FALSE),
('c7777777-7777-7777-7777-777777777777', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'JUNIOR_SUITE', 3, 280.00, 5, 45.00, 'King + Sofa', FALSE);

-- =====================================================
-- ROOM CATEGORY TRANSLATIONS
-- =====================================================

-- Grand Hotel Berlin - Room Translations
INSERT INTO room_category_translations (room_category_id, language, name, description) VALUES
('c1111111-1111-1111-1111-111111111111', 'de', 'Standard Zimmer', 'Komfortables Zimmer mit Queen-Size-Bett, Stadtblick und modernem Bad.'),
('c1111111-1111-1111-1111-111111111111', 'en', 'Standard Room', 'Comfortable room with queen-size bed, city view and modern bathroom.'),
('c2222222-2222-2222-2222-222222222222', 'de', 'Deluxe Zimmer', 'Geräumiges Zimmer mit King-Size-Bett, Sitzecke und Premium-Ausstattung.'),
('c2222222-2222-2222-2222-222222222222', 'en', 'Deluxe Room', 'Spacious room with king-size bed, seating area and premium amenities.'),
('c3333333-3333-3333-3333-333333333333', 'de', 'Suite', 'Luxuriöse Suite mit separatem Wohnbereich, King-Size-Bett und Panoramablick.'),
('c3333333-3333-3333-3333-333333333333', 'en', 'Suite', 'Luxurious suite with separate living area, king-size bed and panoramic view.'),
('c4444444-4444-4444-4444-444444444444', 'de', 'Presidential Suite', 'Exklusive Suite mit zwei Schlafzimmern, Wohnbereich und Butler-Service.'),
('c4444444-4444-4444-4444-444444444444', 'en', 'Presidential Suite', 'Exclusive suite with two bedrooms, living area and butler service.');

-- Boutique Hotel München - Room Translations
INSERT INTO room_category_translations (room_category_id, language, name, description) VALUES
('c5555555-5555-5555-5555-555555555555', 'de', 'Gemütliches Zimmer', 'Charmantes Zimmer mit individueller Einrichtung und bayerischem Touch.'),
('c5555555-5555-5555-5555-555555555555', 'en', 'Cozy Room', 'Charming room with individual furnishings and Bavarian touch.'),
('c6666666-6666-6666-6666-666666666666', 'de', 'Superior Zimmer', 'Stilvolles Zimmer mit King-Size-Bett und Designer-Mobiliar.'),
('c6666666-6666-6666-6666-666666666666', 'en', 'Superior Room', 'Stylish room with king-size bed and designer furniture.'),
('c7777777-7777-7777-7777-777777777777', 'de', 'Junior Suite', 'Großzügige Suite mit Wohnbereich und exklusiver Ausstattung.'),
('c7777777-7777-7777-7777-777777777777', 'en', 'Junior Suite', 'Spacious suite with living area and exclusive amenities.');

-- =====================================================
-- ROOM AMENITIES
-- =====================================================

-- Grand Hotel Berlin - Room Amenities
INSERT INTO room_category_amenities (room_category_id, amenity_id)
SELECT 'c1111111-1111-1111-1111-111111111111', id FROM amenities WHERE code IN ('wifi', 'air_conditioning', 'room_service');

INSERT INTO room_category_amenities (room_category_id, amenity_id)
SELECT 'c2222222-2222-2222-2222-222222222222', id FROM amenities WHERE code IN ('wifi', 'air_conditioning', 'room_service');

INSERT INTO room_category_amenities (room_category_id, amenity_id)
SELECT 'c3333333-3333-3333-3333-333333333333', id FROM amenities WHERE code IN ('wifi', 'air_conditioning', 'room_service', 'spa');

INSERT INTO room_category_amenities (room_category_id, amenity_id)
SELECT 'c4444444-4444-4444-4444-444444444444', id FROM amenities WHERE code IN ('wifi', 'air_conditioning', 'room_service', 'spa', 'laundry');

-- Boutique Hotel München - Room Amenities
INSERT INTO room_category_amenities (room_category_id, amenity_id)
SELECT 'c5555555-5555-5555-5555-555555555555', id FROM amenities WHERE code IN ('wifi', 'air_conditioning');

INSERT INTO room_category_amenities (room_category_id, amenity_id)
SELECT 'c6666666-6666-6666-6666-666666666666', id FROM amenities WHERE code IN ('wifi', 'air_conditioning', 'room_service');

INSERT INTO room_category_amenities (room_category_id, amenity_id)
SELECT 'c7777777-7777-7777-7777-777777777777', id FROM amenities WHERE code IN ('wifi', 'air_conditioning', 'room_service');

-- =====================================================
-- RATES & INVENTORY (nächste 90 Tage)
-- =====================================================

-- Grand Hotel Berlin - Standard Zimmer
INSERT INTO rates (room_category_id, date, price, min_stay, closed_to_arrival, closed_to_departure)
SELECT 
    'c1111111-1111-1111-1111-111111111111',
    DATE(NOW() + (n || ' days')::INTERVAL),
    CASE 
        WHEN EXTRACT(DOW FROM DATE(NOW() + (n || ' days')::INTERVAL)) IN (5, 6) THEN 180.00  -- Wochenende
        ELSE 150.00  -- Wochentag
    END,
    1,
    FALSE,
    FALSE
FROM generate_series(0, 89) AS n;

-- Grand Hotel Berlin - Deluxe Zimmer
INSERT INTO rates (room_category_id, date, price, min_stay, closed_to_arrival, closed_to_departure)
SELECT 
    'c2222222-2222-2222-2222-222222222222',
    DATE(NOW() + (n || ' days')::INTERVAL),
    CASE 
        WHEN EXTRACT(DOW FROM DATE(NOW() + (n || ' days')::INTERVAL)) IN (5, 6) THEN 250.00
        ELSE 220.00
    END,
    1,
    FALSE,
    FALSE
FROM generate_series(0, 89) AS n;

-- Grand Hotel Berlin - Suite
INSERT INTO rates (room_category_id, date, price, min_stay, closed_to_arrival, closed_to_departure)
SELECT 
    'c3333333-3333-3333-3333-333333333333',
    DATE(NOW() + (n || ' days')::INTERVAL),
    CASE 
        WHEN EXTRACT(DOW FROM DATE(NOW() + (n || ' days')::INTERVAL)) IN (5, 6) THEN 500.00
        ELSE 450.00
    END,
    2,
    FALSE,
    FALSE
FROM generate_series(0, 89) AS n;

-- Grand Hotel Berlin - Presidential Suite
INSERT INTO rates (room_category_id, date, price, min_stay, closed_to_arrival, closed_to_departure)
SELECT 
    'c4444444-4444-4444-4444-444444444444',
    DATE(NOW() + (n || ' days')::INTERVAL),
    CASE 
        WHEN EXTRACT(DOW FROM DATE(NOW() + (n || ' days')::INTERVAL)) IN (5, 6) THEN 950.00
        ELSE 850.00
    END,
    3,
    FALSE,
    FALSE
FROM generate_series(0, 89) AS n;

-- Boutique Hotel München - Cozy
INSERT INTO rates (room_category_id, date, price, min_stay, closed_to_arrival, closed_to_departure)
SELECT 
    'c5555555-5555-5555-5555-555555555555',
    DATE(NOW() + (n || ' days')::INTERVAL),
    CASE 
        WHEN EXTRACT(DOW FROM DATE(NOW() + (n || ' days')::INTERVAL)) IN (5, 6) THEN 140.00
        ELSE 120.00
    END,
    1,
    FALSE,
    FALSE
FROM generate_series(0, 89) AS n;

-- Boutique Hotel München - Superior
INSERT INTO rates (room_category_id, date, price, min_stay, closed_to_arrival, closed_to_departure)
SELECT 
    'c6666666-6666-6666-6666-666666666666',
    DATE(NOW() + (n || ' days')::INTERVAL),
    CASE 
        WHEN EXTRACT(DOW FROM DATE(NOW() + (n || ' days')::INTERVAL)) IN (5, 6) THEN 200.00
        ELSE 180.00
    END,
    1,
    FALSE,
    FALSE
FROM generate_series(0, 89) AS n;

-- Boutique Hotel München - Junior Suite
INSERT INTO rates (room_category_id, date, price, min_stay, closed_to_arrival, closed_to_departure)
SELECT 
    'c7777777-7777-7777-7777-777777777777',
    DATE(NOW() + (n || ' days')::INTERVAL),
    CASE 
        WHEN EXTRACT(DOW FROM DATE(NOW() + (n || ' days')::INTERVAL)) IN (5, 6) THEN 320.00
        ELSE 280.00
    END,
    2,
    FALSE,
    FALSE
FROM generate_series(0, 89) AS n;

-- =====================================================
-- INVENTORY (nächste 90 Tage)
-- =====================================================

-- Grand Hotel Berlin - Inventory für alle Kategorien
INSERT INTO inventory (room_category_id, date, total_rooms, available_rooms)
SELECT 'c1111111-1111-1111-1111-111111111111', DATE(NOW() + (n || ' days')::INTERVAL), 50, 50
FROM generate_series(0, 89) AS n;

INSERT INTO inventory (room_category_id, date, total_rooms, available_rooms)
SELECT 'c2222222-2222-2222-2222-222222222222', DATE(NOW() + (n || ' days')::INTERVAL), 40, 40
FROM generate_series(0, 89) AS n;

INSERT INTO inventory (room_category_id, date, total_rooms, available_rooms)
SELECT 'c3333333-3333-3333-3333-333333333333', DATE(NOW() + (n || ' days')::INTERVAL), 20, 20
FROM generate_series(0, 89) AS n;

INSERT INTO inventory (room_category_id, date, total_rooms, available_rooms)
SELECT 'c4444444-4444-4444-4444-444444444444', DATE(NOW() + (n || ' days')::INTERVAL), 10, 10
FROM generate_series(0, 89) AS n;

-- Boutique Hotel München - Inventory für alle Kategorien
INSERT INTO inventory (room_category_id, date, total_rooms, available_rooms)
SELECT 'c5555555-5555-5555-5555-555555555555', DATE(NOW() + (n || ' days')::INTERVAL), 25, 25
FROM generate_series(0, 89) AS n;

INSERT INTO inventory (room_category_id, date, total_rooms, available_rooms)
SELECT 'c6666666-6666-6666-6666-666666666666', DATE(NOW() + (n || ' days')::INTERVAL), 15, 15
FROM generate_series(0, 89) AS n;

INSERT INTO inventory (room_category_id, date, total_rooms, available_rooms)
SELECT 'c7777777-7777-7777-7777-777777777777', DATE(NOW() + (n || ' days')::INTERVAL), 5, 5
FROM generate_series(0, 89) AS n;

-- =====================================================
-- BOOKINGS (verschiedene Status)
-- =====================================================

-- Bestätigte Buchungen (confirmed)
INSERT INTO bookings (id, hotel_id, room_category_id, user_id, guest_first_name, guest_last_name, guest_email, guest_phone, check_in_date, check_out_date, num_guests, num_rooms, status, source, subtotal, tax_amount, total_amount, commission_percentage, special_requests) VALUES
('b1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Anna', 'Weber', 'guest1@book.ax', '+49 40 11111111', CURRENT_DATE + 7, CURRENT_DATE + 10, 2, 1, 'confirmed', 'direct', 660.00, 125.40, 785.40, 15.00, 'Frühes Check-in gewünscht'),
('b2222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'Michael', 'Fischer', 'guest2@book.ax', '+49 221 22222222', CURRENT_DATE + 14, CURRENT_DATE + 16, 4, 1, 'confirmed', 'direct', 900.00, 171.00, 1071.00, 15.00, 'Hochzeitstag - Champagner bitte'),
('b3333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c6666666-6666-6666-6666-666666666666', '55555555-5555-5555-5555-555555555555', 'Sarah', 'Becker', 'guest3@book.ax', '+49 711 33333333', CURRENT_DATE + 21, CURRENT_DATE + 24, 2, 1, 'confirmed', 'direct', 540.00, 102.60, 642.60, 15.00, NULL);

-- Eingecheckte Buchungen (checked_in)
INSERT INTO bookings (id, hotel_id, room_category_id, user_id, guest_first_name, guest_last_name, guest_email, guest_phone, check_in_date, check_out_date, num_guests, num_rooms, status, source, subtotal, tax_amount, total_amount, commission_percentage, special_requests) VALUES
('b4444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c1111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'David', 'Meyer', 'guest4@book.ax', '+49 69 44444444', CURRENT_DATE - 1, CURRENT_DATE + 2, 2, 1, 'checked_in', 'direct', 450.00, 85.50, 535.50, 15.00, NULL);

-- Ausgecheckte Buchungen (checked_out)
INSERT INTO bookings (id, hotel_id, room_category_id, user_id, guest_first_name, guest_last_name, guest_email, guest_phone, check_in_date, check_out_date, num_guests, num_rooms, status, source, subtotal, tax_amount, total_amount, commission_percentage) VALUES
('b5555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c5555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'Anna', 'Weber', 'guest1@book.ax', '+49 40 11111111', CURRENT_DATE - 5, CURRENT_DATE - 3, 2, 1, 'checked_out', 'direct', 240.00, 45.60, 285.60, 15.00),
('b6666666-6666-6666-6666-666666666666', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Michael', 'Fischer', 'guest2@book.ax', '+49 221 22222222', CURRENT_DATE - 10, CURRENT_DATE - 8, 6, 1, 'checked_out', 'booking_com', 1700.00, 323.00, 2023.00, 15.00);

-- Stornierte Buchung (cancelled)
INSERT INTO bookings (id, hotel_id, room_category_id, user_id, guest_first_name, guest_last_name, guest_email, guest_phone, check_in_date, check_out_date, num_guests, num_rooms, status, source, subtotal, tax_amount, total_amount, commission_percentage, cancellation_date, cancellation_reason) VALUES
('b7777777-7777-7777-7777-777777777777', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c7777777-7777-7777-7777-777777777777', '55555555-5555-5555-5555-555555555555', 'Sarah', 'Becker', 'guest3@book.ax', '+49 711 33333333', CURRENT_DATE + 30, CURRENT_DATE + 33, 3, 1, 'cancelled', 'direct', 840.00, 159.60, 999.60, 15.00, NOW() - INTERVAL '2 days', 'Terminänderung');

-- No-Show Buchung
INSERT INTO bookings (id, hotel_id, room_category_id, user_id, guest_first_name, guest_last_name, guest_email, guest_phone, check_in_date, check_out_date, num_guests, num_rooms, status, source, subtotal, tax_amount, total_amount, commission_percentage) VALUES
('b8888888-8888-8888-8888-888888888888', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c1111111-1111-1111-1111-111111111111', NULL, 'John', 'Doe', 'john.doe@example.com', '+1 555 1234567', CURRENT_DATE - 2, CURRENT_DATE - 1, 2, 1, 'no_show', 'expedia', 150.00, 28.50, 178.50, 15.00);

-- =====================================================
-- PAYMENTS (für bestätigte und abgeschlossene Buchungen)
-- =====================================================

-- Erfolgreiche Zahlungen
INSERT INTO payments (id, booking_id, amount, currency, status, payment_method, stripe_payment_intent_id, stripe_charge_id, transaction_id, paid_at) VALUES
('11111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 785.40, 'EUR', 'completed', 'credit_card', 'pi_test_1111111111111111', 'ch_test_1111111111111111', 'TXN-001', NOW() - INTERVAL '3 days'),
('22222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 1071.00, 'EUR', 'completed', 'credit_card', 'pi_test_2222222222222222', 'ch_test_2222222222222222', 'TXN-002', NOW() - INTERVAL '5 days'),
('33333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333', 642.60, 'EUR', 'completed', 'paypal', NULL, NULL, 'PAYPAL-003', NOW() - INTERVAL '1 day'),
('44444444-4444-4444-4444-444444444444', 'b4444444-4444-4444-4444-444444444444', 535.50, 'EUR', 'completed', 'credit_card', 'pi_test_4444444444444444', 'ch_test_4444444444444444', 'TXN-004', NOW() - INTERVAL '2 days'),
('55555555-5555-5555-5555-555555555555', 'b5555555-5555-5555-5555-555555555555', 285.60, 'EUR', 'completed', 'debit_card', 'pi_test_5555555555555555', 'ch_test_5555555555555555', 'TXN-005', NOW() - INTERVAL '6 days'),
('66666666-6666-6666-6666-666666666666', 'b6666666-6666-6666-6666-666666666666', 2023.00, 'EUR', 'completed', 'credit_card', 'pi_test_6666666666666666', 'ch_test_6666666666666666', 'TXN-006', NOW() - INTERVAL '11 days');

-- Rückerstattung für stornierte Buchung
INSERT INTO payments (id, booking_id, amount, currency, status, payment_method, stripe_payment_intent_id, stripe_charge_id, transaction_id, paid_at, refunded_at, refund_amount) VALUES
('77777777-7777-7777-7777-777777777777', 'b7777777-7777-7777-7777-777777777777', 999.60, 'EUR', 'refunded', 'credit_card', 'pi_test_7777777777777777', 'ch_test_7777777777777777', 'TXN-007', NOW() - INTERVAL '10 days', NOW() - INTERVAL '2 days', 999.60);

-- =====================================================
-- COMMISSIONS (für abgeschlossene Buchungen)
-- =====================================================

INSERT INTO commissions (booking_id, hotel_id, commission_amount, hotel_payout, commission_percentage, payout_status, payout_date) VALUES
('b5555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 42.84, 242.76, 15.00, 'completed', NOW() - INTERVAL '1 day'),
('b6666666-6666-6666-6666-666666666666', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 303.45, 1719.55, 15.00, 'completed', NOW() - INTERVAL '5 days');

-- Pending commissions
INSERT INTO commissions (booking_id, hotel_id, commission_amount, hotel_payout, commission_percentage, payout_status) VALUES
('b4444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 80.33, 455.17, 15.00, 'pending');

-- =====================================================
-- HOUSEKEEPING
-- =====================================================

-- Grand Hotel Berlin - Housekeeping Status
INSERT INTO housekeeping (hotel_id, room_number, room_category_id, status, assigned_to, last_cleaned) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '101', 'c1111111-1111-1111-1111-111111111111', 'clean', 'Maria K.', NOW() - INTERVAL '2 hours'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '102', 'c1111111-1111-1111-1111-111111111111', 'occupied', NULL, NOW() - INTERVAL '1 day'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '103', 'c1111111-1111-1111-1111-111111111111', 'dirty', 'Anna M.', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '201', 'c2222222-2222-2222-2222-222222222222', 'clean', 'Maria K.', NOW() - INTERVAL '3 hours'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '301', 'c3333333-3333-3333-3333-333333333333', 'inspected', 'Supervisor', NOW() - INTERVAL '1 hour'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '401', 'c4444444-4444-4444-4444-444444444444', 'clean', 'Maria K.', NOW() - INTERVAL '4 hours');

-- Boutique Hotel München - Housekeeping Status
INSERT INTO housekeeping (hotel_id, room_number, room_category_id, status, assigned_to, last_cleaned) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '10', 'c5555555-5555-5555-5555-555555555555', 'clean', 'Lisa B.', NOW() - INTERVAL '1 hour'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11', 'c5555555-5555-5555-5555-555555555555', 'dirty', 'Lisa B.', NULL),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '20', 'c6666666-6666-6666-6666-666666666666', 'clean', 'Lisa B.', NOW() - INTERVAL '2 hours'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '30', 'c7777777-7777-7777-7777-777777777777', 'out_of_order', NULL, NULL);

-- =====================================================
-- OTA CONNECTIONS (Channel Manager)
-- =====================================================

-- Grand Hotel Berlin - OTA Verbindungen
INSERT INTO ota_connections (hotel_id, ota_name, ota_property_id, status, last_sync) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Booking.com', 'PROP-GHB-12345', 'active', NOW() - INTERVAL '30 minutes'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Expedia', 'EXP-GHB-67890', 'active', NOW() - INTERVAL '1 hour');

-- Boutique Hotel München - OTA Verbindungen
INSERT INTO ota_connections (hotel_id, ota_name, ota_property_id, status, last_sync) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Booking.com', 'PROP-BHM-54321', 'active', NOW() - INTERVAL '45 minutes');

-- =====================================================
-- REVIEWS
-- =====================================================

-- Verifizierte Reviews für abgeschlossene Buchungen
INSERT INTO reviews (booking_id, hotel_id, user_id, rating, cleanliness_rating, location_rating, service_rating, value_rating, comment, is_verified, is_published) VALUES
('b5555555-5555-5555-5555-555555555555', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 5, 5, 5, 5, 4, 'Wunderschönes Boutique-Hotel mit viel Charme! Sehr freundliches Personal und perfekte Lage in München. Komme gerne wieder!', TRUE, TRUE),
('b6666666-6666-6666-6666-666666666666', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 5, 5, 5, 5, 5, 'Die Presidential Suite war der Wahnsinn! Perfekt für unseren besonderen Anlass. Service war erstklassig, das Restaurant mit Michelin-Stern hat alle Erwartungen übertroffen.', TRUE, TRUE);

-- Review mit Hotel-Antwort
INSERT INTO reviews (booking_id, hotel_id, user_id, rating, cleanliness_rating, location_rating, service_rating, value_rating, comment, response, response_date, is_verified, is_published) VALUES
('b5555555-5555-5555-5555-555555555555', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 4, 4, 5, 5, 4, 'Sehr gutes Hotel in toller Lage. Einziger kleiner Minuspunkt: Klimaanlage könnte etwas leiser sein.', 'Vielen Dank für Ihr Feedback! Wir freuen uns, dass Ihnen Ihr Aufenthalt gefallen hat. Wir werden die Klimaanlage prüfen lassen. Herzliche Grüße, Team Grand Hotel Berlin', NOW() - INTERVAL '1 day', TRUE, TRUE);

-- =====================================================
-- REVENUE RULES & AI PRICING
-- =====================================================

-- Revenue Rules für Grand Hotel Berlin
INSERT INTO revenue_rules (hotel_id, room_category_id, rule_name, min_price, max_price, occupancy_threshold, price_adjustment_percentage, days_before_arrival, is_active, priority) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c1111111-1111-1111-1111-111111111111', 'Last-Minute Discount', 120.00, 180.00, 70.00, -15.00, 3, TRUE, 1),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c2222222-2222-2222-2222-222222222222', 'High Occupancy Premium', 220.00, 280.00, 85.00, 20.00, NULL, TRUE, 2);

-- Price Recommendations
INSERT INTO price_recommendations (room_category_id, date, current_price, recommended_price, confidence_score, factors, applied) VALUES
('c1111111-1111-1111-1111-111111111111', CURRENT_DATE + 5, 150.00, 165.00, 0.85, '{"demand": "high", "competitor_avg": 170, "event": "Conference in city"}', FALSE),
('c2222222-2222-2222-2222-222222222222', CURRENT_DATE + 7, 220.00, 245.00, 0.90, '{"demand": "very_high", "occupancy": 0.88, "weekend": true}', FALSE);

-- =====================================================
-- MARKET DATA
-- =====================================================

INSERT INTO market_data (city, country, date, average_price, occupancy_rate, event_name, event_impact) VALUES
('Berlin', 'Deutschland', CURRENT_DATE, 185.50, 78.50, NULL, NULL),
('Berlin', 'Deutschland', CURRENT_DATE + 7, 210.00, 92.00, 'Tech Conference Berlin', 'high'),
('München', 'Deutschland', CURRENT_DATE, 165.00, 72.00, NULL, NULL),
('München', 'Deutschland', CURRENT_DATE + 14, 195.00, 85.00, 'Oktoberfest', 'very_high');

-- =====================================================
-- UPDATE INVENTORY (Zimmer reduzieren für bestätigte Buchungen)
-- =====================================================

-- Für Buchung b1111111 (Check-in +7, Check-out +10)
UPDATE inventory 
SET available_rooms = available_rooms - 1
WHERE room_category_id = 'c2222222-2222-2222-2222-222222222222'
AND date >= CURRENT_DATE + 7
AND date < CURRENT_DATE + 10;

-- Für Buchung b2222222 (Check-in +14, Check-out +16)
UPDATE inventory 
SET available_rooms = available_rooms - 1
WHERE room_category_id = 'c3333333-3333-3333-3333-333333333333'
AND date >= CURRENT_DATE + 14
AND date < CURRENT_DATE + 16;

-- Für Buchung b3333333 (Check-in +21, Check-out +24)
UPDATE inventory 
SET available_rooms = available_rooms - 1
WHERE room_category_id = 'c6666666-6666-6666-6666-666666666666'
AND date >= CURRENT_DATE + 21
AND date < CURRENT_DATE + 24;

-- Für Buchung b4444444 (Check-in -1, Check-out +2)
UPDATE inventory 
SET available_rooms = available_rooms - 1
WHERE room_category_id = 'c1111111-1111-1111-1111-111111111111'
AND date >= CURRENT_DATE - 1
AND date < CURRENT_DATE + 2;

-- =====================================================
-- ABSCHLUSS & STATISTIKEN
-- =====================================================

-- Testdaten Summary ausgeben
DO $$
DECLARE
    user_count INTEGER;
    hotel_count INTEGER;
    room_count INTEGER;
    booking_count INTEGER;
    payment_count INTEGER;
    review_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users WHERE email LIKE '%book.ax';
    SELECT COUNT(*) INTO hotel_count FROM hotels;
    SELECT COUNT(*) INTO room_count FROM room_categories;
    SELECT COUNT(*) INTO booking_count FROM bookings;
    SELECT COUNT(*) INTO payment_count FROM payments;
    SELECT COUNT(*) INTO review_count FROM reviews;
    
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'BOOK.AX TESTDATEN ERFOLGREICH IMPORTIERT';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Users erstellt: %', user_count;
    RAISE NOTICE 'Hotels erstellt: %', hotel_count;
    RAISE NOTICE 'Zimmer-Kategorien: %', room_count;
    RAISE NOTICE 'Buchungen erstellt: %', booking_count;
    RAISE NOTICE 'Zahlungen: %', payment_count;
    RAISE NOTICE 'Reviews: %', review_count;
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'LOGIN CREDENTIALS:';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Admin: admin@book.ax | Admin123!';
    RAISE NOTICE 'Hotelier 1: hotelier1@book.ax | Test123!';
    RAISE NOTICE 'Hotelier 2: hotelier2@book.ax | Test123!';
    RAISE NOTICE 'Guest 1: guest1@book.ax | Test123!';
    RAISE NOTICE 'Guest 2-4: guest2-4@book.ax | Test123!';
    RAISE NOTICE '==============================================';
END $$;
