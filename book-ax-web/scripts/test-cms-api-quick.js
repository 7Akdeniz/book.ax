#!/usr/bin/env node
// =====================================================
// QUICK CMS API TEST (ohne Schema-Deployment)
// =====================================================
// Testet CMS API mit bestehendem Admin-Account
// =====================================================

const readline = require('readline');

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

// Colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  console.log(`\n${colors.cyan}━━━ Step ${step}: ${message} ━━━${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();
  return { response, data };
}

// Test variables
let jwtToken = null;
let createdPageId = null;
const testSlug = `test-page-${Date.now()}`;

// =====================================================
// Step 1: Login as Admin
// =====================================================
async function step1_login() {
  logStep(1, 'Login as Admin');
  
  // Check for environment variables or command line args
  const email = process.env.ADMIN_EMAIL || process.argv[2];
  const password = process.env.ADMIN_PASSWORD || process.argv[3];

  if (!email || !password) {
    logError('Please provide admin credentials:');
    console.log('  Method 1: Environment variables');
    console.log('    ADMIN_EMAIL=admin@book.ax ADMIN_PASSWORD=xxx node scripts/test-cms-api-quick.js');
    console.log('');
    console.log('  Method 2: Command line arguments');
    console.log('    node scripts/test-cms-api-quick.js admin@book.ax password');
    console.log('');
    throw new Error('Missing credentials');
  }

  logInfo(`Logging in as ${email}...`);
  
  const { response, data } = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  console.log('DEBUG - Response status:', response.status);
  console.log('DEBUG - Response data:', data);

  if (data.accessToken) {
    jwtToken = data.accessToken;
    logSuccess(`Logged in successfully!`);
    logInfo(`User ID: ${data.user.id}`);
    logInfo(`Role: ${data.user.role}`);
    
    if (data.user.role !== 'admin') {
      logError('User is not an admin!');
      throw new Error('Insufficient permissions');
    }
    
    return;
  }

  logError('Login failed: ' + (data.error || 'Unknown error'));
  throw new Error('Login failed');
}

// =====================================================
// Step 2: Test List Pages
// =====================================================
async function step2_testList() {
  logStep(2, 'Test GET /api/v1/cms/pages');
  
  const { response, data } = await apiRequest('/api/v1/cms/pages?language_code=en&limit=5');
  
  if (response.ok && data.success) {
    logSuccess('List pages successful');
    logInfo(`Found ${data.data.total} pages`);
    if (data.data.pages.length > 0) {
      console.log('\nFirst page:');
      console.log(`  Slug: ${data.data.pages[0].slug}`);
      console.log(`  Title: ${data.data.pages[0].translation?.title || 'N/A'}`);
      console.log(`  Status: ${data.data.pages[0].status}`);
    }
  } else {
    logError('List pages failed');
    console.log('Response:', data);
    throw new Error('Test failed');
  }
}

// =====================================================
// Step 3: Create Page (with JWT)
// =====================================================
async function step3_createPage() {
  logStep(3, 'Test POST /api/v1/cms/pages (with JWT)');
  
  const pageData = {
    slug: testSlug,
    type: 'page',
    status: 'draft',
    translations: [
      {
        language_code: 'en',
        title: 'Test Page from API (JWT Auth)',
        excerpt: 'This is a test page created via JWT authentication',
        content: '<h1>Test Page</h1><p>Created with JWT token.</p>',
      },
      {
        language_code: 'de',
        title: 'Test-Seite von API (JWT Auth)',
        excerpt: 'Dies ist eine Test-Seite mit JWT-Authentifizierung erstellt',
        content: '<h1>Test-Seite</h1><p>Erstellt mit JWT Token.</p>',
      },
    ],
  };
  
  logInfo('Creating page...');
  const { response, data } = await apiRequest('/api/v1/cms/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
    },
    body: JSON.stringify(pageData),
  });
  
  if (response.ok && data.success) {
    createdPageId = data.data.page.id;
    logSuccess(`Page created!`);
    logInfo(`Page ID: ${createdPageId}`);
    logInfo(`Slug: ${data.data.page.slug}`);
  } else {
    logError('Create page failed');
    console.log('Response:', data);
    throw new Error('Test failed');
  }
}

// =====================================================
// Step 4: Get Single Page
// =====================================================
async function step4_getSingle() {
  logStep(4, 'Test GET /api/v1/cms/pages/:id');
  
  const { response, data } = await apiRequest(`/api/v1/cms/pages/${createdPageId}?language=en`);
  
  if (response.ok && data.success) {
    logSuccess('Get single page successful');
    console.log('\nPage details:');
    console.log(`  Slug: ${data.data.page.slug}`);
    console.log(`  Status: ${data.data.page.status}`);
    console.log(`  Translations: ${data.data.page.translations.length}`);
  } else {
    logError('Get single page failed');
    throw new Error('Test failed');
  }
}

// =====================================================
// Step 5: Update Page
// =====================================================
async function step5_updatePage() {
  logStep(5, 'Test PUT /api/v1/cms/pages/:id');
  
  const { response, data } = await apiRequest(`/api/v1/cms/pages/${createdPageId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({
      status: 'published',
      meta_robots: 'index, follow',
    }),
  });
  
  if (response.ok && data.success) {
    logSuccess('Page updated');
    logInfo(`Status: ${data.data.page.status}`);
  } else {
    logError('Update failed');
    throw new Error('Test failed');
  }
}

// =====================================================
// Step 6: Delete Page
// =====================================================
async function step6_deletePage() {
  logStep(6, 'Test DELETE /api/v1/cms/pages/:id');
  
  const { response, data } = await apiRequest(`/api/v1/cms/pages/${createdPageId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
    },
  });
  
  if (response.ok && data.success) {
    logSuccess('Page deleted');
    logInfo(`Deleted: ${data.data.deleted_page_slug}`);
  } else {
    logError('Delete failed');
    throw new Error('Test failed');
  }
}

// =====================================================
// Step 7: Verify Deletion
// =====================================================
async function step7_verifyDeletion() {
  logStep(7, 'Verify deletion');
  
  const { response } = await apiRequest(`/api/v1/cms/pages/${createdPageId}`);
  
  if (response.status === 404) {
    logSuccess('Deletion verified');
  } else {
    logError('Page still exists!');
    throw new Error('Test failed');
  }
}

// =====================================================
// Main
// =====================================================
async function runTests() {
  console.log(`
${colors.cyan}╔════════════════════════════════════════════════════╗
║      BOOK.AX CMS API QUICK TEST (JWT Auth)       ║
╚════════════════════════════════════════════════════╝${colors.reset}
  `);
  
  try {
    await step1_login();
    await step2_testList();
    await step3_createPage();
    await step4_getSingle();
    await step5_updatePage();
    await step6_deletePage();
    await step7_verifyDeletion();
    
    console.log(`
${colors.green}╔════════════════════════════════════════════════════╗
║              ALL TESTS PASSED ✓                   ║
╚════════════════════════════════════════════════════╝${colors.reset}

Summary:
  ✓ Admin login successful
  ✓ GET /api/v1/cms/pages (list)
  ✓ POST /api/v1/cms/pages (create)
  ✓ GET /api/v1/cms/pages/:id (read)
  ✓ PUT /api/v1/cms/pages/:id (update)
  ✓ DELETE /api/v1/cms/pages/:id (delete)
  ✓ Deletion verified

🎉 CMS API ist voll funktionsfähig mit JWT Authentication!

Next: Installiere API Token System für technische Integrationen:
  1. Deploy schema: Supabase Dashboard SQL Editor
  2. Create token: POST /api/admin/api-tokens
  3. Use token: Authorization: Bearer bax_live_xxxxx
    `);
    
    process.exit(0);
  } catch (error) {
    console.log(`
${colors.red}╔════════════════════════════════════════════════════╗
║                  TESTS FAILED ✗                   ║
╚════════════════════════════════════════════════════╝${colors.reset}

Error: ${error.message}
${error.stack}
    `);
    
    // Cleanup
    if (createdPageId && jwtToken) {
      logInfo('Attempting cleanup...');
      try {
        await apiRequest(`/api/v1/cms/pages/${createdPageId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${jwtToken}` },
        });
        logSuccess('Cleanup successful');
      } catch (e) {
        logError('Cleanup failed');
      }
    }
    
    process.exit(1);
  }
}

runTests();
