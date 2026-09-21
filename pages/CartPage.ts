import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  private readonly lineItemTotals: Locator;
  private readonly subtotal: Locator;
  private readonly shipping: Locator;
  private readonly tax: Locator;
  private readonly total: Locator;

  constructor(private readonly page: Page) {
    this.lineItemTotals = page.locator('.cart-row .cart-col-subtotal .price');
    this.subtotal = page.locator('.cart-summary-subtotal .cart-summary-value');
    this.shipping = page.locator('.cart-summary-shipping .cart-summary-value');
    this.tax = page.locator('.cart-summary-tax .cart-summary-value');
    this.total = page.locator('.cart-summary-total .cart-summary-value');
  }

  async goto() {
    await this.page.goto('/cart');
  }

  private parseCurrency(text: string): number {
    return Number(text.replace(/[^0-9.-]/g, ''));
  }

  private async sumOf(locator: Locator): Promise<number> {
    const values = await locator.allTextContents();
    return values.reduce((sum, value) => sum + this.parseCurrency(value), 0);
  }

  async expectTotalIsCorrect() {
    const lineItemsSum = await this.sumOf(this.lineItemTotals);
    const subtotal = this.parseCurrency(await this.subtotal.innerText());
    const shipping = this.parseCurrency(await this.shipping.innerText());
    const tax = this.parseCurrency(await this.tax.innerText());
    const total = this.parseCurrency(await this.total.innerText());

    expect(subtotal).toBeCloseTo(lineItemsSum, 2);
    expect(total).toBeCloseTo(subtotal + shipping + tax, 2);
  }
}
