import { test, expect, Page } from '@playwright/test';

/**
 * Admin Routes E2E Tests
 * 
 * Tests all admin panel routes with different user roles:
 * - Admin: Full access to all routes
 * - Hotelier: Should be blocked from admin routes
 * - Guest: Should be blocked from admin routes
 * - Unauthenticated: Should redirect to login
 */

// Test users from seed data
const TEST_USERS = {
  admin: {
    email: 'admin@bookax.local',
    password: 'Password123!',
    role: 'admin'
  },
  hotelier: {
    email: 'hotelier@bookax.local',
    password: 'Password123!',
    role: 'hotelier'
  },
  guest: {
    email: 'guest@bookax.local',
    password: 'Password123!',
    role: 'guest'
  }
};

// Admin routes to test
const ADMIN_ROUTES = [
  { path: '/admin', title: 'Admin Dashboard', expectedContent: 'Dashboard' },
  { path: '/admin/users', title: 'User Management', expectedContent: 'All Users' },
  { path: '/admin/hotels', title: 'Hotel Management', expectedContent: 'Hotel Management' },
  { path: '/admin/bookings', title: 'All Bookings', expectedContent: 'Total Bookings' },
  { path: '/admin/finances', title: 'Financial Reports', expectedContent: 'Total Revenue' },
  { path: '/admin/settings', title: 'System Settings', expectedContent: 'System Settings' },
];

/**
 * Helper: Login with credentials
 */
async function loginAs(page: Page, userType: 'admin' | 'hotelier' | 'guest') {
  const user = TEST_USERS[userType];
  
  await page.goto('/de/login');
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);
  await page.click('button[type="submit"]');
  
  // Wait for redirect after login
  await page.waitForURL(/\/(de|admin|panel)/, { timeout: 5000 });
}

/**
 * Helper: Logout
 */
async function logout(page: Page) {
  // Try to find logout button (could be in different places)
  try {
    await page.click('text=Logout', { timeout: 2000 });
  } catch {
    // If not found, clear storage manually
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  }
}

test.describe('Admin Routes - Access Control', () => {
  
  test.beforeEach(async ({ page }) => {
    // Clear storage before each test
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  test.describe('Admin User - Full Access', () => {
    
    test.beforeEach(async ({ page }) => {
      await loginAs(page, 'admin');
    });

    for (const route of ADMIN_ROUTES) {
      test(`should access ${route.title} (${route.path})`, async ({ page }) => {
        await page.goto(route.path);
        
        // Check title
        await expect(page).toHaveTitle(/Admin Panel/);
        
        // Check for expected content
        await expect(page.locator('body')).toContainText(route.expectedContent);
        
        // Check for modern layout (space-y-6 wrapper)
        const hasModernLayout = await page.locator('.space-y-6').count() > 0;
        expect(hasModernLayout).toBeTruthy();
        
        // Check NO old security banners
        const hasSecurityBanner = await page.locator('text=/ADMIN ONLY.*Unauthorized/i').count();
        expect(hasSecurityBanner).toBe(0);
        
        // Check NO old horizontal navigation
        const hasOldNav = await page.locator('nav.bg-white.shadow').count();
        expect(hasOldNav).toBe(0);
        
        // Screenshot for documentation
        await page.screenshot({ 
          path: `test-results/screenshots/admin-${route.path.replace(/\//g, '-')}.png`,
          fullPage: true 
        });
      });
    }

    test('should have consistent sidebar navigation', async ({ page }) => {
      await page.goto('/admin');
      
      // Check sidebar exists
      const sidebar = page.locator('aside');
      await expect(sidebar).toBeVisible();
      
      // Check all navigation links exist
      const navLinks = [
        'Dashboard',
        'Hotels',
        'Bookings',
        'Users',
        'Finances',
        'Analytics',
        'CMS',
        'Settings'
      ];
      
      for (const link of navLinks) {
        await expect(sidebar.locator(`text=${link}`)).toBeVisible();
      }
    });

    test('should navigate between admin pages', async ({ page }) => {
      await page.goto('/admin');
      
      // Navigate to Users
      await page.click('a[href="/admin/users"]');
      await expect(page).toHaveURL('/admin/users');
      await expect(page.locator('body')).toContainText('All Users');
      
      // Navigate to Hotels
      await page.click('a[href="/admin/hotels"]');
      await expect(page).toHaveURL('/admin/hotels');
      await expect(page.locator('body')).toContainText('Hotel Management');
      
      // Navigate to Settings
      await page.click('a[href="/admin/settings"]');
      await expect(page).toHaveURL('/admin/settings');
      await expect(page.locator('body')).toContainText('System Settings');
    });
  });

  test.describe('Hotelier User - Blocked Access', () => {
    
    test.beforeEach(async ({ page }) => {
      await loginAs(page, 'hotelier');
    });

    for (const route of ADMIN_ROUTES) {
      test(`should be blocked from ${route.title} (${route.path})`, async ({ page }) => {
        await page.goto(route.path);
        
        // Should show unauthorized message or redirect
        const isUnauthorized = 
          (await page.locator('text=/unauthorized/i').count()) > 0 ||
          (await page.locator('text=/access denied/i').count()) > 0 ||
          (await page.url()) === 'http://localhost:3000/' ||
          (await page.url()).includes('/de/login');
        
        expect(isUnauthorized).toBeTruthy();
      });
    }
  });

  test.describe('Guest User - Blocked Access', () => {
    
    test.beforeEach(async ({ page }) => {
      await loginAs(page, 'guest');
    });

    for (const route of ADMIN_ROUTES) {
      test(`should be blocked from ${route.title} (${route.path})`, async ({ page }) => {
        await page.goto(route.path);
        
        // Should show unauthorized message or redirect
        const isUnauthorized = 
          (await page.locator('text=/unauthorized/i').count()) > 0 ||
          (await page.locator('text=/access denied/i').count()) > 0 ||
          (await page.url()) === 'http://localhost:3000/' ||
          (await page.url()).includes('/de/login');
        
        expect(isUnauthorized).toBeTruthy();
      });
    }
  });

  test.describe('Unauthenticated User - Redirect to Login', () => {
    
    for (const route of ADMIN_ROUTES) {
      test(`should redirect to login from ${route.path}`, async ({ page }) => {
        await page.goto(route.path);
        
        // Should redirect to login or show auth required
        const requiresAuth = 
          (await page.url()).includes('/login') ||
          (await page.locator('text=/login/i').count()) > 0 ||
          (await page.locator('text=/session expired/i').count()) > 0;
        
        expect(requiresAuth).toBeTruthy();
      });
    }
  });
});

test.describe('Admin Routes - Layout Consistency', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin');
  });

  test('all pages should use space-y-6 layout', async ({ page }) => {
    for (const route of ADMIN_ROUTES) {
      await page.goto(route.path);
      
      const hasSpaceY6 = await page.locator('.space-y-6').count() > 0;
      expect(hasSpaceY6).toBeTruthy();
    }
  });

  test('no pages should have old bg-gray-50 wrapper', async ({ page }) => {
    for (const route of ADMIN_ROUTES) {
      await page.goto(route.path);
      
      // Check for old min-h-screen bg-gray-50 pattern
      const hasOldWrapper = await page.evaluate(() => {
        const divs = document.querySelectorAll('div.min-h-screen.bg-gray-50');
        // Exclude the AdminLayout wrapper (which is ok)
        const nonLayoutWrappers = Array.from(divs).filter(div => 
          !div.classList.contains('flex') || div.children.length > 1
        );
        return nonLayoutWrappers.length > 0;
      });
      
      expect(hasOldWrapper).toBeFalsy();
    }
  });

  test('no pages should have security banners', async ({ page }) => {
    for (const route of ADMIN_ROUTES) {
      await page.goto(route.path);
      
      const hasBanner = await page.locator('.bg-red-600, text=/ADMIN ONLY/i').count();
      expect(hasBanner).toBe(0);
    }
  });

  test('no pages should have duplicate horizontal navigation', async ({ page }) => {
    for (const route of ADMIN_ROUTES) {
      await page.goto(route.path);
      
      const hasOldNav = await page.locator('nav.bg-white.shadow').count();
      expect(hasOldNav).toBe(0);
    }
  });
});

test.describe('Admin Routes - Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin');
  });

  test('Users page: should display users and filters', async ({ page }) => {
    await page.goto('/admin/users');
    
    // Check filters exist
    await expect(page.locator('text=Filter by Role')).toBeVisible();
    await expect(page.locator('text=Filter by Status')).toBeVisible();
    
    // Check table headers
    await expect(page.locator('text=User')).toBeVisible();
    await expect(page.locator('text=Role')).toBeVisible();
    await expect(page.locator('text=Status')).toBeVisible();
  });

  test('Hotels page: should display hotel status filters', async ({ page }) => {
    await page.goto('/admin/hotels');
    
    // Check status filters
    await expect(page.locator('text=Pending Approvals')).toBeVisible();
    await expect(page.locator('text=All Hotels')).toBeVisible();
  });

  test('Bookings page: should display stats cards', async ({ page }) => {
    await page.goto('/admin/bookings');
    
    // Check stats cards exist
    await expect(page.locator('text=Total Bookings')).toBeVisible();
    await expect(page.locator('text=Confirmed')).toBeVisible();
    
    // Check filters
    await expect(page.locator('text=Search')).toBeVisible();
    await expect(page.locator('select')).toHaveCount(2); // Status + Source filters
  });

  test('Finances page: should display financial overview', async ({ page }) => {
    await page.goto('/admin/finances');
    
    // Check financial cards
    await expect(page.locator('text=Total Revenue')).toBeVisible();
    await expect(page.locator('text=Total Commissions')).toBeVisible();
    
    // Check date range filter
    await expect(page.locator('text=7 Days')).toBeVisible();
    await expect(page.locator('text=30 Days')).toBeVisible();
  });

  test('Settings page: should display settings sections', async ({ page }) => {
    await page.goto('/admin/settings');
    
    // Check settings sections exist
    await expect(page.locator('text=Commission Settings')).toBeVisible();
    await expect(page.locator('text=System Settings')).toBeVisible();
    
    // Check save/reset buttons
    await expect(page.locator('button:has-text("Save All Settings")')).toBeVisible();
  });
});

test.describe('Admin Routes - Performance', () => {
  
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin');
  });

  test('all pages should load within 3 seconds', async ({ page }) => {
    for (const route of ADMIN_ROUTES) {
      const startTime = Date.now();
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      console.log(`${route.path} loaded in ${loadTime}ms`);
      expect(loadTime).toBeLessThan(3000);
    }
  });
});
