# Book.ax - React Native Booking Platform

Eine mobile Buchungsplattform ähnlich wie Booking.com, entwickelt mit React Native für iOS und Android.

## 🚀 Features

- **Authentifizierung**: Login, Registrierung, Passwort zurücksetzen
- **Hotel-Suche**: Suche nach Hotels mit Filtern (Preis, Bewertung, Ausstattung)
- **Buchungsverwaltung**: Kompletter Buchungsablauf von der Suche bis zur Bestätigung
- **Zahlungen**: Integration von Zahlungsanbietern
- **Benutzerprofil**: Profilansicht, Buchungshistorie, Favoriten

## 📁 Projektstruktur

```
Book.ax/
├── src/
│   ├── features/           # Feature-basierte Module
│   │   ├── auth/          # Authentifizierung
│   │   ├── search/        # Hotel-Suche
│   │   ├── booking/       # Buchungsverwaltung
│   │   ├── payment/       # Zahlungsabwicklung
│   │   └── profile/       # Benutzerprofil
│   ├── components/        # Wiederverwendbare UI-Komponenten
│   ├── navigation/        # React Navigation Setup
│   ├── services/          # API-Calls, externe Services
│   ├── store/            # Redux Store & Slices
│   ├── utils/            # Helper-Funktionen
│   └── types/            # TypeScript-Definitionen
├── assets/               # Bilder, Fonts, etc.
├── android/             # Android-spezifischer Code
└── ios/                 # iOS-spezifischer Code
```

## 🛠️ Entwicklung

### Voraussetzungen

- Node.js >= 18
- npm oder yarn
- Xcode (für iOS)
- Android Studio (für Android)
- CocoaPods (für iOS-Dependencies)

### Installation

```bash
# Dependencies installieren
npm install

# iOS Pods installieren (nur macOS)
cd ios && pod install && cd ..
```

### App starten

```bash
# Metro Bundler starten
npm start

# iOS App starten
npm run ios

# Android App starten
npm run android
```

### Entwicklerwerkzeuge

```bash
# Linting
npm run lint

# Tests ausführen
npm test

# TypeScript Type-Checking
npx tsc --noEmit
```

## 🏗️ Architektur

### Feature-basierte Struktur

Jedes Feature ist in seinem eigenen Ordner organisiert:
- `components/` - Feature-spezifische UI-Komponenten
- `screens/` - Screen-Komponenten für Navigation
- `hooks/` - Custom React Hooks
- `types.ts` - TypeScript Typen
- `slice.ts` - Redux Toolkit Slice (falls benötigt)

### State Management

- **Redux Toolkit** für globalen App-State
- **React Context** für Theme/Lokalisierung
- **React Query** (optional) für Server-State-Caching

### Navigation

React Navigation mit:
- Stack Navigator für Screen-Flows
- Bottom Tab Navigator für Hauptnavigation
- Typisierte Navigation mit TypeScript

### API-Integration

- Axios für HTTP-Requests
- Zentrale API-Service-Klasse in `src/services/api.ts`
- Environment-spezifische Configs

## 📱 Plattform-spezifische Hinweise

### iOS

- Minimum iOS Version: 13.0
- CocoaPods für Dependency-Management
- Xcode 14+ erforderlich

### Android

- Minimum SDK: 21 (Android 5.0)
- Target SDK: 33
- Gradle für Build-Management

## 🧪 Testing

```bash
# Unit Tests
npm test

# E2E Tests (falls konfiguriert)
npm run test:e2e
```

## 🎨 Styling

- StyleSheet API für Styles
- Responsive Design mit Dimensions API
- Theme-System mit React Context
- React Native Vector Icons für Icons

## 📦 Wichtige Dependencies

- **@react-navigation/native** - Navigation
- **@reduxjs/toolkit** - State Management
- **axios** - HTTP Client
- **react-native-maps** - Kartenintegration
- **react-native-vector-icons** - Icon-Library

## 🔧 Nützliche Befehle

```bash
# Cache leeren
npm start -- --reset-cache

# Bundle Size analysieren
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android-release.bundle --analyze

# iOS-Build für Release
cd ios && xcodebuild -workspace Bookax.xcworkspace -scheme Bookax -configuration Release

# Android APK generieren
cd android && ./gradlew assembleRelease
```

## 📝 Konventionen

- **Dateinamen**: PascalCase für Komponenten, camelCase für Utils
- **Komponenten**: Functional Components mit TypeScript
- **Hooks**: Prefix mit `use` (z.B. `useAuth`, `useBooking`)
- **Styles**: Co-located mit Komponenten, Suffix `.styles.ts`
- **Tests**: Suffix `.test.tsx` neben der Datei

## 🚧 In Entwicklung

- [ ] Backend API Integration
- [ ] Push Notifications
- [ ] Offline-Modus mit AsyncStorage
- [ ] Deep Linking
- [ ] Analytics Integration

## 📄 Lizenz

Privates Projekt
