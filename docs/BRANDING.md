# 🎨 Book.ax Branding & Design

## Brand Identity

### App Name
- **Offizieller Name**: Book.ax
- **Package Name**: bookax
- **Display Name**: Book.ax
- **Beschreibung**: Premium Hotel Buchungsplattform mit modernem Design
- **Tagline**: "Your Journey, Perfected" / "Deine Reise, Perfektioniert"

### Brand Persönlichkeit
- **Modern**: Zeitgemäßes, frisches Design
- **Premium**: Hochwertig, aber zugänglich
- **Vertrauensvoll**: Sicher und zuverlässig
- **Innovativ**: Nutzerfreundliche Technologie

### Logo & Farben

#### Primärfarben (aus theme.ts)
```typescript
colors = {
  primary: '#9C27B0',      // Purple - Modern, Premium & Kreativ
  primaryDark: '#7B1FA2',  // Dunkleres Purple für Hover/Active
  primaryLight: '#BA68C8', // Helleres Purple für Highlights
  
  secondary: '#FFB300',    // Amber Gold - Warmth & Premium
  accent: '#FF6B35',       // Orange - Call-to-Action
  
  // Status
  success: '#4CAF50',      // Grün - Erfolg
  error: '#F44336',        // Rot - Fehler
  warning: '#FF9800',      // Orange - Warnung
  info: '#2196F3',         // Blau - Info
}
```

#### Farbpsychologie
- **Purple (#9C27B0)**: Luxus, Kreativität, Moderne
- **Gold (#FFB300)**: Premium-Qualität, Vertrauen
- **Orange (#FF6B35)**: Energie, Aktion, Begeisterung

#### Verwendungsrichtlinien
- **Primary (Purple)**: Hauptfarbe für Buttons, Navigation, Branding
- **Secondary (Gold)**: Highlights, Bewertungen, Premium-Features
- **Accent (Orange)**: Call-to-Action, wichtige Buttons
- **Neutrals**: Text, Hintergründe, Borders

### Design Philosophie
- **Modern**: Klare Linien, viel Weißraum
- **Premium**: Hochwertige Bildsprache
- **User-Friendly**: Intuitive Navigation
- **Mobile-First**: Optimiert für Touch-Interfaces

### Typography
```typescript
typography = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 24, fontWeight: 'bold' },
  h3: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: 'normal' },
  caption: { fontSize: 14, fontWeight: 'normal' },
  small: { fontSize: 12, fontWeight: 'normal' },
}
```

## Naming Conventions

### In Code
- **Package**: `bookax` (lowercase, no special chars)
- **Components**: `BookaxButton`, `BookaxCard`
- **Namespace**: `@bookax/*` (für interne Packages)

### In Stores
- **iOS App Store**: "Book.ax - Hotels & Travel"
- **Google Play**: "Book.ax - Hotels & Travel"
- **Bundle ID (iOS)**: `com.bookax.app`
- **Application ID (Android)**: `com.bookax.app`

## Assets Locations

```
assets/
├── images/
│   ├── logo.png           # App-Logo (1024x1024)
│   ├── logo-white.png     # Weißes Logo für dunkle BG
│   ├── splash.png         # Splash Screen
│   └── icon.png           # App-Icon
└── fonts/
    ├── Roboto-Regular.ttf
    ├── Roboto-Bold.ttf
    └── Roboto-Medium.ttf
```

## App Store Metadata

### Keywords (App Store Optimization)
- Hotel booking
- Travel app
- Accommodation
- Vacation rentals
- Book hotels
- Travel deals

### Category
- **Primary**: Travel
- **Secondary**: Lifestyle

### Age Rating
- 4+ (keine problematischen Inhalte)

## Social Media Handles (für spätere Nutzung)
- Twitter: @bookax_app
- Instagram: @bookax_official
- Facebook: /bookaxapp
- Website: www.bookax.com (reserviert)

---

**Brand Farbe Update**: Falls Sie die Primärfarbe ändern möchten, aktualisieren Sie `src/utils/theme.ts`.
