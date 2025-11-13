#!/bin/bash

# Book.ax Native Setup Script
# Dieser Script richtet die native Expo-Struktur ein

echo "🚀 Book.ax Native Setup wird gestartet..."
echo ""

# Prüfen ob wir im richtigen Ordner sind
if [ ! -f "package.json" ]; then
    echo "❌ Fehler: package.json nicht gefunden!"
    echo "Bitte führen Sie dieses Script im Book.ax Hauptverzeichnis aus."
    exit 1
fi

echo "✅ package.json gefunden"
echo ""

# Schritt 1: Expo CLI installieren (falls nicht vorhanden)
echo "📦 Schritt 1/5: Expo CLI prüfen..."
if ! command -v expo &> /dev/null; then
    echo "Expo CLI wird installiert..."
    npm install -g expo-cli
else
    echo "✅ Expo CLI bereits installiert"
fi
echo ""

# Schritt 2: Expo in Dependencies hinzufügen
echo "📦 Schritt 2/5: Expo Dependencies hinzufügen..."
npm install expo@~50.0.0 --save
npm install expo-status-bar --save
echo "✅ Expo Dependencies hinzugefügt"
echo ""

# Schritt 3: App.json für Expo erstellen
echo "📝 Schritt 3/5: app.json aktualisieren..."
cat > app.json << 'EOF'
{
  "expo": {
    "name": "Book.ax",
    "slug": "bookax",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#9C27B0"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.bookax.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#9C27B0"
      },
      "package": "com.bookax.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
EOF
echo "✅ app.json aktualisiert"
echo ""

# Schritt 4: Metro Config für React Native
echo "📝 Schritt 4/5: metro.config.js erstellen..."
cat > metro.config.js << 'EOF'
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  };

  return config;
})();
EOF
echo "✅ metro.config.js erstellt"
echo ""

# Schritt 5: Scripts in package.json aktualisieren
echo "📝 Schritt 5/5: package.json scripts aktualisieren..."
# Dieser Teil wird manuell gemacht, da JSON-Manipulation im Script komplex ist
echo "⚠️  Bitte fügen Sie folgende Scripts zu package.json hinzu:"
echo ""
echo '  "scripts": {'
echo '    "start": "expo start",'
echo '    "android": "expo start --android",'
echo '    "ios": "expo start --ios",'
echo '    "web": "expo start --web"'
echo '  }'
echo ""

# Assets Ordner erstellen
echo "📁 Assets-Ordner erstellen..."
mkdir -p assets
echo "✅ assets/ Ordner erstellt"
echo ""

# Fertig!
echo "🎉 Setup abgeschlossen!"
echo ""
echo "📋 Nächste Schritte:"
echo "1. Aktualisieren Sie die scripts in package.json (siehe oben)"
echo "2. Erstellen Sie Platzhalter-Icons in assets/"
echo "3. Führen Sie 'npm install' aus"
echo "4. Starten Sie mit 'npm start'"
echo ""
echo "Dokumentation: NATIVE_SETUP.md"
