import { test, expect } from '@playwright/test';

// List of public routes with expected H1 titles
const publicRoutes = [
  { path: '/', title: 'Home' },
  { path: '/features', title: 'Features' },
  { path: '/testimonials', title: 'Testimonials' },
  { path: '/highlights', title: 'Highlights' },
  { path: '/pricing', title: 'Pricing' },
  { path: '/faq', title: 'FAQ' },
  { path: '/blog', title: 'Posts' },
  { path: '/about', title: 'About Us' },
  { path: '/careers', title: 'Careers' },
  { path: '/press', title: 'Press' },
  { path: '/terms', title: 'Terms & Conditions' },
  { path: '/privacy', title: 'Privacy Policy' },
  { path: '/contact', title: 'Contact' },
  { path: '/foo', title: 'Foo' },
];

test.describe('Public Routes', () => {
  for (const route of publicRoutes) {
    test(`should load ${route.path} successfully and have H1 title`, async ({ page, baseURL }) => {
      const url = route.path.startsWith('http') ? route.path : `${baseURL}${route.path}`;
      await page.goto(url);
      
      // Check that the page has a body element
      const body = await page.locator('body');
      await expect(body).toBeVisible();

      // Optional: verify that the URL is correct
      await expect(page).toHaveURL(url);

      // Check for H1 page title
      const h1 = await page.locator('h1');
      await expect(h1).toHaveText(route.title);
    });
  }
});
