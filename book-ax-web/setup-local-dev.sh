#!/bin/bash

# 🚀 BOOK.AX - Lokale Development Environment Setup
# Dieses Script richtet die komplette lokale Entwicklungsumgebung ein

set -e  # Exit on error

echo "🚀 BOOK.AX - Lokale Development Setup"
echo "======================================"
echo ""

# Farbcodes für Output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Prüfe ob Docker läuft
echo "📦 Prüfe Docker Installation..."
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker läuft nicht oder ist nicht installiert!${NC}"
    echo "Bitte installiere Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi
echo -e "${GREEN}✅ Docker ist verfügbar${NC}"
echo ""

# Prüfe ob docker compose verfügbar ist
echo "📦 Prüfe Docker Compose..."
if ! docker compose version > /dev/null 2>&1; then
    if ! docker-compose --version > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker Compose nicht gefunden!${NC}"
        exit 1
    else
        # Alte Version, verwende docker-compose
        COMPOSE_CMD="docker-compose"
    fi
else
    # Neue Version, verwende docker compose
    COMPOSE_CMD="docker compose"
fi
echo -e "${GREEN}✅ Docker Compose ist verfügbar${NC}"
echo ""

# Prüfe ob Port 5432 frei ist
echo "🔌 Prüfe Port 5432..."
if lsof -Pi :5432 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 5432 ist bereits belegt!${NC}"
    echo "Mögliche Lösungen:"
    echo "  1. Bestehende PostgreSQL stoppen: brew services stop postgresql"
    echo "  2. Anderen Port in docker-compose.yml verwenden"
    read -p "Möchtest du fortfahren? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✅ Port 5432 ist frei${NC}"
fi
echo ""

# Alte Container stoppen (falls vorhanden)
echo "🧹 Räume alte Container auf..."
$COMPOSE_CMD down -v 2>/dev/null || true
echo -e "${GREEN}✅ Alte Container entfernt${NC}"
echo ""

# Prüfe ob seed-data.sql existiert
if [ ! -f "database/seed-data.sql" ]; then
    echo -e "${YELLOW}⚠️  seed-data.sql nicht gefunden - erstelle sie...${NC}"
    # Hier könnte ein Backup-Plan sein
fi

# Docker Container starten
echo "🐳 Starte Docker Container..."
$COMPOSE_CMD up -d

# Warte bis PostgreSQL ready ist
echo "⏳ Warte auf PostgreSQL..."
for i in {1..30}; do
    if docker exec bookax-postgres pg_isready -U bookax_user -d bookax > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL ist ready!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ PostgreSQL startet nicht - prüfe die Logs:${NC}"
        docker-compose logs postgres
        exit 1
    fi
    echo -n "."
    sleep 2
done
echo ""

# Prüfe ob Schema geladen wurde
echo "📊 Prüfe Datenbank-Schema..."
TABLE_COUNT=$(docker exec bookax-postgres psql -U bookax_user -d bookax -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | xargs)

if [ "$TABLE_COUNT" -gt 5 ]; then
    echo -e "${GREEN}✅ Schema erfolgreich geladen ($TABLE_COUNT Tabellen)${NC}"
else
    echo -e "${YELLOW}⚠️  Schema möglicherweise unvollständig (nur $TABLE_COUNT Tabellen)${NC}"
fi
echo ""

# Prüfe ob Demo-Daten vorhanden sind
echo "🎯 Prüfe Demo-Daten..."
USER_COUNT=$(docker exec bookax-postgres psql -U bookax_user -d bookax -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | xargs || echo "0")

if [ "$USER_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Demo-Daten geladen ($USER_COUNT User)${NC}"
else
    echo -e "${YELLOW}⚠️  Keine Demo-Daten gefunden${NC}"
fi
echo ""

# Environment Variables prüfen
echo "🔑 Prüfe Environment Variables..."
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local nicht gefunden - erstelle von .env.example...${NC}"
    
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo -e "${GREEN}✅ .env.local erstellt${NC}"
        echo -e "${YELLOW}⚠️  WICHTIG: Passe .env.local an (DATABASE_URL, JWT_SECRET, etc.)${NC}"
    else
        echo -e "${RED}❌ .env.example nicht gefunden!${NC}"
        cat > .env.local << 'EOF'
# BOOK.AX - Lokale Development Environment

# Lokale PostgreSQL (Docker)
DATABASE_URL=postgresql://bookax_user:bookax_dev_password_2025@localhost:5432/bookax

# JWT Secrets (ÄNDERN FÜR PRODUCTION!)
JWT_SECRET=local_dev_jwt_secret_min_32_chars_bookax_2025_change_me
JWT_REFRESH_SECRET=local_dev_refresh_secret_min_32_chars_bookax_2025_change_me

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe Test Keys (optional - für Payment Testing)
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
EOF
        echo -e "${GREEN}✅ .env.local erstellt (mit Standard-Werten)${NC}"
    fi
else
    echo -e "${GREEN}✅ .env.local existiert${NC}"
fi
echo ""

# Installation prüfen
echo "📦 Prüfe Node.js Dependencies..."
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules nicht gefunden - installiere...${NC}"
    npm install
else
    echo -e "${GREEN}✅ node_modules vorhanden${NC}"
fi
echo ""

# Container Status anzeigen
echo "📊 Container Status:"
$COMPOSE_CMD ps
echo ""

# Zusammenfassung
echo "=========================================="
echo -e "${GREEN}✅ Setup erfolgreich abgeschlossen!${NC}"
echo "=========================================="
echo ""
echo "🎯 Nächste Schritte:"
echo ""
echo "1. Starte die App:"
echo "   ${GREEN}npm run dev${NC}"
echo ""
echo "2. Öffne im Browser:"
echo "   - App: ${GREEN}http://localhost:3000${NC}"
echo "   - pgAdmin: ${GREEN}http://localhost:5050${NC} (admin@bookax.local / admin)"
echo ""
echo "3. Demo-Zugänge:"
echo "   - Gast: ${GREEN}guest@bookax.local${NC} / Password123!"
echo "   - Hotelier: ${GREEN}hotelier@bookax.local${NC} / Password123!"
echo "   - Admin: ${GREEN}admin@bookax.local${NC} / Password123!"
echo ""
echo "📚 Weitere Infos:"
echo "   - Anleitung: ${GREEN}LOCAL_DEVELOPMENT.md${NC}"
echo "   - Schema: ${GREEN}database/schema.sql${NC}"
echo ""
echo "🛠️  Nützliche Befehle:"
echo "   - Logs: ${GREEN}docker-compose logs -f${NC}"
echo "   - PostgreSQL Shell: ${GREEN}docker exec -it bookax-postgres psql -U bookax_user -d bookax${NC}"
echo "   - Container stoppen: ${GREEN}docker-compose stop${NC}"
echo "   - Container neu starten: ${GREEN}docker-compose restart${NC}"
echo ""
echo "Viel Erfolg! 🚀"
