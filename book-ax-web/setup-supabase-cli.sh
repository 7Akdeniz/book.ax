#!/bin/bash

# 🚀 Supabase CLI Setup Script
# Verbindet book-ax-web mit Production Supabase

set -e

echo "🚀 Supabase CLI Setup für book.ax"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if logged in
echo "📋 Schritt 1: Login prüfen..."
if ! supabase projects list &> /dev/null; then
  echo "⚠️  Du bist noch nicht eingeloggt."
  echo "🔐 Starte Login..."
  supabase login
else
  echo "✅ Du bist bereits eingeloggt!"
fi

echo ""
echo "📋 Schritt 2: Projekt verbinden..."
echo ""
echo "⚠️  Du wirst jetzt nach folgenden Informationen gefragt:"
echo "   1. Organization (wähle deine Organization)"
echo "   2. Project (wähle 'book.ax' oder ähnlich)"
echo "   3. Database Password (aus Supabase Dashboard)"
echo ""
echo "💡 Tipp: Database Password findest du hier:"
echo "   https://supabase.com/dashboard/project/_/settings/database"
echo ""
read -p "Bereit? Drücke ENTER um fortzufahren..." 

# Link project
supabase link

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup abgeschlossen!"
echo ""
echo "🎯 Jetzt verfügbar:"
echo "   • supabase db execute --file database/schema.sql"
echo "   • supabase db psql"
echo "   • supabase db dump -f backup.sql"
echo ""
echo "📖 Mehr Infos: siehe SUPABASE_CLI_GUIDE.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
