import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { STORAGE_STATE_PATH } from '../storageState';

// Test account credentials, not secrets.
const BEARSTORE_USERNAME = 'lovely.canada@gmail.com';
const BEARSTORE_PASSWORD = 'test123';

setup('authenticate', async ({ page }) => {
  const username = BEARSTORE_USERNAME;
  const password = BEARSTORE_PASSWORD;

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(username, password);
  await loginPage.expectLoggedIn(username.split('@')[0]);

  await page.context().storageState({ path: STORAGE_STATE_PATH });
});
