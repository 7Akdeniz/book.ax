#!/bin/bash

# =====================================================
# Deploy CMS Schema to Supabase
# =====================================================

echo "🚀 Deploying CMS Schema to Supabase..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found!"
    echo "Install: npm install -g supabase"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "database/cms-schema.sql" ]; then
    echo "❌ cms-schema.sql not found!"
    echo "Make sure you're in the book-ax-web directory"
    exit 1
fi

echo "📋 Schema file: database/cms-schema.sql"
echo ""

# Option 1: Deploy via Supabase CLI (if linked)
if supabase status &> /dev/null; then
    echo "✅ Supabase project detected"
    echo "📤 Deploying schema..."
    
    supabase db push --file database/cms-schema.sql
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ CMS Schema deployed successfully!"
        echo ""
        echo "📊 Created tables:"
        echo "  - cms_categories"
        echo "  - cms_category_translations"
        echo "  - cms_pages"
        echo "  - cms_page_translations"
        echo "  - cms_images"
        echo "  - cms_content_blocks"
        echo "  - cms_page_versions"
        echo ""
        echo "🔐 RLS Policies enabled"
        echo "✨ Triggers configured"
        echo "📈 Views created"
        echo ""
        echo "🎉 CMS System is ready to use!"
        echo ""
        echo "Next steps:"
        echo "1. Create Storage Bucket 'cms-media' in Supabase Dashboard"
        echo "2. Set bucket to public"
        echo "3. Start creating content at /admin/cms/pages"
    else
        echo ""
        echo "❌ Deployment failed!"
        echo "Check the error messages above"
        exit 1
    fi
else
    echo "⚠️  Supabase CLI not linked to a project"
    echo ""
    echo "Manual deployment options:"
    echo ""
    echo "Option 1: Via Supabase Dashboard"
    echo "  1. Open https://supabase.com/dashboard"
    echo "  2. Go to SQL Editor"
    echo "  3. Copy & paste content from database/cms-schema.sql"
    echo "  4. Run the SQL"
    echo ""
    echo "Option 2: Via psql"
    echo "  psql -h <host> -U <user> -d <db> -f database/cms-schema.sql"
    echo ""
    echo "Option 3: Link Supabase CLI"
    echo "  supabase link --project-ref <project-ref>"
    echo "  ./deploy-cms-schema.sh"
fi

echo ""
echo "📚 Documentation: database/CMS_SYSTEM_GUIDE.md"
