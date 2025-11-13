# 🎨 Book.ax Design System

## Farbpalette

### Primärfarben

#### Primary - Purple
```
#9C27B0  ██████  RGB(156, 39, 176)
```
**Verwendung**: Hauptfarbe, Branding, primäre Buttons, Navigation
**Psychologie**: Luxus, Kreativität, Premium, Moderne

#### Primary Dark
```
#7B1FA2  ██████  RGB(123, 31, 162)
```
**Verwendung**: Hover-States, aktive Buttons, Schatten

#### Primary Light
```
#BA68C8  ██████  RGB(186, 104, 200)
```
**Verwendung**: Highlights, Backgrounds, disabled States

---

### Sekundärfarben

#### Secondary - Amber Gold
```
#FFB300  ██████  RGB(255, 179, 0)
```
**Verwendung**: Bewertungen (Sterne), Premium-Features, Highlights
**Psychologie**: Warmth, Optimismus, Premium-Qualität

#### Accent - Vibrant Orange
```
#FF6B35  ██████  RGB(255, 107, 53)
```
**Verwendung**: Call-to-Action, wichtige Aktionen, Badges
**Psychologie**: Energie, Begeisterung, Dringlichkeit

---

### Status-Farben

#### Success
```
#4CAF50  ██████  RGB(76, 175, 80)
```
**Verwendung**: Erfolgsmeldungen, Bestätigungen, verfügbar

#### Error
```
#F44336  ██████  RGB(244, 67, 54)
```
**Verwendung**: Fehlermeldungen, Validierung, kritische Aktionen

#### Warning
```
#FF9800  ██████  RGB(255, 152, 0)
```
**Verwendung**: Warnungen, wichtige Hinweise

#### Info
```
#2196F3  ██████  RGB(33, 150, 243)
```
**Verwendung**: Informationen, Tipps, neutrale Meldungen

---

## Farbkombinationen

### Hero-Sections
- **Background**: Primary (#9C27B0)
- **Text**: White (#FFFFFF)
- **CTA Button**: Secondary (#FFB300)

### Cards
- **Background**: White (#FFFFFF)
- **Border**: Gray300 (#E0E0E0)
- **Text**: TextPrimary (#212121)
- **Price**: Primary (#9C27B0)
- **Rating Stars**: Secondary (#FFB300)

### Buttons

#### Primary Button
- **Background**: Primary (#9C27B0)
- **Text**: White (#FFFFFF)
- **Hover**: PrimaryDark (#7B1FA2)

#### Secondary Button
- **Background**: Secondary (#FFB300)
- **Text**: Gray900 (#212121)
- **Hover**: #E6A000

#### Accent Button (CTA)
- **Background**: Accent (#FF6B35)
- **Text**: White (#FFFFFF)
- **Hover**: #E65D2F

---

## Typography

### Schriftarten
- **Primary**: Roboto, sans-serif
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI"

### Größen & Gewichte
```typescript
h1: { fontSize: 32, fontWeight: 'bold', color: textPrimary }
h2: { fontSize: 24, fontWeight: 'bold', color: textPrimary }
h3: { fontSize: 20, fontWeight: '600', color: textPrimary }
body: { fontSize: 16, fontWeight: 'normal', color: textPrimary }
caption: { fontSize: 14, fontWeight: 'normal', color: textSecondary }
small: { fontSize: 12, fontWeight: 'normal', color: textSecondary }
```

### Verwendungsbeispiele
- **Screen Titel**: h1, Primary Color
- **Section Header**: h2, TextPrimary
- **Card Titel**: h3, TextPrimary
- **Body Text**: body, TextPrimary
- **Untertitel**: caption, TextSecondary
- **Labels**: small, TextSecondary

---

## Abstände (Spacing)

```typescript
xs: 4px    ▯
sm: 8px    ▯▯
md: 16px   ▯▯▯▯
lg: 24px   ▯▯▯▯▯▯
xl: 32px   ▯▯▯▯▯▯▯▯
xxl: 48px  ▯▯▯▯▯▯▯▯▯▯▯▯
```

### Verwendung
- **Padding (Buttons)**: sm (8px) vertical, md (16px) horizontal
- **Card Padding**: md (16px) - lg (24px)
- **Section Margins**: lg (24px) - xxl (48px)
- **Icon-Text Gap**: sm (8px)

---

## Border Radius

```typescript
small: 4px    ┌─┐
medium: 8px   ┌──┐
large: 12px   ┌───┐
xl: 16px      ┌────┐
circle: 9999px  ●
```

### Verwendung
- **Buttons**: medium (8px)
- **Cards**: large (12px)
- **Input Fields**: medium (8px)
- **Profile Images**: circle
- **Badges**: xl (16px)

---

## Schatten (Shadows)

### Small
```typescript
shadowColor: '#000',
shadowOffset: { width: 0, height: 1 },
shadowOpacity: 0.18,
shadowRadius: 1.0,
elevation: 1,
```
**Verwendung**: Kleine Cards, Inputs (Focus)

### Medium
```typescript
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.23,
shadowRadius: 2.62,
elevation: 4,
```
**Verwendung**: Standard Cards, Buttons

### Large
```typescript
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.30,
shadowRadius: 4.65,
elevation: 8,
```
**Verwendung**: Modals, Floating Buttons, wichtige Elemente

---

## Komponenten-Stile

### Button Variants

#### Primary
```typescript
{
  backgroundColor: colors.primary,     // #9C27B0
  paddingVertical: spacing.sm,         // 8px
  paddingHorizontal: spacing.md,       // 16px
  borderRadius: borderRadius.medium,   // 8px
}
```

#### Secondary
```typescript
{
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: colors.primary,         // #9C27B0
  color: colors.primary,
}
```

#### Outline
```typescript
{
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: colors.gray400,         // #BDBDBD
  color: colors.textPrimary,
}
```

---

### Hotel Card
```typescript
{
  backgroundColor: colors.white,
  borderRadius: borderRadius.large,     // 12px
  padding: spacing.md,                  // 16px
  shadowColor: shadows.medium,
  borderWidth: 1,
  borderColor: colors.gray300,          // #E0E0E0
}
```

**Elemente**:
- Image: borderRadius.medium (8px)
- Name: h3, textPrimary
- Location: caption, textSecondary
- Price: h3, primary (#9C27B0)
- Rating Stars: secondary (#FFB300)

---

## Gradients (Optional für Premium-Look)

### Primary Gradient
```typescript
colors: ['#9C27B0', '#7B1FA2']
start: { x: 0, y: 0 }
end: { x: 1, y: 1 }
```
**Verwendung**: Hero-Sections, Premium-Badges

### Secondary Gradient
```typescript
colors: ['#FFB300', '#FF9800']
start: { x: 0, y: 0 }
end: { x: 1, y: 0 }
```
**Verwendung**: Premium-Features, Special Offers

---

## Accessibility (Barrierefreiheit)

### Kontrast-Ratios (WCAG AA)
- **Primary auf White**: ✅ 5.8:1 (AA Large Text)
- **TextPrimary auf White**: ✅ 16.1:1 (AAA)
- **White auf Primary**: ✅ 5.8:1 (AA)
- **Secondary auf White**: ⚠️ 2.1:1 (nur für große Texte)

### Empfehlungen
- Verwenden Sie **Primary (#9C27B0)** für Buttons mit weißem Text
- **Secondary (#FFB300)** nur für Icons, nicht für Text auf weißem Hintergrund
- **TextPrimary (#212121)** für alle wichtigen Texte

---

## Dark Mode (Zukünftig)

### Angepasste Farben
```typescript
darkMode: {
  background: '#121212',
  surface: '#1E1E1E',
  primary: '#BA68C8',        // Helleres Purple
  secondary: '#FFD54F',      // Helleres Gold
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
}
```

---

## Export für Code

```typescript
// src/utils/theme.ts
export const colors = {
  primary: '#9C27B0',
  primaryDark: '#7B1FA2',
  primaryLight: '#BA68C8',
  secondary: '#FFB300',
  accent: '#FF6B35',
  // ... siehe vollständige theme.ts
};
```

---

## Figma / Sketch Variables

```
--color-primary: #9C27B0
--color-primary-dark: #7B1FA2
--color-primary-light: #BA68C8
--color-secondary: #FFB300
--color-accent: #FF6B35
--spacing-md: 16px
--radius-medium: 8px
```

---

**Letzte Aktualisierung**: 13. November 2025  
**Version**: 2.0 (Purple Theme)
