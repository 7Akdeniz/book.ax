const fs = require('fs');
const path = require('path');

/**
 * Update Admin Users Translations
 * Replaces the 'users' object in all language files with the updated version from en.json
 */

const messagesDir = path.join(__dirname, 'messages');
const enPath = path.join(messagesDir, 'en.json');

// Read English translations (source of truth)
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const updatedUsers = enData.admin.users;
const updatedSecurity = enData.admin.security;

if (!updatedUsers) {
  console.error('❌ Error: admin.users not found in en.json');
  process.exit(1);
}

// Get all language files
const langFiles = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

let successCount = 0;
let errorCount = 0;
let skippedCount = 0;

langFiles.forEach(file => {
  const langPath = path.join(messagesDir, file);
  const lang = file.replace('.json', '');
  
  try {
    // Read current translations
    const data = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    
    // Check if admin.users exists
    if (!data.admin || !data.admin.users) {
      console.log(`⏭️  ${lang}: No admin.users found, skipping`);
      skippedCount++;
      return;
    }
    
    // Replace users and security objects
    data.admin.users = updatedUsers;
    data.admin.security = updatedSecurity;
    
    // Write back
    fs.writeFileSync(langPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ ${lang}: Updated admin.users and admin.security`);
    successCount++;
    
  } catch (error) {
    console.error(`❌ ${lang}: Error - ${error.message}`);
    errorCount++;
  }
});

console.log('\n===============================================');
console.log(`✅ Success: ${successCount}`);
console.log(`⏭️  Skipped: ${skippedCount}`);
console.log(`❌ Errors: ${errorCount}`);
console.log('===============================================');
