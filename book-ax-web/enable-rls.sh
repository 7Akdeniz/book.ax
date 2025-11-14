#!/bin/bash

# 🔐 Enable RLS (Row Level Security) on all tables
# Fixes Supabase security warnings

set -e

echo "🔐 Enabling RLS on all tables..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

read -p "⚠️  This will enable RLS on all public tables. Continue? (yes/NO): " confirm

if [ "$confirm" != "yes" ]; then
  echo "❌ Abgebrochen."
  exit 0
fi

echo ""
echo "📤 Deploying RLS policies..."

# Option 1: Via Supabase CLI (if linked)
if command -v supabase &> /dev/null; then
  if supabase projects list &> /dev/null 2>&1; then
    echo "Using Supabase CLI..."
    # Note: Supabase CLI doesn't have direct execute, we need to use the file
    echo "Please run manually:"
    echo "  1. Open Supabase Dashboard → SQL Editor"
    echo "  2. Copy content from: database/enable-rls-complete.sql"
    echo "  3. Paste and RUN"
  fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Manual Steps:"
echo ""
echo "1. Open Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/_/editor"
echo ""
echo "2. Go to SQL Editor"
echo ""
echo "3. Copy & paste from:"
echo "   database/enable-rls-complete.sql"
echo ""
echo "4. Click RUN"
echo ""
echo "5. Verify with:"
echo "   database/verify-rls.sql"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
