# AI Coding Agent Instructions

## Projektkontext

Dies ist eine **React Native Buchungsplattform** (ähnlich Booking.com) für iOS und Android. Die App ermöglicht Hotel-Suche, Buchungen und Zahlungsabwicklung.

## Architektur

### Feature-basierte Struktur
- **Organisation**: Code ist nach Features organisiert (`src/features/*`), nicht nach technischer Schicht
- **Feature-Module** enthalten: `components/`, `screens/`, `hooks/`, `types.ts`, `slice.ts` (Redux)
- **Shared Code**: Wiederverwendbare Komponenten in `src/components/`, Utils in `src/utils/`

### State Management
- **Redux Toolkit** für globalen App-State (Authentifizierung, Buchungen, etc.)
- **React Context** für Theme und App-Konfiguration
- Verwende `useSelector` und `useDispatch` Hooks, nicht `connect()`

### Navigation
- **React Navigation v6** mit TypeScript
- Stack Navigator für Feature-Flows, Bottom Tabs für Hauptnavigation
- Typisierte Navigation: Definiere `RootStackParamList` in `src/navigation/types.ts`
- Navigation-Props immer typisieren: `NavigationProp<RootStackParamList, 'ScreenName'>`

## TypeScript Patterns

```typescript
// Komponenten immer mit React.FC oder explizitem Return-Type
const HotelCard: React.FC<HotelCardProps> = ({hotel, onPress}) => { ... };

// Path Aliases verwenden (konfiguriert in tsconfig.json)
import {Button} from '@components/Button';
import {useAuth} from '@features/auth/hooks/useAuth';
import {Hotel} from '@types/models';

// Strikte Typisierung für API-Responses
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
```

## Komponenten-Konventionen

### Dateiorganisation
```
ComponentName/
├── ComponentName.tsx          # Komponente
├── ComponentName.styles.ts    # Styles
├── ComponentName.test.tsx     # Tests
└── index.ts                   # Export
```

### Styling
- Verwende **StyleSheet.create()** für Performance
- Co-locate Styles: `ComponentName.styles.ts` neben Komponente
- Theme-Farben/Spacing aus zentralem Theme (Context)
- Responsive mit `Dimensions.get('window')` oder `useWindowDimensions()`

```typescript
// ComponentName.styles.ts
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
```

### Custom Hooks Pattern
```typescript
// src/features/auth/hooks/useAuth.ts
export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  
  const login = async (email: string, password: string) => {
    // Implementation
  };
  
  return {user, login, logout};
};
```

## API-Integration

### Service-Struktur
- Zentrale API-Konfiguration in `src/services/api.ts`
- Feature-spezifische Services: `src/features/*/services/`
- Axios für HTTP mit Interceptors für Auth-Token

```typescript
// src/services/api.ts Pattern
import axios from 'axios';

const api = axios.create({
  baseURL: __DEV__ ? 'http://localhost:3000/api' : 'https://api.production.com',
});

api.interceptors.request.use(config => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

## Entwickler-Workflows

### App starten
```bash
npm start              # Metro Bundler
npm run ios            # iOS Simulator
npm run android        # Android Emulator
```

### Häufige Issues
- **Metro Cache**: `npm start -- --reset-cache` bei Build-Problemen
- **iOS Pods**: `cd ios && pod install && cd ..` nach Package-Updates
- **Android Clean**: `cd android && ./gradlew clean && cd ..`

### Debugging
- **React DevTools**: Automatisch mit Metro
- **Flipper**: Für Network-Debugging, Redux-State-Inspection
- **Console Logs**: Vermeiden in Production - verwende `__DEV__` Flag

## Feature-spezifische Patterns

### Authentication Flow
- Token in AsyncStorage speichern
- Auto-Login bei App-Start in `App.tsx`
- Protected Routes mit Navigation Guards

### Search Feature
- Debounce bei Sucheingabe (300ms)
- Filter-State in Redux für Persistenz
- Lazy Loading mit FlatList für große Listen

### Booking Flow
- Multi-Step Form mit Navigation
- State Persistence bei Navigation zurück
- Validierung vor jedem Step-Übergang

### Payments
- Niemals Kreditkartendaten direkt speichern
- Verwende Payment-Provider SDK (Stripe/PayPal)
- PCI-DSS Compliance beachten

## Performance Best Practices

- **FlatList** statt ScrollView für lange Listen mit `getItemLayout` wenn möglich
- **React.memo()** für teure Komponenten
- **useMemo/useCallback** für Optimierungen, aber nicht überall
- **Image-Optimierung**: Komprimierte Assets, `react-native-fast-image` für Remote-Images
- **Bundle Size**: Nur benötigte Icons importieren (`react-native-vector-icons`)

## Testing

```bash
npm test               # Jest Unit Tests
```

- **Unit Tests** für Utils, Hooks, Redux Slices
- **Component Tests** mit React Testing Library
- Test-Files neben Source-Files: `Component.test.tsx`

## Code-Qualität

```bash
npm run lint           # ESLint
npx tsc --noEmit       # TypeScript Type-Check
```

- **ESLint** mit React Native Config
- **Prettier** für Formatierung (2 Spaces, Single Quotes)
- Pre-commit Hooks (optional) für automatisches Linting

## Platform-Spezifisches

### iOS
- Minimum iOS 13.0
- Permissions in `ios/Bookax/Info.plist` (Location, Camera, etc.)
- Deep Linking: URL Schemes in Xcode konfigurieren

### Android
- Minimum SDK 21 (Android 5.0)
- Permissions in `android/app/src/main/AndroidManifest.xml`
- Gradle Build Variants für Dev/Staging/Prod

## Wichtige Hinweise

- **Keine Inline-Styles** in JSX - immer StyleSheet verwenden
- **TypeScript Strict Mode** ist aktiviert - keine `any` Types
- **Navigation** immer typisiert - verwende definierte Param-Lists
- **AsyncStorage** für kleine Daten, Realm/SQLite für größere Datenmengen
- **Environment Variables**: React Native Config für API-URLs, Keys
- **Secrets**: Niemals API-Keys im Code - verwende `.env` Files (nicht committen)

## Nützliche Befehle für AI Agents

```bash
# Projekt-Struktur anzeigen
tree -L 3 -I 'node_modules|ios/Pods'

# Dependencies aktualisieren
npm update

# Type-Check vor Commits
npx tsc --noEmit

# iOS-Logs live anzeigen
npx react-native log-ios

# Android-Logs live anzeigen
npx react-native log-android
```
