# 🎨 Book.ax Branding & Icons

## Übersicht

Alle Book.ax Logos und Icons sind konsistent gestaltet mit dem **violetten Koffer-Icon** und **Book.ax Schriftzug**.

---

## 📂 Web App Icons (`book-ax-web/public/`)

### Generierte Icon-Dateien

| Datei | Größe | Verwendung |
|-------|-------|------------|
| `favicon.svg` | Vektor | Haupt-Favicon (SVG, skalierbar) |
| `favicon.ico` | 32x32px | Fallback für ältere Browser |
| `apple-touch-icon.png` | 180x180px | iOS Home Screen Icon |
| `logo.svg` | Vektor | Header & Footer Logo (weiß) |
| `logo.png` | 512x512px | Structured Data, SEO |
| `og-image.jpg` | 1200x630px | Social Media Sharing (Facebook, LinkedIn, etc.) |

### Icons regenerieren

Nach Änderungen an `favicon.svg` oder `logo.svg`:

```bash
cd book-ax-web
npm run generate-icons
```

Das Script (`generate-icons.js`) erstellt automatisch alle PNG/ICO/JPG Varianten.

---

## 📱 Mobile App Icons (`assets/`)

| Datei | Größe | Verwendung |
|-------|-------|------------|
| `icon.svg` | 1024x1024 | Haupt-App-Icon (iOS & Android) |
| `adaptive-icon.svg` | 1024x1024 | Android Adaptive Icon (Foreground) |
| `splash.svg` | Vektor | Splash Screen |
| `favicon.svg` | 512x512 | PWA Favicon |

### Mobile Icons regenerieren

```bash
# Root-Verzeichnis
npm run generate-mobile-icons
# oder
python3 create-icons.py
```

---

## 🎨 Branding-Farben

### Primärfarben (Violet/Purple)

```css
--violet-500: #8b5cf6;  /* Haupt-Violett */
--violet-600: #7c3aed;  /* Dunkleres Violett */
--violet-700: #6d28d9;  /* Akzent */

/* Gradient */
background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
```

### Text-Farben

```css
--text-primary: #ffffff;   /* Logo-Text (weiß) */
--text-dark: #1f2937;      /* Body-Text (dunkelgrau) */
```

---

## 📐 Logo-Design

### Web Logo (`logo.svg`)

- **Koffer-Icon**: Links (40x40px)
- **Text**: "Book.ax" (26px, bold, weiß)
- **Breite**: ~200px
- **Verwendung**: Header, Footer, E-Mails

### App Icon (`icon.svg`)

- **Nur Text**: "Book.ax" (160px, extra bold)
- **Gradient**: Diagonal Purple
- **Format**: Quadratisch (1024x1024)

---

## 🔧 Icon-Technologie

### Web (Next.js)

- **Tool**: Sharp (Node.js Image Processing)
- **Format**: SVG → PNG/ICO/JPG Konvertierung
- **Script**: `book-ax-web/generate-icons.js`

### Mobile (React Native / Expo)

- **Tool**: Pillow (Python Image Library) oder Sharp
- **Format**: SVG → PNG Konvertierung
- **Script**: `create-icons.py` oder `create-placeholder-icons.sh`

---

## ✅ Checkliste: Icon-Updates

Wenn du das Logo änderst:

### Web App

1. ✅ `book-ax-web/public/favicon.svg` aktualisieren
2. ✅ `book-ax-web/public/logo.svg` aktualisieren
3. ✅ `npm run generate-icons` ausführen
4. ✅ Browser-Cache leeren (Cmd+Shift+R)
5. ✅ Vercel neu deployen

### Mobile App

1. ✅ `assets/icon.svg` aktualisieren
2. ✅ `assets/adaptive-icon.svg` aktualisieren
3. ✅ `assets/splash.svg` aktualisieren
4. ✅ `python3 create-icons.py` ausführen
5. ✅ `npx expo prebuild --clean` (iOS/Android)

---

## 📦 Deployment

### Vercel (Web)

Icons werden automatisch mit deployed. Keine Extra-Schritte nötig!

**WICHTIG**: Stelle sicher, dass alle generierten Icons committed sind:

```bash
git add book-ax-web/public/*.ico
git add book-ax-web/public/*.png
git add book-ax-web/public/*.jpg
git commit -m "chore: Update icons"
git push
```

### Expo (Mobile)

```bash
# Production Build mit neuen Icons
eas build --platform all
```

---

## 🐛 Troubleshooting

### "Favicon wird nicht angezeigt"

1. Browser-Cache leeren: `Cmd+Shift+R` (Mac) oder `Ctrl+Shift+R` (Windows)
2. Incognito-Modus testen
3. DevTools → Network → Disable Cache aktivieren

### "Icons sind verpixelt"

- SVG-Dateien bevorzugen (skalieren perfekt)
- PNG-Dateien in richtiger Auflösung generieren
- `npm run generate-icons` erneut ausführen

### "OG-Image wird nicht in Social Media angezeigt"

1. URL testen: https://www.opengraph.xyz
2. Facebook Debugger: https://developers.facebook.com/tools/debug/
3. Twitter Card Validator: https://cards-dev.twitter.com/validator

---

## 📚 Referenzen

- **Favicon Generator**: `book-ax-web/generate-icons.js`
- **Mobile Icon Generator**: `create-icons.py`
- **Branding Docs**: `docs/BRANDING.md`
- **Design System**: `docs/DESIGN_SYSTEM.md`

---

**Letzte Aktualisierung**: 14. November 2025  
**Version**: 1.0.0
