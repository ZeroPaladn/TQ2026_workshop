import { expect, type Locator, type Page } from '@playwright/test';

export class BearStorePage {
  readonly searchResultHeading: Locator;
  readonly noResultsMessage: Locator;

  constructor(private readonly page: Page) {
    this.searchResultHeading = page.getByText('Search result for bear');
    this.noResultsMessage = page.getByText('Your search did not match any products.');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async searchFor(term: string): Promise<void> {
    const searchInput = this.page.getByPlaceholder('What are you looking for?');
    await searchInput.fill(term);
    await searchInput.press('Enter');
    await expect(this.page).toHaveURL(new RegExp(`/search\\?q=${term}`));
  }
}
