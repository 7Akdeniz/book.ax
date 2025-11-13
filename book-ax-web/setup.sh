#!/bin/bash

# BOOK.AX - Quick Setup Script
# This script helps you get started quickly

echo "🏨 BOOK.AX - Setup Script"
echo "=========================="
echo ""

# Check Node.js version
echo "✓ Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js 20+ required. You have Node.js $NODE_VERSION"
    echo "   Please install from https://nodejs.org/"
    exit 1
fi
echo "  Node.js $(node -v) ✓"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo ""

# Create .env.local if not exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cp .env.local.example .env.local
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local with your credentials:"
    echo "   - Supabase URL & Keys"
    echo "   - JWT Secrets"
    echo "   - Stripe Keys"
    echo ""
fi

# Check if .env.local has real values
if grep -q "your-anon-key" .env.local; then
    echo "⚠️  WARNING: .env.local still contains placeholder values!"
    echo "   Please update with real credentials before running."
    echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your credentials"
echo "2. Deploy database schema to Supabase:"
echo "   - Go to https://supabase.com/dashboard"
echo "   - SQL Editor → Copy database/schema.sql → Execute"
echo "3. Run development server:"
echo "   npm run dev"
echo ""
echo "4. Optional - Generate remaining language files:"
echo "   npm run generate-locales"
echo ""
echo "📚 Documentation:"
echo "   - README.md"
echo "   - IMPLEMENTATION_GUIDE.md"
echo "   - database/schema.sql"
echo ""
