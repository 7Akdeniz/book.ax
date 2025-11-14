#!/usr/bin/env node

/**
 * Book.ax Content Generator
 * Automatische Content-Erstellung für SEO, Social, Ads, Blog, Landing Pages
 * 
 * Usage:
 *   node generator.js --type=blog --city=Berlin
 *   node generator.js --type=all --city=München
 *   npm run generate -- --type=landing --city=Hamburg
 */

import templates from './templates.js';
import { BRAND, SEO, CONTENT_TYPES, LANGUAGES } from './config.js';
import fs from 'fs';
import path from 'path';

// CLI Arguments parsen
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.replace(/^--/, '').split('=');
  acc[key] = value || true;
  return acc;
}, {});

const OUTPUT_DIR = './generated-content';

// Output-Verzeichnis erstellen
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Generiert Content basierend auf Type und Daten
 */
function generateContent(type, data = {}) {
  const timestamp = new Date().toISOString().split('T')[0];
  
  console.log(`\n🎨 Generiere ${CONTENT_TYPES[type]?.name || type}...`);
  
  let result;
  
  switch(type) {
    case 'blog':
      result = templates.blog(data);
      break;
    case 'landing':
      result = templates.landing(data);
      break;
    case 'social':
      result = templates.social(data);
      break;
    case 'ads':
      result = templates.ads(data);
      break;
    case 'guide':
      result = templates.guide(data);
      break;
    case 'hotelDescription':
      result = templates.hotelDescription(data);
      break;
    case 'microPost':
      result = templates.microPost(data);
      break;
    case 'faq':
      result = templates.faq(data);
      break;
    case 'richSnippet':
      result = templates.richSnippet(data);
      break;
    default:
      console.error(`❌ Unbekannter Content-Type: ${type}`);
      return null;
  }
  
  // Datei speichern
  const filename = `${type}-${data.city || 'default'}-${timestamp}.md`;
  const filepath = path.join(OUTPUT_DIR, filename);
  
  const output = formatOutput(type, result, data);
  fs.writeFileSync(filepath, output, 'utf-8');
  
  console.log(`✅ Gespeichert: ${filepath}`);
  
  // JSON Schema separat speichern (falls vorhanden)
  if (result.schema) {
    const schemaFile = filepath.replace('.md', '.schema.json');
    fs.writeFileSync(schemaFile, JSON.stringify(result.schema, null, 2), 'utf-8');
    console.log(`📋 Schema: ${schemaFile}`);
  }
  
  return result;
}

/**
 * Formatiert Output für Markdown-Datei
 */
function formatOutput(type, result, data) {
  let output = '';
  
  // Header
  output += `---\n`;
  output += `title: ${result.seo?.title || `Book.ax ${type}`}\n`;
  output += `type: ${type}\n`;
  output += `generated: ${new Date().toISOString()}\n`;
  output += `city: ${data.city || 'N/A'}\n`;
  output += `brand: Book.ax\n`;
  output += `color: ${BRAND.color}\n`;
  output += `---\n\n`;
  
  // SEO Meta (falls vorhanden)
  if (result.seo) {
    output += `## SEO Meta\n\n`;
    output += `**Title:** ${result.seo.title}\n\n`;
    output += `**Meta Description:** ${result.seo.meta}\n\n`;
    output += `**H1:** ${result.seo.h1}\n\n`;
    
    if (result.seo.keywords) {
      output += `**Keywords:** ${result.seo.keywords.join(', ')}\n\n`;
    }
    
    output += `---\n\n`;
  }
  
  // Content
  if (result.content) {
    output += result.content;
  } else if (result.markdown) {
    output += result.markdown;
  } else if (type === 'ads') {
    // Ads formatieren
    output += `## Google Ads\n\n`;
    if (result.headlines) {
      output += `**Headlines:**\n`;
      result.headlines.forEach((h, i) => output += `${i + 1}. ${h}\n`);
      output += `\n`;
    }
    if (result.descriptions) {
      output += `**Descriptions:**\n`;
      result.descriptions.forEach((d, i) => output += `${i + 1}. ${d}\n`);
      output += `\n`;
    }
    if (result.headline) {
      output += `## Meta Ads\n\n`;
      output += `**Headline:** ${result.headline}\n\n`;
      output += `**Primary:** ${result.primary}\n\n`;
      output += `**Description:** ${result.description}\n\n`;
      output += `**CTA:** ${result.cta}\n\n`;
    }
  } else if (type === 'social') {
    output += `## ${result.platform.toUpperCase()} Post\n\n`;
    output += result.content;
    output += `\n\n**Hashtags:** ${result.hashtags.map(h => `#${h}`).join(' ')}\n`;
  }
  
  // Footer
  output += `\n\n---\n\n`;
  output += `*Generiert von Book.ax Content Automation*\n`;
  output += `*AIO-optimiert · SEO-ready · Multi-Language-fähig*\n`;
  output += `*Brandfarbe: ${BRAND.color}*\n`;
  
  return output;
}

/**
 * Generiert alle Content-Typen für eine Stadt
 */
function generateAll(city = 'Berlin') {
  console.log(`\n🚀 Generiere ALLE Content-Typen für ${city}...\n`);
  
  const types = [
    'blog',
    'landing',
    'guide',
    'hotelDescription',
    'faq',
    'richSnippet'
  ];
  
  const socialPlatforms = ['instagram', 'tiktok', 'twitter', 'facebook'];
  const adsPlatforms = ['google', 'meta'];
  const microTypes = ['deal', 'tip', 'announcement'];
  
  // Standard Content
  types.forEach(type => {
    generateContent(type, { city });
  });
  
  // Social Media
  socialPlatforms.forEach(platform => {
    generateContent('social', { city, platform });
  });
  
  // Ads
  adsPlatforms.forEach(platform => {
    generateContent('ads', { city, platform });
  });
  
  // Mikro-Posts
  microTypes.forEach(type => {
    generateContent('microPost', { city, type });
  });
  
  console.log(`\n✨ Alle Content-Typen für ${city} generiert!\n`);
  console.log(`📁 Output: ${OUTPUT_DIR}/\n`);
}

/**
 * Zeigt Hilfe an
 */
function showHelp() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║          Book.ax Content Automation - AIO Generator            ║
╚════════════════════════════════════════════════════════════════╝

📝 VERWENDUNG:

  node generator.js --type=<type> --city=<city> [options]

🎯 CONTENT-TYPEN:

  blog              Blog Artikel (800-1500 Wörter)
  landing           Landing Page (400-800 Wörter)
  social            Social Media Post (Instagram, TikTok, etc.)
  ads               Ads Text (Google, Meta)
  guide             Reise-Guide (600-1200 Wörter)
  hotelDescription  Hotel Beschreibung (150-300 Wörter)
  microPost         Mikro-Post (<150 Zeichen)
  faq               FAQ Block mit Schema
  richSnippet       Rich Snippet optimiert
  all               ALLE Typen generieren

📦 BEISPIELE:

  # Blog für Berlin
  node generator.js --type=blog --city=Berlin

  # Landing Page für München
  node generator.js --type=landing --city=München

  # Alle Content-Typen für Hamburg
  node generator.js --type=all --city=Hamburg

  # Social Media für Wien
  node generator.js --type=social --city=Wien --platform=instagram

  # Google Ads für Zürich
  node generator.js --type=ads --city=Zürich --platform=google

🎨 OPTIONEN:

  --city=<stadt>      Zielstadt (Standard: Berlin)
  --platform=<name>   Platform für Social/Ads
  --language=<code>   Sprache (Standard: de)
  --keyword=<text>    Haupt-Keyword
  --country=<land>    Land (Standard: Deutschland)

✨ FEATURES:

  ✓ AIO-optimierter Schreibstil
  ✓ Book.ax Branding (#9C27B0)
  ✓ SEO-Automatisierung (Title, Meta, H1, LSI)
  ✓ Schema.org Markup
  ✓ 75 Sprachen Support
  ✓ Sofort verwendbarer Content

📁 OUTPUT: ${OUTPUT_DIR}/

💜 ${BRAND.cta}
`);
}

// Main Execution
console.log(`
╔════════════════════════════════════════════════════════════════╗
║          Book.ax Content Automation v1.0                       ║
║          AIO-optimiert · SEO-ready · Multi-Language            ║
╚════════════════════════════════════════════════════════════════╝
`);

if (args.help || args.h) {
  showHelp();
  process.exit(0);
}

const type = args.type || 'blog';
const city = args.city || 'Berlin';
const platform = args.platform;
const keyword = args.keyword;
const country = args.country || 'Deutschland';
const language = args.language || 'de';

const data = {
  city,
  platform,
  keyword,
  country,
  language
};

if (type === 'all') {
  generateAll(city);
} else {
  generateContent(type, data);
}

console.log(`\n💜 ${BRAND.cta}\n`);
