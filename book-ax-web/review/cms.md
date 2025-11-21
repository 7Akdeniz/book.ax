# 📰 Content Management System (CMS)

**Status:** 🚧 In Progress (Backend + public delivery ready, Admin UI incomplete)  
**Last Updated:** 21. November 2025

## Backend & Database

### Schema & Storage (`supabase/migrations.backup/20251116162326_cms_schema.sql`)
- ✅ Core tables for pages, translations, categories, images, content blocks, versions with RLS + indexes
- ✅ `deploy-cms-schema.sh` helper applies CMS schema + verifies buckets (`cms-media`)
- ✅ Default legal slugs seeded (`impressum`, `datenschutz`, `agb`, `about`)
- 🚧 Page versioning + content blocks exist in DB but no API/UI uses them
- ⏳ Category hierarchy not exposed anywhere in the app yet

### Security & Auth
- ✅ Admin-only Supabase policies for writes; public read for published pages & translations
- ✅ API token scopes (`cms:read|write|delete`) defined in `src/lib/auth/api-token.ts` and used via `verifyJwtOrApiToken`
- ✅ Internal admin APIs (`/api/cms/*`) protected with `verifyAuth` + `requireAdmin`
- 🚧 No audit log/version diff stored when editors update content
- ⏳ No role distinction between copywriters vs admins (all-or-nothing access)

### APIs

#### Pages CRUD (`/api/cms/pages`)
- ✅ **GET** `/api/cms/pages` - List pages with filters (type, status, category, language, search, pagination)
- ✅ **POST** `/api/cms/pages` - Create new page with translations (admin only)
- ✅ **GET** `/api/cms/pages/[id]` - Get single page with translations & blocks
- ✅ **PUT** `/api/cms/pages/[id]` - Update page metadata (slug, type, status, featured image)
- ✅ **DELETE** `/api/cms/pages/[id]` - Delete page (cascades to translations & blocks)

#### Public API (`/api/v1/cms/pages`)
- ✅ **GET** `/api/v1/cms/pages` - Public list (only published, hybrid auth)
- ✅ **POST** `/api/v1/cms/pages` - Create via API token (scope: `cms:write`)
- ✅ **GET** `/api/v1/cms/pages/[id]` - Public single page fetch
- ✅ **PUT** `/api/v1/cms/pages/[id]` - Update via API token (scope: `cms:write`)
- ✅ **DELETE** `/api/v1/cms/pages/[id]` - Delete via API token (scope: `cms:delete`)

#### Media Management (`/api/cms/images`)
- ✅ **GET** `/api/cms/images` - List images with pagination & folder filter
- ✅ **POST** `/api/cms/images` - Upload image to Supabase Storage (admin only, max 10MB)

#### Missing Endpoints
- 🚧 Translation-specific routes (`PUT /api/cms/pages/[id]/translations/[lang]`) referenced by `PageEditor`
- 🚧 No endpoints for categories, content blocks, page versions, or publishing workflow (review/approve)
- 🚧 Input validation currently ad-hoc; needs Zod schemas + clearer error surface

## Admin UI (Content Studio)

### Overview (`src/app/admin/cms/page.tsx`)
- ✅ Entry point with navigation tiles for Pages / Images / Files
- 🚧 Metrics are hard-coded zeros; needs real stats from CMS tables
- ⏳ Image + File sections marked "Coming soon" (no routes implemented)

### Pages List (`src/app/admin/cms/pages/page.tsx`)
- 🚧 Admin gate + scaffolding in place (hero, filters, table shell)
- 🚧 `fetchPages()` TODO leaves list empty; stats and filters are placeholders
- ⏳ Bulk actions, pagination, search wiring, and inline status chips not built

### Page Editor (`src/components/cms/PageEditor.tsx` & `/admin/cms/pages/new`)
- ✅ TipTap-based editor (`RichTextEditor.tsx`) with basic formatting toolbar
- ✅ Supports slug, type, status, SEO meta fields, multi-language tabs (6 hard-coded locales)
- 🚧 Edit view missing (`/admin/cms/pages/[id]` route not created) though component accepts `pageId`
- 🚧 Translation tabs limited to {de,en,fr,es,it,tr}; not synced with 50-locale config nor translation files
- 🚧 No category picker, featured image selector, scheduling, preview, or content blocks UI
- 🚧 Publish workflow simply flips status without confirmation or version bump
- ⏳ Validation, autosave, collaborative locking, and diffing are absent

### Media Library & Files
- 🚧 No UI for `/api/cms/images`; PageEditor prompts for raw URLs instead of opening asset picker
- ⏳ File/document manager (`/admin/cms/files`) not implemented
- ⏳ Image resizing, tagging, usage tracking dashboards missing despite schema support

## Frontend Delivery (`src/app/[locale]/[...slug]/page.tsx`)
- ✅ Server component fetches published page + translation, renders SEO metadata, increments view count
- ✅ Legal documents section reuses CMS pages for `/agb`, `/impressum`, `/datenschutz`
- 🚧 `generateStaticParams` only covers 6 locales & published slugs; remaining 44 languages not pre-built
- 🚧 No draft preview (`?preview=token`) or staged content environment
- ⏳ No fallback route for 404 translation mismatch; currently `notFound()` without alternatives
- ⏳ View-count update is fire-and-forget without rate limiting or bot filtering

## Automation & Integrations
- ✅ API token system documented in `book-ax-web/API_TOKEN_SYSTEM.md` for headless access
- 🚧 `content-automation/` scripts generate markdown, but there is no ingestion pipeline into CMS tables
- ⏳ Webhooks or scheduled revalidation (ISR/tagged cache) not configured for CMS updates

## Testing & Observability

### Manual API Testing
To verify CRUD operations work correctly:

```bash
# 1. Set environment variables
export API_BASE="https://book.ax"  # or http://localhost:3000
export ADMIN_TOKEN="your-jwt-token-here"  # Get from browser DevTools after login

# 2. Test CREATE - Post new page
curl -X POST "$API_BASE/api/cms/pages" \
  -H "Cookie: accessToken=$ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "test-page-123",
    "type": "page",
    "status": "draft",
    "translations": [{
      "language_code": "en",
      "title": "Test Page",
      "content": "<p>Hello world</p>",
      "excerpt": "A test page"
    }]
  }'

# 3. Test READ - List pages
curl "$API_BASE/api/cms/pages?status=draft&page=1&limit=10" \
  -H "Cookie: accessToken=$ADMIN_TOKEN"

# 4. Test READ - Get single page (replace PAGE_ID)
curl "$API_BASE/api/cms/pages/PAGE_ID" \
  -H "Cookie: accessToken=$ADMIN_TOKEN"

# 5. Test UPDATE - Update page status to published
curl -X PUT "$API_BASE/api/cms/pages/PAGE_ID" \
  -H "Cookie: accessToken=$ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "published"}'

# 6. Test DELETE - Remove page
curl -X DELETE "$API_BASE/api/cms/pages/PAGE_ID" \
  -H "Cookie: accessToken=$ADMIN_TOKEN"

# 7. Test public API (no auth for GET)
curl "$API_BASE/api/v1/cms/pages?status=published&language_code=en"

# 8. Test image upload
curl -X POST "$API_BASE/api/cms/images" \
  -H "Cookie: accessToken=$ADMIN_TOKEN" \
  -F "file=@/path/to/image.jpg" \
  -F "alt_text=Test image" \
  -F "folder=test"
```

### Expected Results
- ✅ **CREATE**: Returns `201 Created` with new page object containing `id`, `slug`, `translations`
- ✅ **READ (list)**: Returns `200 OK` with `{ pages: [], total, page, limit, total_pages }`
- ✅ **READ (single)**: Returns `200 OK` with `{ page: {...}, translations: [...], blocks: [...] }`
- ✅ **UPDATE**: Returns `200 OK` with updated page object, `published_at` set if status changed to 'published'
- ✅ **DELETE**: Returns `200 OK` with `{ message: "Page deleted successfully" }`
- ✅ **Public API**: Only returns published pages, respects language filters
- ✅ **Image upload**: Returns `201 Created` with `{ image: {...}, message: "..." }`, file stored in Supabase `cms-media` bucket

### Automated Testing
- 🚧 No unit or integration tests for CMS APIs, PageEditor, or public slug route
- 🚧 Missing Playwright coverage for admin workflows
- ⏳ No monitoring/logging specific to CMS operations (uploads, publish events)

## Known Gaps / TODO
- ⏳ Build pages list data hook + table (sorting, pagination, filters, status chips)
- ⏳ Add `/admin/cms/pages/[id]` detail route w/ read + edit + delete actions
- ⏳ Implement translation CRUD endpoints & sync with 50-language i18n setup
- ⏳ Ship media library UI with picker, upload progress, Supabase Storage integration
- ⏳ Add category management UI + API, and wire to PageEditor
- ⏳ Implement content blocks + page versions end-to-end
- ⏳ Provide preview links, scheduled publish/unpublish, and approval workflow
- ⏳ Harden APIs with Zod validation, rate limiting, and auditing
- ⏳ Cover CMS flows with tests + linting + Storybook/visual regression if needed

## Next Steps
1. **Finish Admin CRUD loop** – implement `/admin/cms/pages/[id]`, connect list + editor to live data, add delete/archive actions.  
2. **Media & taxonomy management** – ship image picker UI, expose `/admin/cms/images` + `/admin/cms/categories` screens, and integrate featured image / category selectors.  
3. **Localization at scale** – dynamic language tabs, translation completeness indicators, and tooling to sync with `messages/*.json`.  
4. **Publishing workflow** – preview tokens, scheduled publish dates, version history, and role-based approvals (editor vs admin).  
5. **Automation & testing** – connect `content-automation` outputs to CMS import APIs, add unit/e2e coverage, and surface metrics/logging for content operations.
