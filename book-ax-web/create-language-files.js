#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// All 50 supported languages
const locales = [
  'de', 'en', 'zh', 'hi', 'es', 'ar', 'fr', 'tr', 'ru',
  'am', 'az', 'bn', 'my', 'ceb', 'cs', 'nl', 'fil', 'el', 'gu',
  'he', 'ha', 'id', 'it', 'ja', 'jv', 'kn', 'ko', 'ms', 'ml',
  'mr', 'ne', 'om', 'fa', 'pl', 'pa', 'ro', 'sr', 'sd', 'si',
  'so', 'sw', 'ta', 'te', 'th', 'uk', 'ur', 'vi', 'yo', 'zu',
  'pt'
];

const messagesDir = path.join(__dirname, 'messages');
const enJsonPath = path.join(messagesDir, 'en.json');

// Read English translations as template
const enTranslations = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));

console.log('🌍 Erstelle fehlende Sprachdateien für Book.ax...\n');

let created = 0;
let skipped = 0;

locales.forEach(locale => {
  const filePath = path.join(messagesDir, `${locale}.json`);
  
  if (fs.existsSync(filePath)) {
    console.log(`⏭️  ${locale}.json existiert bereits`);
    skipped++;
  } else {
    // Create new language file with English content
    fs.writeFileSync(filePath, JSON.stringify(enTranslations, null, 2), 'utf8');
    console.log(`✅ ${locale}.json erstellt`);
    created++;
  }
});

console.log(`\n📊 Zusammenfassung:`);
console.log(`   ✅ ${created} Dateien erstellt`);
console.log(`   ⏭️  ${skipped} Dateien übersprungen (existieren bereits)`);
console.log(`   📁 Gesamt: ${locales.length} Sprachdateien`);
console.log(`\n💡 Hinweis: Alle neuen Dateien verwenden vorerst englische Texte.`);
console.log(`   Du kannst sie später übersetzen oder einen Übersetzungsdienst nutzen.`);
