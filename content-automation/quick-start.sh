#!/bin/bash

###############################################################################
# Book.ax Content Automation - Quick Start
# Schneller Einstieg in die Content-Generierung
###############################################################################

# Farben
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

clear

echo -e "${PURPLE}"
cat << "EOF"
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     ██████╗  ██████╗  ██████╗ ██╗  ██╗     █████╗ ██╗  ██╗   ║
║     ██╔══██╗██╔═══██╗██╔═══██╗██║ ██╔╝    ██╔══██╗╚██╗██╔╝   ║
║     ██████╔╝██║   ██║██║   ██║█████╔╝     ███████║ ╚███╔╝    ║
║     ██╔══██╗██║   ██║██║   ██║██╔═██╗     ██╔══██║ ██╔██╗    ║
║     ██████╔╝╚██████╔╝╚██████╔╝██║  ██╗    ██║  ██║██╔╝ ██╗   ║
║     ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝  ╚═╝   ║
║                                                                ║
║              Content Automation - Quick Start                 ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${BLUE}Willkommen zur Book.ax Content Automation!${NC}"
echo ""
echo "Was möchtest du generieren?"
echo ""
echo -e "${GREEN}1)${NC} Blog-Artikel"
echo -e "${GREEN}2)${NC} Landing Page"
echo -e "${GREEN}3)${NC} Social Media Posts"
echo -e "${GREEN}4)${NC} Ads-Texte (Google/Meta)"
echo -e "${GREEN}5)${NC} Reise-Guide"
echo -e "${GREEN}6)${NC} Hotel-Beschreibung"
echo -e "${GREEN}7)${NC} FAQ-Block"
echo -e "${GREEN}8)${NC} Mikro-Post"
echo -e "${GREEN}9)${NC} Rich Snippet"
echo -e "${PURPLE}A)${NC} ALLES (15 Content-Pieces)"
echo -e "${YELLOW}B)${NC} Batch: Mehrere Städte"
echo ""

read -p "Wähle eine Option (1-9, A, B): " choice

# Stadt abfragen (außer bei Batch)
if [ "$choice" != "B" ] && [ "$choice" != "b" ]; then
  echo ""
  read -p "Für welche Stadt? (z.B. Berlin): " city
  
  if [ -z "$city" ]; then
    city="Berlin"
    echo -e "${YELLOW}Keine Stadt angegeben, verwende: ${city}${NC}"
  fi
fi

echo ""
echo -e "${BLUE}Generiere Content...${NC}"
echo ""

# Generierung basierend auf Wahl
case $choice in
  1)
    node generator.js --type=blog --city="$city"
    ;;
  2)
    node generator.js --type=landing --city="$city"
    ;;
  3)
    echo "Welche Platform?"
    echo "1) Instagram"
    echo "2) TikTok"
    echo "3) Twitter"
    echo "4) Facebook"
    echo "5) Alle"
    read -p "Wähle Platform (1-5): " platform_choice
    
    case $platform_choice in
      1) node generator.js --type=social --city="$city" --platform=instagram ;;
      2) node generator.js --type=social --city="$city" --platform=tiktok ;;
      3) node generator.js --type=social --city="$city" --platform=twitter ;;
      4) node generator.js --type=social --city="$city" --platform=facebook ;;
      5)
        node generator.js --type=social --city="$city" --platform=instagram
        node generator.js --type=social --city="$city" --platform=tiktok
        node generator.js --type=social --city="$city" --platform=twitter
        node generator.js --type=social --city="$city" --platform=facebook
        ;;
      *) echo "Ungültige Wahl" ;;
    esac
    ;;
  4)
    echo "Welche Platform?"
    echo "1) Google Ads"
    echo "2) Meta Ads"
    echo "3) Beide"
    read -p "Wähle Platform (1-3): " ads_choice
    
    case $ads_choice in
      1) node generator.js --type=ads --city="$city" --platform=google ;;
      2) node generator.js --type=ads --city="$city" --platform=meta ;;
      3)
        node generator.js --type=ads --city="$city" --platform=google
        node generator.js --type=ads --city="$city" --platform=meta
        ;;
      *) echo "Ungültige Wahl" ;;
    esac
    ;;
  5)
    node generator.js --type=guide --city="$city"
    ;;
  6)
    node generator.js --type=hotelDescription --city="$city"
    ;;
  7)
    node generator.js --type=faq --city="$city"
    ;;
  8)
    node generator.js --type=microPost --city="$city"
    ;;
  9)
    node generator.js --type=richSnippet --city="$city"
    ;;
  A|a)
    node generator.js --type=all --city="$city"
    ;;
  B|b)
    ./batch-generate.sh
    ;;
  *)
    echo -e "${YELLOW}Ungültige Wahl. Bitte 1-9, A oder B wählen.${NC}"
    exit 1
    ;;
esac

echo ""
echo -e "${GREEN}✅ Fertig!${NC}"
echo ""
echo -e "${BLUE}📁 Deine generierten Files findest du in:${NC}"
echo "   ./generated-content/"
echo ""
echo -e "${PURPLE}💜 Jetzt Hotels vergleichen auf Book.ax${NC}"
echo ""

# Optional: Output-Verzeichnis öffnen
read -p "Möchtest du das Output-Verzeichnis öffnen? (j/n): " open_choice
if [ "$open_choice" = "j" ] || [ "$open_choice" = "J" ]; then
  open ./generated-content
fi
