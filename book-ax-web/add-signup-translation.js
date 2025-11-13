#!/usr/bin/env node
/**
 * Add missing "signUp" translation to all language files
 */

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');

// Translation map for "Sign Up" in different languages
const signUpTranslations = {
  am: 'ይመዝገቡ',           // Amharic
  ar: 'التسجيل',           // Arabic
  az: 'Qeydiyyat',         // Azerbaijani
  bn: 'নিবন্ধন করুন',      // Bengali
  ceb: 'Magparehistro',    // Cebuano
  cs: 'Registrovat se',    // Czech
  de: 'Registrieren',      // German
  el: 'Εγγραφή',           // Greek
  en: 'Sign Up',           // English
  es: 'Registrarse',       // Spanish
  fa: 'ثبت نام',           // Persian
  fil: 'Mag-sign Up',      // Filipino
  fr: "S'inscrire",        // French
  gu: 'સાઇન અપ',           // Gujarati
  ha: 'Yi Rajista',        // Hausa
  he: 'הרשמה',             // Hebrew
  hi: 'साइन अप करें',       // Hindi
  id: 'Daftar',            // Indonesian
  ig: 'Debanye aha',       // Igbo
  it: 'Iscriviti',         // Italian
  ja: '登録',               // Japanese
  jv: 'Ndaftar',           // Javanese
  kn: 'ಸೈನ್ ಅಪ್',         // Kannada
  ko: '가입하기',            // Korean
  ml: 'സൈൻ അപ്പ്',         // Malayalam
  mr: 'साइन अप',           // Marathi
  ms: 'Daftar',            // Malay
  nl: 'Registreren',       // Dutch
  om: 'Galmee',            // Oromo
  pa: 'ਸਾਈਨ ਅੱਪ',          // Punjabi
  pl: 'Zarejestruj się',   // Polish
  pt: 'Inscrever-se',      // Portuguese
  ro: 'Înregistrare',      // Romanian
  ru: 'Зарегистрироваться', // Russian
  rw: 'Iyandikishe',       // Kinyarwanda
  si: 'ලියාපදිංචි වන්න',   // Sinhala
  sk: 'Zaregistrovať sa',  // Slovak
  so: 'Isdiiwaangeli',     // Somali
  sv: 'Registrera dig',    // Swedish
  sw: 'Jisajili',          // Swahili
  ta: 'பதிவு செய்க',        // Tamil
  te: 'సైన్ అప్',          // Telugu
  th: 'ลงทะเบียน',          // Thai
  ti: 'ምዝገባ',             // Tigrinya
  tr: 'Kayıt Ol',          // Turkish
  uk: 'Зареєструватися',   // Ukrainian
  ur: 'سائن اپ',           // Urdu
  vi: 'Đăng ký',           // Vietnamese
  yo: 'Forukọsilẹ',        // Yoruba
  zh: '注册'                // Chinese
};

// Get all JSON files in messages directory
const files = fs.readdirSync(messagesDir).filter(file => file.endsWith('.json'));

console.log(`Found ${files.length} language files`);

let updatedCount = 0;
let errorCount = 0;

files.forEach(file => {
  const filePath = path.join(messagesDir, file);
  const locale = file.replace('.json', '');
  
  try {
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Check if auth.signUp already exists
    if (data.auth && data.auth.signUp) {
      console.log(`✓ ${locale}: signUp already exists`);
      return;
    }
    
    // Add signUp translation
    if (data.auth) {
      const signUpText = signUpTranslations[locale] || signUpTranslations['en'];
      
      // Create new auth object with signUp after registerTitle
      const newAuth = {};
      Object.keys(data.auth).forEach(key => {
        newAuth[key] = data.auth[key];
        if (key === 'registerTitle') {
          newAuth.signUp = signUpText;
        }
      });
      
      // If registerTitle doesn't exist, just add signUp at the beginning
      if (!newAuth.signUp) {
        newAuth.signUp = signUpText;
        Object.keys(data.auth).forEach(key => {
          if (!newAuth[key]) {
            newAuth[key] = data.auth[key];
          }
        });
      }
      
      data.auth = newAuth;
      
      // Write back to file with proper formatting
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      console.log(`✓ ${locale}: Added signUp = "${signUpText}"`);
      updatedCount++;
    } else {
      console.log(`⚠ ${locale}: No auth section found`);
    }
  } catch (error) {
    console.error(`✗ ${locale}: Error - ${error.message}`);
    errorCount++;
  }
});

console.log(`\n✅ Updated ${updatedCount} files`);
if (errorCount > 0) {
  console.log(`❌ ${errorCount} errors`);
}
