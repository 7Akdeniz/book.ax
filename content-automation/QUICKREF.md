# Book.ax Content Automation - Quick Reference

## 🚀 Schnellstart (30 Sekunden)

```bash
cd content-automation
npm install
./quick-start.sh
```

## 📝 Häufigste Befehle

```bash
# Blog für Stadt
node generator.js --type=blog --city=Berlin

# Alles für Stadt
node generator.js --type=all --city=München

# Social Media
node generator.js --type=social --city=Hamburg --platform=instagram

# Batch für 10 Städte
./batch-generate.sh
```

## 🎯 Content-Typen

| Type | Beschreibung | Wörter |
|------|--------------|--------|
| `blog` | SEO-optimierter Blog-Artikel | 800-1500 |
| `landing` | Conversion Landing Page | 400-800 |
| `social` | Social Media Post | Varies |
| `ads` | Google/Meta Ads | Varies |
| `guide` | Reise-Guide | 600-1200 |
| `hotelDescription` | Hotel-Beschreibung | 150-300 |
| `microPost` | Mikro-Post | <150 |
| `faq` | FAQ Block mit Schema | Varies |
| `richSnippet` | Rich Snippet optimiert | <200 |
| `all` | ALLE Typen | ~4000 |

## 🌍 Sprachen

```bash
# Englisch
node generator.js --type=blog --city=London --language=en

# Spanisch
node generator.js --type=blog --city=Madrid --language=es
```

**Verfügbar**: 75 Sprachen (de, en, es, fr, it, pt, nl, ru, zh, ja, ko, ar, hi, tr, ...)

## 🎨 Branding

- **Farbe**: `#9C27B0`
- **CTA**: "Jetzt Hotels vergleichen auf Book.ax"
- **Stil**: AIO (klar, modern, kurz)
- **Emoji**: 💜

## 📁 Output

Alle Files in: `./generated-content/`

Format:
- `{type}-{city}-{date}.md` (Content)
- `{type}-{city}-{date}.schema.json` (SEO Schema)

## 🔧 NPM Scripts

```bash
npm run generate      # Interaktiv
npm run blog         # Blog generieren
npm run landing      # Landing Page
npm run social       # Social Media
npm run ads          # Ads-Texte
npm run all          # Alles
```

## 💡 Tipps

1. **Content-Strategie**: Nutze `--type=all` für komplett-Package
2. **Batch**: `./batch-generate.sh blog` für nur Blogs
3. **Multi-Language**: Kombiniere mit `--language=` Flag
4. **Custom Keywords**: `--keyword="Luxushotels"` für Fokus

## 📊 Performance

- **1 Blog**: 30 Sekunden
- **All Package**: 2 Minuten (15 Pieces)
- **10 Städte Batch**: 5 Minuten (150 Pieces)

## 🆘 Hilfe

```bash
node generator.js --help
```

## 📚 Volle Dokumentation

- `README.md` - Komplette Anleitung
- `SHOWCASE.md` - Alle Beispiele
- `config.js` - Konfiguration

## 💜 Jetzt Hotels vergleichen auf Book.ax

https://book-ax.vercel.app
