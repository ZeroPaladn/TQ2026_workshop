import { expect, type Page } from '@playwright/test';

export type NewAccount = {
  email: string;
  username: string;
  password: string;
};

export class RegisterPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/register');
  }

  async register({ email, username, password }: NewAccount) {
    await this.page.getByRole('textbox', { name: 'Email *' }).fill(email);
    await this.page.getByRole('textbox', { name: 'Username *' }).fill(username);
    await this.page.getByRole('textbox', { name: 'Password *', exact: true }).fill(password);
    await this.page.getByRole('textbox', { name: 'Confirm password *' }).fill(password);
    await this.page.getByRole('button', { name: 'Register' }).click();
  }

  async expectRegistered() {
    await expect(this.page.getByText('Your registration completed')).toBeVisible();
  }
}
