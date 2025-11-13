# ⚠️ KRITISCH: ROOT DIRECTORY MUSS GESETZT SEIN!

## Das Problem

Der Fehler kommt, weil Vercel die `i18n/request.ts` nicht findet.

**GRUND:** Du hast die **Root Directory** im Vercel Dashboard noch nicht auf `book-ax-web` gesetzt!

---

## ✅ LÖSUNG - ROOT DIRECTORY SETZEN

### WICHTIG: Dies MUSS im Vercel Dashboard gemacht werden!

1. Öffne: https://vercel.com/bookax/settings
2. Scrolle zu **"Build & Development Settings"**
3. Finde **"Root Directory"**
4. Klicke **"Edit"** (Bleistift-Icon)
5. Gib ein: **`book-ax-web`**
6. Klicke **"Save"**

---

## 🎯 Warum ist das wichtig?

**OHNE Root Directory:**
```
Vercel sucht: /vercel/path0/i18n/request.ts
Datei ist in: /vercel/path0/book-ax-web/src/i18n/request.ts
❌ NICHT GEFUNDEN!
```

**MIT Root Directory = `book-ax-web`:**
```
Vercel sucht: /vercel/path0/book-ax-web/src/i18n/request.ts
Datei ist in: /vercel/path0/book-ax-web/src/i18n/request.ts
✅ GEFUNDEN!
```

---

## 📸 Screenshot-Hilfe

**So sieht es aus:**

```
Settings → General
  ↓
Build & Development Settings
  ↓
Root Directory: [        Edit       ]
                 ^^^^^^^
                 Hier klicken!
  ↓
[book-ax-web]  ← Eingeben
  ↓
[Save] ← Klicken
```

---

## ⚡ Nach dem Speichern

Vercel wird **AUTOMATISCH** ein neues Deployment starten.

**Das sollte dann funktionieren!**

---

## 🐛 Alternative (falls es immer noch nicht klappt)

Falls Root Directory nicht funktioniert, können wir auch:

1. Ein separates Vercel-Projekt nur für `book-ax-web/` erstellen
2. Oder die Projekt-Struktur umbauen

---

**ABER ZUERST: Setze die Root Directory im Dashboard!** ☝️

Ohne das wird es nicht funktionieren, egal was ich im Code ändere.
