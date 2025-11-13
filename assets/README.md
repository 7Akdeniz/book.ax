# Book.ax Assets

Dieser Ordner enthält alle App-Assets:

## Icon & Splash Screen

### icon.png (1024x1024)
- App-Icon für iOS und Android
- Sollte ein transparentes PNG sein
- Mindestgröße: 1024x1024px

### splash.png (1284x2778)
- Splash Screen beim App-Start
- Background-Farbe: #9C27B0 (Purple)
- Logo in der Mitte

### adaptive-icon.png (1024x1024)
- Adaptive Icon für Android
- Foreground: Logo
- Background: #9C27B0

### favicon.png (48x48)
- Favicon für Web-Version
- Mindestgröße: 48x48px

## Platzhalter erstellen

Bis Sie eigene Icons haben, können Sie Platzhalter verwenden:

### Online Generatoren:
- https://www.favicon-generator.org/
- https://www.appicon.co/
- https://expo.github.io/vector-icons/

### Oder verwenden Sie:
```bash
# Installieren Sie icon-gen
npm install -g icon-gen

# Generieren Sie Icons aus einem Logo
icon-gen -i logo.svg -o ./assets
```

## Farben für Design

- **Primary**: #9C27B0 (Purple)
- **Secondary**: #FFB300 (Gold)
- **Background**: #FFFFFF (White)

## Empfohlene Icon-Größen

| Datei | Größe | Verwendung |
|-------|-------|------------|
| icon.png | 1024x1024 | iOS & Android App Icon |
| splash.png | 1284x2778 | Splash Screen |
| adaptive-icon.png | 1024x1024 | Android Adaptive Icon |
| favicon.png | 48x48 | Web Favicon |

---

**Tipp**: Verwenden Sie vorerst einfache Platzhalter mit Ihrer Brand-Farbe #9C27B0
