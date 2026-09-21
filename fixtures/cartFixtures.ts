import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { RegisterPage } from '../pages/RegisterPage';

type WorkerFixtures = {
  workerStorageStatePath: string;
};

type TestFixtures = {
  authenticatedPage: Page;
};

// Each worker registers its own account so parallel workers never share a shopping basket.
export const test = base.extend<TestFixtures, WorkerFixtures>({
  workerStorageStatePath: [
    async ({ browser }, use, workerInfo) => {
      const authDir = path.resolve(__dirname, '../playwright/.auth');
      fs.mkdirSync(authDir, { recursive: true });
      const storageStatePath = path.join(authDir, `cart-worker-${workerInfo.parallelIndex}.json`);

      const uniqueId = `${workerInfo.parallelIndex}-${Date.now()}`;
      // Override the project's shared storageState so registration starts from a logged-out session.
      const context = await browser.newContext({ storageState: undefined });
      const page = await context.newPage();
      const registerPage = new RegisterPage(page);
      await registerPage.goto();
      await registerPage.register({
        email: `qa-cart-${uniqueId}@example.com`,
        username: `qa-cart-${uniqueId}`,
        password: 'Test12345!',
      });
      await registerPage.expectRegistered();
      await context.storageState({ path: storageStatePath });
      await context.close();

      await use(storageStatePath);
    },
    { scope: 'worker' },
  ],

  authenticatedPage: async ({ browser, workerStorageStatePath }, use) => {
    const context = await browser.newContext({ storageState: workerStorageStatePath });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
