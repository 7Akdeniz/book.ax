#!/usr/bin/env node
/**
 * 🔐 Admin Token Generator für lokales Testing
 * 
 * Generiert einen JWT Token für den Admin-User und zeigt
 * ein Copy-Paste-fähiges Script für die Browser Console.
 * 
 * Usage:
 *   node scripts/generate-admin-token.js
 * 
 * oder im Admin-Panel Console öffnen (F12) und ausführen:
 *   // Code aus OUTPUT kopieren und in Console einfügen
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Load .env.local
require('dotenv').config({ path: '.env.local' });

const JWT_SECRET = process.env.JWT_SECRET || 'book-ax-jwt-secret-development-min-32-chars-long-for-tokens';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'book-ax-refresh-secret-development-min-32-chars-long';

// Admin User aus seed-data.sql
const ADMIN_USER = {
  id: '33333333-3333-3333-3333-333333333333',
  email: 'admin@bookax.local',
  first_name: 'Super',
  last_name: 'Admin',
  role: 'admin',
};

// Generate Access Token (15 Minuten)
const accessToken = jwt.sign(
  {
    userId: ADMIN_USER.id,
    email: ADMIN_USER.email,
    role: ADMIN_USER.role,
    type: 'access',
  },
  JWT_SECRET,
  { expiresIn: '15m' }
);

// Generate Refresh Token (7 Tage)
const refreshToken = jwt.sign(
  {
    userId: ADMIN_USER.id,
    email: ADMIN_USER.email,
    role: ADMIN_USER.role,
    type: 'refresh',
  },
  JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);

// Generate User Object
const userObject = JSON.stringify({
  id: ADMIN_USER.id,
  email: ADMIN_USER.email,
  firstName: ADMIN_USER.first_name,
  lastName: ADMIN_USER.last_name,
  role: ADMIN_USER.role,
  emailVerified: true,
}, null, 2);

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║  🔐 BOOK.AX ADMIN TOKEN GENERATOR                            ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

console.log('📧 Admin User: admin@bookax.local');
console.log('🔑 Password: Password123!\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📋 COPY & PASTE THIS INTO BROWSER CONSOLE (F12):');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const browserScript = `
// 🔐 Book.ax Admin Authentication (DEV ONLY!)
// Generated: ${new Date().toISOString()}

// Set Tokens
localStorage.setItem('access_token', '${accessToken}');
localStorage.setItem('refresh_token', '${refreshToken}');

// Set User Data
localStorage.setItem('user', '${userObject.replace(/\n/g, '')}');

console.log('✅ Admin authenticated successfully!');
console.log('👤 User:', JSON.parse(localStorage.getItem('user')));
console.log('🔄 Reloading page...');

// Reload page to apply authentication
setTimeout(() => window.location.reload(), 1000);
`.trim();

console.log(browserScript);

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('💡 INSTRUCTIONS:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('1. Öffne http://localhost:3000/admin im Browser');
console.log('2. Drücke F12 um die Developer Console zu öffnen');
console.log('3. Kopiere den obigen Code-Block');
console.log('4. Füge ihn in die Console ein und drücke Enter');
console.log('5. Die Seite wird neu geladen und du bist als Admin eingeloggt!\n');

console.log('⏰ Token gültig für: 15 Minuten (Access) / 7 Tage (Refresh)');
console.log('🔄 Zum neu generieren: node scripts/generate-admin-token.js\n');

// Optional: Zeige Token Details
if (process.argv.includes('--verbose')) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 TOKEN DETAILS (--verbose):');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('Access Token:');
  console.log(accessToken, '\n');
  console.log('Refresh Token:');
  console.log(refreshToken, '\n');
  
  const decoded = jwt.decode(accessToken);
  console.log('Decoded Token:');
  console.log(JSON.stringify(decoded, null, 2), '\n');
}
