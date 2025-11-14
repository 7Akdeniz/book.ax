# Integration in Book.ax Web App

## 🔗 Content Automation in Next.js integrieren

### Option 1: Node.js Integration (Server-Side)

#### 1. Utility-Funktion erstellen

Erstelle `book-ax-web/src/lib/content-generator.ts`:

```typescript
import { execSync } from 'child_process';
import path from 'path';

const AUTOMATION_PATH = path.join(process.cwd(), '../content-automation');

export interface ContentOptions {
  type: 'blog' | 'landing' | 'social' | 'ads' | 'guide' | 'hotelDescription' | 'microPost' | 'faq' | 'richSnippet' | 'all';
  city: string;
  language?: string;
  platform?: string;
  keyword?: string;
}

export function generateContent(options: ContentOptions): string {
  const { type, city, language = 'de', platform, keyword } = options;
  
  let command = `cd ${AUTOMATION_PATH} && node generator.js`;
  command += ` --type=${type}`;
  command += ` --city="${city}"`;
  command += ` --language=${language}`;
  
  if (platform) command += ` --platform=${platform}`;
  if (keyword) command += ` --keyword="${keyword}"`;
  
  try {
    const output = execSync(command, { 
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024 // 10MB
    });
    
    return output;
  } catch (error) {
    console.error('Content generation failed:', error);
    throw new Error('Failed to generate content');
  }
}

export function getGeneratedFilePath(type: string, city: string): string {
  const date = new Date().toISOString().split('T')[0];
  return path.join(AUTOMATION_PATH, 'generated-content', `${type}-${city}-${date}.md`);
}
```

#### 2. API Route erstellen

Erstelle `book-ax-web/src/app/api/generate-content/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { generateContent, getGeneratedFilePath } from '@/lib/content-generator';
import fs from 'fs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, city, language, platform, keyword } = body;
    
    // Validierung
    if (!type || !city) {
      return NextResponse.json(
        { error: 'Missing required fields: type, city' },
        { status: 400 }
      );
    }
    
    // Content generieren
    const output = generateContent({
      type,
      city,
      language,
      platform,
      keyword
    });
    
    // Generierte Datei lesen
    const filePath = getGeneratedFilePath(type, city);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Schema-Datei lesen (falls vorhanden)
    let schema = null;
    const schemaPath = filePath.replace('.md', '.schema.json');
    if (fs.existsSync(schemaPath)) {
      schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
    }
    
    return NextResponse.json({
      success: true,
      content,
      schema,
      filePath
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Content generation failed' },
      { status: 500 }
    );
  }
}
```

#### 3. Client-Component erstellen

Erstelle `book-ax-web/src/components/ContentGenerator.tsx`:

```typescript
'use client';

import { useState } from 'react';

interface ContentGeneratorProps {
  defaultCity?: string;
  defaultType?: string;
}

export function ContentGenerator({ 
  defaultCity = 'Berlin',
  defaultType = 'blog' 
}: ContentGeneratorProps) {
  const [city, setCity] = useState(defaultCity);
  const [type, setType] = useState(defaultType);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, city })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult(data.content);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to generate content');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#9C27B0' }}>
        Content Generator
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Content-Type
          </label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="blog">Blog-Artikel</option>
            <option value="landing">Landing Page</option>
            <option value="social">Social Media</option>
            <option value="ads">Ads-Text</option>
            <option value="guide">Reise-Guide</option>
            <option value="faq">FAQ-Block</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Stadt
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="z.B. Berlin"
          />
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 px-6 text-white rounded font-medium disabled:opacity-50"
          style={{ backgroundColor: '#9C27B0' }}
        >
          {loading ? 'Generiere...' : 'Content generieren'}
        </button>
        
        {error && (
          <div className="p-4 bg-red-50 text-red-800 rounded">
            {error}
          </div>
        )}
        
        {result && (
          <div className="mt-4">
            <h3 className="font-bold mb-2">Generierter Content:</h3>
            <pre className="p-4 bg-gray-50 rounded overflow-auto max-h-96 text-sm">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
```

#### 4. Verwendung in Page

```typescript
// book-ax-web/src/app/[locale]/admin/content/page.tsx
import { ContentGenerator } from '@/components/ContentGenerator';

export default function ContentPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">
        Content Automation
      </h1>
      <ContentGenerator />
    </div>
  );
}
```

---

### Option 2: Standalone API Service

#### Docker Container (Empfohlen für Production)

Erstelle `content-automation/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["node", "api-server.js"]
```

Erstelle `content-automation/api-server.js`:

```javascript
import express from 'express';
import cors from 'cors';
import templates from './templates.js';
import { BRAND } from './config.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Book.ax Content Automation' });
});

// Generate Content
app.post('/api/generate', (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (!type || !templates[type]) {
      return res.status(400).json({ error: 'Invalid content type' });
    }
    
    const result = templates[type](data || {});
    
    res.json({
      success: true,
      type,
      result
    });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: 'Content generation failed' });
  }
});

// Batch Generate
app.post('/api/batch-generate', (req, res) => {
  try {
    const { types, cities } = req.body;
    
    const results = [];
    
    for (const city of cities) {
      for (const type of types) {
        if (templates[type]) {
          results.push({
            city,
            type,
            content: templates[type]({ city })
          });
        }
      }
    }
    
    res.json({
      success: true,
      count: results.length,
      results
    });
  } catch (error) {
    console.error('Batch generation error:', error);
    res.status(500).json({ error: 'Batch generation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Book.ax Content API running on port ${PORT}`);
});
```

#### Docker Compose Integration

Füge zu `book-ax-web/docker-compose.yml` hinzu:

```yaml
version: '3.8'

services:
  web:
    # ... existing Next.js config
    
  content-api:
    build: ../content-automation
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    networks:
      - bookax-network

networks:
  bookax-network:
    driver: bridge
```

---

### Option 3: Vercel Edge Function

Erstelle `book-ax-web/src/app/api/edge-generate/route.ts`:

```typescript
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Simplified template for Edge Runtime (no fs, child_process)
const simpleTemplate = (city: string) => `
# Hotels in ${city} vergleichen – moderne Hotelsuchmaschine

Kurze Reise? Lange Suche? Book.ax macht Hotelsuchen klar, modern und transparent.

## Warum Book.ax für deine ${city}-Suche?

✓ Hotelpreise weltweit vergleichen
✓ Bestpreis-Fokus
✓ Schnell, modern, transparent
✓ Über 500.000+ Hotels weltweit

💜 Jetzt Hotels vergleichen auf Book.ax
`;

export async function POST(req: NextRequest) {
  const { city } = await req.json();
  
  const content = simpleTemplate(city);
  
  return new Response(JSON.stringify({ content }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

---

## 🔄 Automatische Content-Pipeline

### GitHub Actions Workflow

Erstelle `.github/workflows/generate-content.yml`:

```yaml
name: Generate Content

on:
  schedule:
    - cron: '0 9 * * 1' # Jeden Montag 9 Uhr
  workflow_dispatch:
    inputs:
      city:
        description: 'Stadt für Content'
        required: true
        default: 'Berlin'

jobs:
  generate:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd content-automation
          npm ci
      
      - name: Generate Content
        run: |
          cd content-automation
          node generator.js --type=all --city=${{ github.event.inputs.city || 'Berlin' }}
      
      - name: Commit generated content
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add content-automation/generated-content/
          git commit -m "Auto-generate content for ${{ github.event.inputs.city || 'Berlin' }}"
          git push
```

---

## 📊 Analytics Integration

### Track Content Performance

```typescript
// book-ax-web/src/lib/analytics.ts
export function trackContentGeneration(type: string, city: string) {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'content_generated', {
      content_type: type,
      city: city,
      timestamp: new Date().toISOString()
    });
  }
  
  // Plausible
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible('Content Generated', {
      props: { type, city }
    });
  }
}
```

---

## 🎯 Best Practices

### 1. Caching
```typescript
// Redis Cache für generierte Inhalte
import { redis } from '@/lib/redis';

const cacheKey = `content:${type}:${city}:${language}`;
const cached = await redis.get(cacheKey);

if (cached) return cached;

const content = generateContent({ type, city, language });
await redis.set(cacheKey, content, 'EX', 86400); // 24h
```

### 2. Rate Limiting
```typescript
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m') // 10 requests per minute
});
```

### 3. Queue System
```typescript
// BullMQ für asynchrone Generierung
import { Queue } from 'bullmq';

const contentQueue = new Queue('content-generation', {
  connection: redis
});

await contentQueue.add('generate', {
  type: 'blog',
  city: 'Berlin'
});
```

---

## 💜 Fertig!

Die Content Automation ist jetzt vollständig in Book.ax integriert.

**Next Steps**:
1. API Route testen: `POST /api/generate-content`
2. Admin-Dashboard erstellen
3. Content-Scheduler einrichten
4. Performance monitoring

Jetzt Hotels vergleichen auf Book.ax! 🚀
