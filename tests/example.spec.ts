import { expect, test } from '@playwright/test';
import { BearStorePage } from './pages/bear-store.page';

test('searching for bear returns no results', async ({ page }) => {
  const bearStorePage = new BearStorePage(page);
  await bearStorePage.goto();

  await bearStorePage.searchFor('bear');

  await expect(page).toHaveURL(/\/search\?q=bear/);
  await expect(bearStorePage.searchResultHeading).toBeVisible();
  await expect(bearStorePage.noResultsMessage).toBeVisible();
});
