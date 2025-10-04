import { test, expect } from '@playwright/test';

test('access protected page using stored GitHub session', async ({ browser }) => {
  const context = await browser.newContext({ storageState: 'auth.json' });
  
  const page = await context.newPage();

  await page.goto('https://ambitious-tree-05189ec03-47.westeurope.1.azurestaticapps.net/blog');
  await expect(page.locator('h1')).toHaveText('Posts');
});