#!/bin/bash

# 🔄 Datenbank Reset & Neu-Initialisierung
# WARNUNG: Löscht ALLE Daten in der lokalen Datenbank!

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Detect docker compose command
if docker compose version > /dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

echo -e "${RED}⚠️  WARNUNG: Dies löscht ALLE Daten in der lokalen Datenbank!${NC}"
echo ""
read -p "Möchtest du fortfahren? (yes/no) " -r
echo

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Abgebrochen."
    exit 0
fi

echo -e "${YELLOW}🗑️  Lösche Container und Volumes...${NC}"
$COMPOSE_CMD down -v

echo -e "${YELLOW}🚀 Starte Container neu...${NC}"
$COMPOSE_CMD up -d

echo -e "${YELLOW}⏳ Warte auf PostgreSQL...${NC}"
for i in {1..30}; do
    if docker exec bookax-postgres pg_isready -U bookax_user -d bookax > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL ist ready!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ PostgreSQL startet nicht!${NC}"
        exit 1
    fi
    echo -n "."
    sleep 2
done

echo -e "${GREEN}✅ Datenbank erfolgreich neu initialisiert!${NC}"
echo ""
echo "Demo-Zugänge:"
echo "  Guest: guest@bookax.local / Password123!"
echo "  Hotelier: hotelier@bookax.local / Password123!"
echo "  Admin: admin@bookax.local / Password123!"
