---
description: "Add a new test case to an existing spec file for a given page or user flow"
agent: "agent"
argument-hint: "Describe the page/flow and the scenario to cover, e.g. 'cart.spec.ts: applying an invalid coupon shows an error'"
tools: ["read", "search", "edit", "execute"]
---
Add a new test case to an existing spec file in `tests/` for the page or flow described by the user.

Follow these steps:

1. Identify the target spec file in `tests/` (or ask which one if it's ambiguous) and the Page Object(s) in `pages/` involved in the flow.
2. Reuse existing Page Objects and fixtures (see `fixtures/`) instead of duplicating locators or setup logic. If the flow needs a new interaction method, add it to the relevant Page Object rather than inlining locators in the test.
3. Follow the conventions in [../copilot-instructions.md](../copilot-instructions.md) and [../../AGENTS.md](../../AGENTS.md):
   - Use `test`/`expect` from `@playwright/test` (or the project's typed fixture wrapper, e.g. `../fixtures/cartFixtures`).
   - Use Playwright's built-in, user-facing locators (`getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`, `getByAltText`, `getByTitle`, `getByTestId`) in that priority order. Never use absolute XPath.
   - Use web-first assertions (`toBeVisible`, `toHaveText`, `toHaveURL`, etc.). Never use `waitForTimeout`.
   - Keep the test isolated and independent of execution order or shared mutable state.
   - Keep test data isolated; don't add secrets. The Bearstore test-site login may use plaintext constants.
4. Write one new, focused test that covers exactly the described scenario, with a clear, descriptive test name.
5. Run the new test with `npx playwright test <spec file> -g "<test name>"` and fix any failures before finishing.
6. Report which file(s) were changed and the command used to verify the test passes.
