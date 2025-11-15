// =====================================================
// BOOK.AX CMS SYSTEM - TypeScript Types
// =====================================================

export type PageType = 'page' | 'blog' | 'legal' | 'seo' | 'landing';
export type PageStatus = 'draft' | 'published' | 'archived';
export type BlockType = 'text' | 'image' | 'gallery' | 'video' | 'quote' | 'code' | 'table' | 'html' | 'cta';

// =====================================================
// CMS CATEGORY
// =====================================================
export interface CMSCategory {
  id: string;
  slug: string;
  parent_id: string | null;
  icon: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CMSCategoryTranslation {
  id: string;
  category_id: string;
  language_code: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CMSCategoryWithTranslation extends CMSCategory {
  translation?: CMSCategoryTranslation;
  translations?: CMSCategoryTranslation[];
}

// =====================================================
// CMS PAGE
// =====================================================
export interface CMSPage {
  id: string;
  slug: string;
  type: PageType;
  category_id: string | null;
  author_id: string | null;
  status: PageStatus;
  published_at: string | null;
  featured_image_id: string | null;
  meta_robots: string;
  canonical_url: string | null;
  view_count: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CMSPageTranslation {
  id: string;
  page_id: string;
  language_code: string;
  title: string;
  excerpt: string | null;
  content: string; // HTML or JSON from TipTap
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  created_at: string;
  updated_at: string;
}

export interface CMSPageWithTranslation extends CMSPage {
  translation?: CMSPageTranslation;
  translations?: CMSPageTranslation[];
  featured_image?: CMSImage;
  category?: CMSCategoryWithTranslation;
  author?: {
    email: string;
    name?: string;
  };
}

// =====================================================
// CMS IMAGE
// =====================================================
export interface CMSImage {
  id: string;
  filename: string;
  original_filename: string | null;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  storage_path: string;
  cdn_url: string | null;
  thumbnail_url: string | null;
  alt_text: string | null;
  caption: string | null;
  uploader_id: string | null;
  folder: string;
  tags: string[] | null;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

// =====================================================
// CMS CONTENT BLOCK
// =====================================================
export interface CMSContentBlock {
  id: string;
  page_id: string;
  language_code: string;
  block_type: BlockType;
  content: Record<string, any>; // JSONB
  sort_order: number;
  css_classes: string | null;
  custom_styles: Record<string, any> | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

// Block-specific content types
export interface TextBlockContent {
  html: string;
  plaintext?: string;
}

export interface ImageBlockContent {
  image_id: string;
  alt: string;
  caption?: string;
  alignment?: 'left' | 'center' | 'right' | 'full';
  link_url?: string;
}

export interface GalleryBlockContent {
  images: Array<{
    image_id: string;
    alt: string;
    caption?: string;
  }>;
  layout?: 'grid' | 'carousel' | 'masonry';
  columns?: number;
}

export interface VideoBlockContent {
  url: string;
  platform?: 'youtube' | 'vimeo' | 'embed';
  thumbnail?: string;
  title?: string;
}

export interface QuoteBlockContent {
  text: string;
  author?: string;
  source?: string;
}

export interface CodeBlockContent {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export interface TableBlockContent {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface CTABlockContent {
  title: string;
  text: string;
  button_text: string;
  button_url: string;
  style?: 'primary' | 'secondary' | 'success' | 'warning';
}

// =====================================================
// CMS PAGE VERSION
// =====================================================
export interface CMSPageVersion {
  id: string;
  page_id: string;
  language_code: string;
  title: string;
  content: string;
  content_blocks: Record<string, any> | null;
  version_number: number;
  change_summary: string | null;
  created_by: string | null;
  created_at: string;
}

// =====================================================
// API REQUEST/RESPONSE TYPES
// =====================================================

// Create Page
export interface CreatePageRequest {
  slug: string;
  type: PageType;
  category_id?: string;
  status?: PageStatus;
  featured_image_id?: string;
  translations: Array<{
    language_code: string;
    title: string;
    excerpt?: string;
    content: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
  }>;
}

// Update Page
export interface UpdatePageRequest {
  slug?: string;
  type?: PageType;
  category_id?: string;
  status?: PageStatus;
  featured_image_id?: string;
  published_at?: string | null;
  meta_robots?: string;
  canonical_url?: string;
}

// Update Page Translation
export interface UpdatePageTranslationRequest {
  title?: string;
  excerpt?: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

// Create Category
export interface CreateCategoryRequest {
  slug: string;
  parent_id?: string;
  icon?: string;
  translations: Array<{
    language_code: string;
    name: string;
    description?: string;
  }>;
}

// Upload Image
export interface UploadImageRequest {
  file: File;
  alt_text?: string;
  caption?: string;
  folder?: string;
  tags?: string[];
}

export interface UploadImageResponse {
  image: CMSImage;
  message: string;
}

// Create Content Block
export interface CreateContentBlockRequest {
  page_id: string;
  language_code: string;
  block_type: BlockType;
  content: Record<string, any>;
  sort_order?: number;
  css_classes?: string;
  custom_styles?: Record<string, any>;
}

// List Pages
export interface ListPagesRequest {
  type?: PageType;
  status?: PageStatus;
  category_id?: string;
  language_code?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'created_at' | 'updated_at' | 'published_at' | 'view_count' | 'title';
  order?: 'asc' | 'desc';
}

export interface ListPagesResponse {
  pages: CMSPageWithTranslation[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// =====================================================
// EDITOR STATE (für Rich Text Editor)
// =====================================================
export interface EditorState {
  content: string; // HTML or TipTap JSON
  characterCount: number;
  wordCount: number;
  modified: boolean;
}

// =====================================================
// SEO METADATA
// =====================================================
export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  robots?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_card?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
}
