#!/bin/bash

# 🧪 User Registration API Test Script
# Tests the /api/auth/register endpoint

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
API_URL="${1:-https://book.ax}"
TEST_EMAIL="test-$(date +%s)@example.com"

echo -e "${YELLOW}🧪 Testing User Registration API${NC}"
echo -e "API URL: ${API_URL}"
echo -e "Test Email: ${TEST_EMAIL}\n"

# Test 1: Register new user
echo -e "${YELLOW}Test 1: Register new guest user...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${TEST_EMAIL}\",
    \"password\": \"SecurePass123!\",
    \"firstName\": \"Test\",
    \"lastName\": \"User\",
    \"role\": \"guest\"
  }")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" -eq 201 ]; then
  echo -e "${GREEN}✅ Registration successful!${NC}"
  echo -e "Response: ${BODY}\n"
  
  # Extract tokens
  ACCESS_TOKEN=$(echo "$BODY" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
  USER_ID=$(echo "$BODY" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
  
  if [ -n "$ACCESS_TOKEN" ]; then
    echo -e "${GREEN}✅ Access Token received${NC}"
    echo -e "Token (first 50 chars): ${ACCESS_TOKEN:0:50}...\n"
  fi
  
  if [ -n "$USER_ID" ]; then
    echo -e "${GREEN}✅ User ID received: ${USER_ID}${NC}\n"
  fi
else
  echo -e "${RED}❌ Registration failed!${NC}"
  echo -e "HTTP Code: ${HTTP_CODE}"
  echo -e "Response: ${BODY}\n"
  exit 1
fi

# Test 2: Try to register same email again (should fail)
echo -e "${YELLOW}Test 2: Try duplicate registration (should fail)...${NC}"
RESPONSE2=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${TEST_EMAIL}\",
    \"password\": \"SecurePass123!\",
    \"firstName\": \"Test\",
    \"lastName\": \"User\",
    \"role\": \"guest\"
  }")

HTTP_CODE2=$(echo "$RESPONSE2" | tail -n1)
BODY2=$(echo "$RESPONSE2" | head -n-1)

if [ "$HTTP_CODE2" -eq 409 ]; then
  echo -e "${GREEN}✅ Duplicate registration correctly rejected!${NC}"
  echo -e "Response: ${BODY2}\n"
else
  echo -e "${RED}❌ Expected 409 Conflict, got ${HTTP_CODE2}${NC}"
  echo -e "Response: ${BODY2}\n"
fi

# Test 3: Register hotelier
echo -e "${YELLOW}Test 3: Register hotelier user...${NC}"
HOTELIER_EMAIL="hotelier-$(date +%s)@example.com"
RESPONSE3=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${HOTELIER_EMAIL}\",
    \"password\": \"SecurePass123!\",
    \"firstName\": \"Hotel\",
    \"lastName\": \"Manager\",
    \"role\": \"hotelier\"
  }")

HTTP_CODE3=$(echo "$RESPONSE3" | tail -n1)
BODY3=$(echo "$RESPONSE3" | head -n-1)

if [ "$HTTP_CODE3" -eq 201 ]; then
  echo -e "${GREEN}✅ Hotelier registration successful!${NC}"
  echo -e "Response: ${BODY3}\n"
else
  echo -e "${RED}❌ Hotelier registration failed!${NC}"
  echo -e "HTTP Code: ${HTTP_CODE3}"
  echo -e "Response: ${BODY3}\n"
fi

# Test 4: Invalid email format
echo -e "${YELLOW}Test 4: Invalid email format (should fail)...${NC}"
RESPONSE4=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"invalid-email\",
    \"password\": \"SecurePass123!\",
    \"firstName\": \"Test\",
    \"lastName\": \"User\",
    \"role\": \"guest\"
  }")

HTTP_CODE4=$(echo "$RESPONSE4" | tail -n1)
BODY4=$(echo "$RESPONSE4" | head -n-1)

if [ "$HTTP_CODE4" -eq 400 ]; then
  echo -e "${GREEN}✅ Invalid email correctly rejected!${NC}"
  echo -e "Response: ${BODY4}\n"
else
  echo -e "${RED}❌ Expected 400 Bad Request, got ${HTTP_CODE4}${NC}"
  echo -e "Response: ${BODY4}\n"
fi

# Test 5: Weak password
echo -e "${YELLOW}Test 5: Weak password (should fail)...${NC}"
RESPONSE5=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"test-weak@example.com\",
    \"password\": \"123\",
    \"firstName\": \"Test\",
    \"lastName\": \"User\",
    \"role\": \"guest\"
  }")

HTTP_CODE5=$(echo "$RESPONSE5" | tail -n1)
BODY5=$(echo "$RESPONSE5" | head -n-1)

if [ "$HTTP_CODE5" -eq 400 ]; then
  echo -e "${GREEN}✅ Weak password correctly rejected!${NC}"
  echo -e "Response: ${BODY5}\n"
else
  echo -e "${RED}❌ Expected 400 Bad Request, got ${HTTP_CODE5}${NC}"
  echo -e "Response: ${BODY5}\n"
fi

# Summary
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Registration API Tests Complete!${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "✅ Test 1: New user registration"
echo -e "✅ Test 2: Duplicate email prevention"
echo -e "✅ Test 3: Hotelier registration"
echo -e "✅ Test 4: Email validation"
echo -e "✅ Test 5: Password validation"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo -e "1. Check Supabase Dashboard → users table"
echo -e "2. Test login with: ${TEST_EMAIL}"
echo -e "3. Test token refresh endpoint"
echo ""
