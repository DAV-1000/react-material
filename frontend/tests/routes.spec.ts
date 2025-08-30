import { test, expect } from '@playwright/test';

// List of public routes
const publicRoutes = [
  '/',
  '/features',
  '/testimonials',
  '/highlights',
  '/pricing',
  '/faq',
  '/blog',
  '/about',
  '/careers',
  '/press',
  '/terms',
  '/privacy',
  '/contact',
];

test.describe('Public Routes', () => {
  for (const route of publicRoutes) {
    test(`should load ${route} successfully`, async ({ page, baseURL }) => {
      await page.goto(route.startsWith('http') ? route : `${baseURL}${route}`);
      
      // Check that the page has a body element
      const body = await page.locator('body');
      await expect(body).toBeVisible();

      // Optional: verify that the URL is correct
      await expect(page).toHaveURL(`${baseURL}${route}`);
    });
  }
});