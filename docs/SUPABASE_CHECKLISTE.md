# ✅ Supabase Setup Checkliste für Book.ax

**Status:** Datenbank-Code ist bereit, jetzt Setup in Supabase Dashboard durchführen

---

## 📋 Setup-Schritte (5-10 Minuten)

### ☐ Schritt 1: Einloggen
```
1. Öffne: https://supabase.com
2. Klicke: "Sign in" (oben rechts)
3. Email/Username: book.ax
4. Password: tQ3cq&8EQ8ipa-Pjao00jooinmp7890
5. Klicke: "Sign in"
```
**Status:** [ ] Erledigt

---

### ☐ Schritt 2: Projekt erstellen
```
1. Klicke: "New Project" (grüner Button)
2. Name: bookax
3. Database Password: [ERSTELLE EINS - Z.B. BookAx2025!]
   ⚠️ WICHTIG: Schreibe es auf!
4. Region: Europe West (Frankfurt)
5. Plan: Free
6. Klicke: "Create new project"
7. Warte 1-2 Minuten bis "Active"
```
**Status:** [ ] Erledigt

**Dein Database Password:** _____________________ (hier eintragen!)

---

### ☐ Schritt 3: API-Keys holen
```
1. Klicke: ⚙️ Settings (links unten)
2. Klicke: "API"
3. Kopiere "Project URL":
   z.B. https://abcdefghijklmn.supabase.co
4. Kopiere "anon public" key:
   z.B. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**Status:** [ ] Erledigt

**Deine Werte:**
```
Project URL: _________________________________
anon key: ____________________________________
```

---

### ☐ Schritt 4: .env konfigurieren
```
1. Öffne VS Code
2. Öffne Datei: .env
3. Ersetze:
   SUPABASE_URL=https://dein-projekt.supabase.co
   SUPABASE_ANON_KEY=dein-anon-key-hier
   
   Mit deinen echten Werten (aus Schritt 3)
   
4. Speichere (Cmd/Ctrl + S)
```
**Status:** [ ] Erledigt

---

### ☐ Schritt 5: SQL ausführen
```
1. Supabase Dashboard → Klicke: "SQL Editor" (📝)
2. Klicke: "+ New query"
3. VS Code → Öffne: supabase-schema.sql
4. Markiere ALLES (Cmd/Ctrl + A)
5. Kopiere (Cmd/Ctrl + C)
6. Zurück zu Supabase SQL Editor
7. Einfügen (Cmd/Ctrl + V)
8. Klicke: "Run" (oder F5)
9. Warte auf: "Success. No rows returned"
```
**Status:** [ ] Erledigt

---

### ☐ Schritt 6: Tabellen prüfen
```
1. Klicke: "Database" (🗄️)
2. Klicke: "Tables"
3. Prüfe ob vorhanden:
   [ ] bookings
   [ ] hotels
   [ ] reviews
   [ ] users
   
4. Klicke auf "hotels"
5. Du solltest 2 Hotels sehen:
   [ ] Grand Hotel Berlin
   [ ] Seaside Resort München
```
**Status:** [ ] Erledigt

---

### ☐ Schritt 7: App neu starten
```
Terminal:
cd /Users/alanbest/B_Imo_co
npm start -- --reset-cache

Oder einfach Metro Bundler neu starten
```
**Status:** [ ] Erledigt

---

## 🎯 Nach dem Setup testen:

### Test 1: Registration
```
1. Öffne App auf Handy (QR-Code scannen)
2. Gehe zu "Registrieren"
3. Erstelle Account:
   - Email: test@bookax.com
   - Password: Test123!
   - Vorname: Test
   - Nachname: User
4. Klicke "Registrieren"
5. ✅ Sollte funktionieren (keine Fehler)
```

### Test 2: Login
```
1. Gehe zu Login
2. Email: test@bookax.com
3. Password: Test123!
4. ✅ Sollte einloggen
```

### Test 3: Hotels laden
```
1. Nach Login → Suche-Tab
2. ✅ Solltest 2 Hotels sehen:
   - Grand Hotel Berlin (€250/Nacht)
   - Seaside Resort München (€180/Nacht)
```

### Test 4: Buchung erstellen
```
1. Wähle ein Hotel
2. Klicke "Jetzt buchen"
3. Wähle Daten & Gäste
4. Klicke "Buchung abschließen"
5. ✅ Buchung sollte erstellt werden
```

---

## 🐛 Troubleshooting

### Problem: "Supabase ist nicht konfiguriert"
**Lösung:**
- Prüfe `.env` Datei
- Starte Metro neu: `npm start -- --reset-cache`
- Prüfe ob SUPABASE_URL mit `https://` beginnt

### Problem: "relation 'users' does not exist"
**Lösung:**
- SQL-Schema wurde nicht deployed
- Wiederhole Schritt 5
- Prüfe "Success" Meldung in SQL Editor

### Problem: "Invalid API key"
**Lösung:**
- Falsche Keys in `.env`
- Gehe zu Supabase → Settings → API
- Kopiere Keys erneut

### Problem: "Row Level Security violation"
**Lösung:**
- User ist nicht eingeloggt
- Mach Login/Register zuerst
- Dann Hotels/Buchungen laden

---

## 📊 Supabase Dashboard Features

### Nach Setup nutzen:

1. **Table Editor**
   - Daten direkt bearbeiten
   - Neue Hotels manuell hinzufügen
   - User-Accounts ansehen

2. **Authentication**
   - Alle registrierten User sehen
   - Email-Bestätigung konfigurieren
   - Social Login aktivieren (Google, Apple)

3. **Storage** (später)
   - Hotel-Bilder hochladen
   - Öffentliche Buckets erstellen
   - CDN für schnelle Bilder

4. **Logs**
   - API-Anfragen überwachen
   - Fehler debuggen
   - Performance messen

---

## 🎉 Erfolg?

Wenn alle Schritte ✅ sind:

**Deine Book.ax App nutzt jetzt:**
- ✅ Production PostgreSQL Datenbank
- ✅ Supabase Authentication
- ✅ Row Level Security
- ✅ Real-Time Daten (kein Mock mehr!)
- ✅ Geo-Queries (Hotels in der Nähe)
- ✅ Auto-Rating Updates

---

## 📞 Wenn du Hilfe brauchst:

1. Prüfe welcher Schritt fehlschlägt
2. Screenshot vom Fehler machen
3. Schau in: SUPABASE_SETUP.md für Details
4. Oder frag mich mit dem Screenshot!

---

**Setup-Datum:** ____________
**Projekt-URL:** ____________
**Status:** [ ] Komplett fertig

---

💡 **Tipp:** Bookmark deine Supabase Dashboard URL für schnellen Zugriff!
