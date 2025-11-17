#!/bin/bash

# Script to fix all admin page layouts
# 1. Remove security banners
# 2. Remove horizontal navigation
# 3. Update to modern layout style
# 4. Fix auth patterns

echo "🔧 Fixing Admin Page Layouts..."

# Files to fix
FILES=(
  "src/app/admin/finances/page.tsx"
  "src/app/admin/settings/page.tsx"
  "src/app/admin/bookings/page.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 Processing: $file"
    
    # Remove security banner line
    sed -i '' '/bg-red-600.*adminOnly/d' "$file"
    sed -i '' '/security\.adminOnly.*auditLog/d' "$file"
    sed -i '' '/ADMIN ONLY/d' "$file"
    sed -i '' '/Unauthorized access will be logged/d' "$file"
    sed -i '' '/Audit logging enabled/d' "$file"
    
    # Remove horizontal admin navigation
    sed -i '' '/<nav className="bg-white shadow">/,/<\/nav>/d' "$file"
    
    # Update spacing/container
    sed -i '' 's/min-h-screen bg-gray-50/space-y-6/g' "$file"
    sed -i '' 's/min-h-screen bg-gray-100/space-y-6/g' "$file"
    
    echo "✅ Fixed: $file"
  else
    echo "❌ Not found: $file"
  fi
done

echo ""
echo "🎉 Done! Now run: npm run dev"
