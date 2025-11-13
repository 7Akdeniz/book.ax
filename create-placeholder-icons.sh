#!/bin/bash

# Erstellt Platzhalter-Icons für Book.ax
# Verwendet ImageMagick (installieren mit: brew install imagemagick)

echo "🎨 Erstelle Platzhalter-Icons für Book.ax..."

# Farben
PRIMARY="#9C27B0"
TEXT="#FFFFFF"

# Prüfe ob ImageMagick installiert ist
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick nicht gefunden!"
    echo "Installieren Sie es mit: brew install imagemagick"
    exit 1
fi

# Icon (1024x1024)
echo "📱 Erstelle icon.png..."
convert -size 1024x1024 xc:"$PRIMARY" \
    -gravity center \
    -pointsize 400 \
    -fill "$TEXT" \
    -annotate +0+0 "B.ax" \
    assets/icon.png

# Splash (1284x2778)
echo "💦 Erstelle splash.png..."
convert -size 1284x2778 xc:"$PRIMARY" \
    -gravity center \
    -pointsize 200 \
    -fill "$TEXT" \
    -annotate +0+0 "Book.ax" \
    assets/splash.png

# Adaptive Icon (1024x1024)
echo "🤖 Erstelle adaptive-icon.png..."
convert -size 1024x1024 xc:"$PRIMARY" \
    -gravity center \
    -pointsize 300 \
    -fill "$TEXT" \
    -annotate +0+0 "B" \
    assets/adaptive-icon.png

# Favicon (48x48)
echo "🌐 Erstelle favicon.png..."
convert -size 48x48 xc:"$PRIMARY" \
    -gravity center \
    -pointsize 30 \
    -fill "$TEXT" \
    -annotate +0+0 "B" \
    assets/favicon.png

echo "✅ Alle Platzhalter-Icons erstellt!"
echo ""
echo "📁 Erstellte Dateien:"
ls -lh assets/*.png
echo ""
echo "💡 Tipp: Ersetzen Sie diese später mit professionellen Icons"
