import { test, expect } from '../fixtures/authFixtures';

test('authenticatedPage starts already logged in', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/');

  await expect(authenticatedPage.getByRole('link', { name: 'lovely.canada' })).toBeVisible();
});
