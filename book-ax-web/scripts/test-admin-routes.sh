#!/bin/bash

# Test Admin Routes with Authentication
# Usage: ./scripts/test-admin-routes.sh

echo "🔐 Testing Admin Routes with Authentication"
echo "=========================================="
echo ""

# Login as admin
echo "1️⃣  Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bookax.local","password":"Password123!"}')

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Login failed!"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Login successful"
echo "Token: ${TOKEN:0:20}..."
echo ""

# Test routes
echo "2️⃣  Testing Admin Routes..."
echo ""

# Dashboard
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/admin)
echo "Dashboard: $HTTP_CODE $([ "$HTTP_CODE" = "200" ] && echo "✅" || echo "❌")"

# Bookings
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/admin/bookings)
echo "Bookings: $HTTP_CODE $([ "$HTTP_CODE" = "200" ] && echo "✅" || echo "❌")"

# Users
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/admin/users)
echo "Users: $HTTP_CODE $([ "$HTTP_CODE" = "200" ] && echo "✅" || echo "❌")"

# Hotels
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/admin/hotels)
echo "Hotels: $HTTP_CODE $([ "$HTTP_CODE" = "200" ] && echo "✅" || echo "❌")"

# CMS Pages
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/admin/cms/pages)
echo "CMS Pages: $HTTP_CODE $([ "$HTTP_CODE" = "200" ] && echo "✅" || echo "❌")"

# Analytics
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/admin/analytics)
echo "Analytics: $HTTP_CODE $([ "$HTTP_CODE" = "200" ] && echo "✅" || echo "❌")"

# Finances
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/admin/finances)
echo "Finances: $HTTP_CODE $([ "$HTTP_CODE" = "200" ] && echo "✅" || echo "❌")"

# Settings
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/admin/settings)
echo "Settings: $HTTP_CODE $([ "$HTTP_CODE" = "200" ] && echo "✅" || echo "❌")"

echo ""
echo "3️⃣  Testing Admin API Routes..."
echo ""

# API: Verify
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/admin/verify)
echo "API Verify: $HTTP_CODE $([ "$HTTP_CODE" = "200" ] && echo "✅" || echo "❌")"

# API: Stats
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/admin/stats)
echo "API Stats: $HTTP_CODE $([ "$HTTP_CODE" = "200" ] && echo "✅" || echo "❌")"

# API: Bookings
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/admin/bookings)
echo "API Bookings: $HTTP_CODE $([ "$HTTP_CODE" = "200" ] && echo "✅" || echo "❌")"

echo ""
echo "=========================================="
echo "✅ Admin Routes Test Complete!"
