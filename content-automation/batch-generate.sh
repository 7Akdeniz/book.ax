#!/bin/bash

###############################################################################
# Book.ax Content Automation - Batch Generator
# Generiert Content für mehrere Städte auf einmal
###############################################################################

# Farben für Output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║       Book.ax Content Automation - Batch Generator             ║"
echo "║       Generiere Content für mehrere Städte                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Top Deutsche Städte
CITIES=(
  "Berlin"
  "München"
  "Hamburg"
  "Frankfurt"
  "Köln"
  "Stuttgart"
  "Düsseldorf"
  "Dortmund"
  "Essen"
  "Leipzig"
)

# Content-Type auswählen (Standard: all)
TYPE=${1:-all}

echo -e "${BLUE}Content-Type: ${TYPE}${NC}"
echo -e "${BLUE}Anzahl Städte: ${#CITIES[@]}${NC}"
echo ""

# Counter
total=${#CITIES[@]}
current=0

# Durch alle Städte iterieren
for city in "${CITIES[@]}"; do
  ((current++))
  
  echo -e "${GREEN}[$current/$total] Generiere Content für $city...${NC}"
  
  # Content generieren
  node generator.js --type="$TYPE" --city="$city"
  
  echo ""
done

echo -e "${PURPLE}"
echo "✨ Batch-Generierung abgeschlossen!"
echo ""
echo "📁 Output: ./generated-content/"
echo ""
echo "💜 Jetzt Hotels vergleichen auf Book.ax"
echo -e "${NC}"
