# Playwright E2E Tests for Book.ax Admin Panel

## 📋 Overview

Comprehensive end-to-end tests for the Book.ax admin panel using Playwright. Tests cover:

- ✅ **Access Control**: Admin, Hotelier, Guest, and Unauthenticated users
- ✅ **Layout Consistency**: Modern `space-y-6` layout on all pages
- ✅ **Security**: No old banners, no duplicate navigation
- ✅ **Functionality**: Filters, stats, forms on each page
- ✅ **Performance**: Load times under 3 seconds

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install -D @playwright/test
npx playwright install
```

### 2. Make sure Dev Server is Running

```bash
npm run dev
```

### 3. Run Tests

```bash
# Run all tests
npx playwright test

# Run with UI (recommended for development)
npx playwright test --ui

# Run specific test file
npx playwright test tests/e2e/admin-routes.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run only failed tests
npx playwright test --last-failed
```

## 📊 Test Coverage

### Admin Routes Tested

| Route | Access Control | Layout | Functionality |
|-------|---------------|--------|---------------|
| `/admin` | ✅ | ✅ | ✅ |
| `/admin/users` | ✅ | ✅ | ✅ |
| `/admin/hotels` | ✅ | ✅ | ✅ |
| `/admin/bookings` | ✅ | ✅ | ✅ |
| `/admin/finances` | ✅ | ✅ | ✅ |
| `/admin/settings` | ✅ | ✅ | ✅ |

### Test Users (from seed data)

```typescript
{
  admin: 'admin@bookax.local' / 'Password123!',
  hotelier: 'hotelier@bookax.local' / 'Password123!',
  guest: 'guest@bookax.local' / 'Password123!'
}
```

## 🧪 Test Suites

### 1. Access Control Tests

Tests that verify proper authentication and authorization:

- **Admin User**: Should have full access to all routes
- **Hotelier User**: Should be blocked from admin routes
- **Guest User**: Should be blocked from admin routes
- **Unauthenticated**: Should redirect to login

```bash
npx playwright test --grep "Access Control"
```

### 2. Layout Consistency Tests

Ensures all pages follow the modern layout:

- Uses `space-y-6` wrapper
- No old `min-h-screen bg-gray-50` wrappers
- No security banners (`bg-red-600`)
- No duplicate horizontal navigation

```bash
npx playwright test --grep "Layout Consistency"
```

### 3. Functionality Tests

Tests specific features on each page:

- Users: Filters, table, role management
- Hotels: Status filters, approval buttons
- Bookings: Stats cards, search, filters
- Finances: Financial cards, date range
- Settings: Settings sections, save buttons

```bash
npx playwright test --grep "Functionality"
```

### 4. Performance Tests

Measures page load times (must be < 3 seconds):

```bash
npx playwright test --grep "Performance"
```

## 📸 Screenshots & Reports

Tests automatically capture screenshots on failure:

```bash
# View HTML report after running tests
npx playwright show-report
```

Screenshots are saved to: `test-results/screenshots/`

## 🔧 Configuration

Edit `playwright.config.ts` to customize:

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30 * 1000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```

## 🐛 Debugging Tests

### Run in Debug Mode

```bash
npx playwright test --debug
```

### Run Specific Test

```bash
npx playwright test -g "should access Admin Dashboard"
```

### Generate Code (record actions)

```bash
npx playwright codegen http://localhost:3000
```

## 📈 CI/CD Integration

Add to your CI pipeline (e.g., GitHub Actions):

```yaml
- name: Install Playwright
  run: npm install -D @playwright/test && npx playwright install

- name: Run E2E Tests
  run: npx playwright test

- name: Upload Report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## 📝 Adding New Tests

```typescript
test('should do something', async ({ page }) => {
  await page.goto('/admin/new-page');
  
  // Check content
  await expect(page.locator('h1')).toHaveText('Expected Title');
  
  // Interact
  await page.click('button');
  
  // Verify result
  await expect(page.locator('.success')).toBeVisible();
});
```

## 🔄 Test Maintenance

When adding new admin routes:

1. Add to `ADMIN_ROUTES` array in `admin-routes.spec.ts`
2. Add functionality test if needed
3. Run full test suite to verify

## 📞 Support

If tests fail:

1. Check dev server is running on port 3000
2. Verify test users exist in database (run seed script)
3. Check browser console in headed mode: `--headed`
4. View trace: `npx playwright show-trace trace.zip`

## 🎯 Next Steps

- [ ] Add tests for form submissions
- [ ] Add tests for hotel approval workflow
- [ ] Add tests for user role changes
- [ ] Add visual regression testing
- [ ] Add API tests
