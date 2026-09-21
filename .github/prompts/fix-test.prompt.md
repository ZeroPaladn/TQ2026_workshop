---
description: "Diagnose and fix a failing Playwright test using its failure output/trace"
agent: "agent"
argument-hint: "Name or path of the failing test/spec, or paste the failure output"
tools: ["read", "search", "edit", "execute", "testFailure"]
---
Diagnose and fix the failing Playwright test identified by the user.

Follow these steps:

1. Reproduce the failure: run `npx playwright test <spec file> -g "<test name>"` (or the full suite if the target isn't specified) and read the failure output/trace. Use the `testFailure` tool if failure context is already available.
2. Find the root cause before editing anything — check whether it is:
   - A locator that no longer matches the UI (stale selector, renamed role/label/text).
   - A timing/synchronization issue (missing await, relying on a state that hasn't settled) — fix with Playwright's auto-waiting/web-first assertions, never `waitForTimeout`.
   - A genuine regression in application behavior — flag this to the user instead of masking it.
   - Broken shared setup in a Page Object (`pages/`) or fixture (`fixtures/`).
3. Apply the smallest fix that addresses the root cause, per [../copilot-instructions.md](../copilot-instructions.md) and [../../AGENTS.md](../../AGENTS.md):
   - Keep selector fixes inside the relevant Page Object, not the spec file.
   - Prefer `getByRole`/`getByLabel`/`getByPlaceholder`/`getByText`/`getByAltText`/`getByTitle`/`getByTestId` (in that order) over brittle CSS/XPath.
   - Preserve existing test intent and coverage; don't weaken assertions to make the test pass.
   - Don't change unrelated tests or refactor beyond what's needed to fix the failure.
4. Re-run the test (and the full spec file) to confirm it passes and nothing else regressed.
5. Report the root cause, the fix applied, and the verification command/result.
