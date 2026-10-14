# Tasky v2.7 — Verified Project Reports crash fix

## Observed symptom

On `http://localhost:8080/#project/<projectId>/project-reports`, the entire page displayed **Unable to connect to Tasky** even though the visible JavaScript error was `Cannot read properties of null (reading 'split')`.

## Source-level root cause and reproduction

The frontend `app.js` used `u.name.split(' ')[0]` for every account in `workloadChart()`. With a member whose `name` property is null, **the original v2.6 source reproduced the exact TypeError** while rendering the Project Reports page. The HTTP `/api/bootstrap` request and CSRF request were successful in the reproduction; the exception occurred during `render()` and was incorrectly labeled a network failure by the catch-all startup screen.

A null/blank display name could come from incomplete legacy records or an unexpected payload. We did not access the user's live database, so the exact record in their database has **not** been identified.

## Changes

- Added `displayName(person)` with fallback to the email username, otherwise "Unnamed member".
- Added `firstName(person)` and removed unsafe `u.name.split(...)` calls in project reports, global analytics, the dashboard and workload summaries.
- Reused the fallback for member labels and avatars so such users do not appear blank.
- Classified startup failures into **connection** and **render** stages. Only genuine failed requests display a connection error; JavaScript render errors offer **Go to Overview** in addition to retry.
- Validate the workspace response arrays before rendering and safely handle an invalid navigation argument.
- Bumped CSS/JS versions to 2.7.0, including project version metadata.

## Regression tests

- `node tests/reports-null-name-smoke.mjs`
- `node tests/workspace-render-resilience-smoke.mjs`
- Run all tests with Node.js: `for %f in (tests\*.mjs) do node "%f"` in Windows Command Prompt, or run files individually in PowerShell.

## Database preservation

No database tables or application.yml values were changed. Stop Spring Boot, back up `backend/data`, and overlay updated sources onto the SAME Tasky directory. If using the full ZIP in a new directory, copy your H2 data folder with Spring Boot **stopped**. Do not run the database reset utility.

## Limitations

This patch handles the reproducible frontend null-name failure. If the live API is also failing or returning different malformed data, inspect the browser DevTools Network tab (`/api/bootstrap` HTTP status) and Spring Boot logs. Maven tests should be run locally before any public launch.
