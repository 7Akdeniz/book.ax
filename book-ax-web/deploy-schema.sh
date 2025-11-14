#!/bin/bash

# 🚀 Deploy Database Schema to Production
# Führt schema.sql in Production Supabase aus

set -e

echo "🚀 Deploying Database Schema to Production..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if linked
if ! supabase projects list &> /dev/null; then
  echo "❌ Fehler: Nicht mit Supabase eingeloggt!"
  echo "Führe aus: supabase login"
  exit 1
fi

echo "📁 Schema-Datei: database/schema.sql"
echo ""
read -p "⚠️  WARNUNG: Dies überschreibt das Schema in Production! Fortfahren? (yes/NO): " confirm

if [ "$confirm" != "yes" ]; then
  echo "❌ Abgebrochen."
  exit 0
fi

echo ""
echo "📤 Deploying schema.sql..."
supabase db execute --file database/schema.sql

echo ""
echo "✅ Schema erfolgreich deployed!"
echo ""
echo "🔍 Verifizierung:"
supabase db execute --sql "
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  ORDER BY table_name;
"

echo ""
echo "👤 Admin User prüfen:"
supabase db execute --sql "
  SELECT id, email, role, status 
  FROM users 
  WHERE email = 'admin@book.ax';
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Deployment abgeschlossen!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
