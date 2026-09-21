import { expect, type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.page.getByRole('textbox', { name: 'Username or email' }).fill(username);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Log in' }).click();
  }

  async expectLoggedIn(username: string) {
    await expect(this.page.getByRole('link', { name: username, exact: false })).toBeVisible();
  }
}
