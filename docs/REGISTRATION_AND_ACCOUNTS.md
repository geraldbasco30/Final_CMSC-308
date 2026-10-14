# Tasky v2.4 — Registration and accounts

Tasky registration lives at `/register.html` and login at `/login.html`. A blank database no longer requires `first-run.bat` or `TASKY_ADMIN_EMAIL` / `TASKY_ADMIN_PASSWORD`.

- First signup on an empty database creates the workspace **ADMIN** automatically.
- Subsequent signups (or any signup into an existing database) create a **MEMBER** account.
- Passwords are hashed using BCrypt; emails are normalized and unique, validated by Java, and never become role selectors.
- New Members can log in but cannot see projects until they're assigned to the project. The workspace administrator can add users through the interface.
- Set `TASKY_REGISTRATION_ENABLED=false` to close public registration when you no longer need it.
- For hosting, set `TASKY_OWNER_SETUP_TOKEN` so only someone with the private code can claim the first administrator account; no CLI registration is necessary.

See `docs/WEB_FIRST_RUN.md` for API routes, deployment concerns, upgrade and tests. Registration requires a CSRF token from `GET /api/auth/csrf` and POST to `POST /api/auth/register` with `name`, `email`, `password`, `confirmPassword`, and optional `setupToken`. The successful response includes `role` chosen by the **server**, not the client.
