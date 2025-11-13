# 🔄 Ordner physisch umbenennen (Optional)

## Wichtig!

Die Dokumentation wurde bereits aktualisiert (alle "B_Imo_co" → "Book.ax").

Falls Sie auch den **physischen Ordner** umbenennen möchten:

---

## Option 1: Im Finder (macOS)

1. Öffnen Sie den Finder
2. Navigieren Sie zu `/Users/alanbest/`
3. Rechtsklick auf `B_Imo_co`
4. Wählen Sie "Umbenennen"
5. Ändern Sie zu: `Book.ax`
6. Enter drücken

---

## Option 2: Im Terminal

```bash
# Wechseln Sie ins übergeordnete Verzeichnis
cd /Users/alanbest

# Ordner umbenennen
mv B_Imo_co Book.ax

# Bestätigen
ls -la | grep Book
```

**Ergebnis**: Sie sollten `Book.ax` sehen

---

## Nach dem Umbenennen

### 1. VS Code neu öffnen
```bash
cd /Users/alanbest/Book.ax
code .
```

### 2. Terminal-Pfade aktualisieren

Falls Sie Terminals offen haben:
```bash
# Neuer Pfad
cd /Users/alanbest/Book.ax
```

### 3. Git Repository (falls vorhanden)

Git funktioniert weiterhin, da nur der Ordnername geändert wurde:
```bash
cd /Users/alanbest/Book.ax
git status  # Sollte funktionieren
```

---

## Keine Änderungen nötig in:

- ✅ package.json (enthält nur App-Namen, nicht Ordner-Namen)
- ✅ Alle Code-Dateien (verwenden relative Pfade)
- ✅ Git-Repository (funktioniert mit neuem Ordner-Namen)
- ✅ node_modules (bleiben erhalten)

---

## Wenn Sie den Ordner NICHT umbenennen

Kein Problem! Die Dokumentation funktioniert trotzdem:
- Alle Copy-Befehle in NATIVE_SETUP.md verwenden `Book.ax`
- Sie müssen die Befehle anpassen auf `B_Imo_co`

**Beispiel**:
```bash
# Dokumentation sagt:
cp -r ../Book.ax/src ./

# Sie verwenden:
cp -r ../B_Imo_co/src ./
```

---

## Empfehlung

✅ **Umbenennen Sie den Ordner zu "Book.ax"**

**Gründe**:
1. Konsistenz mit App-Namen
2. Dokumentation passt perfekt
3. Professioneller
4. Keine Verwirrung

---

_Letzte Aktualisierung: 13. November 2025_
