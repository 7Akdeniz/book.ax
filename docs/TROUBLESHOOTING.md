# 🐛 Häufige Probleme & Lösungen

## Probleme beim Handy-Test

### 1. "Unable to connect to Metro"

#### Symptom:
- App zeigt roten Bildschirm
- Meldung: "Unable to connect"

#### Lösung A: Gleisches WLAN prüfen
```bash
# Auf Mac: System Settings → Wi-Fi → Ihr Netzwerk
# Auf Handy: Einstellungen → WLAN → Gleiches Netzwerk?
```

#### Lösung B: Tunnel-Modus verwenden
```bash
# Terminal:
npm start -- --tunnel
```
Dann QR-Code neu scannen.

#### Lösung C: Firewall-Ausnahme
```bash
# Mac Firewall prüfen:
# System Settings → Network → Firewall
# Fügen Sie "Metro" oder "Node" hinzu
```

---

### 2. "Network response timed out"

#### Symptom:
- App lädt ewig
- Timeout-Fehler

#### Lösung:
```bash
# 1. Metro neu starten:
# Drücken Sie Ctrl+C im Terminal
npm start -- --clear

# 2. Expo Go komplett schließen und neu öffnen

# 3. Falls das nicht hilft:
npm start -- --tunnel
```

---

### 3. QR-Code wird nicht erkannt

#### iPhone:
- ✅ **Richtig**: Normale **Kamera-App** verwenden
- ❌ **Falsch**: NICHT Expo Go zum Scannen nutzen
- Nach dem Scan erscheint eine Benachrichtigung → antippen

#### Android:
- ✅ **Richtig**: **Expo Go App** öffnen → "Scan QR Code"
- ❌ **Falsch**: NICHT normale Kamera verwenden

---

### 4. App ist komplett weiß/schwarz

#### Symptom:
- Screen bleibt weiß
- Nichts wird angezeigt

#### Lösung:
```bash
# 1. Handy schütteln → "Reload"

# 2. Terminal prüfen auf Fehler (rot markiert)

# 3. Cache löschen:
npm start -- --clear

# 4. Dependencies neu installieren:
rm -rf node_modules
npm install
npm start
```

---

### 5. "Cannot find module '@components/...'"

#### Symptom:
```
Error: Unable to resolve module @components/Button
```

#### Lösung:
```bash
# 1. Metro neu starten:
npm start -- --reset-cache

# 2. Prüfen Sie babel.config.js:
cat babel.config.js | grep "module-resolver"
# Sollte vorhanden sein

# 3. Falls nicht:
npm install babel-plugin-module-resolver --save-dev
npm start
```

---

### 6. App stürzt beim Navigieren ab

#### Symptom:
- Red Screen of Death
- "Invariant Violation" Fehler

#### Lösung:
```bash
# 1. Terminal-Fehler lesen (wichtig!)

# 2. Meist: Import-Fehler
# Prüfen Sie die letzte Datei, die Sie geändert haben

# 3. Metro neu starten:
npm start -- --clear
```

---

### 7. Expo Go zeigt "SDK Version Mismatch"

#### Symptom:
```
This app requires Expo SDK XX
You have SDK YY
```

#### Lösung:
```bash
# 1. Expo SDK aktualisieren:
npx expo install expo@latest

# 2. Alle Expo-Packages aktualisieren:
npx expo install --check

# 3. Metro neu starten:
npm start
```

---

### 8. Änderungen werden nicht angezeigt (Fast Refresh funktioniert nicht)

#### Symptom:
- Code geändert
- Handy zeigt alte Version

#### Lösung:
```bash
# 1. Fast Refresh aktivieren:
# Handy schütteln → "Enable Fast Refresh"

# 2. Manuell reloaden:
# Handy schütteln → "Reload"

# 3. Development Server neu starten:
# Ctrl+C im Terminal
npm start
```

---

### 9. "Metro Bundler is not responding"

#### Symptom:
- Terminal zeigt Metro, aber App verbindet nicht

#### Lösung:
```bash
# 1. Port prüfen (Standard: 8081):
lsof -i :8081

# 2. Falls Port besetzt, Prozess beenden:
kill -9 [PID]

# 3. Metro neu starten:
npm start

# 4. Alternative: Anderen Port verwenden:
npm start -- --port 8082
```

---

### 10. Icons/Bilder werden nicht angezeigt

#### Symptom:
- Nur Platzhalter oder gar nichts

#### Lösung:
```bash
# 1. Prüfen Sie, ob assets/ Ordner existiert:
ls -la assets/

# 2. SVG-Icons sollten da sein:
ls assets/*.svg

# 3. Falls nicht, neu erstellen:
# Siehe CREATE_ICONS_GUIDE.md

# 4. App neu laden:
# Handy schütteln → "Reload"
```

---

## Entwicklungs-Probleme

### 11. "npm start" tut nichts

#### Lösung:
```bash
# 1. Prüfen Sie Node-Version:
node --version
# Sollte >= 18 sein

# 2. npm Cache löschen:
npm cache clean --force

# 3. node_modules löschen und neu installieren:
rm -rf node_modules package-lock.json
npm install

# 4. Nochmal versuchen:
npm start
```

---

### 12. TypeScript-Fehler in VS Code

#### Symptom:
```
Cannot find name 'colors'
Module not found
```

#### Lösung:
```bash
# 1. TypeScript Server neu starten:
# VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

# 2. tsconfig.json prüfen:
cat tsconfig.json | grep "paths"
# Sollte Path Aliases enthalten

# 3. VS Code komplett neu starten
```

---

### 13. "Permission denied" beim npm install

#### Lösung:
```bash
# NICHT sudo verwenden!

# 1. npm Prefix prüfen:
npm config get prefix
# Sollte NICHT /usr sein

# 2. Falls doch, Prefix ändern:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# 3. PATH aktualisieren (in ~/.zshrc):
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

# 4. Nochmal versuchen:
npm install
```

---

## Performance-Probleme

### 14. App ist sehr langsam

#### Lösung:
```bash
# 1. Production Build testen:
npm run build

# 2. Entwicklungs-Modus nutzt mehr Ressourcen (normal!)

# 3. Handy neu starten

# 4. Metro Cache löschen:
npm start -- --reset-cache
```

---

### 15. Viele Warnungen im Terminal

#### Symptom:
```
Warning: componentWillMount is deprecated
Warning: Each child should have a unique key
```

#### Lösung:
```bash
# Diese Warnungen sind meist nicht kritisch

# Um sie zu deaktivieren (nicht empfohlen für Produktion):
# Fügen Sie zu App.tsx hinzu:
console.disableYellowBox = true;  // Nur für Entwicklung!

# Besser: Warnungen einzeln fixen
# Siehe WARNINGS_FIX_GUIDE.md
```

---

## Notfall-Reset

### 🚨 Komplett von vorne starten

Wenn GAR NICHTS funktioniert:

```bash
# 1. Expo Go vom Handy deinstallieren und neu installieren

# 2. Projekt komplett neu aufsetzen:
cd /Users/alanbest/B_Imo_co
rm -rf node_modules package-lock.json
npm cache clean --force

# 3. Dependencies neu installieren:
npm install

# 4. Metro Cache löschen:
npx expo start --clear

# 5. QR-Code neu scannen
```

---

## 📞 Hilfe holen

### Wo Sie Hilfe finden:

1. **Expo Dokumentation**
   - https://docs.expo.dev/troubleshooting/

2. **React Native Docs**
   - https://reactnative.dev/docs/troubleshooting

3. **Stack Overflow**
   - https://stackoverflow.com/questions/tagged/expo
   - https://stackoverflow.com/questions/tagged/react-native

4. **Expo Forums**
   - https://forums.expo.dev/

---

## 🔍 Debugging-Tools

### Metro Bundler Log lesen:
```bash
# Im Terminal nach Zeilen mit ERROR oder WARN suchen
# Rot = Fehler (muss gefixt werden)
# Gelb = Warnung (kann ignoriert werden)
```

### React DevTools:
```bash
# Installieren:
npm install -g react-devtools

# Starten:
react-devtools

# Im Development Menu (Handy schütteln):
# → "Open React DevTools"
```

### Network Inspector:
```bash
# Handy schütteln
# → "Debug Remote JS"
# → Chrome öffnet sich
# → F12 für DevTools
# → Network Tab
```

---

## ✅ Projekt-Gesundheits-Check

```bash
# Führen Sie diese Befehle aus:

# 1. Node-Version prüfen:
node --version
# Sollte: v18.x.x oder höher

# 2. npm-Version prüfen:
npm --version
# Sollte: 9.x.x oder höher

# 3. Expo-Version prüfen:
npx expo --version
# Sollte: ~51.0.0

# 4. Dependencies prüfen:
npm list expo
npm list react-native

# 5. TypeScript kompilieren (ohne Fehler):
npx tsc --noEmit

# Wenn alles ✓ ist, sollte die App funktionieren!
```

---

**Bei weiteren Problemen: Schreiben Sie mir mit dem genauen Fehler!**
