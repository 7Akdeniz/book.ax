#!/usr/bin/env python3
"""
Erstellt einfache Platzhalter-Icons für Book.ax
Benötigt: pip3 install pillow
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Farben
PRIMARY = (156, 39, 176)  # #9C27B0
WHITE = (255, 255, 255)

# Assets-Ordner
ASSETS_DIR = "assets"

def create_icon(size, filename, text, font_size):
    """Erstellt ein Icon mit Text"""
    # Erstelle Bild mit Primary-Farbe
    img = Image.new('RGB', size, PRIMARY)
    draw = ImageDraw.Draw(img)
    
    # Text zentriert
    try:
        # Versuche System-Font zu nutzen
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    except:
        # Fallback auf default font
        font = ImageFont.load_default()
    
    # Text-Position berechnen (zentriert)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    position = ((size[0] - text_width) // 2, (size[1] - text_height) // 2)
    
    # Text zeichnen
    draw.text(position, text, fill=WHITE, font=font)
    
    # Speichern
    filepath = os.path.join(ASSETS_DIR, filename)
    img.save(filepath)
    print(f"✅ {filename} erstellt ({size[0]}x{size[1]})")

def main():
    print("🎨 Erstelle Platzhalter-Icons für Book.ax...")
    print()
    
    # Prüfe ob assets Ordner existiert
    if not os.path.exists(ASSETS_DIR):
        os.makedirs(ASSETS_DIR)
    
    # Erstelle Icons
    create_icon((1024, 1024), "icon.png", "B.ax", 300)
    create_icon((1284, 2778), "splash.png", "Book.ax", 200)
    create_icon((1024, 1024), "adaptive-icon.png", "B", 400)
    create_icon((48, 48), "favicon.png", "B", 30)
    
    print()
    print("🎉 Alle Platzhalter-Icons erfolgreich erstellt!")
    print("📁 Ort: ./assets/")
    print()
    print("💡 Tipp: Ersetzen Sie diese später mit professionellen Icons")

if __name__ == "__main__":
    main()
