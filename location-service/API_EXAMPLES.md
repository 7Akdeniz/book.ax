# Book.ax Location Service - API Examples

## Authentication

All admin endpoints require authentication. Include Bearer token in header:

```bash
Authorization: Bearer <your-token-here>
```

## Public API Examples

### 1. Search for "Berlin"

```bash
curl "http://localhost:3001/api/v1/locations/search?q=berlin&language=de"
```

**Response**:
```json
{
  "countries": [],
  "cities": [
    {
      "id": "uuid",
      "name": "Berlin",
      "slug": "berlin",
      "display_name": "Berlin",
      "population": 3645000,
      "is_capital": true,
      "is_major_city": true,
      "latitude": 52.5200,
      "longitude": 13.4050,
      "country": {
        "iso2": "DE",
        "name_de": "Deutschland"
      }
    }
  ],
  "districts": [...],
  "pois": [...],
  "total_results": 15
}
```

### 2. Autocomplete

```bash
curl "http://localhost:3001/api/v1/locations/autocomplete?q=new&language=en&limit=5"
```

**Response**:
```json
[
  {
    "type": "city",
    "id": "uuid",
    "display_name": "New York, United States",
    "country_name": "United States",
    "city_name": "New York",
    "slug": "new-york"
  },
  {
    "type": "city",
    "id": "uuid",
    "display_name": "New Delhi, India",
    "country_name": "India",
    "city_name": "New Delhi",
    "slug": "new-delhi"
  }
]
```

### 3. Get All European Countries

```bash
curl "http://localhost:3001/api/v1/locations/countries?continent=EU&page=1&limit=20"
```

### 4. Get Country Details

```bash
curl "http://localhost:3001/api/v1/locations/countries/<country-id>?language=de"
```

### 5. Search Cities in Germany

```bash
curl "http://localhost:3001/api/v1/locations/cities?country=DE&is_major_city=true"
```

### 6. Proximity Search - Hotels near Berlin Airport

```bash
curl "http://localhost:3001/api/v1/locations/search?q=hotel&near_lat=52.3667&near_lng=13.5033&radius_km=10"
```

### 7. Get Airports in Dubai

```bash
curl "http://localhost:3001/api/v1/locations/poi?city=<dubai-city-id>&type=AIRPORT"
```

### 8. Search POIs by IATA Code

```bash
curl "http://localhost:3001/api/v1/locations/search?q=BER&type=poi"
```

## Admin API Examples

### 1. Create New Country

```bash
curl -X POST http://localhost:3001/api/v1/admin/locations/countries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "continent_id": "<continent-uuid>",
    "iso2": "JP",
    "iso3": "JPN",
    "numeric_code": "392",
    "name_official": "Japan",
    "name_en": "Japan",
    "name_de": "Japan",
    "name_fr": "Japon",
    "name_es": "Japón",
    "name_tr": "Japonya",
    "capital": "Tokyo",
    "currency_code": "JPY",
    "phone_code": "+81",
    "population": 125800000,
    "timezones": ["Asia/Tokyo"]
  }'
```

### 2. Create New City

```bash
curl -X POST http://localhost:3001/api/v1/admin/locations/cities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "country_id": "<country-uuid>",
    "region_id": "<region-uuid>",
    "name": "Tokyo",
    "slug": "tokyo",
    "name_en": "Tokyo",
    "population": 13960000,
    "latitude": 35.6762,
    "longitude": 139.6503,
    "timezone": "Asia/Tokyo",
    "is_capital": true,
    "is_major_city": true
  }'
```

### 3. Create Airport POI

```bash
curl -X POST http://localhost:3001/api/v1/admin/locations/poi \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "city_id": "<city-uuid>",
    "type": "AIRPORT",
    "name": "Narita International Airport",
    "slug": "narita-airport",
    "latitude": 35.7720,
    "longitude": 140.3929,
    "iata_code": "NRT",
    "icao_code": "RJAA",
    "description_short": "Major international airport serving Tokyo"
  }'
```

### 4. Create Location Alias

```bash
curl -X POST http://localhost:3001/api/v1/admin/locations/aliases \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "target_type": "CITY",
    "target_id": "<city-uuid>",
    "alias_name": "NYC",
    "language_code": "en",
    "use_for_search": true
  }'
```

### 5. Update City

```bash
curl -X PATCH http://localhost:3001/api/v1/admin/locations/cities/<city-id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "population": 3700000,
    "is_major_city": true
  }'
```

### 6. Delete POI

```bash
curl -X DELETE http://localhost:3001/api/v1/admin/locations/poi/<poi-id> \
  -H "Authorization: Bearer <token>"
```

## Advanced Queries

### Multi-Language Search

```bash
# German interface
curl "http://localhost:3001/api/v1/locations/search?q=münchen&language=de"

# English interface (same city)
curl "http://localhost:3001/api/v1/locations/search?q=munich&language=en"

# Turkish interface
curl "http://localhost:3001/api/v1/locations/search?q=istanbul&language=tr"
```

### Geo-Spatial Queries

```bash
# Find all cities within 100km of coordinates
curl "http://localhost:3001/api/v1/locations/cities?near_lat=48.8566&near_lng=2.3522&radius_km=100"

# Find POIs near user location
curl "http://localhost:3001/api/v1/locations/poi?near_lat=40.7128&near_lng=-74.0060&radius_km=5&type=MUSEUM"
```

### Pagination

```bash
# Page 2, 50 results per page
curl "http://localhost:3001/api/v1/locations/cities?page=2&limit=50"
```

### Combined Filters

```bash
# Major cities in Germany, German language, paginated
curl "http://localhost:3001/api/v1/locations/cities?country=DE&is_major_city=true&language=de&page=1&limit=10"
```

## Response Format

All endpoints return JSON with consistent structure:

### Success Response (Single Item)
```json
{
  "id": "uuid",
  "name": "...",
  "...": "..."
}
```

### Success Response (List with Pagination)
```json
{
  "data": [...],
  "total": 150,
  "page": 1,
  "limit": 20,
  "total_pages": 8
}
```

### Error Response
```json
{
  "statusCode": 404,
  "message": "City with ID xxx not found",
  "error": "Not Found"
}
```

## Rate Limiting

- Public API: 100 requests/minute per IP
- Admin API: 1000 requests/minute per token
- Autocomplete: 50 requests/minute per IP (cached)

## Caching

- Countries/Continents: 1 hour
- Cities: 30 minutes
- Search results: 5 minutes
- Autocomplete: 15 minutes

## Webhooks (Future)

Subscribe to location updates:

```bash
POST /api/v1/admin/webhooks
{
  "url": "https://yourapp.com/webhook",
  "events": ["city.created", "city.updated", "poi.created"]
}
```

---

For full API documentation, visit: http://localhost:3001/docs
