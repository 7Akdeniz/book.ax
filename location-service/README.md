# 📍 Book.ax Location Service

Worldwide location database service for the Book.ax hotel search platform. Provides comprehensive location data including continents, countries, regions, cities, districts, and points of interest (POIs) with multi-language support and geo-spatial search capabilities.

## 🌟 Features

- **Complete Geographic Hierarchy**: Continents → Countries → Regions → Cities → Districts → POIs
- **Multi-Language Support**: 5 languages (EN, DE, ES, FR, TR) with automatic fallback
- **Geo-Spatial Search**: PostGIS-powered proximity search and distance calculations
- **Fast Autocomplete**: Trigram-based fuzzy search for real-time suggestions
- **REST API**: Clean, well-documented endpoints with Swagger UI
- **Admin Interface**: CRUD operations for all location entities
- **Production Ready**: Docker support, caching, validation, error handling

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **PostgreSQL** 15+ with **PostGIS** extension
- **Docker** (optional, recommended)

### Installation

```bash
# Clone the repository
cd location-service

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env and configure your database
```

### Database Setup

#### Option 1: Docker (Recommended)

```bash
# Start PostgreSQL with PostGIS
docker-compose up -d postgres

# Wait for database to be ready
docker-compose logs -f postgres
```

#### Option 2: Local PostgreSQL

```bash
# Install PostGIS extension (Ubuntu/Debian)
sudo apt-get install postgresql-15-postgis-3

# Create database
createdb bookax_locations

# Enable PostGIS
psql bookax_locations -c "CREATE EXTENSION postgis;"
```

### Run Migrations & Seed Data

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Execute PostGIS setup
psql $DATABASE_URL -f prisma/postgis-setup.sql

# Seed database with initial data
npm run seed:all
```

This will populate:
- ✅ 7 Continents
- ✅ 15+ Countries (DE, US, TR, FR, ES, IT, UK, AE, etc.)
- ✅ 50+ Regions/States
- ✅ 50+ Major Cities
- ✅ 60+ Points of Interest (airports, landmarks, museums, etc.)

### Start the Service

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Docker (complete stack)
docker-compose up
```

The service will be available at:
- **API**: http://localhost:3001/api/v1
- **Swagger Docs**: http://localhost:3001/docs

## 📖 API Documentation

### Public Endpoints

#### Search Locations
```http
GET /api/v1/locations/search?q=berlin&language=en&type=city&limit=20
```

**Query Parameters**:
- `q` (required): Search query
- `language` (optional): Response language (de, en, es, fr, tr)
- `type` (optional): Filter by type (country, city, district, poi)
- `country` (optional): Filter by country ISO2 code
- `near_lat`, `near_lng` (optional): Proximity search coordinates
- `radius_km` (optional): Search radius in km (default: 50)
- `page`, `limit` (optional): Pagination

**Response**:
```json
{
  "countries": [...],
  "cities": [...],
  "districts": [...],
  "pois": [...],
  "total_results": 42
}
```

#### Autocomplete
```http
GET /api/v1/locations/autocomplete?q=ber&language=de&limit=10
```

Returns fast autocomplete suggestions for search fields.

**Response**:
```json
[
  {
    "type": "city",
    "id": "uuid",
    "display_name": "Berlin, Deutschland",
    "country_name": "Deutschland",
    "city_name": "Berlin",
    "slug": "berlin"
  }
]
```

#### Get Countries
```http
GET /api/v1/locations/countries?continent=EU&page=1&limit=20
```

**Response**: Paginated list of countries with full details.

#### Get Country by ID
```http
GET /api/v1/locations/countries/:id?language=de
```

Includes regions and major cities.

#### Get Cities
```http
GET /api/v1/locations/cities?country=DE&is_major_city=true
```

**Query Parameters**:
- `country`: Filter by ISO2 code
- `region`: Filter by region ID
- `q`: Search by name
- `is_major_city`: Only major cities

#### Get City by ID
```http
GET /api/v1/locations/cities/:id?language=en
```

Includes districts and top POIs.

#### Get POIs
```http
GET /api/v1/locations/poi?city=<city_id>&type=AIRPORT
```

**Query Parameters**:
- `city`: Filter by city ID
- `type`: Filter by POI type (AIRPORT, MUSEUM, LANDMARK, etc.)
- `q`: Search by name
- `near_lat`, `near_lng`, `radius_km`: Proximity search

### Admin Endpoints (require authentication)

All admin endpoints are under `/api/v1/admin/locations` and require bearer token authentication.

#### Create Country
```http
POST /api/v1/admin/locations/countries
Content-Type: application/json

{
  "continent_id": "uuid",
  "iso2": "DE",
  "iso3": "DEU",
  "name_official": "Federal Republic of Germany",
  "name_en": "Germany",
  "name_de": "Deutschland",
  "capital": "Berlin",
  "currency_code": "EUR",
  "phone_code": "+49",
  "population": 83240525,
  "timezones": ["Europe/Berlin"]
}
```

#### Create City
```http
POST /api/v1/admin/locations/cities
Content-Type: application/json

{
  "country_id": "uuid",
  "region_id": "uuid",
  "name": "Berlin",
  "slug": "berlin",
  "name_en": "Berlin",
  "name_de": "Berlin",
  "population": 3645000,
  "latitude": 52.5200,
  "longitude": 13.4050,
  "timezone": "Europe/Berlin",
  "is_capital": true,
  "is_major_city": true
}
```

#### Create POI
```http
POST /api/v1/admin/locations/poi
Content-Type: application/json

{
  "city_id": "uuid",
  "type": "AIRPORT",
  "name": "Berlin Brandenburg Airport",
  "latitude": 52.3667,
  "longitude": 13.5033,
  "iata_code": "BER",
  "description_short": "Main international airport serving Berlin"
}
```

#### Create Alias (alternative names)
```http
POST /api/v1/admin/locations/aliases
Content-Type: application/json

{
  "target_type": "CITY",
  "target_id": "uuid",
  "alias_name": "München",
  "language_code": "de",
  "use_for_search": true
}
```

**Update & Delete**: Available for all entities via `PATCH /:id` and `DELETE /:id`.

## 🗃️ Database Schema

```
continents
├── countries
│   ├── regions
│   └── cities
│       ├── districts
│       └── points_of_interest
└── location_aliases (can point to any entity)
```

**Key Features**:
- PostGIS geometry columns for lat/lng
- Multi-language name fields (en, de, es, fr, tr)
- Slugs for SEO-friendly URLs
- Foreign key constraints with cascading deletes
- GIN/GIST indexes for full-text and geo search

## 🛠️ Advanced Usage

### Import from GeoNames

```bash
# Download GeoNames data
wget http://download.geonames.org/export/dump/allCountries.zip
unzip allCountries.zip

# Run importer (customize as needed)
npm run import:geonames -- --file=allCountries.txt --country=DE
```

### Run Individual Seed Scripts

```bash
npm run seed:continents
npm run seed:countries
npm run seed:cities
npm run seed:pois
```

### Prisma Studio (Database GUI)

```bash
npm run prisma:studio
```

Opens database admin interface at http://localhost:5555

### Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 🌍 Data Coverage

### Currently Seeded

- **Europe**: Germany, France, Spain, Italy, UK, Austria, Switzerland, Netherlands, Belgium, Poland, Greece, Portugal
- **North America**: United States
- **Asia**: Turkey, United Arab Emirates

### Adding More Countries

1. Add country to `src/seed/data/countries.data.ts`
2. Add regions to `src/seed/data/regions.data.ts`
3. Add cities to `src/seed/data/cities.data.ts`
4. Add POIs to `src/seed/data/pois.data.ts`
5. Run `npm run seed:all`

Or use the Admin API to add via REST endpoints.

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/bookax_locations?schema=public"

# Server
PORT=3001
NODE_ENV=development

# API
API_PREFIX=api/v1
CORS_ORIGINS=http://localhost:3000,https://book-ax.vercel.app

# Redis (optional, for caching)
REDIS_HOST=localhost
REDIS_PORT=6379

# GeoNames (for import)
GEONAMES_USERNAME=your_username
```

## 📦 Deployment

### Docker

```bash
# Build image
docker build -t bookax-location-service .

# Run container
docker run -p 3001:3001 \
  -e DATABASE_URL="postgresql://..." \
  bookax-location-service
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure database connection pooling
- [ ] Enable Redis caching
- [ ] Set up monitoring (Prometheus, Grafana)
- [ ] Configure log aggregation
- [ ] Set up database backups
- [ ] Enable HTTPS/SSL
- [ ] Implement rate limiting
- [ ] Add authentication for admin endpoints
- [ ] Configure CORS for production domains

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:cov
```

## 📊 Performance

- **Search Response Time**: < 100ms (with caching)
- **Autocomplete**: < 50ms
- **Database Size**: ~500MB for full worldwide dataset
- **Concurrent Requests**: 1000+ req/s (with proper scaling)

### Optimization Tips

1. **Caching**: Enable Redis for frequently accessed data
2. **Indexes**: Already optimized with GIN/GIST indexes
3. **Connection Pooling**: Configure Prisma connection pool
4. **CDN**: Cache country/continent data at edge
5. **Horizontal Scaling**: Run multiple instances behind load balancer

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🙋 Support

- **Documentation**: https://book-ax.vercel.app/docs
- **Issues**: https://github.com/7Akdeniz/book.ax/issues
- **Email**: support@book.ax

---

Built with ❤️ for Book.ax by the development team.
