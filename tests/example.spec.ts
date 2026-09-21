import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

test('search', async ({ page }) => {
  await page.goto('/');

  const searchInput = page.getByRole('searchbox').or(page.getByPlaceholder(/search/i));
  await searchInput.fill('bear');

  const searchButton = page.getByRole('button', { name: /search/i });
  await searchButton.click();

  await expect(page.getByText(/no results|no products found|0 results/i)).toBeVisible();
});

