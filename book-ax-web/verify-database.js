// Database Verification Script
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDatabase() {
  console.log('🔍 Book.ax Database Verification');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const tables = [
    'users',
    'refresh_tokens',
    'password_reset_tokens',
    'hotels',
    'hotel_translations',
    'room_categories',
    'room_category_translations',
    'bookings',
    'payments',
    'commissions',
    'amenities',
    'hotel_amenities',
    'hotel_images',
    'rates',
    'inventory',
    'housekeeping',
    'ota_connections',
    'ota_room_mappings',
    'ota_sync_logs',
    'revenue_rules',
    'price_recommendations',
    'market_data',
    'reviews',
    'system_settings',
    'locales',
    'translations'
  ];

  const results = {
    existing: [],
    missing: [],
    withData: []
  };

  console.log('📊 Checking tables...\n');

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          results.missing.push(table);
          console.log(`❌ ${table.padEnd(30)} - NOT FOUND`);
        } else {
          results.existing.push({ table, count: '?' });
          console.log(`⚠️  ${table.padEnd(30)} - EXISTS (error: ${error.message})`);
        }
      } else {
        results.existing.push({ table, count });
        if (count > 0) {
          results.withData.push({ table, count });
          console.log(`✅ ${table.padEnd(30)} - EXISTS (${count} rows)`);
        } else {
          console.log(`✅ ${table.padEnd(30)} - EXISTS (empty)`);
        }
      }
    } catch (e) {
      results.missing.push(table);
      console.log(`❌ ${table.padEnd(30)} - ERROR: ${e.message}`);
    }
  }

  // Check admin user
  console.log('\n👤 Checking admin user...');
  try {
    const { data: admin, error } = await supabase
      .from('users')
      .select('id, email, role, status')
      .eq('email', 'admin@book.ax')
      .single();

    if (error) {
      console.log('❌ Admin user not found');
    } else {
      console.log('✅ Admin user exists:', admin);
    }
  } catch (e) {
    console.log('❌ Error checking admin:', e.message);
  }

  // Check locales
  console.log('\n🌍 Checking locales...');
  try {
    const { count, error } = await supabase
      .from('locales')
      .select('*', { count: 'exact', head: true });

    if (!error) {
      console.log(`✅ ${count} locales configured`);
    } else {
      console.log('❌ Error checking locales');
    }
  } catch (e) {
    console.log('❌ Error:', e.message);
  }

  // Check amenities
  console.log('\n🏨 Checking amenities...');
  try {
    const { count, error } = await supabase
      .from('amenities')
      .select('*', { count: 'exact', head: true });

    if (!error) {
      console.log(`✅ ${count} amenities configured`);
    } else {
      console.log('❌ Error checking amenities');
    }
  } catch (e) {
    console.log('❌ Error:', e.message);
  }

  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📈 Summary:');
  console.log(`✅ Existing tables: ${results.existing.length}/${tables.length}`);
  console.log(`📦 Tables with data: ${results.withData.length}`);
  console.log(`❌ Missing tables: ${results.missing.length}`);

  if (results.missing.length > 0) {
    console.log('\n⚠️  Missing tables:');
    results.missing.forEach(t => console.log(`   - ${t}`));
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (results.existing.length === tables.length) {
    console.log('✅ DATABASE IS COMPLETE!');
    if (results.withData.length > 0) {
      console.log(`📊 ${results.withData.length} tables have data`);
    }
  } else {
    console.log('⚠️  SOME TABLES ARE MISSING!');
    console.log('Run: ./deploy-schema.sh');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

checkDatabase().catch(console.error);
