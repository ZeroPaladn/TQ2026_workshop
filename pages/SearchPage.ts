import { type Locator, type Page } from '@playwright/test';

export class SearchPage {
  private readonly searchBox: Locator;

  constructor(private readonly page: Page) {
    this.searchBox = page.getByRole('textbox', { name: 'What are you looking for?' });
  }

  async searchFor(query: string) {
    await this.searchBox.fill(query);
    await this.searchBox.press('Enter');
  }

  async openFirstResult() {
    await this.page.getByRole('heading', { level: 3 }).first().getByRole('link').click();
  }
}
