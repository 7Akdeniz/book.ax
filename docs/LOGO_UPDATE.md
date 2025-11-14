# 🎨 Book.ax Logo Update

**Datum**: 14. November 2025  
**Status**: ✅ Abgeschlossen

## 📦 Neues Design

Das Book.ax Logo wurde auf ein **Koffer-Design** (Suitcase) in **Lila/Violett** (#8b5cf6 - #7c3aed) umgestellt, passend zum Reise- und Buchungsthema.

### Design-Elemente

- **Icon**: Lila Koffer mit Henkel und Schloss
- **Farben**: 
  - Primär: `#8b5cf6` (Violet-500)
  - Sekundär: `#7c3aed` (Violet-600)
  - Hintergrund: `#f5f3ff` (Violet-50) / Hell-Lila
- **Typografie**: "Book.ax" in weißer, fetter Arial/Helvetica Schrift

---

## 📁 Aktualisierte Dateien

### Web App (`book-ax-web/`)
- ✅ `/public/logo.svg` - Header/Footer Logo (200x60px)
- ✅ `/public/favicon.svg` - Browser Favicon (512x512px)

### Mobile App (`assets/`)
- ✅ `icon.svg` - App Icon (1024x1024px)
- ✅ `adaptive-icon.svg` - Android Adaptive Icon (1024x1024px)
- ✅ `splash.svg` - Splash Screen (1284x2778px)

---

## 🎨 Logo-Varianten

### 1. **Header/Footer Logo** (`/public/logo.svg`)
- Größe: 200x60px
- Verwendung: Website Header, Footer
- Hintergrund: Transparent
- Koffer + "Book.ax" Text nebeneinander

### 2. **Favicon** (`/public/favicon.svg`)
- Größe: 512x512px
- Verwendung: Browser Tab Icon
- Hintergrund: Hell-Lila (#f5f3ff)
- Kompakter Koffer + Text unterhalb

### 3. **App Icon** (`assets/icon.svg`)
- Größe: 1024x1024px
- Verwendung: iOS/Android App Icon
- Hintergrund: Hell-Lila Gradient
- Großer Koffer + "Book.ax" Text

### 4. **Adaptive Icon** (`assets/adaptive-icon.svg`)
- Größe: 1024x1024px
- Verwendung: Android Adaptive Icon (mit Masken)
- Hintergrund: Voller Lila (#8b5cf6)
- Weißer Koffer + weißer Text

### 5. **Splash Screen** (`assets/splash.svg`)
- Größe: 1284x2778px (iPhone-Format)
- Verwendung: App Start-Bildschirm
- Hintergrund: Lila Gradient
- Großer Koffer + "Book.ax" + Tagline

---

## 🔧 Technische Details

### SVG-Vorteile
- ✅ Skalierbar ohne Qualitätsverlust
- ✅ Kleine Dateigröße
- ✅ Einfach zu bearbeiten
- ✅ Unterstützt Gradienten und Animationen

### Farbpalette (Tailwind CSS)
```css
/* Primärfarben */
--violet-50: #f5f3ff;   /* Hintergrund */
--violet-500: #8b5cf6;  /* Hauptfarbe */
--violet-600: #7c3aed;  /* Dunklere Variante */
--violet-700: #6d28d9;  /* Akzent */
```

### Verwendung im Code

**React/Next.js (Web)**
```jsx
<Image src="/logo.svg" alt="Book.ax" width={200} height={60} />
```

**HTML Meta-Tags**
```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
```

**React Native (Mobile)**
```json
// app.json
{
  "expo": {
    "icon": "./assets/icon.svg",
    "splash": {
      "image": "./assets/splash.svg"
    }
  }
}
```

---

## 📱 App Store Assets (TODO)

Für App Store / Play Store Submissions benötigt:

- [ ] App Icon PNG (1024x1024) - aus SVG generieren
- [ ] Splash Screen PNGs (verschiedene Auflösungen)
- [ ] Screenshots (iPhone/Android)
- [ ] Marketing Banner (1024x500)

**Generierung mit:**
```bash
# Beispiel: SVG zu PNG konvertieren (mit ImageMagick)
convert -density 300 -background none icon.svg -resize 1024x1024 icon.png
```

---

## 🌐 Browser-Kompatibilität

### SVG Favicon Support
- ✅ Chrome 80+ (2020)
- ✅ Firefox 41+ (2015)
- ✅ Safari 9+ (2015)
- ✅ Edge 79+ (2020)

**Fallback für ältere Browser:**
```html
<!-- Optional: PNG Fallback -->
<link rel="icon" href="/favicon-32x32.png" sizes="32x32">
<link rel="icon" href="/favicon-16x16.png" sizes="16x16">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

---

## 🎨 Design-Rationale

### Warum ein Koffer?
- **Reise-Assoziation**: Sofort erkennbar als Reise-/Buchungsapp
- **Universell**: Kulturübergreifend verständlich
- **Ikonisch**: Simpel, memorabel, skalierbar
- **Professionell**: Passt zum Business-Travel und Urlaub

### Warum Lila/Violett?
- **Differenzierung**: Hebt sich von blau-lastigen Konkurrenten ab (Booking.com, Expedia)
- **Vertrauen**: Lila vermittelt Kreativität + Professionalität
- **Modern**: Trend-Farbe in Tech/Apps
- **Accessibility**: Guter Kontrast mit Weiß/Hell

---

## 🚀 Deployment

### Web App (Vercel)
1. Git Push → Automatisches Deployment
2. Neue Logos werden automatisch deployed
3. Browser-Cache leeren für Favicon-Update

### Mobile App (Expo)
1. Assets werden beim Build automatisch kompiliert
2. Für App Store Update:
   ```bash
   npm run build:ios
   npm run build:android
   ```

---

## 📚 Weitere Schritte

1. **PNG-Versionen generieren** (für App Stores)
2. **Marketing-Assets** erstellen (Social Media, etc.)
3. **Brand Guidelines** dokumentieren
4. **Dark Mode Variante** (optional)

---

**Alte Logos gesichert als:**
- `favicon-old.svg`
- `icon-old.svg`
- `adaptive-icon-old.svg`
- `splash-old.svg`

Bei Bedarf können diese wiederhergestellt werden.
