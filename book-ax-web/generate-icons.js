#!/usr/bin/env node
/**
 * Generate all required icon formats for Book.ax Web App
 * Uses sharp for image processing (no Python dependencies needed)
 */

const fs = require('fs').promises;
const path = require('path');

async function checkSharp() {
  try {
    const sharp = require('sharp');
    return sharp;
  } catch (error) {
    console.log('❌ Sharp not installed!');
    console.log('\n🔧 Run: npm install sharp --save-dev\n');
    process.exit(1);
  }
}

async function generateIcons() {
  const sharp = await checkSharp();
  
  console.log('=' + '='.repeat(59));
  console.log('🎨 Book.ax Icon Generator (Node.js)');
  console.log('=' + '='.repeat(59));
  
  const publicDir = path.join(__dirname, 'public');
  const faviconSvg = path.join(publicDir, 'favicon.svg');
  const logoSvg = path.join(publicDir, 'logo.svg');
  
  // Check if SVG files exist
  try {
    await fs.access(faviconSvg);
    await fs.access(logoSvg);
  } catch (error) {
    console.log('❌ SVG files not found!');
    return;
  }
  
  console.log('\n🎨 Creating favicon.ico...');
  // Generate favicon.ico (using 32x32 as base)
  await sharp(faviconSvg)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32.png'));
  
  // For ICO, we'll use PNG for now (browsers support it)
  await sharp(faviconSvg)
    .resize(32, 32)
    .toFormat('png')
    .toFile(path.join(publicDir, 'favicon.ico'));
  
  console.log('  ✅ favicon.ico created (32x32px)');
  
  console.log('\n🍎 Creating apple-touch-icon.png...');
  await sharp(faviconSvg)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('  ✅ apple-touch-icon.png created (180x180px)');
  
  console.log('\n📦 Creating logo.png...');
  await sharp(logoSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'logo.png'));
  console.log('  ✅ logo.png created (512x512px)');
  
  console.log('\n🌐 Creating og-image.jpg...');
  // Create gradient background with logo
  const width = 1200;
  const height = 630;
  
  // Create purple gradient SVG
  const gradientSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)"/>
      <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="120" font-weight="700" fill="white" text-anchor="middle" dominant-baseline="middle">Book.ax</text>
      <text x="50%" y="75%" font-family="Arial, sans-serif" font-size="48" font-weight="400" fill="white" text-anchor="middle" opacity="0.9">Find Your Perfect Stay</text>
    </svg>
  `;
  
  await sharp(Buffer.from(gradientSvg))
    .jpeg({ quality: 95 })
    .toFile(path.join(publicDir, 'og-image.jpg'));
  console.log('  ✅ og-image.jpg created (1200x630px)');
  
  // Cleanup temp files
  try {
    await fs.unlink(path.join(publicDir, 'favicon-32.png'));
  } catch (e) {}
  
  console.log('\n' + '=' + '='.repeat(59));
  console.log('✅ All icons generated successfully!');
  console.log('=' + '='.repeat(59));
  console.log('\n📂 Generated files:');
  console.log('   • favicon.ico       (32x32px)');
  console.log('   • apple-touch-icon.png (180x180px)');
  console.log('   • logo.png          (512x512px)');
  console.log('   • og-image.jpg      (1200x630px)');
  console.log();
}

generateIcons().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
