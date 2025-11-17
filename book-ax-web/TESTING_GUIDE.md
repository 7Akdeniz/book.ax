# 🚀 Admin Panel Lokales Testing - Quick Start

## Status: ✅ READY TO TEST

### Was bereits läuft:

1. **PostgreSQL auf Port 5433** ✅
   - Container: `bookax-postgres`
   - 4 Test-User geladen (inkl. Admin)

2. **Next.js Dev Server auf Port 3000** ✅
   - http://localhost:3000

3. **Admin Token Generator** ✅
   - Script: `npm run admin-token`

---

## 🎯 Jetzt bist DU dran! Testing Steps:

### Schritt 1: Admin-Seite öffnen
```bash
# Öffne im Browser:
http://localhost:3000/admin
```

### Schritt 2: Als Admin einloggen (Browser Console)

1. **Drücke F12** um Developer Console zu öffnen
2. **Generiere Token:**
   ```bash
   npm run admin-token
   ```
3. **Kopiere den Output** (das JavaScript-Snippet)
4. **Füge es in die Browser Console ein** und drücke Enter
5. **Seite wird neu geladen** - du bist jetzt als Admin eingeloggt!

**Admin Credentials (Falls du Login-Form nutzen willst):**
- Email: `admin@bookax.local`
- Password: `Password123!`

---

## 🧪 Was zu testen ist:

### Layout & Navigation
- [ ] Sidebar wird angezeigt (links, dunkel)
- [ ] Header wird angezeigt (oben)
- [ ] Mobile: Hamburger Menu funktioniert
- [ ] Alle Sidebar-Links klickbar
- [ ] User-Dropdown funktioniert

### Admin Routes (Klick durch alle!)
- [ ] `/admin` - Dashboard
- [ ] `/admin/users` - User Management
- [ ] `/admin/hotels` - Hotels
- [ ] `/admin/bookings` - Buchungen
- [ ] `/admin/analytics` - Analytics
- [ ] `/admin/cms` - CMS
- [ ] `/admin/finances` - Finanzen
- [ ] `/admin/settings` - Einstellungen

### Funktionalität
- [ ] Settings-Form: Änderungen speichern
- [ ] User-Tabelle: Daten laden
- [ ] Hotels-Tabelle: Daten laden
- [ ] Suche funktioniert
- [ ] Filter funktionieren
- [ ] Pagination funktioniert

---

## 🐛 Fehler dokumentieren

**Öffne Browser Console (F12) und notiere:**

1. **Rote Fehler** (Errors):
   ```
   Beispiel: "Cannot read property 'map' of undefined"
   ```

2. **Gelbe Warnungen** (Warnings):
   ```
   Beispiel: "Warning: Each child should have unique key"
   ```

3. **Network Errors** (Tab "Network"):
   ```
   Beispiel: "GET /api/admin/users 404 Not Found"
   ```

4. **Funktionalität**:
   - "Settings speichern funktioniert nicht"
   - "User-Tabelle bleibt leer"
   - etc.

---

## 🔧 Nützliche Commands

```bash
# PostgreSQL Connection testen
node scripts/test-postgres.js

# Admin Token neu generieren
npm run admin-token

# Docker PostgreSQL neustarten
docker compose restart postgres

# Docker Logs ansehen
docker compose logs -f postgres

# Dev Server neustarten
# Ctrl+C zum Stoppen, dann:
npm run dev

# Database direkt verbinden (psql)
docker exec -it bookax-postgres psql -U bookax_user -d bookax
```

---

## 📊 Test-Daten in DB

**Admin User:**
- ID: `33333333-3333-3333-3333-333333333333`
- Email: `admin@bookax.local`
- Password: `Password123!`
- Role: `admin`

**Hotelier User:**
- Email: `hotelier@bookax.local`
- Password: `Password123!`
- Role: `hotelier`

**Guest User:**
- Email: `guest@bookax.local`
- Password: `Password123!`
- Role: `guest`

**Demo Hotel:**
- Name: Grand Hotel Berlin
- ID: `aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa`

---

## ✅ Wenn alles funktioniert

Dann committen wir die Änderungen:
```bash
git add -A
git commit -m "feat: Add PostgreSQL client, admin token generator, local dev setup"
git push
```

---

## ❌ Wenn Fehler auftreten

**Poste mir:**
1. Die Console Errors (Screenshot oder Text)
2. Welche Route/Funktionalität betroffen ist
3. Was du erwartet hast vs. was passiert ist

Dann fixen wir es Schritt für Schritt! 🔧

---

**Viel Erfolg beim Testen! 🚀**
