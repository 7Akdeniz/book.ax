#!/bin/bash
# Test Login on Production

echo "🧪 Testing Login on https://book.ax"
echo "=================================="
echo ""

curl -X POST https://book.ax/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@book.ax",
    "password": "Admin123!"
  }' | jq '.'

echo ""
echo "=================================="
