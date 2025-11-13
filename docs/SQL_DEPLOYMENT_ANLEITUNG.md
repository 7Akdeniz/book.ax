# 🎯 SQL Schema Deployment - Ganz einfach!

## ⚠️ WICHTIG: Ohne diesen Schritt funktioniert die App nicht!

Die App braucht die Datenbank-Tabellen in Supabase. Das dauert nur **2 Minuten**!

---

## 📋 Schritt-für-Schritt Anleitung

### Schritt 1: Supabase Dashboard öffnen

1. Öffne deinen Browser (Chrome, Safari, etc.)
2. Gehe zu dieser URL:
   ```
   https://supabase.com/dashboard/project/cmoohnktsgszmuxxnobd
   ```
3. Du solltest jetzt dein Projekt-Dashboard sehen

---

### Schritt 2: SQL Editor öffnen

1. **Links** in der Sidebar siehst du ein Menü
2. Klicke auf: **"SQL Editor"** (hat ein SQL-Icon 📝)
3. Der SQL Editor öffnet sich

---

### Schritt 3: Neue Query erstellen

1. Im SQL Editor siehst du oben einen Button: **"+ New query"**
2. Klicke darauf
3. Ein leeres Editor-Fenster öffnet sich

---

### Schritt 4: SQL Code kopieren

1. Öffne die Datei `supabase-schema.sql` in deinem Projekt
   - Du findest sie hier: `/Users/alanbest/B_Imo_co/supabase-schema.sql`
   
2. **Markiere ALLES** (Cmd+A auf Mac)
   - Die Datei hat ca. 350 Zeilen
   - Von der ersten Zeile bis zur letzten Zeile

3. **Kopiere alles** (Cmd+C)

---

### Schritt 5: SQL Code einfügen

1. Gehe zurück zum Supabase SQL Editor
2. Klicke in das leere Editor-Fenster
3. **Füge den SQL Code ein** (Cmd+V)
4. Du solltest jetzt den kompletten SQL Code sehen

---

### Schritt 6: SQL ausführen ▶️

1. Unten rechts siehst du einen grünen Button: **"Run"** (oder drücke F5)
2. **Klicke auf "Run"**
3. Warte 5-10 Sekunden
4. Du solltest sehen: **"Success. No rows returned"** ✅

---

### Schritt 7: Überprüfen

1. Gehe links zu: **"Table Editor"** (Tabellen-Icon 📊)
2. Du solltest jetzt diese Tabellen sehen:
   - ✅ **users** (User-Profile)
   - ✅ **hotels** (Hotels - sollte 2 Einträge haben)
   - ✅ **bookings** (Buchungen - leer)
   - ✅ **reviews** (Bewertungen - leer)

3. Klicke auf **"hotels"** Tabelle
4. Du solltest **2 Hotels** sehen:
   - Grand Hotel Berlin
   - Seaside Resort München

---

## ✅ Fertig!

Wenn du die 4 Tabellen siehst und 2 Hotels in der hotels-Tabelle sind → **PERFEKT!**

Die App kann jetzt:
- ✅ User registrieren und speichern
- ✅ Hotels aus der Datenbank laden
- ✅ Buchungen speichern
- ✅ Bewertungen verwalten

---

## 🚀 App testen

Jetzt kannst du die App testen:

1. Öffne Expo Go auf deinem Handy
2. Scanne den QR-Code im Terminal
3. Registriere einen Test-User
4. Suche nach "Berlin" oder "München"
5. Du solltest die 2 Hotels sehen! 🏨

---

## 🆘 Probleme?

### Fehler beim SQL ausführen?

**Fehler:** "relation already exists"
- **Lösung:** Tabellen existieren bereits! Alles gut ✅

**Fehler:** "permission denied"
- **Lösung:** Du musst als Owner eingeloggt sein
- Check: Bist du mit dem richtigen Account angemeldet?

**Fehler:** "syntax error"
- **Lösung:** Stelle sicher, dass du den **KOMPLETTEN** SQL Code kopiert hast
- Von Zeile 1 bis zur letzten Zeile!

### Keine Tabellen sichtbar?

1. Klicke auf "Refresh" im Table Editor
2. Prüfe ob "public" Schema ausgewählt ist (nicht "auth")

### Hotels-Tabelle leer?

- Die Sample-Daten werden am Ende des SQL Scripts eingefügt
- Prüfe ob das SQL Script komplett durchgelaufen ist
- Falls leer: Führe nochmal aus

---

## 📞 Nächste Schritte

Nachdem das SQL Schema deployed ist:

1. **App testen** (siehe oben)
2. **Eigene Hotels hinzufügen** (optional)
   - Table Editor → hotels → Insert row
3. **Row Level Security prüfen** (optional)
   - Authentication → Policies

---

**Du schaffst das! 💪 Es dauert wirklich nur 2 Minuten!**

Falls du nicht weiterkommst, sag mir **genau** welchen Fehler du siehst.
