import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

test('search', async ({ page }) => {
  await page.goto('/');

  const searchInput = page.getByRole('textbox', { name: 'What are you looking for?' });
  await searchInput.fill('bear');
  await searchInput.press('Enter');

  await expect(page.getByText(/no results|no products found|0 results/i)).toBeVisible();
});

