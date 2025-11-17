#!/bin/bash

# Book.ax Playwright E2E Tests - Quick Start Script
# Run this to set up and execute all tests

set -e

echo "🎭 Book.ax Playwright E2E Tests Setup"
echo "======================================"
echo ""

# Check if dev server is running
if ! curl -s http://localhost:3000 > /dev/null; then
  echo "⚠️  Dev server is not running on port 3000"
  echo "Please start it first: npm run dev"
  exit 1
fi

echo "✅ Dev server is running"
echo ""

# Install Playwright if not installed
if ! npx playwright --version > /dev/null 2>&1; then
  echo "📦 Installing Playwright..."
  npm install -D @playwright/test
fi

# Install browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install chromium --with-deps

echo ""
echo "🧪 Running E2E Tests..."
echo ""

# Run tests
npx playwright test "$@"

# Show report if tests passed
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ All tests passed!"
  echo ""
  echo "📊 View detailed report:"
  echo "   npm run test:e2e:report"
else
  echo ""
  echo "❌ Some tests failed"
  echo ""
  echo "🔍 Debug options:"
  echo "   npm run test:e2e:ui       - Run with UI"
  echo "   npm run test:e2e:headed   - See browser"
  echo "   npm run test:e2e:debug    - Debug mode"
  echo "   npm run test:e2e:report   - View report"
fi
