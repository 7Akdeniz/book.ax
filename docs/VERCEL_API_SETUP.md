# 🔑 Vercel API Token Setup

## So gibst du mir Zugriff auf dein Vercel-Deployment:

### Schritt 1: Token erstellen

1. Gehe zu: https://vercel.com/account/tokens
2. Klicke **"Create Token"**
3. Name: `GitHub Copilot Access`
4. Scope: **Read-only** (nur lesen, kein Deploy!)
5. Expiration: `7 days`
6. Klicke **"Create"**
7. **Kopiere den Token** (wird nur einmal angezeigt!)

### Schritt 2: Token hier speichern

Erstelle eine `.env.vercel` Datei:

```bash
# Im Root-Verzeichnis
echo "VERCEL_TOKEN=dein-token-hier" > .env.vercel
```

**WICHTIG:** Diese Datei wird automatisch von `.gitignore` ignoriert!

### Schritt 3: Ich kann dann:

- ✅ Deployment Status abrufen
- ✅ Build Logs lesen
- ✅ Fehler automatisch erkennen
- ✅ Dir genau sagen was schief läuft

---

## Alternative: Manuell checken

Wenn du mir keinen Token geben willst (völlig OK!), kannst du auch einfach:

1. Öffne: https://vercel.com/bookax/deployments
2. Sag mir den Status:
   - 🟢 "Ready"
   - 🟡 "Building..."
   - 🔴 "Error" (dann kopiere den Fehler)

---

**Was möchtest du machen?**
- A) Token erstellen (dann kann ich automatisch checken)
- B) Manuell Status sagen (schneller, kein Setup)
