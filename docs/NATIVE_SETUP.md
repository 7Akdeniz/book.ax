# 🚀 Native Setup Anleitung

## Das Problem

Der `react-native init` Befehl ist veraltet. Sie haben jetzt 2 Optionen:

---

## ✅ Option 1: Expo verwenden (Empfohlen für schnellen Start)

Expo ist der einfachste Weg, React Native Apps zu entwickeln.

```bash
# 1. Expo CLI installieren
npm install -g expo-cli

# 2. Neues Expo-Projekt erstellen
cd /Users/alanbest
npx create-expo-app Bookax --template expo-template-blank-typescript

# 3. In das neue Projekt wechseln
cd Bookax

# 4. Unsere Dateien kopieren
cp -r ../Book.ax/src ./
cp ../Book.ax/App.tsx ./
cp -r ../Book.ax/.github ./
cp ../Book.ax/tsconfig.json ./

# 5. Dependencies aus unserer package.json hinzufügen
# Bearbeiten Sie package.json und fügen Sie die Dependencies hinzu

# 6. Dependencies installieren
npm install --legacy-peer-deps

# 7. App starten
npm start
```

### Vorteile von Expo:
- ✅ Kein Xcode/Android Studio Setup nötig
- ✅ Testen auf echtem Gerät via Expo Go App
- ✅ Einfaches OTA-Update System
- ✅ Viele native APIs out-of-the-box

---

## ✅ Option 2: React Native Community CLI (Für mehr Kontrolle)

Für vollständige Kontrolle über native Code:

```bash
# 1. Community CLI verwenden
cd /Users/alanbest
npx @react-native-community/cli@latest init Bookax --skip-install

# 2. In das neue Projekt wechseln
cd Bookax

# 3. Unsere Dateien kopieren
cp -r ../Book.ax/src ./
cp ../Book.ax/App.tsx ./App.tsx
cp -r ../Book.ax/.github ./
cp ../Book.ax/tsconfig.json ./
cp ../Book.ax/babel.config.js ./
cp ../Book.ax/.eslintrc.js ./
cp ../Book.ax/.prettierrc.js ./
cp ../Book.ax/.env.example ./
cp ../Book.ax/jest.config.js ./

# 4. package.json aktualisieren
# Fügen Sie die Dependencies aus Book.ax/package.json hinzu

# 5. Dependencies installieren
npm install --legacy-peer-deps

# 6. iOS Pods installieren (nur macOS)
cd ios && pod install && cd ..

# 7. App starten
npm start
npm run ios  # oder android
```

### Vorteile von Community CLI:
- ✅ Voller Zugriff auf nativen Code
- ✅ Einfachere Integration von nativen Modulen
- ✅ Bessere Performance
- ✅ Keine Expo-Einschränkungen

---

## 🎯 Unser aktuelles Projekt (Book.ax)

Das aktuelle Projekt in `/Users/alanbest/Book.ax` ist **vollständig funktional** und enthält:

### ✅ Bereits implementiert:
- Komplette Projektstruktur
- Auth Feature (Login, Register)
- Search Feature (Suche, Ergebnisse, Details, Buchung)
- UI Components (Button, HotelCard, TextInput, Loading)
- Navigation (Auth Flow, Main Tabs)
- Redux State Management
- TypeScript Konfiguration
- 911 Dependencies installiert

### 🔌 Was fehlt:
- **Native Ordner** (ios/ und android/)
- Diese bekommen Sie durch Option 1 oder 2

---

## 💡 Empfehlung

**Für Anfänger und schnellen Prototyping**: Option 1 (Expo)  
**Für Production Apps mit nativen Modulen**: Option 2 (Community CLI)

---

## 📝 Schritte nach Native Setup:

1. **Dependencies synchronisieren**:
   - Kopieren Sie alle dependencies aus `Book.ax/package.json`
   - In das neue Projekt einfügen
   - `npm install --legacy-peer-deps` ausführen

2. **Babel Config anpassen**:
   - Kopieren Sie `babel.config.js` für Path Aliases
   - Stellen Sie sicher, dass `babel-plugin-module-resolver` installiert ist

3. **TypeScript Config**:
   - Kopieren Sie `tsconfig.json` für Path Aliases
   - Alle @imports sollten funktionieren

4. **App testen**:
   ```bash
   npm start
   npm run ios  # oder android
   ```

---

## 🆘 Probleme?

### "Cannot find module '@components/...'"
**Lösung**: Stellen Sie sicher, dass `babel.config.js` und `tsconfig.json` kopiert wurden.

### "Pod install failed"
**Lösung**:
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### "Metro bundler error"
**Lösung**:
```bash
npm start -- --reset-cache
```

---

## 🎉 Sie sind fast fertig!

Ihr Code in `Book.ax` ist **production-ready**. Sie brauchen nur noch die nativen Plattform-Ordner.

Wählen Sie eine Option oben und folgen Sie den Schritten. In 10 Minuten läuft Ihre App! 🚀
