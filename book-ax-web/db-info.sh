#!/bin/bash

# 📊 Datenbank Status & Statistiken anzeigen

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Detect docker compose command
if docker compose version > /dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}   BOOK.AX - Datenbank Status${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Container Status
echo -e "${YELLOW}📦 Container Status:${NC}"
$COMPOSE_CMD ps
echo ""

# Datenbank-Größe
echo -e "${YELLOW}💾 Datenbank-Größe:${NC}"
docker exec bookax-postgres psql -U bookax_user -d bookax -c "
SELECT 
    pg_size_pretty(pg_database_size('bookax')) as \"Größe\"
"
echo ""

# Tabellen-Übersicht
echo -e "${YELLOW}📊 Tabellen & Anzahl Einträge:${NC}"
docker exec bookax-postgres psql -U bookax_user -d bookax -c "
SELECT 
    schemaname || '.' || tablename AS table,
    pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) AS size,
    n_live_tup AS rows
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC;
"
echo ""

# Aktive Verbindungen
echo -e "${YELLOW}🔌 Aktive Verbindungen:${NC}"
docker exec bookax-postgres psql -U bookax_user -d bookax -c "
SELECT 
    COUNT(*) as \"Anzahl\"
FROM pg_stat_activity
WHERE datname = 'bookax';
"
echo ""

# User-Statistik
echo -e "${YELLOW}👥 User nach Rolle:${NC}"
docker exec bookax-postgres psql -U bookax_user -d bookax -c "
SELECT 
    role,
    COUNT(*) as anzahl
FROM users
GROUP BY role
ORDER BY role;
"
echo ""

# Hotel-Statistik
echo -e "${YELLOW}🏨 Hotels nach Status:${NC}"
docker exec bookax-postgres psql -U bookax_user -d bookax -c "
SELECT 
    status,
    COUNT(*) as anzahl
FROM hotels
GROUP BY status;
"
echo ""

# Booking-Statistik
echo -e "${YELLOW}📅 Bookings nach Status:${NC}"
docker exec bookax-postgres psql -U bookax_user -d bookax -c "
SELECT 
    status,
    COUNT(*) as anzahl,
    SUM(total_amount) as gesamt_umsatz
FROM bookings
GROUP BY status;
"
echo ""

echo -e "${GREEN}✅ Status-Check abgeschlossen${NC}"
