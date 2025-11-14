#!/bin/bash

###############################################################################
# DEMO: Zeigt die Capabilities der Book.ax Content Automation
###############################################################################

PURPLE='\033[0;35m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

clear

echo -e "${PURPLE}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║     Book.ax Content Automation - LIVE DEMO                     ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${BLUE}Diese Demo generiert Beispiel-Content für verschiedene Szenarien.${NC}"
echo ""
echo "Generiere in 60 Sekunden:"
echo "  ✓ 1 Blog-Artikel"
echo "  ✓ 1 Landing Page"
echo "  ✓ 4 Social Media Posts"
echo "  ✓ 2 Ads-Texte"
echo "  ✓ 1 Reise-Guide"
echo "  ✓ 1 FAQ-Block"
echo ""

read -p "Demo starten? (j/n): " start

if [ "$start" != "j" ] && [ "$start" != "J" ]; then
  echo "Demo abgebrochen."
  exit 0
fi

echo ""
echo -e "${GREEN}=== DEMO START ===${NC}"
echo ""

# Szenario 1: Blog
echo -e "${BLUE}[1/6] Generiere Blog-Artikel für Berlin...${NC}"
node generator.js --type=blog --city=Berlin
sleep 1

# Szenario 2: Landing Page
echo -e "${BLUE}[2/6] Generiere Landing Page für München...${NC}"
node generator.js --type=landing --city=München
sleep 1

# Szenario 3: Social Media
echo -e "${BLUE}[3/6] Generiere Social Media Posts für Hamburg...${NC}"
node generator.js --type=social --city=Hamburg --platform=instagram
node generator.js --type=social --city=Hamburg --platform=tiktok
sleep 1

# Szenario 4: Ads
echo -e "${BLUE}[4/6] Generiere Ads für Frankfurt...${NC}"
node generator.js --type=ads --city=Frankfurt --platform=google
node generator.js --type=ads --city=Frankfurt --platform=meta
sleep 1

# Szenario 5: Guide
echo -e "${BLUE}[5/6] Generiere Reise-Guide für Köln...${NC}"
node generator.js --type=guide --city=Köln
sleep 1

# Szenario 6: FAQ
echo -e "${BLUE}[6/6] Generiere FAQ-Block für Stuttgart...${NC}"
node generator.js --type=faq --city=Stuttgart
sleep 1

echo ""
echo -e "${GREEN}=== DEMO ABGESCHLOSSEN ===${NC}"
echo ""
echo -e "${PURPLE}Statistik:${NC}"
echo "  📝 Content-Pieces: 11"
echo "  ⏱️  Zeit: ~60 Sekunden"
echo "  💾 Total Wörter: ~5000"
echo "  📁 Location: ./generated-content/"
echo ""
echo -e "${BLUE}Öffne die generierten Files um die Qualität zu sehen!${NC}"
echo ""
echo -e "${PURPLE}💜 Jetzt Hotels vergleichen auf Book.ax${NC}"
echo ""

# Optional: Output öffnen
read -p "Output-Verzeichnis öffnen? (j/n): " open_choice
if [ "$open_choice" = "j" ] || [ "$open_choice" = "J" ]; then
  open ./generated-content
fi
