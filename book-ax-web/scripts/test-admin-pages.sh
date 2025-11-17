#!/bin/bash

# Test all admin pages after layout changes

BASE_URL="http://localhost:3001"

echo "🧪 Testing Admin Pages..."
echo ""

# 1. Login als Admin
echo "1️⃣  Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bookax.local","password":"Password123!"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Login failed!"
  echo "$LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Login successful"
echo ""

# 2. Test Admin Routes
echo "2️⃣  Testing Admin Pages..."

ROUTES=(
  "/admin"
  "/admin/users"
  "/admin/hotels"
  "/admin/bookings"
  "/admin/finances"
  "/admin/settings"
  "/admin/analytics"
  "/admin/cms"
  "/admin/cms/pages"
)

for route in "${ROUTES[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Cookie: token=$TOKEN" \
    "$BASE_URL$route")
  
  if [ "$STATUS" == "200" ]; then
    echo "✅ $route: $STATUS"
  else
    echo "❌ $route: $STATUS"
  fi
done

echo ""
echo "🎉 Testing complete!"
