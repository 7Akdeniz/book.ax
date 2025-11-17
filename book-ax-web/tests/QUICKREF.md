# 🎭 Playwright E2E Tests - Quick Reference

## ⚡ Quick Commands

```bash
# Run all tests
npm run test:e2e

# Run with interactive UI (recommended)
npm run test:e2e:ui

# See browser while testing
npm run test:e2e:headed

# Debug failed test
npm run test:e2e:debug

# View HTML report
npm run test:e2e:report

# Use the quick-start script
./tests/run-tests.sh
```

## 🎯 Run Specific Tests

```bash
# Run only access control tests
npx playwright test --grep "Access Control"

# Run only layout tests
npx playwright test --grep "Layout Consistency"

# Run only functionality tests
npx playwright test --grep "Functionality"

# Run tests for specific route
npx playwright test -g "Users page"

# Run single test
npx playwright test -g "should access Admin Dashboard"
```

## 📊 Test Results

After running tests, find:

- **HTML Report**: `playwright-report/index.html`
- **Screenshots**: `test-results/screenshots/`
- **Videos**: `test-results/` (on failure)
- **JSON Results**: `test-results.json`

## 🐛 Debugging

```bash
# Run in debug mode (step through)
npm run test:e2e:debug

# Run specific test in debug
npx playwright test --debug -g "should access Users"

# Show trace for failed test
npx playwright show-trace test-results/[test-name]/trace.zip

# Generate test code (record actions)
npx playwright codegen http://localhost:3000
```

## 📝 Test Users

```typescript
Admin:     admin@bookax.local / Password123!
Hotelier:  hotelier@bookax.local / Password123!
Guest:     guest@bookax.local / Password123!
```

## 🔍 What's Tested

### ✅ Access Control
- Admin: Full access to all 6 routes
- Hotelier/Guest: Blocked with "unauthorized"
- Unauthenticated: Redirect to login

### ✅ Layout Consistency
- All pages use `space-y-6` wrapper
- No old `min-h-screen bg-gray-50` layouts
- No security banners (`bg-red-600`)
- No duplicate horizontal navigation

### ✅ Functionality
- Users: Filters, table, role management
- Hotels: Status filters, approval workflow
- Bookings: Stats, search, filters
- Finances: Cards, date range, transactions
- Settings: Sections, save/reset buttons

### ✅ Performance
- All pages load < 3 seconds

## 📈 CI/CD

```yaml
# .github/workflows/e2e.yml
- run: npm install
- run: npx playwright install --with-deps
- run: npm run test:e2e
- uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## 🛠️ Configuration

**File**: `playwright.config.ts`

Key settings:
- `baseURL`: `http://localhost:3000`
- `timeout`: 30 seconds per test
- `retries`: 2 in CI, 0 locally
- `workers`: 1 in CI, parallel locally

## 📸 Screenshots

Automatic screenshots on failure:
- Saved to `test-results/screenshots/`
- Full page captures
- Named by test and route

## 🎨 Test Structure

```typescript
test.describe('Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Setup
  });

  test('Test name', async ({ page }) => {
    await page.goto('/route');
    await expect(page).toHaveTitle(/Expected/);
  });
});
```

## 🔄 Adding New Tests

1. Open `tests/e2e/admin-routes.spec.ts`
2. Add route to `ADMIN_ROUTES` array
3. (Optional) Add functionality test
4. Run: `npm run test:e2e:ui`

## 💡 Tips

- Use `--ui` for development (visual feedback)
- Use `--headed` to see what's happening
- Use `--debug` to step through tests
- Screenshots help diagnose failures
- Traces show full test execution

## 🆘 Troubleshooting

**Tests fail immediately**:
- Check dev server is running: `curl http://localhost:3000`
- Verify test users exist in database

**Timeout errors**:
- Increase timeout in config
- Check for slow network/database

**Element not found**:
- Run in headed mode to see UI
- Check selector is correct
- Add `await page.waitForSelector()`

**Flaky tests**:
- Add `await page.waitForLoadState('networkidle')`
- Use more specific selectors
- Add explicit waits

## 📚 Resources

- [Playwright Docs](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Test Generator](https://playwright.dev/docs/codegen)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer)
