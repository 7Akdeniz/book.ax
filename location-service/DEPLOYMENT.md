# 🚀 Book.ax Location Service - Deployment Guide

## Production Deployment Checklist

### 1. Prerequisites

- [x] PostgreSQL 15+ with PostGIS extension
- [x] Node.js 20+ runtime
- [x] Redis (optional, for caching)
- [x] Domain & SSL certificate
- [x] CDN (optional, for static assets)

### 2. Environment Configuration

Create `.env.production`:

```bash
# Database (use connection pooling)
DATABASE_URL="postgresql://user:pass@db.example.com:5432/bookax_locations?schema=public&connection_limit=20&pool_timeout=30"

# Server
NODE_ENV=production
PORT=3001

# API
API_PREFIX=api/v1
CORS_ORIGINS=https://book-ax.vercel.app,https://www.book.ax

# Redis (highly recommended for production)
REDIS_HOST=redis.example.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Security
JWT_SECRET=your-super-secret-jwt-key-min-256-bits
ADMIN_API_KEY=your-admin-api-key

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_PUBLIC=100
RATE_LIMIT_ADMIN=1000
RATE_LIMIT_WINDOW=60
```

### 3. Database Setup (Production)

```bash
# 1. Create production database
createdb bookax_locations_prod

# 2. Enable PostGIS
psql bookax_locations_prod -c "CREATE EXTENSION postgis;"
psql bookax_locations_prod -c "CREATE EXTENSION pg_trgm;"

# 3. Run migrations
DATABASE_URL="postgresql://..." npm run prisma:migrate:prod

# 4. Execute PostGIS setup
psql $DATABASE_URL -f prisma/postgis-setup.sql

# 5. Seed initial data
npm run seed:all
```

### 4. Build & Deploy

#### Option A: Docker (Recommended)

```bash
# Build production image
docker build -t bookax-location-service:latest .

# Push to registry
docker tag bookax-location-service:latest registry.example.com/bookax-location-service:latest
docker push registry.example.com/bookax-location-service:latest

# Deploy with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

**docker-compose.prod.yml**:
```yaml
version: '3.8'

services:
  location-service:
    image: registry.example.com/bookax-location-service:latest
    restart: always
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_HOST=${REDIS_HOST}
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

#### Option B: PM2 (Node Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Build application
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

**ecosystem.config.js**:
```javascript
module.exports = {
  apps: [{
    name: 'bookax-location-service',
    script: './dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001,
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    max_memory_restart: '1G',
    autorestart: true,
    watch: false,
  }]
};
```

#### Option C: Kubernetes

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: bookax-location-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: bookax-location-service
  template:
    metadata:
      labels:
        app: bookax-location-service
    spec:
      containers:
      - name: location-service
        image: registry.example.com/bookax-location-service:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /api/v1/health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/v1/health
            port: 3001
          initialDelaySeconds: 10
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: bookax-location-service
spec:
  selector:
    app: bookax-location-service
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3001
  type: LoadBalancer
```

### 5. Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/locations-api.book.ax

upstream location_service {
    least_conn;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    server 127.0.0.1:3003;
}

# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
limit_req_zone $binary_remote_addr zone=autocomplete_limit:10m rate=50r/m;

server {
    listen 443 ssl http2;
    server_name locations-api.book.ax;

    ssl_certificate /etc/letsencrypt/live/locations-api.book.ax/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/locations-api.book.ax/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # CORS
    add_header Access-Control-Allow-Origin "https://book-ax.vercel.app" always;
    add_header Access-Control-Allow-Methods "GET, POST, PATCH, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types application/json text/plain;

    location /api/v1/locations/autocomplete {
        limit_req zone=autocomplete_limit burst=10 nodelay;
        proxy_pass http://location_service;
        proxy_cache api_cache;
        proxy_cache_valid 200 15m;
    }

    location /api/v1 {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://location_service;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Swagger docs
    location /docs {
        proxy_pass http://location_service;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name locations-api.book.ax;
    return 301 https://$server_name$request_uri;
}
```

Enable:
```bash
ln -s /etc/nginx/sites-available/locations-api.book.ax /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 6. SSL Certificate (Let's Encrypt)

```bash
# Install certbot
apt-get install certbot python3-certbot-nginx

# Obtain certificate
certbot --nginx -d locations-api.book.ax

# Auto-renewal (cron)
0 0 * * * certbot renew --quiet
```

### 7. Database Optimization

```sql
-- Connection pooling (PgBouncer recommended)
-- Install: apt-get install pgbouncer

-- Optimize PostgreSQL config
ALTER SYSTEM SET shared_buffers = '4GB';
ALTER SYSTEM SET effective_cache_size = '12GB';
ALTER SYSTEM SET maintenance_work_mem = '1GB';
ALTER SYSTEM SET work_mem = '64MB';
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET random_page_cost = 1.1;

-- Reload config
SELECT pg_reload_conf();

-- Create read replicas for scaling
-- Use pg_basebackup or streaming replication
```

### 8. Monitoring & Logging

#### Prometheus + Grafana

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'bookax-locations'
    static_configs:
      - targets: ['localhost:3001']
    metrics_path: '/metrics'
```

#### Log Aggregation (ELK Stack)

```bash
# Filebeat configuration
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/log/bookax/location-service/*.log
    json.keys_under_root: true
    
output.elasticsearch:
  hosts: ["elasticsearch:9200"]
```

### 9. Backup Strategy

```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/location-service"
DB_NAME="bookax_locations"

# Full database dump
pg_dump $DB_NAME | gzip > "$BACKUP_DIR/full_$DATE.sql.gz"

# Upload to S3
aws s3 cp "$BACKUP_DIR/full_$DATE.sql.gz" s3://bookax-backups/locations/

# Keep only last 30 days
find $BACKUP_DIR -type f -mtime +30 -delete

# Cron: 0 2 * * * /scripts/backup-db.sh
```

### 10. Performance Tuning

```typescript
// Add to main.ts for production

// Enable compression
import * as compression from 'compression';
app.use(compression());

// Rate limiting
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
  ],
})

// Database connection pooling
// Prisma automatically handles this via DATABASE_URL params
```

### 11. Security Hardening

```bash
# Helmet.js for security headers (already in main.ts)
npm install helmet

# API key authentication for admin endpoints
# Implement AdminGuard using JWT or API keys

# Environment variable encryption
npm install dotenv-vault
npx dotenv-vault local build
npx dotenv-vault push production
```

### 12. CDN Configuration (Cloudflare)

```javascript
// Cache API responses at edge
// Cloudflare Workers example

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const cache = caches.default
  const cacheKey = new Request(request.url, request)
  
  // Check cache first
  let response = await cache.match(cacheKey)
  
  if (!response) {
    response = await fetch(request)
    
    // Cache countries/continents for 1 hour
    if (request.url.includes('/countries') || request.url.includes('/continents')) {
      const headers = new Headers(response.headers)
      headers.set('Cache-Control', 'public, max-age=3600')
      response = new Response(response.body, { ...response, headers })
      event.waitUntil(cache.put(cacheKey, response.clone()))
    }
  }
  
  return response
}
```

### 13. Health Checks

Add health endpoint:

```typescript
// health.controller.ts
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaClient) {}

  @Get()
  async check() {
    // Check database connection
    await this.prisma.$queryRaw`SELECT 1`;
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
    };
  }
}
```

### 14. Deployment Commands

```bash
# 1. Pre-deployment checks
npm run lint
npm run test
npm run build

# 2. Database migration (production)
DATABASE_URL="..." npm run prisma:migrate:prod

# 3. Deploy application
# (Docker/PM2/K8s commands from above)

# 4. Health check
curl https://locations-api.book.ax/api/v1/health

# 5. Smoke test
curl https://locations-api.book.ax/api/v1/locations/countries?limit=1

# 6. Monitor logs
pm2 logs bookax-location-service
# or
docker logs -f bookax-location-service
```

### 15. Rollback Plan

```bash
# PM2
pm2 deploy production revert 1

# Docker
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml pull bookax-location-service:previous
docker-compose -f docker-compose.prod.yml up -d

# Kubernetes
kubectl rollout undo deployment/bookax-location-service
```

---

## Post-Deployment Verification

- [ ] Health endpoint responds with 200 OK
- [ ] API documentation accessible at /docs
- [ ] Search returns results
- [ ] Autocomplete responds < 50ms
- [ ] CORS headers configured correctly
- [ ] HTTPS certificate valid
- [ ] Monitoring dashboards showing metrics
- [ ] Log aggregation working
- [ ] Database backups running
- [ ] Rate limiting active
- [ ] CDN caching working (if applicable)

## Scaling Strategy

### Vertical Scaling
- Increase server CPU/RAM
- Optimize database (more RAM, SSD storage)
- Enable Redis caching

### Horizontal Scaling
- Add more application instances
- Database read replicas
- Load balancer (Nginx/HAProxy)
- Distributed caching (Redis Cluster)

### Expected Performance (3x instances, optimized DB)
- **Throughput**: 5,000+ req/s
- **Search latency**: < 50ms p99
- **Autocomplete**: < 30ms p99
- **Database connections**: 60 (20 per instance)

---

**Production Support**: support@book.ax  
**Incident Response**: incidents@book.ax  
**Monitoring**: https://grafana.book.ax/locations
