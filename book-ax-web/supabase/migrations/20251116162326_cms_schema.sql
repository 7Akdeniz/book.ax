-- =====================================================
-- BOOK.AX CMS SYSTEM DATABASE SCHEMA
-- =====================================================
-- Multi-Language Content Management System
-- Features: Rich Text, Images, SEO, Categories, Versioning
-- =====================================================

-- =====================================================
-- 1. CMS CATEGORIES (Optional, für Blog etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS cms_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) NOT NULL UNIQUE,
  parent_id UUID REFERENCES cms_categories(id) ON DELETE SET NULL,
  icon VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cms_categories_slug ON cms_categories(slug);
CREATE INDEX idx_cms_categories_parent ON cms_categories(parent_id);

-- =====================================================
-- 2. CMS CATEGORY TRANSLATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS cms_category_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES cms_categories(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, language_code)
);

CREATE INDEX idx_cms_category_translations_category ON cms_category_translations(category_id);
CREATE INDEX idx_cms_category_translations_language ON cms_category_translations(language_code);

-- =====================================================
-- 3. CMS PAGES (Main Content Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(512) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL DEFAULT 'page', -- 'page', 'blog', 'legal', 'seo'
  category_id UUID REFERENCES cms_categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Status & Publishing
  status VARCHAR(20) NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'archived'
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- SEO & Metadata
  featured_image_id UUID, -- FK zu cms_images (wird später hinzugefügt)
  meta_robots VARCHAR(100) DEFAULT 'index, follow',
  canonical_url VARCHAR(512),
  
  -- Analytics & Sorting
  view_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CHECK (type IN ('page', 'blog', 'legal', 'seo', 'landing')),
  CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE INDEX idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX idx_cms_pages_type ON cms_pages(type);
CREATE INDEX idx_cms_pages_status ON cms_pages(status);
CREATE INDEX idx_cms_pages_category ON cms_pages(category_id);
CREATE INDEX idx_cms_pages_author ON cms_pages(author_id);
CREATE INDEX idx_cms_pages_published ON cms_pages(published_at) WHERE status = 'published';

-- =====================================================
-- 4. CMS PAGE TRANSLATIONS (Multi-Language Content)
-- =====================================================
CREATE TABLE IF NOT EXISTS cms_page_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL,
  
  -- Content
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL, -- Rich Text (HTML oder JSON from TipTap)
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description VARCHAR(512),
  meta_keywords TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(page_id, language_code)
);

CREATE INDEX idx_cms_page_translations_page ON cms_page_translations(page_id);
CREATE INDEX idx_cms_page_translations_language ON cms_page_translations(language_code);
CREATE INDEX idx_cms_page_translations_title ON cms_page_translations(title);

-- Full-text search index für Content
CREATE INDEX idx_cms_page_translations_content_search 
  ON cms_page_translations USING gin(to_tsvector('simple', content));

-- =====================================================
-- 5. CMS IMAGES (Media Library)
-- =====================================================
CREATE TABLE IF NOT EXISTS cms_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255),
  mime_type VARCHAR(100) NOT NULL,
  size_bytes BIGINT NOT NULL,
  width INTEGER,
  height INTEGER,
  
  -- Storage
  storage_path VARCHAR(512) NOT NULL UNIQUE,
  cdn_url VARCHAR(512),
  thumbnail_url VARCHAR(512),
  
  -- Metadata
  alt_text TEXT,
  caption TEXT,
  uploader_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Organization
  folder VARCHAR(255) DEFAULT 'uploads',
  tags TEXT[], -- Array für Tagging
  
  -- Usage Tracking
  usage_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cms_images_filename ON cms_images(filename);
CREATE INDEX idx_cms_images_folder ON cms_images(folder);
CREATE INDEX idx_cms_images_uploader ON cms_images(uploader_id);
CREATE INDEX idx_cms_images_tags ON cms_images USING gin(tags);

-- Add FK constraint for featured_image_id
ALTER TABLE cms_pages 
  ADD CONSTRAINT fk_cms_pages_featured_image 
  FOREIGN KEY (featured_image_id) 
  REFERENCES cms_images(id) ON DELETE SET NULL;

-- =====================================================
-- 6. CMS CONTENT BLOCKS (Flexible Content Sections)
-- =====================================================
-- Für Block-basierte Content-Erstellung (wie WordPress Gutenberg)
CREATE TABLE IF NOT EXISTS cms_content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL,
  
  -- Block Configuration
  block_type VARCHAR(50) NOT NULL, -- 'text', 'image', 'gallery', 'video', 'quote', 'code', 'table'
  content JSONB NOT NULL, -- Flexible JSON content
  sort_order INTEGER DEFAULT 0,
  
  -- Styling
  css_classes TEXT,
  custom_styles JSONB,
  
  -- Visibility
  is_visible BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CHECK (block_type IN ('text', 'image', 'gallery', 'video', 'quote', 'code', 'table', 'html', 'cta'))
);

CREATE INDEX idx_cms_content_blocks_page ON cms_content_blocks(page_id);
CREATE INDEX idx_cms_content_blocks_type ON cms_content_blocks(block_type);
CREATE INDEX idx_cms_content_blocks_order ON cms_content_blocks(page_id, sort_order);

-- =====================================================
-- 7. CMS PAGE VERSIONS (Optional: Version Control)
-- =====================================================
CREATE TABLE IF NOT EXISTS cms_page_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL,
  
  -- Snapshot
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  content_blocks JSONB, -- Snapshot of all blocks
  
  -- Version Info
  version_number INTEGER NOT NULL,
  change_summary TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(page_id, language_code, version_number)
);

CREATE INDEX idx_cms_page_versions_page ON cms_page_versions(page_id);
CREATE INDEX idx_cms_page_versions_created ON cms_page_versions(created_at DESC);

-- =====================================================
-- 8. TRIGGERS FOR AUTO-UPDATE
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_cms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cms_categories_updated
  BEFORE UPDATE ON cms_categories
  FOR EACH ROW EXECUTE FUNCTION update_cms_updated_at();

CREATE TRIGGER trigger_cms_category_translations_updated
  BEFORE UPDATE ON cms_category_translations
  FOR EACH ROW EXECUTE FUNCTION update_cms_updated_at();

CREATE TRIGGER trigger_cms_pages_updated
  BEFORE UPDATE ON cms_pages
  FOR EACH ROW EXECUTE FUNCTION update_cms_updated_at();

CREATE TRIGGER trigger_cms_page_translations_updated
  BEFORE UPDATE ON cms_page_translations
  FOR EACH ROW EXECUTE FUNCTION update_cms_updated_at();

CREATE TRIGGER trigger_cms_images_updated
  BEFORE UPDATE ON cms_images
  FOR EACH ROW EXECUTE FUNCTION update_cms_updated_at();

-- =====================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE cms_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_page_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_page_versions ENABLE ROW LEVEL SECURITY;

-- Public Read Access for Published Content
CREATE POLICY "Public can view published pages"
  ON cms_pages FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public can view published page translations"
  ON cms_page_translations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cms_pages 
      WHERE cms_pages.id = cms_page_translations.page_id 
      AND cms_pages.status = 'published'
    )
  );

CREATE POLICY "Public can view published categories"
  ON cms_categories FOR SELECT
  USING (true);

CREATE POLICY "Public can view category translations"
  ON cms_category_translations FOR SELECT
  USING (true);

CREATE POLICY "Public can view used images"
  ON cms_images FOR SELECT
  USING (usage_count > 0);

-- Admin Full Access
CREATE POLICY "Admins have full access to categories"
  ON cms_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins have full access to pages"
  ON cms_pages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins have full access to page translations"
  ON cms_page_translations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins have full access to images"
  ON cms_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins have full access to content blocks"
  ON cms_content_blocks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins have full access to page versions"
  ON cms_page_versions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- =====================================================
-- 10. SAMPLE DATA FOR LEGAL PAGES
-- =====================================================

-- Create default legal pages
INSERT INTO cms_pages (slug, type, status, published_at) VALUES
  ('impressum', 'legal', 'draft', NOW()),
  ('datenschutz', 'legal', 'draft', NOW()),
  ('agb', 'legal', 'draft', NOW()),
  ('about', 'page', 'draft', NOW())
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 11. USEFUL VIEWS
-- =====================================================

-- View: Complete Page with Translations
CREATE OR REPLACE VIEW cms_pages_full AS
SELECT 
  p.id,
  p.slug,
  p.type,
  p.status,
  p.published_at,
  p.view_count,
  pt.language_code,
  pt.title,
  pt.excerpt,
  pt.content,
  pt.meta_title,
  pt.meta_description,
  pt.meta_keywords,
  c.slug as category_slug,
  ct.name as category_name,
  u.email as author_email,
  i.cdn_url as featured_image_url,
  p.created_at,
  p.updated_at
FROM cms_pages p
LEFT JOIN cms_page_translations pt ON p.id = pt.page_id
LEFT JOIN cms_categories c ON p.category_id = c.id
LEFT JOIN cms_category_translations ct ON c.id = ct.category_id AND pt.language_code = ct.language_code
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN cms_images i ON p.featured_image_id = i.id;

-- View: Recently Updated Pages
CREATE OR REPLACE VIEW cms_pages_recent AS
SELECT * FROM cms_pages_full
WHERE status = 'published'
ORDER BY updated_at DESC
LIMIT 20;

-- =====================================================
-- DONE! CMS System Ready
-- =====================================================
-- Deploy: psql -h <host> -U <user> -d <db> -f cms-schema.sql
-- Or: cat cms-schema.sql | supabase db push
-- =====================================================
