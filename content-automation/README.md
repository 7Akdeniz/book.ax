# Book.ax Content Automation

> **Vollautomatische Content-Erstellung für SEO, Social Media, Ads, Blog & Landing Pages**

AIO-optimiert · SEO-ready · Multi-Language · Book.ax Branding

---

## 🎯 Was ist das?

Ein vollständiges Content-Automatisierungssystem für **Book.ax**, die globale Hotelsuchmaschine.

Generiert automatisch:
- ✅ **Blog-Artikel** (800-1500 Wörter, SEO-optimiert)
- ✅ **Landing Pages** (400-800 Wörter, Conversion-fokussiert)
- ✅ **Social Media Posts** (Instagram, TikTok, Twitter, Facebook)
- ✅ **Ads-Texte** (Google Ads, Meta Ads)
- ✅ **Reise-Guides** (600-1200 Wörter)
- ✅ **Hotel-Beschreibungen** (150-300 Wörter)
- ✅ **Mikro-Posts** (<150 Zeichen)
- ✅ **FAQ-Blöcke** (mit Schema.org)
- ✅ **Rich Snippets** (Google-optimiert)

---

## 🚀 Quick Start

### Installation

```bash
cd content-automation
npm install
```

### Einfache Verwendung

```bash
# Blog-Artikel für Berlin generieren
npm run blog -- --city=Berlin

# Landing Page für München
npm run landing -- --city=München

# Alle Content-Typen für Hamburg
npm run all -- --city=Hamburg
```

### Manuelle Generierung

```bash
# Spezifischer Content-Type
node generator.js --type=blog --city=Wien

# Mit zusätzlichen Optionen
node generator.js --type=guide --city=Zürich --keyword="Luxushotels"

# Social Media für bestimmte Platform
node generator.js --type=social --city=Barcelona --platform=instagram

# Google Ads
node generator.js --type=ads --city=Paris --platform=google
```

---

## 📋 Content-Typen im Detail

### 1. Blog-Artikel (`--type=blog`)
- **Länge**: 800-1500 Wörter
- **Struktur**: Intro, Benefits, How-To, Tipps, CTA, FAQ
- **SEO**: Title, Meta, H1, LSI-Keywords, Schema.org
- **Ausgabe**: Markdown + JSON Schema

**Beispiel**:
```bash
node generator.js --type=blog --city=Berlin --keyword="Hotels"
```

### 2. Landing Page (`--type=landing`)
- **Länge**: 400-800 Wörter
- **Struktur**: Hero, Highlights, Vergleichstabelle, Testimonials, FAQ
- **SEO**: Conversion-optimiert, Rich Snippets
- **Ausgabe**: Markdown + FAQ Schema

**Beispiel**:
```bash
node generator.js --type=landing --city=München
```

### 3. Social Media (`--type=social`)
- **Platforms**: Instagram, TikTok, Twitter, Facebook
- **Länge**: Platform-spezifisch (max 280 Zeichen)
- **Stil**: AIO-optimiert, Hashtags, Emojis
- **Ausgabe**: Fertiger Post-Text

**Beispiel**:
```bash
node generator.js --type=social --city=Hamburg --platform=instagram
```

### 4. Ads-Texte (`--type=ads`)
- **Platforms**: Google Ads, Meta Ads
- **Format**: 3 Headlines + 2 Descriptions (Google), Headline + Primary + CTA (Meta)
- **Stil**: Conversion-fokussiert, klare Benefits
- **Ausgabe**: Strukturierte Ad-Texte

**Beispiel**:
```bash
node generator.js --type=ads --city=Frankfurt --platform=google
```

### 5. Reise-Guide (`--type=guide`)
- **Länge**: 600-1200 Wörter
- **Struktur**: Intro, Top-Aktivitäten, Hotel-Tipps, Insider-Tipps
- **SEO**: Keywords, LSI, Schema.org TravelGuide
- **Ausgabe**: Markdown + Schema

**Beispiel**:
```bash
node generator.js --type=guide --city=Barcelona
```

### 6. Hotel-Beschreibung (`--type=hotelDescription`)
- **Länge**: 150-300 Wörter
- **Struktur**: Ambiente, Features, Preis, CTA
- **Stil**: Emotional, verkaufsorientiert
- **Ausgabe**: Markdown mit Brandfarbe

**Beispiel**:
```bash
node generator.js --type=hotelDescription --city=Zürich
```

### 7. Mikro-Post (`--type=microPost`)
- **Länge**: <150 Zeichen
- **Typen**: Deal, Tip, Announcement
- **Stil**: Kurz, knackig, CTA
- **Ausgabe**: Fertiger Mikro-Text

**Beispiel**:
```bash
node generator.js --type=microPost --city=Wien
```

### 8. FAQ-Block (`--type=faq`)
- **Fragen**: 5 häufigste Fragen
- **Schema**: FAQPage (Google Rich Results)
- **Stil**: Klar, informativ, mit CTA
- **Ausgabe**: Markdown + JSON-LD Schema

**Beispiel**:
```bash
node generator.js --type=faq --city=Amsterdam
```

### 9. Rich Snippet (`--type=richSnippet`)
- **Länge**: <200 Wörter
- **Format**: Featured Snippet optimiert
- **Schema**: Article mit Publisher
- **Ausgabe**: Google-optimierter Text + Schema

**Beispiel**:
```bash
node generator.js --type=richSnippet --city=Rom
```

---

## 🎨 Book.ax Branding

Alle generierten Inhalte folgen dem **Book.ax Branding**:

### Markenfarbe
- **Primär**: `#9C27B0` (Lila/Purple)
- Verwendung: Buttons, Borders, Highlights

### Tone of Voice
- **Stil**: AIO (Answer Intent Optimization)
- **Eigenschaften**:
  - Klar, modern, einfach
  - Kurze Sätze
  - Menschlicher Ton
  - Sofort verständlich

### Call-to-Action
- **Standard**: "Jetzt Hotels vergleichen auf Book.ax"
- **Immer**: Am Ende jedes Contents
- **Varianten**: Je nach Format angepasst

### Key Messages
1. **Hotelsuchmaschine** (Hauptprodukt)
2. **Hotelpreise weltweit vergleichen** (Hauptfunktion)
3. **Bestpreis-Fokus** (USP)
4. **Schnell, modern, transparent** (Werte)
5. **Über 500.000 Hotels weltweit** (Trust)

---

## 🌍 Multi-Language Support

### Unterstützte Sprachen

**Top 9**:
- Deutsch (de)
- English (en)
- 中文 (zh)
- हिन्दी (hi)
- Español (es)
- العربية (ar)
- Français (fr)
- Türkçe (tr)
- Русский (ru)

**Weitere 66 Sprachen** verfügbar (insgesamt 75, wie in Book.ax Web App).

### Verwendung

```bash
# Content auf Englisch
node generator.js --type=blog --city=London --language=en

# Content auf Spanisch
node generator.js --type=landing --city=Madrid --language=es

# Content auf Französisch
node generator.js --type=social --city=Paris --language=fr
```

### Automatische Lokalisierung
- CTA wird automatisch übersetzt
- Keywords werden lokalisiert
- SEO-Meta in Zielsprache

---

## 🔍 SEO-Automatisierung

### Automatisch generiert:

#### 1. Title Tag
```
Format: {{keyword}} – {{benefit}} | Book.ax
Beispiel: Hotels in Berlin finden – Hotelsuchmaschine Book.ax | Jetzt Hotels vergleichen
```

#### 2. Meta Description
```
Format: Book.ax vergleicht {{keyword}} in Sekunden. {{benefit}}. Jetzt Hotels vergleichen auf Book.ax.
Länge: 150-160 Zeichen
```

#### 3. H1 Headline
```
Format: {{keyword}} – moderne Hotelsuchmaschine
Beispiel: Hotels in München vergleichen – moderne Hotelsuchmaschine
```

#### 4. LSI-Keywords (automatisch eingebaut)
- hotel deals vergleichen
- bestpreis garantie
- weltweit hotelpreise in echtzeit
- transparente preise ohne versteckte kosten
- hotelvergleich schnell & einfach
- hotelsuchmaschine modern
- günstige hotels finden
- hotel preisvergleich online

#### 5. Keyword-Cluster
- **Main**: hotelpreise vergleichen, hotel vergleich, hotelsuchmaschine
- **Longtail**: luxus hotels {city} mit bestpreis, günstige hotels {city} vergleichen
- **Questions**: Wie finde ich den besten Hotelpreis?, Wo kann ich Hotelpreise vergleichen?

#### 6. Schema.org Markup
- BlogPosting (Blog)
- FAQPage (FAQ)
- Article (Rich Snippet)
- TravelGuide (Reise-Guide)

Alle Schemas automatisch als `.schema.json` exportiert.

---

## 📁 Output-Struktur

Generierte Files werden in `generated-content/` gespeichert:

```
generated-content/
├── blog-Berlin-2025-11-14.md
├── blog-Berlin-2025-11-14.schema.json
├── landing-München-2025-11-14.md
├── landing-München-2025-11-14.schema.json
├── social-Hamburg-2025-11-14.md
├── ads-Frankfurt-2025-11-14.md
└── ...
```

### Datei-Format (Markdown)

```markdown
---
title: Hotels in Berlin finden – Hotelsuchmaschine Book.ax
type: blog
generated: 2025-11-14T10:30:00.000Z
city: Berlin
brand: Book.ax
color: #9C27B0
---

## SEO Meta

**Title:** Hotels in Berlin finden – Hotelsuchmaschine Book.ax | Jetzt Hotels vergleichen

**Meta Description:** Book.ax vergleicht Hotels in Berlin weltweit in Sekunden...

**H1:** Hotels in Berlin vergleichen – moderne Hotelsuchmaschine

**Keywords:** hotel deals vergleichen, bestpreis garantie, ...

---

# Hotels in Berlin vergleichen – moderne Hotelsuchmaschine

Kurze Reise? Lange Suche? Book.ax macht Hotelsuchen klar, modern und transparent.

...

---

*Generiert von Book.ax Content Automation*
*AIO-optimiert · SEO-ready · Multi-Language-fähig*
*Brandfarbe: #9C27B0*
```

---

## 🛠️ Erweiterte Verwendung

### Alle Content-Typen auf einmal

```bash
node generator.js --type=all --city=Hamburg
```

Generiert:
- 1x Blog
- 1x Landing Page
- 1x Reise-Guide
- 1x Hotel-Beschreibung
- 1x FAQ
- 1x Rich Snippet
- 4x Social Media (Instagram, TikTok, Twitter, Facebook)
- 2x Ads (Google, Meta)
- 3x Mikro-Posts (Deal, Tip, Announcement)

**Insgesamt: 15 fertige Content-Pieces!**

### Batch-Generierung für mehrere Städte

```bash
#!/bin/bash
# generate-cities.sh

CITIES=("Berlin" "München" "Hamburg" "Frankfurt" "Köln")

for city in "${CITIES[@]}"; do
  echo "Generiere Content für $city..."
  node generator.js --type=all --city="$city"
done

echo "✅ Fertig! Alle Städte generiert."
```

Ausführen:
```bash
chmod +x generate-cities.sh
./generate-cities.sh
```

---

## 📊 Content-Qualität

### AIO-Optimierung
- **Klar**: Einfache Sprache, keine Fachbegriffe
- **Modern**: Aktueller Schreibstil, Emojis wo sinnvoll
- **Kurz**: Kurze Sätze, max 15-20 Wörter
- **Menschlich**: Natürlicher Ton, keine Marketing-Floskeln

### SEO-Score
- **Title**: 50-60 Zeichen ✓
- **Meta**: 150-160 Zeichen ✓
- **H1**: Keyword + Branding ✓
- **LSI**: 10+ Keywords ✓
- **Schema**: JSON-LD inklusive ✓

### Conversion-Optimierung
- **CTA**: Mindestens 2x pro Content ✓
- **Trust**: Benefits, Garantien, Zahlen ✓
- **Emotion**: Storytelling, Vorteile ✓
- **Action**: Klare Handlungsaufforderung ✓

---

## 🔧 Anpassungen & Erweiterungen

### Eigene Templates hinzufügen

Bearbeite `templates.js`:

```javascript
export const templates = {
  // ... bestehende Templates
  
  myCustomType: (data) => {
    const { city = 'Berlin' } = data;
    
    return {
      seo: {
        title: `My Custom Title for ${city}`,
        meta: `Custom meta description...`,
        h1: `Custom H1 for ${city}`
      },
      content: `
# My Custom Content

...
`
    };
  }
};
```

### Neue Sprachen hinzufügen

Bearbeite `i18n.js`:

```javascript
export const CTAs = {
  // ... bestehende Sprachen
  
  pl: 'Porównaj hotele teraz na Book.ax',
  cs: 'Porovnejte hotely nyní na Book.ax'
};
```

### Config anpassen

Bearbeite `config.js`:

```javascript
export const BRAND = {
  name: 'Book.ax',
  color: '#9C27B0',  // Ändern für andere Brandfarbe
  cta: 'Jetzt Hotels vergleichen auf Book.ax',
  // ...
};
```

---

## 💡 Tipps & Best Practices

### 1. Content-Strategie
- **Fokus**: 1 Keyword-Cluster pro Stadt
- **Frequenz**: 1-2 Blogs pro Woche
- **Distribution**: Social + Blog + Landing Page kombinieren

### 2. SEO-Optimierung
- **Interne Links**: Verlinke zwischen generierten Inhalten
- **Images**: Füge Bilder mit Alt-Text hinzu
- **Schema**: Nutze generierte JSON-LD Schemas

### 3. Social Media
- **Timing**: Beste Zeiten für Posting beachten
- **Hashtags**: 5-10 relevante Hashtags pro Post
- **Engagement**: CTA für Interaktion

### 4. Ads
- **A/B Testing**: Teste verschiedene Headlines
- **Budget**: Starte klein, skaliere Winners
- **Tracking**: Nutze UTM-Parameter

---

## 📈 Analytics & Tracking

### UTM-Parameter generieren

Füge zu URLs hinzu:
```
?utm_source=content-automation
&utm_medium=blog
&utm_campaign=berlin-hotels
&utm_content=article-2025-11
```

### Content-Performance messen

Tracke:
- **Seitenaufrufe** (Google Analytics)
- **Verweildauer** (Zeit auf Seite)
- **Bounce Rate** (<50% ist gut)
- **Conversions** (CTA-Klicks)

---

## 🤝 Integration in Book.ax

### Next.js Integration

```javascript
// book-ax-web/lib/content.js
import { execSync } from 'child_process';

export function generateContent(type, city) {
  const output = execSync(
    `node ../content-automation/generator.js --type=${type} --city=${city}`,
    { encoding: 'utf-8' }
  );
  
  return output;
}
```

### API-Route

```javascript
// book-ax-web/app/api/generate-content/route.ts
import { generateContent } from '@/lib/content';

export async function POST(req: Request) {
  const { type, city } = await req.json();
  
  const content = generateContent(type, city);
  
  return Response.json({ content });
}
```

---

## 📝 Changelog

### v1.0.0 (14.11.2025)
- ✅ Initiales Release
- ✅ 9 Content-Typen
- ✅ Multi-Language (75 Sprachen)
- ✅ SEO-Automatisierung
- ✅ Schema.org Support
- ✅ Book.ax Branding
- ✅ CLI-Interface

---

## 📄 Lizenz

MIT License - Book.ax Team

---

## 💜 Jetzt Hotels vergleichen auf Book.ax

**Schnell · Modern · Transparent**

https://book-ax.vercel.app

---

*Powered by Book.ax Content Automation*
*AIO-optimiert · SEO-ready · Multi-Language*
