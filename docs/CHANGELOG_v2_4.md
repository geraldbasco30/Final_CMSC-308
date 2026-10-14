# Tasky v2.4 — Browser-only workspace initialization

- Replaced the startup-only `BootstrapAdmin` bean with a non-operative compatibility class. This removes the empty-database startup error, including for in-place source updates.
- Added website first-account ownership (first signup = Admin, subsequent signups = Member).
- Added a database-unique owner claim to protect against two simultaneous initial administrator registrations.
- Added optional `TASKY_OWNER_SETUP_TOKEN` for public/server-based owner claims.
- Added `GET /api/auth/setup-state`, first-owner copy and setup-code UI in `/register.html`, and new successful owner signup messaging.
- Continued preserving existing accounts and database records without re-seeding demo content.
- Updated Windows runner, Docker Compose, environment examples, documentation, and standalone frontend/Java integration tests.
- No database resets; Hibernate schema update adds a nullable owner claim column for existing accounts.

Release status: frontend smoke suites pass; live Maven Java build not independently verified in this environment.
