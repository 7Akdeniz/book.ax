#!/bin/bash

# 🔍 Quick Database Status Check
# Zeigt wichtige Infos über die Production Database

set -e

echo "🔍 Database Status Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if linked
if ! supabase projects list &> /dev/null; then
  echo "❌ Fehler: Nicht mit Supabase eingeloggt!"
  echo "Führe aus: supabase login"
  exit 1
fi

echo "📊 Tabellen:"
supabase db execute --sql "
  SELECT 
    table_name,
    (SELECT COUNT(*) 
     FROM information_schema.columns 
     WHERE columns.table_name = tables.table_name) as columns
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  ORDER BY table_name;
"

echo ""
echo "👥 Users:"
supabase db execute --sql "
  SELECT 
    role,
    status,
    COUNT(*) as count
  FROM users
  GROUP BY role, status
  ORDER BY role, status;
"

echo ""
echo "🏨 Hotels:"
supabase db execute --sql "
  SELECT 
    status,
    COUNT(*) as count
  FROM hotels
  GROUP BY status
  ORDER BY status;
" 2>/dev/null || echo "⚠️  Hotels-Tabelle ist leer oder existiert nicht"

echo ""
echo "📅 Bookings:"
supabase db execute --sql "
  SELECT 
    status,
    COUNT(*) as count
  FROM bookings
  GROUP BY status
  ORDER BY status;
" 2>/dev/null || echo "⚠️  Bookings-Tabelle ist leer oder existiert nicht"

echo ""
echo "💳 Payments:"
supabase db execute --sql "
  SELECT 
    status,
    COUNT(*) as count
  FROM payments
  GROUP BY status
  ORDER BY status;
" 2>/dev/null || echo "⚠️  Payments-Tabelle ist leer oder existiert nicht"

echo ""
echo "📈 Database Size:"
supabase db execute --sql "
  SELECT 
    pg_size_pretty(pg_database_size(current_database())) as size;
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
