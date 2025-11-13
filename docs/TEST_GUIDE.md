# 📱 Book.ax App - Test-Guide für Ihr Handy

## 🎯 Was Sie testen sollten

Diese Anleitung zeigt Ihnen Schritt-für-Schritt, wie Sie alle Features Ihrer App testen können.

---

## 1️⃣ **App starten**

```bash
cd /Users/alanbest/B_Imo_co
npm start
```

Dann:
- QR-Code mit **Expo Go** scannen
- Warten Sie, bis die App lädt (~5-10 Sekunden beim ersten Mal)

---

## 2️⃣ **Login Screen testen**

### Was Sie sehen sollten:
- ✅ Purple Logo-Bereich (#9C27B0)
- ✅ "Willkommen bei Book.ax" Überschrift
- ✅ Email-Eingabefeld
- ✅ Passwort-Eingabefeld
- ✅ **Purple "Anmelden" Button**
- ✅ "Noch kein Konto? Registrieren" Link (auch Purple)

### Test-Schritte:

#### Test 1: Leere Felder
1. Tippen Sie direkt auf **"Anmelden"** (ohne etwas einzugeben)
2. ❌ **Erwartung**: Fehlermeldung "Bitte Email eingeben"

#### Test 2: Ungültige Email
1. Geben Sie ein: `test` (keine richtige Email)
2. Passwort: `123`
3. Tippen Sie auf "Anmelden"
4. ❌ **Erwartung**: "Ungültige Email-Adresse"

#### Test 3: Gültige Daten (Mock)
1. Email: `test@bookax.com`
2. Passwort: `password123`
3. Tippen Sie auf "Anmelden"
4. ✅ **Erwartung**: Sie werden zur **Search Screen** weitergeleitet

> **Hinweis**: Da noch kein Backend verbunden ist, funktioniert jede Email/Passwort-Kombination!

---

## 3️⃣ **Register Screen testen**

### Zum Register Screen navigieren:
1. Vom Login Screen: Tippen Sie auf **"Registrieren"** Link unten

### Was Sie sehen sollten:
- ✅ "Neues Konto erstellen" Überschrift
- ✅ Name-Eingabefeld
- ✅ Email-Eingabefeld
- ✅ Passwort-Eingabefeld
- ✅ Passwort bestätigen-Feld
- ✅ Purple "Registrieren" Button
- ✅ "Bereits ein Konto? Anmelden" Link

### Test-Schritte:

#### Test 1: Formular ausfüllen
1. Name: `Max Mustermann`
2. Email: `max@bookax.com`
3. Passwort: `password123`
4. Passwort bestätigen: `password123`
5. Tippen Sie auf **"Registrieren"**
6. ✅ **Erwartung**: Weiterleitung zur Main App

#### Test 2: Passwörter stimmen nicht überein
1. Passwort: `password123`
2. Passwort bestätigen: `password456`
3. ❌ **Erwartung**: Fehlermeldung "Passwörter stimmen nicht überein"

---

## 4️⃣ **Bottom Tab Navigation testen**

Nach dem Login sehen Sie unten **3 Tabs**:

### Tab 1: 🔍 Suche (Search)
- **Icon**: Lupe (Purple wenn aktiv)
- **Funktion**: Hotel-Suche

### Tab 2: 📚 Buchungen (Bookings)
- **Icon**: Buch/Liste
- **Funktion**: Ihre Buchungen anzeigen

### Tab 3: 👤 Profil (Profile)
- **Icon**: Person
- **Funktion**: Benutzerprofil

### Test-Schritte:
1. Tippen Sie auf jeden Tab
2. ✅ **Erwartung**: Icon wird **Purple** (#9C27B0) wenn aktiv
3. ✅ **Erwartung**: Screen wechselt ohne Verzögerung

---

## 5️⃣ **Search Screen testen**

### Was Sie sehen sollten:
- ✅ "Finde dein Traumhotel" Überschrift
- ✅ **Ziel-Eingabefeld** (z.B. "Berlin")
- ✅ **Check-in Datum** Picker
- ✅ **Check-out Datum** Picker
- ✅ **Gäste-Anzahl** Auswahl
- ✅ Purple **"Hotels suchen"** Button

### Test-Schritte:

#### Test 1: Hotel-Suche durchführen
1. **Ziel**: Geben Sie `Berlin` ein
2. **Check-in**: Wählen Sie ein Datum
3. **Check-out**: Wählen Sie ein Datum (nach Check-in)
4. **Gäste**: Wählen Sie `2 Erwachsene`
5. Tippen Sie auf **"Hotels suchen"**
6. ✅ **Erwartung**: Weiterleitung zu **Search Results Screen**

---

## 6️⃣ **Search Results Screen testen**

Nach der Suche sehen Sie eine **Liste von Hotels**.

### Was Sie sehen sollten:
- ✅ Liste mit 5 Mock-Hotels
- ✅ Jedes Hotel zeigt:
  - Bild (Platzhalter)
  - **Hotel Name** (z.B. "Hotel Adlon Berlin")
  - **Location** (z.B. "Unter den Linden, Berlin")
  - **Rating** (⭐⭐⭐⭐⭐ in **Gold** #FFB300)
  - **Preis** (in **Purple** #9C27B0)
  - **"Details ansehen" Link** (Purple)

### Mock-Hotels, die Sie sehen:
1. **Hotel Adlon Berlin** - 250€/Nacht - ⭐⭐⭐⭐⭐ 5.0
2. **The Ritz-Carlton Munich** - 320€/Nacht - ⭐⭐⭐⭐⭐ 4.8
3. **Fontenay Hamburg** - 280€/Nacht - ⭐⭐⭐⭐⭐ 4.9
4. **Excelsior Köln** - 190€/Nacht - ⭐⭐⭐⭐ 4.6
5. **Villa Kennedy Frankfurt** - 210€/Nacht - ⭐⭐⭐⭐ 4.7

### Test-Schritte:

#### Test 1: Scrollen
1. **Scrollen Sie** durch die Liste
2. ✅ **Erwartung**: Smooth Scrolling, alle 5 Hotels sichtbar

#### Test 2: Hotel auswählen
1. Tippen Sie auf **"Details ansehen"** bei einem Hotel
2. ✅ **Erwartung**: Weiterleitung zu **Hotel Details Screen**

---

## 7️⃣ **Hotel Details Screen testen**

### Was Sie sehen sollten:
- ✅ **Zurück-Button** (←) oben links
- ✅ **Bildergalerie** (Platzhalter-Bilder)
- ✅ **Hotel Name** (z.B. "Hotel Adlon Berlin")
- ✅ **Location** mit 📍 Icon
- ✅ **Rating** (⭐⭐⭐⭐⭐ in Gold)
- ✅ **Beschreibung** des Hotels
- ✅ **Ausstattung** (✓ WLAN, ✓ Parkplatz, ✓ Pool, etc.)
- ✅ **Preis** (in Purple)
- ✅ Purple **"Zimmer auswählen"** Button

### Test-Schritte:

#### Test 1: Bildergalerie
1. **Wischen Sie** horizontal durch die Bilder
2. ✅ **Erwartung**: Mehrere Bilder werden angezeigt

#### Test 2: Zurück-Navigation
1. Tippen Sie auf **← Zurück** Button
2. ✅ **Erwartung**: Zurück zur Search Results Liste

#### Test 3: Buchung starten
1. Scrollen Sie nach unten zum Button
2. Tippen Sie auf **"Zimmer auswählen"**
3. ✅ **Erwartung**: Weiterleitung zu **Booking Confirm Screen**

---

## 8️⃣ **Booking Confirm Screen testen**

### Was Sie sehen sollten:
- ✅ "Buchungsbestätigung" Überschrift
- ✅ **Hotel-Informationen** (Name, Location, Daten)
- ✅ **Preis-Aufschlüsselung**:
  - Preis pro Nacht
  - Anzahl Nächte
  - Zwischensumme
  - Service-Gebühr
  - **Gesamtpreis** (in Purple, größer)
- ✅ Purple **"Buchung bestätigen"** Button
- ✅ "Abbrechen" Button

### Test-Schritte:

#### Test 1: Preis-Berechnung prüfen
1. Prüfen Sie, ob die **Berechnung stimmt**:
   - Beispiel: 250€ × 3 Nächte = 750€
   - + Service-Gebühr (10€)
   - = **Gesamt: 760€**

#### Test 2: Buchung bestätigen
1. Tippen Sie auf **"Buchung bestätigen"**
2. ✅ **Erwartung**: Success-Message oder Weiterleitung

#### Test 3: Abbrechen
1. Tippen Sie auf **"Abbrechen"**
2. ✅ **Erwartung**: Zurück zu Hotel Details

---

## 9️⃣ **Profil Screen testen**

### Navigation:
1. Tippen Sie auf den **👤 Profil** Tab unten

### Was Sie sehen sollten:
- ✅ "Mein Profil" Überschrift
- ✅ Benutzer-Informationen
- ✅ **"Abmelden"** Button (Purple)

### Test-Schritte:

#### Test 1: Logout
1. Tippen Sie auf **"Abmelden"**
2. ✅ **Erwartung**: Zurück zum **Login Screen**

---

## 🔟 **Design & Farben prüfen**

Während Sie testen, achten Sie auf:

### Primärfarbe (Purple #9C27B0)
- ✅ Alle **primären Buttons** sind Purple
- ✅ **Aktive Tab-Icons** sind Purple
- ✅ **Links** sind Purple
- ✅ **Preise** sind Purple
- ✅ **Splash Screen** Background ist Purple

### Sekundärfarbe (Gold #FFB300)
- ✅ **Rating Stars** (⭐) sind Gold
- ✅ Premium-Features sind Gold

### Text-Farben
- ✅ Haupt-Text: Schwarz (#212121)
- ✅ Sekundär-Text: Grau (#757575)
- ✅ Button-Text: Weiß (#FFFFFF)

---

## 🐛 **Bekannte Einschränkungen (Normal!)**

### Was NICHT funktioniert (noch):
- ❌ **Echte Login-Validierung** (jede Email/Passwort funktioniert)
- ❌ **Echte Hotel-Daten** (nur 5 Mock-Hotels)
- ❌ **Echte Buchungen speichern** (kein Backend)
- ❌ **Zahlungen** (noch nicht implementiert)
- ❌ **Bilder laden** (Platzhalter-Bilder)

### Was funktioniert ✅:
- ✅ **Navigation** zwischen allen Screens
- ✅ **Formular-Validierung**
- ✅ **Redux State Management** (Filter, Auth-Status)
- ✅ **UI/UX** komplett
- ✅ **Responsive Design**
- ✅ **Theme System** (Purple Farben)

---

## 🔧 **Troubleshooting**

### App lädt nicht?
```bash
# Terminal neu starten:
npm start -- --clear
```

### Screen bleibt weiß?
- Schütteln Sie das Handy
- Wählen Sie "Reload"

### Änderungen werden nicht angezeigt?
- **Fast Refresh** sollte automatisch funktionieren
- Falls nicht: Handy schütteln → "Reload"

### App stürzt ab?
- Prüfen Sie das Terminal auf Fehler
- Metro Bundler läuft weiter? (im Terminal)

---

## 📊 **Test-Checkliste**

Haken Sie ab, was Sie getestet haben:

### Authentifizierung
- [ ] Login mit ungültigen Daten (Fehler wird angezeigt)
- [ ] Login mit gültigen Daten (Navigation zur Main App)
- [ ] Register mit allen Feldern
- [ ] Logout funktioniert

### Navigation
- [ ] Alle 3 Bottom Tabs funktionieren
- [ ] Active Tab ist Purple
- [ ] Zurück-Buttons funktionieren

### Hotel-Suche
- [ ] Search Form ausfüllen
- [ ] Search Results werden angezeigt
- [ ] 5 Mock-Hotels sind sichtbar
- [ ] Scrolling funktioniert

### Hotel Details
- [ ] Details-Screen öffnet sich
- [ ] Alle Informationen sichtbar
- [ ] "Zimmer auswählen" funktioniert

### Booking
- [ ] Booking Confirm Screen zeigt korrekte Daten
- [ ] Preis-Berechnung ist korrekt
- [ ] "Bestätigen" Button funktioniert

### Design
- [ ] Alle Buttons sind Purple
- [ ] Rating Stars sind Gold
- [ ] Preise sind Purple
- [ ] Text ist gut lesbar

---

## 🎉 **Super! Was jetzt?**

Nach dem Testen:

### Feedback geben
- Was gefällt Ihnen?
- Was würden Sie ändern?
- Welche Features fehlen?

### Nächste Schritte
1. **Backend anbinden** (API-URLs in `.env`)
2. **Echte Bilder** hochladen
3. **Payment Integration** (Stripe/PayPal)
4. **Push Notifications** aktivieren

---

## 💡 **Tipps für Live-Entwicklung**

### Code ändern & sofort sehen:
1. Öffnen Sie z.B. `src/features/auth/screens/LoginScreen.tsx`
2. Ändern Sie den Text "Willkommen bei Book.ax" zu "Hallo!"
3. **Speichern** (Cmd+S)
4. ✨ **Magic**: App auf Handy aktualisiert sich automatisch!

### Farbe ändern & testen:
1. Öffnen Sie `src/utils/theme.ts`
2. Ändern Sie `primary: '#9C27B0'` zu z.B. `'#E91E63'` (Pink)
3. Speichern
4. Alle Purple-Elemente werden jetzt Pink! 💖

---

**Viel Spaß beim Testen! 🚀**

Bei Fragen oder Problemen, schreiben Sie mir!
