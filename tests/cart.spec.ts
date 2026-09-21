import { test, expect } from '../fixtures/cartFixtures';
import { SearchPage } from '../pages/SearchPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

test('cart total is correct after adding items', async ({ authenticatedPage }) => {
  const searchPage = new SearchPage(authenticatedPage);
  const productPage = new ProductPage(authenticatedPage);
  const cartPage = new CartPage(authenticatedPage);

  await authenticatedPage.goto('/');
  await searchPage.searchFor('Epic Sub Zero Driver');
  await searchPage.openFirstResult();
  await productPage.addToCart();

  await authenticatedPage.goto('/');
  await searchPage.searchFor('CHRONOGRAPH');
  await searchPage.openFirstResult();
  await productPage.addToCart();

  await cartPage.goto();
  await expect(authenticatedPage.getByRole('heading', { name: 'Shopping cart' })).toBeVisible();

  await cartPage.expectTotalIsCorrect();
});
