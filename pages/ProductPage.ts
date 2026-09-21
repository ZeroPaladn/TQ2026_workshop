import { expect, type Page } from '@playwright/test';

export class ProductPage {
  constructor(private readonly page: Page) {}

  async addToCart() {
    const basketLink = this.page.getByRole('link', { name: /Shopping Basket/ });
    const previousCount = await basketLink.textContent();

    await this.page.getByRole('link', { name: 'Add to cart' }).click();

    await expect(basketLink).not.toHaveText(previousCount ?? '');
  }
}
