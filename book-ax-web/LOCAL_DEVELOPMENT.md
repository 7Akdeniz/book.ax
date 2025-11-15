# 🐳 BOOK.AX - Lokale Entwicklungsumgebung

## Schnellstart

### 1. Docker starten
```bash
cd book-ax-web
docker-compose up -d
```

Das startet:
- **PostgreSQL** auf Port `5432`
- **pgAdmin** (Web UI) auf Port `5050`

### 2. Datenbank prüfen
```bash
# Status prüfen
docker-compose ps

# Logs anschauen
docker-compose logs -f postgres

# In PostgreSQL einloggen
docker exec -it bookax-postgres psql -U bookax_user -d bookax
```

### 3. Environment Variables anpassen

**`.env.local`** für lokale Entwicklung:
```bash
# Lokale PostgreSQL (Docker)
DATABASE_URL=postgresql://bookax_user:bookax_dev_password_2025@localhost:5432/bookax

# JWT Secrets (lokal)
JWT_SECRET=local_dev_jwt_secret_min_32_chars_bookax_2025
JWT_REFRESH_SECRET=local_dev_refresh_secret_min_32_chars_bookax_2025

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (Test Keys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Optional: Supabase für Storage/Auth (falls benötigt)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 4. App starten
```bash
npm run dev
```

App läuft auf: http://localhost:3000

---

## Demo-Zugänge

Nach dem ersten Start sind folgende Demo-User verfügbar:

| Rolle | Email | Passwort |
|-------|-------|----------|
| **Gast** | guest@bookax.local | Password123! |
| **Hotelier** | hotelier@bookax.local | Password123! |
| **Admin** | admin@bookax.local | Password123! |

**Demo Hotel**: Grand Hotel Berlin (5-Sterne, Berlin Mitte)

---

## pgAdmin Web UI

1. Öffne: http://localhost:5050
2. Login mit:
   - **Email**: admin@bookax.local
   - **Passwort**: admin

3. Server hinzufügen:
   - **Name**: BookAX Local
   - **Host**: postgres (Docker-Netzwerk) oder `host.docker.internal`
   - **Port**: 5432
   - **Database**: bookax
   - **Username**: bookax_user
   - **Password**: bookax_dev_password_2025

---

## Nützliche Befehle

### Docker Management
```bash
# Starten
docker-compose up -d

# Stoppen
docker-compose stop

# Herunterfahren (Container löschen)
docker-compose down

# Herunterfahren + Daten löschen
docker-compose down -v

# Neu initialisieren (Schema neu laden)
docker-compose down -v && docker-compose up -d

# Logs live anzeigen
docker-compose logs -f
```

### Datenbank-Befehle
```bash
# PostgreSQL Shell öffnen
docker exec -it bookax-postgres psql -U bookax_user -d bookax

# SQL-Datei ausführen
docker exec -i bookax-postgres psql -U bookax_user -d bookax < database/schema.sql

# Datenbank-Dump erstellen
docker exec -t bookax-postgres pg_dump -U bookax_user bookax > backup.sql

# Backup wiederherstellen
docker exec -i bookax-postgres psql -U bookax_user -d bookax < backup.sql
```

### PostgreSQL SQL Queries (im psql Shell)
```sql
-- Alle Tabellen anzeigen
\dt

-- User anzeigen
SELECT id, email, first_name, last_name, role FROM users;

-- Hotels anzeigen
SELECT id, name, city, star_rating, status FROM hotels;

-- Bookings anzeigen
SELECT id, check_in_date, check_out_date, status, total_amount FROM bookings;

-- Verfügbarkeit prüfen (nächste 7 Tage)
SELECT date, available_rooms, total_rooms 
FROM inventory 
WHERE hotel_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
AND date >= CURRENT_DATE
AND date <= CURRENT_DATE + INTERVAL '7 days'
ORDER BY date;
```

---

## Troubleshooting

### Port 5432 bereits belegt
```bash
# Prüfen welcher Prozess Port 5432 nutzt
lsof -i :5432

# Eigene PostgreSQL Instanz stoppen (falls vorhanden)
brew services stop postgresql@15
```

### Container startet nicht
```bash
# Alte Container + Volumes löschen
docker-compose down -v

# Images neu laden
docker-compose pull

# Neu starten
docker-compose up -d
```

### Schema-Änderungen anwenden
```bash
# 1. Daten sichern (falls wichtig)
docker exec -t bookax-postgres pg_dump -U bookax_user bookax > backup.sql

# 2. Datenbank neu initialisieren
docker-compose down -v
docker-compose up -d

# 3. Warten bis Container ready ist
docker-compose logs -f postgres
# Warte auf "database system is ready to accept connections"
```

### App findet Datenbank nicht
Prüfe:
1. `DATABASE_URL` in `.env.local` korrekt?
2. PostgreSQL Container läuft? → `docker-compose ps`
3. Firewall/VPN blockiert Port 5432?

```bash
# Verbindung testen
psql postgresql://bookax_user:bookax_dev_password_2025@localhost:5432/bookax -c "SELECT 1;"
```

---

## Development Workflow

### Lokale Entwicklung (empfohlen)
1. **Docker DB** für lokale Entwicklung
2. **Supabase Cloud** nur für Deployment/Testing
3. **Production DB** via Vercel Environment Variables

### Schema-Änderungen
1. Bearbeite `database/schema.sql`
2. Teste lokal mit Docker
3. Deploye zu Supabase via `npm run db:push` (falls Script existiert)
4. Update Vercel Production DB

---

## Performance

### Lokale DB vs. Supabase Cloud
- **Lokale DB**: ~1-5ms Latency (sehr schnell!)
- **Supabase Cloud**: ~50-200ms Latency (abhängig von Region)
- **Empfehlung**: Entwickle immer lokal, teste auf Cloud vor Deployment

### Indexe
Alle wichtigen Indexe sind in `database/schema.sql` und `database/performance-indexes.sql` definiert.

---

## Weitere Informationen

- **Schema Dokumentation**: `database/schema.sql`
- **Performance Optimierung**: `database/performance-indexes.sql`
- **API Dokumentation**: `docs/API.md`
- **Projekt-Architektur**: `docs/HOTEL_PMS_SYSTEM_ARCHITEKTUR.md`

---

**Status**: ✅ Ready for Local Development  
**Letzte Aktualisierung**: 15. November 2025
