# 📁 Book.ax Content Automation - Datei-Übersicht

## 🎯 Core Files

### `generator.js`
**Hauptdatei** - CLI Content Generator
- Parst Command-Line Arguments
- Ruft Templates auf
- Speichert generierten Content
- Erstellt Markdown + JSON Schema
- **Usage**: `node generator.js --type=blog --city=Berlin`

### `templates.js`
**Template Engine** - Alle Content-Templates
- 9 Content-Typen (Blog, Landing, Social, Ads, etc.)
- AIO-optimierter Schreibstil
- Book.ax Branding integriert
- SEO-Meta automatisch
- Schema.org Markup

### `config.js`
**Konfiguration** - Alle Settings
- Brand-Einstellungen (Farbe, CTA, Benefits)
- SEO-Konfiguration (LSI, Keywords, Cluster)
- Content-Type Definitionen
- 75 Sprachen Support

### `i18n.js`
**Internationalisierung** - Multi-Language Support
- CTAs in 14+ Sprachen
- Keywords lokalisiert
- Übersetzungs-Funktionen
- Language Metadata

---

## 📦 Package Files

### `package.json`
NPM Package Definition
- Dependencies: marked, js-yaml
- Scripts: generate, blog, landing, social, ads, all
- Metadata

---

## 🚀 Shell Scripts

### `quick-start.sh`
**Interaktiver Wizard**
- Menü-basierte Auswahl
- Fragt nach Stadt
- Generiert Content
- Öffnet Output (optional)

### `batch-generate.sh`
**Batch Generator**
- Generiert für 10 deutsche Städte
- Beliebiger Content-Type
- Progress-Anzeige
- Zeit-Ersparnis: Stunden

### `demo.sh`
**Live Demo**
- Zeigt alle Capabilities
- Generiert 11 Content-Pieces
- ~60 Sekunden
- Automatische Präsentation

---

## 📚 Dokumentation

### `README.md`
**Hauptdokumentation** (Umfangreich!)
- Installation & Setup
- Alle Content-Typen erklärt
- Beispiele & Use-Cases
- Multi-Language Guide
- SEO-Details
- Performance-Tipps
- Erweiterungen
- Best Practices

### `SHOWCASE.md`
**Content-Beispiele** (Showcase aller Typen)
- 9 vollständige Beispiele
- Fertige Texte zum Copy-Paste
- Multi-Language Samples
- Performance-Metriken
- Einsatz-Szenarien
- Zeit-Ersparnis Statistiken

### `QUICKREF.md`
**Quick Reference**
- Wichtigste Befehle
- Content-Types Tabelle
- Sprachen-Liste
- NPM Scripts
- Tipps & Tricks

### `INTEGRATION.md`
**Web App Integration**
- Next.js Integration (3 Optionen)
- API Routes
- React Components
- Docker Container
- GitHub Actions Workflow
- Analytics & Tracking
- Best Practices

---

## 🗂️ Output

### `generated-content/`
**Generierte Content-Files**
- `.md` Files (Markdown Content)
- `.schema.json` Files (SEO Schema)
- Naming: `{type}-{city}-{date}.md`
- Beispiele bereits generiert:
  - `blog-Berlin-2025-11-14.md`
  - `landing-München-2025-11-14.md`
  - `social-München-2025-11-14.md`
  - `ads-München-2025-11-14.md`
  - ... (15+ Files pro Stadt bei --type=all)

---

## 🛠️ Utility Files

### `.gitignore`
- Ignoriert `node_modules/`
- Optional: Generated Content (konfigurierbar)
- OS & IDE Files

---

## 📊 Datei-Statistik

```
Total Files: 14
- JavaScript: 4 (generator.js, templates.js, config.js, i18n.js)
- Shell Scripts: 3 (quick-start.sh, batch-generate.sh, demo.sh)
- Documentation: 5 (README, SHOWCASE, QUICKREF, INTEGRATION, diese Datei)
- Config: 2 (package.json, .gitignore)
```

---

## 🔄 Workflow-Übersicht

```
1. USER INPUT
   └─> CLI Args (--type, --city, --language)
       │
2. GENERATOR.JS
   └─> Parst Args
   └─> Ruft Template auf
       │
3. TEMPLATES.JS
   └─> Wählt Template basierend auf Type
   └─> Füllt mit Daten (Stadt, Keywords, etc.)
   └─> Generiert SEO-Meta
   └─> Erstellt Schema.org Markup
       │
4. CONFIG.JS
   └─> Liefert Brand-Settings
   └─> Liefert SEO-Konfiguration
       │
5. I18N.JS (optional)
   └─> Übersetzt Content
   └─> Lokalisiert Keywords
       │
6. OUTPUT
   └─> Markdown File (.md)
   └─> JSON Schema (.schema.json)
   └─> Gespeichert in generated-content/
```

---

## 🎯 Wichtigste Funktionen

### In `generator.js`:
- `generateContent(type, data)` - Generiert Content
- `formatOutput(type, result, data)` - Formatiert Markdown
- `generateAll(city)` - Generiert alle Typen

### In `templates.js`:
- `templates.blog(data)` - Blog-Template
- `templates.landing(data)` - Landing-Template
- `templates.social(data)` - Social-Template
- `templates.ads(data)` - Ads-Template
- ... (9 Templates total)

### In `i18n.js`:
- `translateContent(content, targetLang)` - Übersetzt
- `getLocalizedSEO(city, language)` - SEO lokalisiert

---

## 💡 Wo starten?

### Als User:
1. **Start**: `./quick-start.sh` (Interaktiv)
2. **Demo**: `./demo.sh` (Zeigt alles)
3. **Doku**: `README.md` (Vollständig)
4. **Beispiele**: `SHOWCASE.md` (Alle Typen)

### Als Developer:
1. **Code**: `generator.js` (Entry Point)
2. **Templates**: `templates.js` (Anpassen)
3. **Config**: `config.js` (Branding)
4. **Integration**: `INTEGRATION.md` (Next.js)

### Als Content Manager:
1. **Quick Ref**: `QUICKREF.md` (Befehle)
2. **Batch**: `./batch-generate.sh` (Viele Städte)
3. **Output**: `generated-content/` (Ergebnisse)

---

## 🔧 Anpassungen

### Branding ändern:
→ `config.js` → `BRAND` Object

### Neue Sprache hinzufügen:
→ `i18n.js` → `CTAs` + `KeywordsByLanguage`

### Neues Template erstellen:
→ `templates.js` → `export const templates = { myNewType: ... }`

### SEO-Keywords anpassen:
→ `config.js` → `SEO.lsiKeywords` + `SEO.keywordClusters`

---

## 📈 Performance

| Aktion | Zeit | Output |
|--------|------|--------|
| Single Blog | 30s | 1 File (~1200 Wörter) |
| Single Landing | 30s | 1 File (~600 Wörter) |
| All Package | 2min | 15 Files (~4000 Wörter) |
| Batch 10 Cities | 5min | 150 Files (~40k Wörter) |

---

## 💜 Jetzt Hotels vergleichen auf Book.ax

**Schnell · Modern · Transparent**

https://book-ax.vercel.app
