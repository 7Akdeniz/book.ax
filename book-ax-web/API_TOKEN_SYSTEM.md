# 🔐 BOOK.AX API TOKEN SYSTEM

Complete API Token authentication system für technische Integrationen (MCP Server, Content Automation, etc.)

## 📋 Features

✅ **API Token Authentication** - Alternative zu JWT für technische Clients  
✅ **Scope-based Permissions** - Granulare Rechte-Kontrolle  
✅ **Rate Limiting** - Automatisches Request-Limiting  
✅ **IP Restrictions** - Optional IP-Whitelist  
✅ **Hybrid Auth** - APIs unterstützen JWT UND API-Token  
✅ **Usage Logs** - Automatisches Logging für Analytics  
✅ **Expiration** - Tokens können ablaufen  
✅ **Admin Management** - API-Endpoints für Token-Verwaltung

## 🚀 Quick Start

### 1. Setup Database

```bash
cd book-ax-web
./scripts/setup-api-tokens.sh
```

Oder manuell:

```bash
psql $DATABASE_URL < database/api-tokens-schema.sql
```

### 2. Start Dev Server

```bash
npm run dev
```

### 3. Create API Token

**Option A: Via API**

```bash
# Login as admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@book.ax",
    "password": "your-password"
  }'

# Create token
curl -X POST http://localhost:3000/api/admin/api-tokens \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "MCP Server Token",
    "description": "Token for Model Context Protocol Server",
    "scopes": ["cms:read", "cms:write", "cms:delete"],
    "expires_in_days": 90,
    "rate_limit": 10000
  }'
```

**Option B: Via Automated Test**

```bash
node scripts/test-cms-api.js
```

### 4. Use Token

```bash
# With Authorization header
curl http://localhost:3000/api/v1/cms/pages \
  -H "Authorization: Bearer bax_live_xxxxx"

# With X-API-Token header
curl http://localhost:3000/api/v1/cms/pages \
  -H "X-API-Token: bax_live_xxxxx"
```

## 📚 API Endpoints

### Token Management (Admin only)

#### List Tokens
```
GET /api/admin/api-tokens
Authorization: Bearer {JWT_TOKEN}
```

#### Create Token
```
POST /api/admin/api-tokens
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "name": "Token Name",
  "description": "Optional description",
  "scopes": ["cms:read", "cms:write"],
  "expires_in_days": 90,
  "rate_limit": 1000,
  "allowed_ips": ["192.168.1.1"]  // optional
}
```

#### Get Token Details
```
GET /api/admin/api-tokens/{id}
Authorization: Bearer {JWT_TOKEN}
```

#### Update Token
```
PUT /api/admin/api-tokens/{id}
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "name": "Updated Name",
  "is_active": false,
  "scopes": ["cms:read"]
}
```

#### Delete Token
```
DELETE /api/admin/api-tokens/{id}
Authorization: Bearer {JWT_TOKEN}
```

### CMS API (Hybrid Auth: JWT or API Token)

#### List Pages
```
GET /api/v1/cms/pages?language_code=en&status=published
# No auth required for published pages
```

#### Create Page
```
POST /api/v1/cms/pages
Authorization: Bearer {API_TOKEN}
Content-Type: application/json

{
  "slug": "my-page",
  "type": "page",
  "status": "draft",
  "translations": [
    {
      "language_code": "en",
      "title": "My Page",
      "content": "<p>Content</p>"
    }
  ]
}
```

#### Get Page
```
GET /api/v1/cms/pages/{id}?language=en
# No auth required
```

#### Update Page
```
PUT /api/v1/cms/pages/{id}
Authorization: Bearer {API_TOKEN}
Content-Type: application/json

{
  "status": "published",
  "meta_robots": "index, follow"
}
```

#### Delete Page
```
DELETE /api/v1/cms/pages/{id}
Authorization: Bearer {API_TOKEN}
```

## 🔑 Scopes

Verfügbare Permission-Scopes:

| Scope | Description |
|-------|-------------|
| `admin` | Full admin access (bypasses all checks) |
| `cms:read` | Read CMS pages |
| `cms:write` | Create/update CMS pages |
| `cms:delete` | Delete CMS pages |
| `hotels:read` | Read hotel data |
| `hotels:write` | Create/update hotels |
| `hotels:delete` | Delete hotels |
| `bookings:read` | Read bookings |
| `bookings:write` | Create/update bookings |
| `users:read` | Read user data |
| `users:write` | Create/update users |
| `payments:read` | Read payment data |
| `analytics:read` | Read analytics data |

## 🛠️ Token Format

```
bax_live_<48 hex characters>
```

Beispiel:
```
bax_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4
```

## 📊 Database Schema

### `api_tokens` Table

```sql
- id (UUID)
- token (VARCHAR, unique)
- name (VARCHAR)
- description (TEXT)
- user_id (UUID, FK)
- scopes (JSONB)
- is_active (BOOLEAN)
- expires_at (TIMESTAMP)
- last_used_at (TIMESTAMP)
- rate_limit (INTEGER)
- requests_count (INTEGER)
- requests_reset_at (TIMESTAMP)
- allowed_ips (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### `api_token_logs` Table

```sql
- id (UUID)
- token_id (UUID, FK)
- endpoint (VARCHAR)
- method (VARCHAR)
- status_code (INTEGER)
- ip_address (VARCHAR)
- user_agent (TEXT)
- response_time_ms (INTEGER)
- created_at (TIMESTAMP)
```

## 🔒 Security Best Practices

1. **Never commit tokens** - Add to `.gitignore`
2. **Use short expiration** - Max 90 days
3. **Rotate regularly** - Especially after incidents
4. **Minimal scopes** - Only grant necessary permissions
5. **IP restrictions** - Enable for production tokens
6. **Monitor usage** - Check logs regularly
7. **Revoke compromised** - Immediately deactivate suspicious tokens

## 🧪 Testing

### Automated Full Test

```bash
node scripts/test-cms-api.js
```

Tests:
- ✓ Schema deployment
- ✓ Token creation
- ✓ List pages (GET)
- ✓ Create page (POST)
- ✓ Get page (GET)
- ✓ Update page (PUT)
- ✓ Delete page (DELETE)
- ✓ Verify deletion

### Manual Testing

```bash
# Set token
export API_TOKEN="bax_live_xxxxx"

# Test read
curl http://localhost:3000/api/v1/cms/pages \
  -H "Authorization: Bearer $API_TOKEN"

# Test write
curl -X POST http://localhost:3000/api/v1/cms/pages \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "test",
    "type": "page",
    "translations": [{"language_code": "en", "title": "Test", "content": "Test"}]
  }'
```

## 🔌 MCP Server Integration

Beispiel MCP Server Config:

```json
{
  "mcpServers": {
    "bookax": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"],
      "env": {
        "BOOKAX_API_URL": "https://book.ax/api/v1",
        "BOOKAX_API_TOKEN": "bax_live_xxxxx"
      }
    }
  }
}
```

## 📖 Usage Examples

### Node.js

```javascript
const API_URL = 'https://book.ax/api/v1';
const API_TOKEN = process.env.BOOKAX_API_TOKEN;

async function listPages() {
  const response = await fetch(`${API_URL}/cms/pages`, {
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
    },
  });
  
  const data = await response.json();
  return data.data.pages;
}

async function createPage(pageData) {
  const response = await fetch(`${API_URL}/cms/pages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pageData),
  });
  
  return response.json();
}
```

### Python

```python
import os
import requests

API_URL = 'https://book.ax/api/v1'
API_TOKEN = os.environ['BOOKAX_API_TOKEN']

def list_pages():
    response = requests.get(
        f'{API_URL}/cms/pages',
        headers={'Authorization': f'Bearer {API_TOKEN}'}
    )
    return response.json()['data']['pages']

def create_page(page_data):
    response = requests.post(
        f'{API_URL}/cms/pages',
        headers={
            'Authorization': f'Bearer {API_TOKEN}',
            'Content-Type': 'application/json'
        },
        json=page_data
    )
    return response.json()
```

## 🐛 Troubleshooting

### Token nicht erkannt

```
Error: Invalid token
```

**Lösung:**
- Prüfe Token-Format (muss mit `bax_` starten)
- Prüfe ob Token aktiv ist (`is_active = true`)
- Prüfe Expiration (`expires_at`)

### Insufficient permissions

```
Error: Insufficient permissions. Required: cms:write
```

**Lösung:**
- Token braucht den Scope `cms:write` oder `admin`
- Update Token scopes via Admin API

### Rate limit exceeded

```
Error: Rate limit exceeded. Resets at 2025-11-16T15:30:00Z
```

**Lösung:**
- Warte bis Reset-Zeit
- Erhöhe `rate_limit` via Admin API
- Verwende separaten Token für High-Traffic

## 📈 Monitoring

### Check Token Usage

```bash
# Via Admin API
curl http://localhost:3000/api/admin/api-tokens/{token_id} \
  -H "Authorization: Bearer {JWT_TOKEN}"
```

### Check Logs

```sql
-- Recent usage
SELECT * FROM api_token_logs
WHERE token_id = 'xxx'
ORDER BY created_at DESC
LIMIT 100;

-- Usage statistics
SELECT 
  endpoint,
  method,
  COUNT(*) as request_count,
  AVG(response_time_ms) as avg_response_time
FROM api_token_logs
WHERE token_id = 'xxx'
  AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY endpoint, method
ORDER BY request_count DESC;
```

## 🎯 Next Steps

1. **Implement remaining CMS endpoints:**
   - Categories
   - Images
   - Content Blocks
   
2. **Extend to other modules:**
   - Hotels API
   - Bookings API
   - Analytics API
   
3. **Add MCP Server:**
   - Create dedicated MCP server
   - Test with Claude Desktop
   
4. **Production hardening:**
   - Enable IP restrictions
   - Set up monitoring alerts
   - Implement token rotation

## 📝 License

Part of Book.ax - Hotel Booking Platform  
© 2025 7Akdeniz

---

**Created:** 16. November 2025  
**Status:** ✅ Ready for Production  
**Tested:** ✓ Full CRUD operations
