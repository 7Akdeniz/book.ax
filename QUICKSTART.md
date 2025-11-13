# Book.ax Schnellstart-Anleitung

## 🚀 Installation & Setup

### 1. Dependencies installieren

```bash
npm install --legacy-peer-deps
```

**Hinweis**: Wir verwenden `--legacy-peer-deps` aufgrund von Peer-Dependency-Konflikten zwischen verschiedenen React Native Packages.

### 2. iOS Setup (nur macOS)

```bash
cd ios
pod install
cd ..
```

### 3. App starten

#### Metro Bundler starten

```bash
npm start
```

#### iOS App (in neuem Terminal)

```bash
npm run ios
```

#### Android App (in neuem Terminal)

```bash
npm run android
```

## 📱 Features

### ✅ Bereits implementiert

1. **Authentifizierung**
   - Login-Screen mit Validierung
   - Registrierungs-Screen
   - Redux-Integration für Auth-State
   - Token-Persistierung mit AsyncStorage

2. **Hotel-Suche**
   - Such-Screen mit Filtern
   - Ergebnis-Liste mit FlatList
   - Hotel-Card-Komponente
   - Redux-Integration für Search-State

3. **Navigation**
   - Auth-Flow (Login/Register)
   - Main-App mit Bottom Tabs
   - Typisierte Navigation mit TypeScript

4. **UI-Komponenten**
   - Button (primary, secondary, outline)
   - HotelCard mit Bildern und Bewertung
   - Theme-System mit Farben und Spacing

### 🚧 In Entwicklung

- Hotel-Details Screen
- Buchungs-Flow
- Zahlungs-Integration
- Profil-Bearbeitung
- Buchungs-Historie

## 🎯 Erste Schritte als Entwickler

### Test-Login (Mock-Daten)

Die App ist aktuell im Mock-Modus. Um zu testen:

1. Starten Sie die App
2. Klicken Sie auf "Registrieren"
3. Füllen Sie das Formular aus
4. Sie werden zur Hauptansicht weitergeleitet

**Hinweis**: Ohne Backend-Verbindung funktioniert die tatsächliche Authentifizierung noch nicht.

### Backend-Integration

Um die App mit einem Backend zu verbinden:

1. Erstellen Sie eine `.env` Datei (basierend auf `.env.example`)
2. Setzen Sie `API_BASE_URL` auf Ihre Backend-URL
3. Passen Sie die Services in `src/services/` an

```bash
# .env
API_BASE_URL=https://your-api.com/api
```

### Neue Feature hinzufügen

1. Erstellen Sie einen neuen Feature-Ordner: `src/features/your-feature/`
2. Struktur:
   ```
   your-feature/
   ├── components/      # Feature-spezifische Komponenten
   ├── screens/         # Screen-Komponenten
   ├── hooks/           # Custom Hooks
   ├── navigation/      # Navigation (optional)
   ├── yourFeatureSlice.ts   # Redux Slice
   ├── yourFeatureService.ts # API Service
   └── types.ts         # TypeScript Types
   ```
3. Integrieren Sie den Reducer in `src/store/store.ts`
4. Fügen Sie Navigation in entsprechenden Navigator hinzu

## 🔧 Debugging

### Metro Cache leeren

```bash
npm start -- --reset-cache
```

### iOS Logs anzeigen

```bash
npx react-native log-ios
```

### Android Logs anzeigen

```bash
npx react-native log-android
```

### TypeScript Type-Check

```bash
npx tsc --noEmit
```

## 📚 Wichtige Befehle

```bash
# Linting
npm run lint

# Tests (wenn konfiguriert)
npm test

# iOS Clean Build
cd ios && xcodebuild clean && cd ..
rm -rf ios/build

# Android Clean Build
cd android && ./gradlew clean && cd ..

# Node Modules neu installieren
rm -rf node_modules
npm install --legacy-peer-deps
```

## 🆘 Häufige Probleme

### Problem: "Unable to resolve module"

**Lösung**:
```bash
npm start -- --reset-cache
```

### Problem: iOS Build-Fehler

**Lösung**:
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Problem: Android Build-Fehler

**Lösung**:
```bash
cd android
./gradlew clean
cd ..
npm start -- --reset-cache
```

### Problem: TypeScript-Fehler wegen fehlender Module

**Lösung**: Die Fehler verschwinden nach `npm install`. Während der Installation zeigt TypeScript Fehler an, weil die Packages noch nicht vorhanden sind.

## 📖 Weitere Ressourcen

- [React Native Dokumentation](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/docs/getting-started)
- [Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

## 🎨 Code-Style

Das Projekt verwendet:
- **Prettier** für Code-Formatierung (2 Spaces, Single Quotes)
- **ESLint** für Code-Qualität
- **TypeScript** im Strict Mode

Auto-Formatierung in VS Code:
1. Installieren Sie die Prettier-Extension
2. Settings: "Format on Save" aktivieren

---

**Viel Erfolg beim Entwickeln! 🚀**

Bei Fragen schauen Sie in die `.github/copilot-instructions.md` für detaillierte Pattern-Beschreibungen.
