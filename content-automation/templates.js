/**
 * Content Templates für Book.ax
 * Jedes Template folgt AIO-Prinzipien und Book.ax Branding
 */

import { BRAND, SEO } from './config.js';

export const templates = {
  
  // ============================================
  // BLOG ARTIKEL TEMPLATE
  // ============================================
  blog: (data) => {
    const { city = 'Berlin', keyword = 'Hotels', country = 'Deutschland' } = data;
    
    return {
      seo: {
        title: `${keyword} in ${city} finden – Hotelsuchmaschine Book.ax | ${BRAND.cta}`,
        meta: `Book.ax vergleicht ${keyword.toLowerCase()} in ${city} weltweit in Sekunden. Schnell, modern, transparent. ${BRAND.cta}.`,
        h1: `${keyword} in ${city} vergleichen – moderne Hotelsuchmaschine`,
        keywords: [...SEO.lsiKeywords, `hotels ${city}`, `${city} hotel vergleich`, `günstige hotels ${city}`]
      },
      
      content: `
# ${keyword} in ${city} vergleichen – moderne Hotelsuchmaschine

Kurze Reise? Lange Suche? Book.ax macht Hotelsuchen klar, modern und transparent.

## Warum Book.ax für deine ${city}-Suche?

${BRAND.benefits.map(b => `✓ ${b}`).join('\n')}

Hotels in ${city} gibt es viele. Den besten Preis zu finden, dauert normalerweise Stunden.

Book.ax ändert das.

## So funktioniert der Preisvergleich

**Schritt 1**: Gib ${city} ein.
**Schritt 2**: Wähle Datum und Gäste.
**Schritt 3**: Sieh alle Preise auf einen Blick.

Schnell. Weltweit. Bestpreis-Alert inklusive.

## Top 5 Hotel-Kategorien in ${city}

1. **Luxus-Hotels** – Komfort mit Bestpreis-Garantie
2. **Business-Hotels** – Perfekt für Geschäftsreisen
3. **Familienhotels** – Platz und Kinderfreundlichkeit
4. **Boutique-Hotels** – Charakter und Stil
5. **Budget-Hotels** – Günstig, aber gut

Jede Kategorie auf Book.ax vergleichbar. Jeder Preis transparent.

## Insider-Tipps für ${city}

- Früh buchen spart bis zu 40%
- Midweek-Aufenthalte sind günstiger
- Nutze den Book.ax Bestpreis-Alert
- Vergleiche auch Nachbarstadtteile

## 💜 ${BRAND.cta}

Fokussiert auf Bestpreise, nicht auf Klicks.

Starte jetzt. Modern. Schnell. Transparent.

## Häufige Fragen zu Hotels in ${city}

**Was macht Book.ax einzigartig?**
Book.ax vergleicht über 500.000 Hotels weltweit in Sekunden. Transparent, ohne versteckte Kosten. ${BRAND.cta}.

**Kann ich Hotels weltweit vergleichen?**
Ja! Book.ax deckt ${city}, ${country} und weltweit alle großen Destinationen ab.

**Wie sicher sind die Preise?**
Alle Preise sind live und direkt von Partnern. Keine versteckten Gebühren. Bestpreis-Garantie.

**Gibt es versteckte Kosten?**
Nein. Was du siehst, ist was du zahlst. Transparenz ist unser Versprechen.

**Kann ich auch Last-Minute buchen?**
Absolut! Book.ax zeigt auch Last-Minute-Deals in ${city}.

---

**Ready?** ${BRAND.cta} 💜
`,
      
      schema: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: `${keyword} in ${city} finden – Hotelsuchmaschine Book.ax`,
        description: `Vergleiche ${keyword.toLowerCase()} in ${city} mit Book.ax. Schnell, transparent, Bestpreis-Fokus.`,
        author: {
          '@type': 'Organization',
          name: 'Book.ax'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Book.ax',
          logo: {
            '@type': 'ImageObject',
            url: 'https://book-ax.vercel.app/logo.png'
          }
        }
      }
    };
  },
  
  // ============================================
  // LANDING PAGE TEMPLATE
  // ============================================
  landing: (data) => {
    const { city = 'München', season = 'Sommer' } = data;
    
    return {
      seo: {
        title: `${city} Hotels ${season} – Bestpreise finden | Book.ax`,
        meta: `Die modernste Hotelsuchmaschine für ${city}. Schnelles Matching, transparente Tarife, Bestpreis-Garantie. ${BRAND.cta}.`,
        h1: `Hotels in ${city} – Preisvergleich leicht gemacht`
      },
      
      content: `
# Hotels in ${city} – Preisvergleich leicht gemacht

**Die modernste Art, Hotelpreise weltweit zu vergleichen.**

Schnelles Matching · Transparente Tarife · Bestpreis-Garantie

## Warum Reisende Book.ax lieben

<div style="border-left: 4px solid ${BRAND.color}; padding-left: 16px;">

📍 **500.000+ Hotels weltweit**
Inklusive ${city} und alle Top-Destinationen

⚡ **Live-Preisvergleich**
Echtzeitdaten von allen großen Anbietern

💰 **Bestpreis-Garantie**
Wenn du woanders günstiger findest, erstatten wir die Differenz

🔒 **Sicherer Checkout**
SSL-verschlüsselt, keine Kreditkarte nötig zum Vergleichen

</div>

## So sparst du mit Book.ax

| Traditionelle Suche | Mit Book.ax |
|---------------------|-------------|
| 5+ Tabs offen | 1 Tab |
| 30+ Minuten | 2 Minuten |
| Unsicherheit | Bestpreis-Garantie |
| Versteckte Kosten? | 100% transparent |

## ${city}-Hotels im Vergleich

Beispiel-Szenario: 2 Personen, 3 Nächte im ${season}

- **Anbieter A**: 450 €
- **Anbieter B**: 420 €
- **Book.ax Bestpreis**: **389 €** ✓

<div style="background: ${BRAND.color}10; border: 2px solid ${BRAND.color}; padding: 20px; border-radius: 8px; margin: 20px 0;">

### 💜 ${BRAND.cta}

**Keine Anmeldung nötig · Sofort starten**

</div>

## Häufige Fragen

**Ist Book.ax kostenlos?**
Ja, der Vergleich ist 100% kostenlos. Keine versteckten Gebühren.

**Wie aktuell sind die Preise?**
Live-Daten direkt von Partnern. Immer aktuell.

**Kann ich auch spontan buchen?**
Absolut! Book.ax zeigt auch Last-Minute-Angebote.

---

Ready für ${city}? ${BRAND.cta} 💜
`,
      
      schema: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Ist Book.ax kostenlos?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ja, der Vergleich ist 100% kostenlos. Keine versteckten Gebühren.'
            }
          },
          {
            '@type': 'Question',
            name: 'Wie aktuell sind die Preise?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Live-Daten direkt von Partnern. Immer aktuell.'
            }
          }
        ]
      }
    };
  },
  
  // ============================================
  // SOCIAL MEDIA TEMPLATES
  // ============================================
  social: (data) => {
    const { platform = 'instagram', city = 'Wien', deal = '30%' } = data;
    
    const posts = {
      instagram: `Schnell, modern, transparent – Book.ax vergleicht Hotelpreise in ${city} weltweit in Sekunden. 

Du sparst Zeit und bekommst den Bestpreis. 

Ready? ${BRAND.cta} 💜✈️

#Bookax #Hotelvergleich #Bestpreis #${city} #Reisen #Hotels #Travel #TravelDeals`,
      
      tiktok: `POV: Du suchst ein Hotel in ${city} 😅

❌ 10 Tabs offen
❌ 30 Minuten Zeit weg
❌ Immer noch unsicher

✅ Book.ax: 2 Minuten, Bestpreis, fertig

${BRAND.cta} 💜

#bookax #hotel #${city.toLowerCase()} #travel #lifehack #reisetipps`,
      
      twitter: `Hotels in ${city} vergleichen?

Book.ax macht's in 2 Minuten:
→ 500k+ Hotels
→ Live-Preise
→ Bestpreis-Garantie
→ Transparent

${BRAND.cta} 💜`,
      
      facebook: `🏨 Suchst du ein Hotel in ${city}?

Book.ax vergleicht über 500.000 Hotels weltweit – in Sekunden.

✓ Schnell
✓ Modern  
✓ Transparent
✓ Bestpreis-Garantie

Keine versteckten Kosten. Keine endlose Suche.

${BRAND.cta} 💜✈️`
    };
    
    return {
      platform,
      content: posts[platform] || posts.instagram,
      hashtags: ['Bookax', 'Hotelvergleich', 'Bestpreis', city, 'Reisen'],
      cta: BRAND.cta
    };
  },
  
  // ============================================
  // ADS TEMPLATES
  // ============================================
  ads: (data) => {
    const { platform = 'google', city = 'Hamburg' } = data;
    
    const google = {
      headlines: [
        `Hotelsuchmaschine Book.ax`,
        `Hotels in ${city} – Bestpreise`,
        `Hotelpreise weltweit vergleichen`,
        `Spare Zeit & Geld bei Hotels`,
        `${city} Hotels ab heute günstiger`
      ].slice(0, 3),
      
      descriptions: [
        `${BRAND.cta} – schnell, transparent, ohne versteckte Kosten.`,
        `500.000+ Hotels weltweit. Live-Preise. Bestpreis-Garantie. Jetzt ${city} entdecken.`
      ],
      
      path: ['Book.ax', city, 'Hotels']
    };
    
    const meta = {
      headline: `Hotels in ${city} finden – Bestpreise garantiert`,
      primary: `Book.ax vergleicht Hotelpreise weltweit. Schnell, modern, transparent.`,
      description: `Spare Zeit und Geld. ${BRAND.cta}. 💜`,
      cta: 'Jetzt vergleichen'
    };
    
    return platform === 'google' ? google : meta;
  },
  
  // ============================================
  // REISE-GUIDE TEMPLATE
  // ============================================
  guide: (data) => {
    const { city = 'Barcelona', country = 'Spanien' } = data;
    
    return {
      seo: {
        title: `${city} Reiseführer – Hotels & Tipps | Book.ax`,
        meta: `Entdecke ${city} mit unserem Guide. Top-Aktivitäten + beste Hotels zum Bestpreis. ${BRAND.cta}.`,
        h1: `${city} entdecken – Reiseführer mit Hotel-Tipps`
      },
      
      content: `
# ${city} entdecken – Reiseführer mit Hotel-Tipps

${city}, ${country} – eine Stadt voller Leben, Kultur und unvergesslicher Momente.

Wir zeigen dir die Top-Aktivitäten. Plus: wo du am besten übernachtest.

## Top 5 Aktivitäten in ${city}

### 1. Altstadt erkunden
Schlendere durch historische Gassen. Erlebe lokales Leben.

**Hotel-Tipp**: Boutique-Hotels im Zentrum. Vergleiche Preise auf Book.ax.

### 2. Kulinarische Tour
Probiere lokale Spezialitäten. Genieße authentische Küche.

**Hotel-Tipp**: Hotels mit Frühstück inklusive. Beste Deals auf Book.ax.

### 3. Kultur & Museen
Tauche in Geschichte ein. Besuche Top-Museen.

**Hotel-Tipp**: Kulturhotels in Museumsnähe. ${BRAND.cta}.

### 4. Nachtleben erleben
${city} schläft nie. Erlebe pulsierende Bars und Clubs.

**Hotel-Tipp**: Zentrale Lage für kurze Wege. Vergleiche auf Book.ax.

### 5. Natur & Parks
Grüne Oasen mitten in der Stadt. Perfekt zum Entspannen.

**Hotel-Tipp**: Ruhige Hotels am Stadtrand. Bestpreise auf Book.ax.

## Hotel-Kategorien für ${city}

- **Luxus**: Für besondere Anlässe (ab 200€/Nacht)
- **Business**: Perfekt für Geschäftsreisen (ab 120€/Nacht)
- **Familie**: Platz & Kinderfreundlichkeit (ab 90€/Nacht)
- **Budget**: Günstig, aber gut (ab 45€/Nacht)

Alle Preise vergleichbar auf Book.ax. Transparent. Ohne versteckte Kosten.

## Insider-Tipps

✓ Beste Reisezeit: März-Juni & September-November
✓ Früh buchen spart bis zu 40%
✓ Midweek günstiger als Wochenende
✓ Nutze Book.ax Bestpreis-Alert

## 💜 ${BRAND.cta}

Ready für ${city}? Finde dein perfektes Hotel. Jetzt.
`,
      
      schema: {
        '@context': 'https://schema.org',
        '@type': 'TravelGuide',
        name: `${city} Reiseführer`,
        description: `Top-Aktivitäten und Hotel-Tipps für ${city}`,
        author: {
          '@type': 'Organization',
          name: 'Book.ax'
        }
      }
    };
  },
  
  // ============================================
  // HOTEL BESCHREIBUNG TEMPLATE
  // ============================================
  hotelDescription: (data) => {
    const { 
      name = 'Skyline Boutique Hotel',
      city = 'Frankfurt',
      stars = 4,
      priceFrom = 89,
      highlights = ['Rooftop-Bar', 'City-View', 'Spa']
    } = data;
    
    return {
      content: `
## ${name} – ${stars}⭐ Hotel in ${city}

Das ${name} strahlt Ruhe und modernen Komfort aus.

Designdetails in ${BRAND.color}. ${highlights.join(', ')}. Perfekt für Städtereisen.

### Highlights
${highlights.map(h => `✓ ${h}`).join('\n')}

### Bestpreis-Siegel via Book.ax
Ab **${priceFrom}€** pro Nacht

<div style="background: ${BRAND.color}; color: white; padding: 12px 24px; border-radius: 4px; display: inline-block; margin-top: 16px;">
${BRAND.cta}
</div>
`,
      
      price: priceFrom,
      cta: BRAND.cta
    };
  },
  
  // ============================================
  // MIKRO-POST TEMPLATE
  // ============================================
  microPost: (data) => {
    const { type = 'deal', hotel = 'Grand Hotel', discount = 25, city = 'Zürich' } = data;
    
    const posts = {
      deal: `🔥 Bestpreis-Alarm: ${hotel} ${city} gerade ${discount}% günstiger über Book.ax. ${BRAND.cta} 💜`,
      
      tip: `💡 Hotel-Tipp: Midweek-Buchungen in ${city} sind bis zu 40% günstiger. ${BRAND.cta}`,
      
      announcement: `🆕 Neu: ${city} jetzt mit 500+ Hotels auf Book.ax. Alle Preise vergleichen. Sofort. ${BRAND.cta} 💜`
    };
    
    return {
      type,
      content: posts[type] || posts.deal,
      maxChars: 150
    };
  },
  
  // ============================================
  // FAQ BLOCK TEMPLATE
  // ============================================
  faq: (data) => {
    const { city = 'Amsterdam' } = data;
    
    const questions = [
      {
        q: 'Was macht Book.ax einzigartig?',
        a: `Book.ax vergleicht über 500.000 Hotels weltweit in Sekunden. Transparent, modern, ohne versteckte Kosten. ${BRAND.cta}.`
      },
      {
        q: `Kann ich Hotels in ${city} weltweit vergleichen?`,
        a: `Ja! Book.ax deckt ${city} und alle großen Destinationen weltweit ab. Live-Preise von allen Top-Anbietern.`
      },
      {
        q: 'Wie sicher sind die Preise?',
        a: 'Alle Preise sind live und direkt von Partnern. Keine versteckten Gebühren. Bestpreis-Garantie inklusive.'
      },
      {
        q: 'Gibt es versteckte Kosten?',
        a: 'Nein. Was du siehst, ist was du zahlst. Transparenz ist unser Versprechen bei Book.ax.'
      },
      {
        q: 'Kann ich auch Last-Minute buchen?',
        a: `Absolut! Book.ax zeigt auch Last-Minute-Deals in ${city} und weltweit. Oft mit extra Rabatten.`
      }
    ];
    
    return {
      questions,
      
      markdown: questions.map(({q, a}) => `
**${q}**
${a}
`).join('\n'),
      
      schema: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions.map(({q, a}) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: a
          }
        }))
      }
    };
  },
  
  // ============================================
  // RICH SNIPPET TEMPLATE
  // ============================================
  richSnippet: (data) => {
    const { city = 'Rom', type = 'article' } = data;
    
    return {
      content: `
Book.ax zeigt Bestpreis-Labels, Live-Room-Highlights und Trust-Badges (Sicherer Checkout).

✓ Über 500.000 Hotels weltweit
✓ Echtzeitdaten von allen Top-Anbietern
✓ Transparente Preise ohne versteckte Kosten
✓ Bestpreis-Garantie inklusive

Hotels in ${city}? ${BRAND.cta} 💜
`,
      
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `Hotels in ${city} vergleichen – Book.ax`,
        description: `Die moderne Hotelsuchmaschine für ${city}. Schnell, transparent, Bestpreis-Fokus.`,
        author: {
          '@type': 'Organization',
          name: 'Book.ax'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Book.ax',
          logo: {
            '@type': 'ImageObject',
            url: 'https://book-ax.vercel.app/logo.png'
          }
        }
      }
    };
  }
};

export default templates;
