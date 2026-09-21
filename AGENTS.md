# Project Guidelines

## Project Structure

- Playwright configuration lives in `playwright.config.ts`.
- End-to-end tests live in `tests/` and use TypeScript with `@playwright/test`.
- CI configuration lives in `.github/workflows/`.
- Keep generated Playwright output (`playwright-report/`, `test-results/`, and related
  artifacts) out of source control.

## Development and Validation

- Install dependencies with `npm ci`; keep `package-lock.json` synchronized with
  `package.json`.
- Run the test suite with `npx playwright test`.
- When changing Playwright configuration or browser behavior, run the narrowest
  applicable project or test first, then the full suite.
- Do not add dependencies or scripts unless they are needed by the project and
  documented in the relevant configuration.

## Playwright Testing Rules

- Add or update tests for behavior changes.
- Prefer accessible, user-facing locators such as roles, labels, and visible text.
- Keep tests isolated and independent; do not rely on execution order or shared
  mutable state.
- Use Playwright assertions with built-in retry behavior instead of manual polling.
- Avoid arbitrary sleeps such as `waitForTimeout`; wait for a meaningful page state
  or assertion instead.
- New durable tests should not depend on third-party websites or live external
  services. Prefer a local test server, fixture, or mocked boundary. Existing
  starter smoke tests may remain until the application under test is defined.

## TypeScript Adherence

- Prefer TypeScript for project code and tests; keep compiler-checked types
  meaningful and up to date.
- Prefer inferred types when the initializer makes the type obvious, but add
  explicit types at public boundaries, reusable helpers, and complex data
  structures.
- Avoid `any`, unnecessary type assertions, non-null assertions, and
  `@ts-ignore`; use type guards, validation, or safer Playwright APIs instead.
- Follow existing naming, module, formatting, and async/await conventions.
- Keep browser interactions and test fixtures type-safe; do not hide type errors
  to get a test passing.

## Simplicity and Scope

- Solve the requested problem with the smallest clear change that fits the
  existing architecture.
- Do not add abstractions, wrappers, configuration, dependencies, or framework
  changes without a concrete current use case.
- Prefer straightforward code over speculative extensibility, generalized
  utilities, or premature optimization.
- Reuse an existing helper or pattern when it clearly fits; only extract a new
  abstraction when it removes real duplication or improves a repeated behavior.
- Avoid unrelated refactors and preserve behavior that is not part of the request.

## Security and Tooling

- Never commit credentials, tokens, private keys, or environment-specific secrets.
- Treat new MCP servers, tools, and network access as explicit project-scope changes;
  document why they are needed and keep permissions minimal.
- Validate and constrain external input in tests and supporting scripts.
- Do not use destructive shell commands, unchecked downloads, or hidden fallback
  behavior to make tests pass.
- Review dependency and configuration changes for unexpected network, filesystem, or
  credential access.

## Change Scope

- Make focused changes and preserve existing behavior outside the requested scope.
- Update directly related documentation and workflow configuration when behavior or
  commands change.
- Do not edit generated artifacts by hand.
