#!/usr/bin/env node
// =====================================================
// BOOK.AX CMS API TESTER
// =====================================================
// Tests all CRUD operations with API Token
// =====================================================

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Colors for console output
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

// =====================================================
// API HELPERS
// =====================================================

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

// =====================================================
// TEST VARIABLES
// =====================================================

let apiToken = null;
let adminUserId = null;
let createdPageId = null;
const testSlug = `test-page-${Date.now()}`;

// =====================================================
// STEP 1: Deploy API Token Schema
// =====================================================

async function step1_deploySchema() {
  logStep(1, 'Deploy API Token Schema to Database');
  
  logInfo('Please run the following command:');
  console.log(`
cd book-ax-web
psql \${DATABASE_URL} < database/api-tokens-schema.sql
  `);
  
  logInfo('Press Enter when done...');
  await new Promise(resolve => {
    process.stdin.once('data', () => resolve());
  });
  
  logSuccess('Schema deployment completed');
}

// =====================================================
// STEP 2: Create API Token
// =====================================================

async function step2_createToken() {
  logStep(2, 'Create API Token via Admin API');
  
  logInfo('You need to login as admin first to get JWT token');
  logInfo('Or provide existing API token');
  
  console.log(`
Options:
1. Use existing API token (paste it)
2. Login as admin and create new token

Enter your choice (1 or 2):
  `);
  
  const choice = await new Promise(resolve => {
    process.stdin.once('data', data => {
      resolve(data.toString().trim());
    });
  });
  
  if (choice === '1') {
    console.log('Paste your API token:');
    apiToken = await new Promise(resolve => {
      process.stdin.once('data', data => {
        resolve(data.toString().trim());
      });
    });
    logSuccess(`Using token: ${apiToken.substring(0, 20)}...`);
  } else {
    console.log('Enter admin email:');
    const email = await new Promise(resolve => {
      process.stdin.once('data', data => resolve(data.toString().trim()));
    });
    
    console.log('Enter admin password:');
    const password = await new Promise(resolve => {
      process.stdin.once('data', data => resolve(data.toString().trim()));
    });
    
    logInfo('Logging in...');
    const { data: loginData } = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (!loginData.accessToken) {
      logError('Login failed!');
      throw new Error('Login failed');
    }
    
    logSuccess('Login successful');
    const jwtToken = loginData.accessToken;
    adminUserId = loginData.user.id;
    
    logInfo('Creating API token...');
    const { data: tokenData } = await apiRequest('/api/admin/api-tokens', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        name: 'CMS Test Token',
        description: 'Auto-generated token for CMS API testing',
        scopes: ['admin', 'cms:read', 'cms:write', 'cms:delete'],
        expires_in_days: 30,
        rate_limit: 10000,
      }),
    });
    
    if (!tokenData.token) {
      logError('Failed to create token!');
      console.log('Response:', tokenData);
      throw new Error('Token creation failed');
    }
    
    apiToken = tokenData.token.token;
    logSuccess(`API Token created: ${apiToken.substring(0, 20)}...`);
    logInfo('⚠️  Save this token securely! It will not be shown again.');
  }
}

// =====================================================
// STEP 3: Test GET (List Pages)
// =====================================================

async function step3_testList() {
  logStep(3, 'Test GET /api/v1/cms/pages (List Pages)');
  
  const { response, data } = await apiRequest('/api/v1/cms/pages?language_code=en&limit=5');
  
  if (response.ok && data.success) {
    logSuccess('List pages successful');
    logInfo(`Found ${data.data.total} pages`);
    if (data.data.pages.length > 0) {
      console.log('\nFirst page:');
      console.log(`  ID: ${data.data.pages[0].id}`);
      console.log(`  Slug: ${data.data.pages[0].slug}`);
      console.log(`  Title: ${data.data.pages[0].translation?.title || 'N/A'}`);
    }
  } else {
    logError('List pages failed');
    console.log('Response:', data);
    throw new Error('Test failed');
  }
}

// =====================================================
// STEP 4: Test POST (Create Page)
// =====================================================

async function step4_testCreate() {
  logStep(4, 'Test POST /api/v1/cms/pages (Create Page)');
  
  const pageData = {
    slug: testSlug,
    type: 'page',
    status: 'draft',
    translations: [
      {
        language_code: 'en',
        title: 'Test Page from API',
        excerpt: 'This is a test page created via API Token',
        content: '<h1>Test Page</h1><p>This page was created using the CMS API with API Token authentication.</p>',
        meta_title: 'Test Page - Book.ax',
        meta_description: 'A test page for API testing',
      },
      {
        language_code: 'de',
        title: 'Test-Seite von API',
        excerpt: 'Dies ist eine Test-Seite, die über API-Token erstellt wurde',
        content: '<h1>Test-Seite</h1><p>Diese Seite wurde mit der CMS-API mit API-Token-Authentifizierung erstellt.</p>',
        meta_title: 'Test-Seite - Book.ax',
        meta_description: 'Eine Test-Seite für API-Tests',
      },
    ],
  };
  
  logInfo('Creating page...');
  const { response, data } = await apiRequest('/api/v1/cms/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
    },
    body: JSON.stringify(pageData),
  });
  
  if (response.ok && data.success) {
    createdPageId = data.data.page.id;
    logSuccess(`Page created successfully!`);
    logInfo(`Page ID: ${createdPageId}`);
    logInfo(`Slug: ${data.data.page.slug}`);
    logInfo(`Translations: ${data.data.page.translations.length}`);
  } else {
    logError('Create page failed');
    console.log('Response:', data);
    throw new Error('Test failed');
  }
}

// =====================================================
// STEP 5: Test GET (Single Page)
// =====================================================

async function step5_testGetSingle() {
  logStep(5, `Test GET /api/v1/cms/pages/${createdPageId} (Get Single Page)`);
  
  const { response, data } = await apiRequest(`/api/v1/cms/pages/${createdPageId}?language=en`);
  
  if (response.ok && data.success) {
    logSuccess('Get single page successful');
    console.log('\nPage details:');
    console.log(`  ID: ${data.data.page.id}`);
    console.log(`  Slug: ${data.data.page.slug}`);
    console.log(`  Type: ${data.data.page.type}`);
    console.log(`  Status: ${data.data.page.status}`);
    console.log(`  Translations: ${data.data.page.translations.length}`);
    if (data.data.page.translations.length > 0) {
      console.log(`  Title (en): ${data.data.page.translations[0].title}`);
    }
  } else {
    logError('Get single page failed');
    console.log('Response:', data);
    throw new Error('Test failed');
  }
}

// =====================================================
// STEP 6: Test PUT (Update Page)
// =====================================================

async function step6_testUpdate() {
  logStep(6, `Test PUT /api/v1/cms/pages/${createdPageId} (Update Page)`);
  
  const updateData = {
    status: 'published',
    meta_robots: 'index, follow',
  };
  
  logInfo('Updating page to published status...');
  const { response, data } = await apiRequest(`/api/v1/cms/pages/${createdPageId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
    },
    body: JSON.stringify(updateData),
  });
  
  if (response.ok && data.success) {
    logSuccess('Page updated successfully');
    logInfo(`Status: ${data.data.page.status}`);
    logInfo(`Published at: ${data.data.page.published_at}`);
  } else {
    logError('Update page failed');
    console.log('Response:', data);
    throw new Error('Test failed');
  }
}

// =====================================================
// STEP 7: Test DELETE (Delete Page)
// =====================================================

async function step7_testDelete() {
  logStep(7, `Test DELETE /api/v1/cms/pages/${createdPageId} (Delete Page)`);
  
  logInfo('Deleting page...');
  const { response, data } = await apiRequest(`/api/v1/cms/pages/${createdPageId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
    },
  });
  
  if (response.ok && data.success) {
    logSuccess('Page deleted successfully');
    logInfo(`Deleted page ID: ${data.data.deleted_page_id}`);
    logInfo(`Deleted page slug: ${data.data.deleted_page_slug}`);
  } else {
    logError('Delete page failed');
    console.log('Response:', data);
    throw new Error('Test failed');
  }
}

// =====================================================
// STEP 8: Verify Deletion
// =====================================================

async function step8_verifyDeletion() {
  logStep(8, 'Verify page is deleted');
  
  const { response, data } = await apiRequest(`/api/v1/cms/pages/${createdPageId}`);
  
  if (response.status === 404 && !data.success) {
    logSuccess('Deletion verified - page not found (correct!)');
  } else {
    logError('Deletion verification failed - page still exists!');
    throw new Error('Test failed');
  }
}

// =====================================================
// MAIN TEST RUNNER
// =====================================================

async function runTests() {
  console.log(`
${colors.cyan}╔════════════════════════════════════════════════════╗
║      BOOK.AX CMS API COMPLETE TEST SUITE         ║
║           with API Token Authentication           ║
╚════════════════════════════════════════════════════╝${colors.reset}
  `);
  
  try {
    await step1_deploySchema();
    await step2_createToken();
    await step3_testList();
    await step4_testCreate();
    await step5_testGetSingle();
    await step6_testUpdate();
    await step7_testDelete();
    await step8_verifyDeletion();
    
    console.log(`
${colors.green}╔════════════════════════════════════════════════════╗
║                   ALL TESTS PASSED ✓              ║
╚════════════════════════════════════════════════════╝${colors.reset}

Summary:
  ✓ Schema deployed
  ✓ API Token created
  ✓ GET /api/v1/cms/pages (list)
  ✓ POST /api/v1/cms/pages (create)
  ✓ GET /api/v1/cms/pages/:id (read)
  ✓ PUT /api/v1/cms/pages/:id (update)
  ✓ DELETE /api/v1/cms/pages/:id (delete)
  ✓ Deletion verified

🎉 CMS API is fully functional!
🔑 Your API Token: ${apiToken?.substring(0, 20)}...

Next steps:
  - Use this token for MCP Server integration
  - Test with other CMS endpoints (images, categories, etc.)
  - Implement rate limiting monitoring
  - Set up automated API tests
    `);
    
    process.exit(0);
  } catch (error) {
    console.log(`
${colors.red}╔════════════════════════════════════════════════════╗
║                    TESTS FAILED ✗                 ║
╚════════════════════════════════════════════════════╝${colors.reset}

Error: ${error.message}
    `);
    
    // Cleanup if page was created
    if (createdPageId && apiToken) {
      logInfo('Attempting cleanup...');
      try {
        await apiRequest(`/api/v1/cms/pages/${createdPageId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${apiToken}` },
        });
        logSuccess('Cleanup successful');
      } catch (cleanupError) {
        logError('Cleanup failed');
      }
    }
    
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  logError(`Fatal error: ${error.message}`);
  process.exit(1);
});
