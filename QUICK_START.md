# 🚀 Quick Start - Supabase Integration

## Schritt 1: SQL Schema deployen ⚠️ WICHTIG!

1. Öffne: https://supabase.com/dashboard/project/cmoohnktsgszmuxxnobd
2. Klicke: **SQL Editor** (links)
3. Klicke: **+ New query**
4. Kopiere **komplett** `supabase-schema.sql` (350 Zeilen)
5. Füge ein und klicke **Run** (F5)
6. Warte auf "Success"

✅ **Prüfen:** Table Editor → Du solltest sehen:
- `users`
- `hotels` (mit 2 Sample-Hotels)
- `bookings`
- `reviews`

---

## Schritt 2: App starten

```bash
npm start
```

Scanne QR-Code mit Expo Go oder:

```bash
npm run ios     # iOS Simulator
npm run android # Android Emulator
```

---

## Schritt 3: Testen

### 1️⃣ Registrierung
- Registriere einen neuen User
- **Check:** Supabase → Table Editor → `users` → Dein User erscheint

### 2️⃣ Login
- Melde dich an
- **Check:** Du bleibst eingeloggt

### 3️⃣ Hotels suchen
- Suche nach "Berlin" oder "München"
- **Check:** 2 Hotels werden angezeigt

### 4️⃣ Buchung erstellen
- Wähle ein Hotel
- Erstelle Buchung
- **Check:** `bookings` Tabelle → Deine Buchung erscheint

---

## ✅ Fertig!

Die App ist jetzt **komplett mit Supabase verbunden**:

- ✅ Authentication funktioniert
- ✅ Hotels aus Datenbank
- ✅ Buchungen werden gespeichert
- ✅ TypeScript: 0 Fehler

---

## 🐛 Troubleshooting

### Keine Hotels?
→ SQL Schema deployed? Check Table Editor!

### Login funktioniert nicht?
→ Check Browser Console / Expo Logs für Fehler

### Buchung fehlschlägt?
→ Bist du eingeloggt? Check Session!

---

**Mehr Details:** `SUPABASE_INTEGRATION_FERTIG.md`
