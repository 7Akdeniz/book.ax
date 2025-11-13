const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// QR-Code Konfiguration
const qrData = {
  url: 'http://localhost:3001/en',
  productionUrl: 'https://book.ax',
  text: 'Book.ax - Find Your Perfect Stay'
};

async function generateQRCodes() {
  console.log('🎨 Generiere QR-Codes für Book.ax...\n');

  const outputDir = path.join(__dirname, 'public', 'qr-codes');
  
  // Erstelle Ordner falls nicht vorhanden
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. QR-Code für Localhost (Testen)
  console.log('📱 Erstelle QR-Code für Localhost...');
  await QRCode.toFile(
    path.join(outputDir, 'book-ax-localhost.png'),
    qrData.url,
    {
      color: {
        dark: '#9C27B0',  // Book.ax Primary Color
        light: '#FFFFFF'
      },
      width: 400,
      margin: 2
    }
  );
  console.log('✅ Gespeichert: public/qr-codes/book-ax-localhost.png');
  console.log(`   URL: ${qrData.url}\n`);

  // 2. QR-Code für Production
  console.log('🌐 Erstelle QR-Code für Production...');
  await QRCode.toFile(
    path.join(outputDir, 'book-ax-production.png'),
    qrData.productionUrl,
    {
      color: {
        dark: '#9C27B0',
        light: '#FFFFFF'
      },
      width: 400,
      margin: 2
    }
  );
  console.log('✅ Gespeichert: public/qr-codes/book-ax-production.png');
  console.log(`   URL: ${qrData.productionUrl}\n`);

  // 3. SVG Version (skalierbar)
  console.log('🎯 Erstelle SVG QR-Code...');
  await QRCode.toFile(
    path.join(outputDir, 'book-ax-localhost.svg'),
    qrData.url,
    {
      type: 'svg',
      color: {
        dark: '#9C27B0',
        light: '#FFFFFF'
      },
      width: 400
    }
  );
  console.log('✅ Gespeichert: public/qr-codes/book-ax-localhost.svg\n');

  // 4. QR-Code als Data URL (für React Component)
  console.log('⚛️  Erstelle Data URL für React...');
  const dataUrl = await QRCode.toDataURL(qrData.url, {
    color: {
      dark: '#9C27B0',
      light: '#FFFFFF'
    },
    width: 400,
    margin: 2
  });
  
  // Speichere Data URL als JSON
  fs.writeFileSync(
    path.join(outputDir, 'qr-data-url.json'),
    JSON.stringify({
      localhost: dataUrl,
      url: qrData.url,
      generatedAt: new Date().toISOString()
    }, null, 2)
  );
  console.log('✅ Gespeichert: public/qr-codes/qr-data-url.json\n');

  // 5. Großer QR-Code für Drucken (800x800)
  console.log('🖨️  Erstelle großen QR-Code zum Drucken...');
  await QRCode.toFile(
    path.join(outputDir, 'book-ax-print.png'),
    qrData.productionUrl,
    {
      color: {
        dark: '#9C27B0',
        light: '#FFFFFF'
      },
      width: 800,
      margin: 4,
      errorCorrectionLevel: 'H' // Höchste Fehlerkorrektur
    }
  );
  console.log('✅ Gespeichert: public/qr-codes/book-ax-print.png (800x800)\n');

  console.log('🎉 Alle QR-Codes erfolgreich generiert!');
  console.log('\n📍 Speicherort: public/qr-codes/');
  console.log('\n📱 Zum Testen:');
  console.log('   1. Öffne public/qr-codes/book-ax-localhost.png');
  console.log('   2. Scanne mit deinem Handy');
  console.log('   3. Du wirst zu http://localhost:3001/en weitergeleitet');
  console.log('\n💡 Tipp: Stelle sicher, dass dein Handy im selben WLAN ist!');
}

// QR-Codes generieren
generateQRCodes().catch(err => {
  console.error('❌ Fehler beim Generieren:', err);
  process.exit(1);
});
