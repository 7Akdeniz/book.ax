#!/usr/bin/env node
/**
 * Fix Admin User Password
 * 
 * This script updates the admin@book.ax user with a proper bcrypt password hash.
 * Password: Admin123!
 */

const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: Missing environment variables!');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function fixAdminPassword() {
  try {
    console.log('🔧 Fixing admin user password...\n');

    const email = 'admin@book.ax';
    const password = 'Admin123!';

    // Generate bcrypt hash (salt rounds: 10)
    console.log('🔐 Generating bcrypt hash...');
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(`✅ Hash generated: ${passwordHash.substring(0, 30)}...`);

    // Check if user exists
    console.log('\n📋 Checking if user exists...');
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email, role, status, email_verified')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingUser) {
      // User exists - update password
      console.log(`✅ User found: ${existingUser.email}`);
      console.log(`   Role: ${existingUser.role}`);
      console.log(`   Status: ${existingUser.status}`);
      console.log(`   Email Verified: ${existingUser.email_verified}`);

      console.log('\n🔄 Updating password hash...');
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          password_hash: passwordHash,
          email_verified: true,
          status: 'active'
        })
        .eq('email', email);

      if (updateError) throw updateError;

      console.log('✅ Password updated successfully!');
    } else {
      // User doesn't exist - create it
      console.log('⚠️  User not found. Creating new admin user...');

      const { error: insertError } = await supabase
        .from('users')
        .insert({
          email: email,
          password_hash: passwordHash,
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
          status: 'active',
          email_verified: true,
          preferred_language: 'en'
        });

      if (insertError) throw insertError;

      console.log('✅ Admin user created successfully!');
    }

    console.log('\n✅ Done! You can now login with:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n🌐 Try logging in at: https://book.ax/en/login');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.details) console.error('Details:', error.details);
    if (error.hint) console.error('Hint:', error.hint);
    process.exit(1);
  }
}

// Run
fixAdminPassword();
