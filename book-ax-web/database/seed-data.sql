-- =====================================================
-- BOOK.AX SEED DATA FOR LOCAL DEVELOPMENT
-- Demo Users, Hotels, and Bookings
-- =====================================================

-- Demo Users
-- Password for all: "Password123!"
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, email_verified, preferred_language) VALUES
-- Guest User
('11111111-1111-1111-1111-111111111111', 'guest@bookax.local', '$2a$10$X5wFKzwN4FqZvJXKw9vKZeGxPqJQ5tYr0qL5aJHp7Z9yXqF1KqGxC', 'Max', 'Mustermann', '+49 170 1234567', 'guest', TRUE, 'de'),

-- Hotelier User
('22222222-2222-2222-2222-222222222222', 'hotelier@bookax.local', '$2a$10$X5wFKzwN4FqZvJXKw9vKZeGxPqJQ5tYr0qL5aJHp7Z9yXqF1KqGxC', 'Anna', 'Schmidt', '+49 170 7654321', 'hotelier', TRUE, 'de'),

-- Admin User
('33333333-3333-3333-3333-333333333333', 'admin@bookax.local', '$2a$10$X5wFKzwN4FqZvJXKw9vKZeGxPqJQ5tYr0qL5aJHp7Z9yXqF1KqGxC', 'Super', 'Admin', '+49 170 9999999', 'admin', TRUE, 'en');

-- Demo Hotel
INSERT INTO hotels (id, owner_id, name, slug, email, phone, address, city, state, country, postal_code, latitude, longitude, star_rating, commission_percentage, status, check_in_time, check_out_time) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Grand Hotel Berlin', 'grand-hotel-berlin', 'info@grandhotel-berlin.de', '+49 30 12345678', 'Unter den Linden 77', 'Berlin', 'Berlin', 'DE', '10117', 52.5170365, 13.3888599, 5, 15.00, 'active', '15:00', '11:00');

-- Hotel Translations (Deutsch & Englisch)
INSERT INTO hotel_translations (hotel_id, language_code, description, amenities) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'de', 
'Luxuriöses 5-Sterne Hotel im Herzen Berlins. Direkt an der berühmten Straße Unter den Linden gelegen, bietet unser Hotel erstklassigen Service und modernen Komfort. Ideal für Geschäfts- und Urlaubsreisende.',
'{"WLAN": true, "Pool": true, "Spa": true, "Fitness": true, "Restaurant": true, "Bar": true, "Parkplatz": true, "Klimaanlage": true, "Concierge": true, "Zimmerservice": true}'),

('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'en',
'Luxurious 5-star hotel in the heart of Berlin. Located directly on the famous Unter den Linden boulevard, our hotel offers first-class service and modern comfort. Ideal for business and leisure travelers.',
'{"WiFi": true, "Pool": true, "Spa": true, "Fitness": true, "Restaurant": true, "Bar": true, "Parking": true, "Air Conditioning": true, "Concierge": true, "Room Service": true}');

-- Room Categories
INSERT INTO room_categories (id, hotel_id, name, slug, base_price, max_occupancy, size_sqm, sort_order) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Standard Room', 'standard-room', 120.00, 2, 25, 1),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Deluxe Room', 'deluxe-room', 180.00, 2, 35, 2),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Junior Suite', 'junior-suite', 250.00, 3, 50, 3),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Executive Suite', 'executive-suite', 400.00, 4, 80, 4);

-- Room Category Translations
INSERT INTO room_category_translations (room_category_id, language_code, description, amenities) VALUES
-- Standard Room
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'de', 
'Komfortables Standardzimmer mit modernem Design. Ausgestattet mit allem, was Sie für einen angenehmen Aufenthalt benötigen.',
'{"WLAN": true, "TV": true, "Klimaanlage": true, "Minibar": true, "Safe": true, "Schreibtisch": true}'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'en',
'Comfortable standard room with modern design. Equipped with everything you need for a pleasant stay.',
'{"WiFi": true, "TV": true, "Air Conditioning": true, "Minibar": true, "Safe": true, "Desk": true}'),

-- Deluxe Room
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'de',
'Geräumiges Deluxe-Zimmer mit gehobener Ausstattung und herrlichem Stadtblick.',
'{"WLAN": true, "TV": true, "Klimaanlage": true, "Minibar": true, "Safe": true, "Schreibtisch": true, "Balkon": true, "Bademantel": true}'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'en',
'Spacious deluxe room with upscale furnishings and wonderful city views.',
'{"WiFi": true, "TV": true, "Air Conditioning": true, "Minibar": true, "Safe": true, "Desk": true, "Balcony": true, "Bathrobe": true}'),

-- Junior Suite
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'de',
'Elegante Junior Suite mit separatem Wohnbereich und exklusiven Annehmlichkeiten.',
'{"WLAN": true, "TV": true, "Klimaanlage": true, "Minibar": true, "Safe": true, "Schreibtisch": true, "Balkon": true, "Bademantel": true, "Nespresso": true, "Sitzecke": true}'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'en',
'Elegant junior suite with separate living area and exclusive amenities.',
'{"WiFi": true, "TV": true, "Air Conditioning": true, "Minibar": true, "Safe": true, "Desk": true, "Balcony": true, "Bathrobe": true, "Nespresso": true, "Seating Area": true}'),

-- Executive Suite
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'de',
'Luxuriöse Executive Suite mit großzügigem Wohn- und Schlafbereich. Premium-Ausstattung und persönlicher Service.',
'{"WLAN": true, "TV": true, "Klimaanlage": true, "Minibar": true, "Safe": true, "Schreibtisch": true, "Balkon": true, "Bademantel": true, "Nespresso": true, "Sitzecke": true, "Jacuzzi": true, "Butler Service": true}'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'en',
'Luxurious executive suite with spacious living and sleeping areas. Premium furnishings and personal service.',
'{"WiFi": true, "TV": true, "Air Conditioning": true, "Minibar": true, "Safe": true, "Desk": true, "Balcony": true, "Bathrobe": true, "Nespresso": true, "Seating Area": true, "Jacuzzi": true, "Butler Service": true}');

-- Inventory (Verfügbarkeit für nächste 90 Tage)
INSERT INTO inventory (hotel_id, room_category_id, date, available_rooms, total_rooms)
SELECT 
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    rc.id,
    CURRENT_DATE + (d || ' days')::interval,
    CASE 
        WHEN rc.slug = 'standard-room' THEN 10
        WHEN rc.slug = 'deluxe-room' THEN 8
        WHEN rc.slug = 'junior-suite' THEN 5
        WHEN rc.slug = 'executive-suite' THEN 2
    END,
    CASE 
        WHEN rc.slug = 'standard-room' THEN 10
        WHEN rc.slug = 'deluxe-room' THEN 8
        WHEN rc.slug = 'junior-suite' THEN 5
        WHEN rc.slug = 'executive-suite' THEN 2
    END
FROM 
    room_categories rc,
    generate_series(0, 90) AS d
WHERE 
    rc.hotel_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Rates (Preise für nächste 90 Tage - mit Wochenend-Zuschlag)
INSERT INTO rates (hotel_id, room_category_id, date, price)
SELECT 
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    rc.id,
    CURRENT_DATE + (d || ' days')::interval,
    rc.base_price * CASE 
        WHEN EXTRACT(DOW FROM CURRENT_DATE + (d || ' days')::interval) IN (5, 6) THEN 1.3  -- Weekend +30%
        ELSE 1.0
    END
FROM 
    room_categories rc,
    generate_series(0, 90) AS d
WHERE 
    rc.hotel_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

-- Demo Booking (vergangene Buchung)
INSERT INTO bookings (
    id, user_id, hotel_id, room_category_id,
    check_in_date, check_out_date, num_guests, num_rooms,
    total_amount, commission_amount, hotel_payout,
    commission_percentage, status, payment_status,
    guest_first_name, guest_last_name, guest_email, guest_phone
) VALUES (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE - INTERVAL '27 days',
    2, 1,
    540.00, 81.00, 459.00,
    15.00, 'completed', 'paid',
    'Max', 'Mustermann', 'guest@bookax.local', '+49 170 1234567'
);

-- Demo Payment
INSERT INTO payments (
    booking_id, amount, currency, status, payment_method,
    stripe_payment_intent_id, stripe_charge_id
) VALUES (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    540.00, 'EUR', 'succeeded', 'card',
    'pi_demo_' || gen_random_uuid()::text,
    'ch_demo_' || gen_random_uuid()::text
);

-- Hotel Images
INSERT INTO hotel_images (hotel_id, image_url, image_type, alt_text, sort_order) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1566073771259-6a8506099945', 'exterior', 'Grand Hotel Berlin - Außenansicht', 1),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', 'lobby', 'Grand Hotel Berlin - Lobby', 2),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c', 'restaurant', 'Grand Hotel Berlin - Restaurant', 3),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1540541338287-41700207dee6', 'pool', 'Grand Hotel Berlin - Pool', 4);

-- Room Images
INSERT INTO hotel_images (hotel_id, room_category_id, image_url, image_type, alt_text, sort_order) VALUES
-- Standard Room
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32', 'room', 'Standard Room', 1),
-- Deluxe Room
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'https://images.unsplash.com/photo-1618773928121-c32242e63f39', 'room', 'Deluxe Room', 1),
-- Junior Suite
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'https://images.unsplash.com/photo-1590490360182-c33d57733427', 'room', 'Junior Suite', 1),
-- Executive Suite
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'https://images.unsplash.com/photo-1582719508461-905c673771fd', 'room', 'Executive Suite', 1);

-- Demo Analytics Event
INSERT INTO analytics_events (event_type, user_id, hotel_id, metadata) VALUES
('hotel_view', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '{"source": "search", "device": "desktop"}');

ANALYZE;
