#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

// Read the full admin translations from en.json
const enPath = path.join(messagesDir, 'en.json');
const enContent = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
const adminTranslations = enContent.admin;

const files = fs.readdirSync(messagesDir).filter((f) => f.endsWith('.json'));

let successCount = 0;
let skippedCount = 0;
let errorCount = 0;

files.forEach((file) => {
  const locale = file.replace('.json', '');
  const filePath = path.join(messagesDir, file);

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const translations = JSON.parse(content);

    // Check if full admin structure already exists
    if (translations.admin?.dashboard && translations.admin?.hotels && translations.admin?.users) {
      console.log(`⏭️  ${locale}: Full admin translations already exist`);
      skippedCount++;
      return;
    }

    // Replace entire admin object with new structure
    translations.admin = adminTranslations;

    fs.writeFileSync(filePath, JSON.stringify(translations, null, 2) + '\n', 'utf-8');
    console.log(`✅ ${locale}: Added complete admin translations`);
    successCount++;
  } catch (error) {
    console.error(`❌ ${locale}: Error -`, error.message);
    errorCount++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`✅ Success: ${successCount}`);
console.log(`⏭️  Skipped: ${skippedCount}`);
console.log(`❌ Errors: ${errorCount}`);
console.log('='.repeat(60));
