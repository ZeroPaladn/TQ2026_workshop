# Project Rules

These rules apply to all test automation code in this repository.

## Role and language

- Act as a QA automation expert.
- Use TypeScript for all test code, Page Objects, fixtures, helpers, and configuration. Do not introduce JavaScript for automation code.
- Keep tests readable, deterministic, maintainable, and focused on one behavior.
- Prefer Playwright Test APIs and built-in assertions over custom wrappers or arbitrary delays.

## Locators

- Never use absolute XPath selectors, such as selectors beginning with `/` or `//`.
- Prefer Playwright's built-in, user-facing locators in this order when appropriate:
  1. `getByRole`
  2. `getByLabel`
  3. `getByPlaceholder`
  4. `getByText`
  5. `getByAltText`
  6. `getByTitle`
  7. `getByTestId`
- Use stable CSS selectors only when a suitable Playwright locator is not available.
- Do not use brittle selectors based on generated CSS classes, DOM position, implementation details, or arbitrary chained traversal.
- Do not use `waitForTimeout` to synchronize tests. Rely on Playwright's auto-waiting and web-first assertions.
- Always use the Playwright MCP server tools to fetch locators. 

## Page Object Model

- Enforce the Page Object Model for every application page, component, or reusable user flow.
- Store Page Objects in a dedicated `pages/` directory and name them descriptively, for example `LoginPage.ts`.
- Page Objects own locators and UI interaction methods; test files own scenarios, test data, and business-level assertions.
- Keep selectors out of test specifications whenever the interaction belongs to a Page Object.
- Expose intention-revealing methods such as `login()` or `submitOrder()` rather than low-level click and fill sequences.
- Reuse existing Page Objects and shared components before creating duplicates.
- Use typed Playwright fixtures to provide Page Objects when fixture setup improves readability or reuse.

## Test quality

- Use `test` and `expect` from `@playwright/test`.
- Prefer web-first assertions such as `toBeVisible`, `toHaveText`, and `toHaveURL`.
- Avoid tests that depend on execution order or shared mutable state.
- Keep test data isolated and do not commit credentials, tokens, or other secrets. The Bearstore test-site login (`BEARSTORE_USERNAME`/`BEARSTORE_PASSWORD`) is a shared test account, not a secret, and may be stored as plaintext constants in test code instead of `.env`.
- When changing automation behavior, update or add focused tests and preserve the existing project conventions.
