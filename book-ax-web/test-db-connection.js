#!/usr/bin/env node

/**
 * Test Database Connection
 * Prüft ob die lokale PostgreSQL-Datenbank erreichbar ist
 */

const { Client } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://bookax_user:bookax_dev_password_2025@localhost:5432/bookax';

console.log('🔍 Teste Datenbankverbindung...');
console.log(`📍 URL: ${DATABASE_URL.replace(/:[^:@]+@/, ':****@')}`);
console.log('');

const client = new Client({
  connectionString: DATABASE_URL,
});

async function testConnection() {
  try {
    // Connect
    await client.connect();
    console.log('✅ Verbindung erfolgreich!');
    console.log('');

    // Test Query: Count Tables
    const tablesResult = await client.query(`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log(`📊 Tabellen: ${tablesResult.rows[0].table_count}`);

    // Test Query: Count Users
    const usersResult = await client.query('SELECT COUNT(*) as count FROM users');
    console.log(`👥 Users: ${usersResult.rows[0].count}`);

    // Test Query: Count Hotels
    const hotelsResult = await client.query('SELECT COUNT(*) as count FROM hotels');
    console.log(`🏨 Hotels: ${hotelsResult.rows[0].count}`);

    // Test Query: Count Bookings
    const bookingsResult = await client.query('SELECT COUNT(*) as count FROM bookings');
    console.log(`📅 Bookings: ${bookingsResult.rows[0].count}`);

    console.log('');
    console.log('✅ Datenbank ist einsatzbereit!');
    
  } catch (error) {
    console.error('❌ Fehler beim Verbinden:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

testConnection();
