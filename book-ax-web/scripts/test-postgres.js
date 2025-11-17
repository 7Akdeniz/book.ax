#!/usr/bin/env node
/**
 * Test PostgreSQL Connection (Direct pg test)
 */

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function testDB() {
  console.log('🧪 Testing PostgreSQL connection...\n');
  console.log('📍 DATABASE_URL:', process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@') : 'NOT SET');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not set in .env.local');
    process.exit(1);
  }
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  try {
    // Test basic connection
    const versionResult = await pool.query('SELECT NOW() as now, version() as version');
    console.log('✅ PostgreSQL connection successful!');
    console.log('⏰ Server time:', versionResult.rows[0].now);
    console.log('🐘 Version:', versionResult.rows[0].version.split(' ').slice(0, 2).join(' '));
    
    // Test query
    console.log('\n📊 Testing database query...');
    const countResult = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log(`✅ Users in database: ${countResult.rows[0].count}\n`);
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    await pool.end();
    process.exit(1);
  }
}

testDB();
