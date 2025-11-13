# 📝 SOFORT-ANLEITUNG - FEHLER BEHEBEN

## ⚡ SCHNELLSTART (3 BEFEHLE)

```bash
# 1. In Projekt-Verzeichnis wechseln
cd /Users/alanbest/B_Imo_co/book-ax-web

# 2. Dependencies installieren
npm install

# 3. Development Server starten  
npm run dev
```

**Dann öffne:** http://localhost:3000

---

## ❌ AKTUELLER FEHLER

**Problem:** TypeScript findet Module nicht
```
Das Modul "next-intl" wurde nicht gefunden
Das Modul "next/navigation" wurde nicht gefunden
```

**Grund:** `node_modules/` fehlt noch

**Lösung:** Warte bis `npm install` fertig ist (2-5 Minuten)

---

## ✅ NACH NPM INSTALL

**VS Code neu laden:**
- Mac: `Cmd + Shift + P` → "Reload Window"
- Oder: VS Code schließen + neu öffnen

**Alle Fehler sollten WEG sein!** ✅

---

## 🔑 WICHTIG VOR DEM START

**Bearbeite `.env.local`:**

```bash
code .env.local
```

**Ändere diese Zeilen:**
```
NEXT_PUBLIC_SUPABASE_URL=https://cmoohnktsgszmuxxnobd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...  (dein Key)
```

**Hole Keys von:** https://supabase.com/dashboard → Settings → API

---

## 💾 DATENBANK SETUP

1. https://supabase.com/dashboard
2. SQL Editor
3. Kopiere ALLES aus `database/schema.sql`
4. Einfügen → RUN

---

## 🎉 FERTIG!

Wenn `npm run dev` läuft und http://localhost:3000 die Homepage zeigt:

**→ ALLES FUNKTIONIERT!** ✅

---

**Ausführliche Anleitung:** Siehe `FEHLER_BEHEBEN.md`
