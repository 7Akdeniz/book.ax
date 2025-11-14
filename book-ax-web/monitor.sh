#!/bin/bash

# Vercel Deployment Monitor Script
# Überwacht Deployments und zeigt Fehler in Echtzeit

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   📊 Vercel Deployment Monitor${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Navigate to web directory
cd "$(dirname "$0")"

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo -e "${RED}❌ Nicht bei Vercel eingeloggt!${NC}"
    echo -e "${YELLOW}Führe aus: npm run vercel:login${NC}\n"
    exit 1
fi

# Check if linked
if [ ! -d ".vercel" ]; then
    echo -e "${RED}❌ Projekt nicht mit Vercel verbunden!${NC}"
    echo -e "${YELLOW}Führe aus: npm run vercel:link${NC}\n"
    exit 1
fi

echo -e "${GREEN}✅ Vercel CLI bereit${NC}\n"

# Menu
echo "Was möchtest du tun?"
echo "1) 🚀 Production Deployment + Inspect"
echo "2) 🔍 Preview Deployment (Test)"
echo "3) 📊 Deployment Logs anzeigen"
echo "4) � Deployment Details inspizieren"
echo "5) 🐛 Fehler in Logs suchen"
echo "6) 📦 Deployment Liste"
echo "7) 🔐 Environment Variables"
echo ""
read -p "Wähle (1-7): " choice

case $choice in
    1)
        echo -e "\n${YELLOW}🚀 Starte Production Deployment...${NC}\n"
        vercel --prod --yes
        echo -e "\n${GREEN}✅ Deployment gestartet!${NC}"
        echo -e "${BLUE}� Zeige Deployment Details...${NC}\n"
        sleep 5
        vercel inspect https://book.ax
        ;;
    2)
        echo -e "\n${YELLOW}🔍 Starte Preview Deployment...${NC}\n"
        vercel --yes
        echo -e "\n${GREEN}✅ Preview Deployment gestartet!${NC}"
        echo -e "${BLUE}Test die URL bevor du Production deployed!${NC}\n"
        ;;
    3)
        echo -e "\n${BLUE}📊 Deployment Logs:${NC}\n"
        vercel logs https://book.ax
        ;;
    4)
        echo -e "\n${BLUE}📡 Deployment Details:${NC}\n"
        vercel inspect https://book.ax
        ;;
    5)
        echo -e "\n${RED}🐛 Fehler suchen in Logs:${NC}\n"
        vercel logs https://book.ax | grep -i -E "error|failed|exception" --color=always || echo -e "${GREEN}Keine Fehler gefunden! 🎉${NC}"
        ;;
    6)
        echo -e "\n${BLUE}📦 Deployment Liste:${NC}\n"
        vercel list --next 10
        ;;
    7)
        echo -e "\n${BLUE}🔐 Environment Variables:${NC}\n"
        vercel env ls
        echo -e "\n${YELLOW}💡 Tipp: Mit 'vercel env pull .env.local' kannst du alle Vars lokal ziehen${NC}"
        ;;
    *)
        echo -e "${RED}Ungültige Auswahl${NC}"
        exit 1
        ;;
esac

echo -e "\n${GREEN}✨ Fertig!${NC}\n"
