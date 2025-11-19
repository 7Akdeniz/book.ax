#!/bin/bash

# Test Cookie-Based Authentication
# This script tests if cookies are properly set and used

echo "🧪 Testing Cookie-Based Authentication..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="${1:-http://localhost:3000}"
EMAIL="test@example.com"
PASSWORD="test123"

echo "📍 Testing against: $BASE_URL"
echo ""

# Step 1: Login and save cookies
echo "1️⃣ Testing Login with Cookie Storage..."
LOGIN_RESPONSE=$(curl -s -c cookies.txt -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

if echo "$LOGIN_RESPONSE" | grep -q "accessToken"; then
  echo -e "${GREEN}✅ Login successful${NC}"
  
  # Check if cookies were saved
  if [ -f cookies.txt ]; then
    echo -e "${GREEN}✅ Cookie file created${NC}"
    
    # Check cookie content
    if grep -q "accessToken" cookies.txt; then
      echo -e "${GREEN}✅ accessToken cookie found${NC}"
    else
      echo -e "${RED}❌ accessToken cookie NOT found in file${NC}"
    fi
    
    if grep -q "refreshToken" cookies.txt; then
      echo -e "${GREEN}✅ refreshToken cookie found${NC}"
    else
      echo -e "${YELLOW}⚠️  refreshToken cookie NOT found in file${NC}"
    fi
    
    echo ""
    echo "📋 Cookie file contents:"
    cat cookies.txt
  else
    echo -e "${RED}❌ Cookie file NOT created${NC}"
  fi
else
  echo -e "${RED}❌ Login failed${NC}"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 2: Test Upload with Cookies
echo "2️⃣ Testing Upload with Cookies..."

# Create a test image
echo "Creating test image..."
convert -size 100x100 xc:blue test-image.jpg 2>/dev/null || {
  echo "ImageMagick not installed, creating dummy file..."
  echo "fake image data" > test-image.jpg
}

UPLOAD_RESPONSE=$(curl -s -b cookies.txt -X POST "$BASE_URL/api/upload/image" \
  -F "file=@test-image.jpg" \
  -w "\nHTTP_CODE:%{http_code}")

HTTP_CODE=$(echo "$UPLOAD_RESPONSE" | grep "HTTP_CODE" | cut -d':' -f2)
RESPONSE_BODY=$(echo "$UPLOAD_RESPONSE" | sed '/HTTP_CODE/d')

echo "HTTP Status: $HTTP_CODE"
echo "Response: $RESPONSE_BODY"

if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ Upload successful with cookies!${NC}"
elif [ "$HTTP_CODE" = "401" ]; then
  echo -e "${RED}❌ Upload failed: 401 Unauthorized${NC}"
  echo -e "${YELLOW}⚠️  Cookies are not being sent or accepted properly${NC}"
else
  echo -e "${RED}❌ Upload failed with status: $HTTP_CODE${NC}"
fi

# Cleanup
rm -f test-image.jpg

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 3: Test Upload with Bearer Token
echo "3️⃣ Testing Upload with Bearer Token (fallback)..."

ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -n "$ACCESS_TOKEN" ]; then
  echo "Using token: ${ACCESS_TOKEN:0:20}..."
  
  # Create another test image
  echo "fake image data" > test-image2.jpg
  
  BEARER_UPLOAD_RESPONSE=$(curl -s -X POST "$BASE_URL/api/upload/image" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -F "file=@test-image2.jpg" \
    -w "\nHTTP_CODE:%{http_code}")
  
  BEARER_HTTP_CODE=$(echo "$BEARER_UPLOAD_RESPONSE" | grep "HTTP_CODE" | cut -d':' -f2)
  BEARER_RESPONSE_BODY=$(echo "$BEARER_UPLOAD_RESPONSE" | sed '/HTTP_CODE/d')
  
  echo "HTTP Status: $BEARER_HTTP_CODE"
  echo "Response: $BEARER_RESPONSE_BODY"
  
  if [ "$BEARER_HTTP_CODE" = "201" ] || [ "$BEARER_HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ Upload successful with Bearer token!${NC}"
  else
    echo -e "${RED}❌ Upload failed with status: $BEARER_HTTP_CODE${NC}"
  fi
  
  rm -f test-image2.jpg
else
  echo -e "${RED}❌ Could not extract access token${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Cleanup
rm -f cookies.txt

echo "🏁 Test completed!"
echo ""
echo "Summary:"
echo "- If Cookie test fails but Bearer test succeeds: Cookie settings issue"
echo "- If both fail: Authentication/Authorization issue"
echo "- If both succeed: Everything works! 🎉"
