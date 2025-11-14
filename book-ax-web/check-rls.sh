#!/bin/bash

# 🔍 Quick RLS Status Check

echo "🔐 RLS Status Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 To check RLS status in Supabase:"
echo ""
echo "1. Go to: https://supabase.com/dashboard/project/_/editor"
echo "2. Paste this query:"
echo ""
cat << 'EOF'
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ RLS Enabled'
    ELSE '❌ RLS Disabled'
  END as status,
  (SELECT COUNT(*) FROM pg_policies p WHERE p.tablename = t.tablename) as policy_count
FROM pg_tables t
WHERE schemaname = 'public'
AND tablename NOT LIKE 'pg_%'
ORDER BY tablename;
EOF
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Expected result: All tables with '✅ RLS Enabled' and policy_count > 0"
echo ""
