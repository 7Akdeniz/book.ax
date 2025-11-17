#!/bin/bash

# Generate Admin Login Script for Browser Console
# This script creates a ready-to-paste JavaScript code for browser console

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  🔐 ADMIN LOGIN SCRIPT FOR BROWSER                            ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Get admin token
echo "📧 Logging in as: admin@bookax.local"
echo "🔑 Password: Password123!"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bookax.local","password":"Password123!"}')

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')
REFRESH_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.refreshToken')
USER_DATA=$(echo $LOGIN_RESPONSE | jq -c '.user')

if [ "$ACCESS_TOKEN" = "null" ] || [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ Login failed!"
  exit 1
fi

echo "✅ Login successful!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 COPY & PASTE THIS INTO BROWSER CONSOLE (F12):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cat << EOF
// 🔐 Book.ax Admin Authentication (DEV ONLY!)
// Generated: $(date '+%Y-%m-%d %H:%M:%S')

// Set Tokens
localStorage.setItem('token', '$ACCESS_TOKEN');
localStorage.setItem('refreshToken', '$REFRESH_TOKEN');

// Set User Data
localStorage.setItem('user', '$USER_DATA');

console.log('✅ Admin authenticated successfully!');
console.log('👤 User:', JSON.parse(localStorage.getItem('user')));
console.log('🔄 Reloading page...');

// Reload page to apply authentication
setTimeout(() => window.location.reload(), 1000);
EOF

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 INSTRUCTIONS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Öffne http://localhost:3000/admin im Browser"
echo "2. Drücke F12 um die Developer Console zu öffnen"
echo "3. Kopiere den obigen Code-Block"
echo "4. Füge ihn in die Console ein und drücke Enter"
echo "5. Die Seite wird neu geladen und du bist als Admin eingeloggt!"
echo ""
echo "⏰ Token gültig für: 15 Minuten"
echo "🔄 Zum neu generieren: bash scripts/browser-admin-login.sh"
echo ""
