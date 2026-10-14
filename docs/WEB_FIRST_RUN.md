# Tasky v2.4 — Web-based first run (no CLI admin registration)

## Scenario A — first run with an empty database

1. Run `mvn spring-boot:run` from `Tasky/backend` (or `.\run-tasky.bat` from the `Tasky` folder).
2. Open `http://localhost:8080/login.html`, choose **Create an account**.
3. The server reports that no accounts exist, so the registration page displays **Set up your workspace**.
4. Enter your name, a unique email, password and confirmation (12+ characters, maximum 72 UTF-8 bytes). Submit.
5. The server atomically saves a BCrypt-hashed administrator account, marked as the initial workspace owner in a unique database column. The browser cannot choose its own role.
6. Sign in through the ordinary login page and create your first project.
7. Teammates register through the same registration page; they receive the **MEMBER** role and must be assigned to projects.

## Scenario B — existing database

- If any account already exists, the first-owner bootstrap is skipped entirely.
- Existing roles and passwords are not modified. New self-registered users always become Members.
- If the previous database contains your projects, preserve `backend/data` when updating. An extracted new directory points to a different, initially empty H2 file unless you migrate the folder.

## Optional private owner setup code (strongly recommended for public hosting)

With the server stopped, configure `TASKY_OWNER_SETUP_TOKEN` as a long random secret in your server environment/secret manager, then start normally. The first-registration page displays an additional **Workspace setup code** password field. The backend verifies the code before granting first-account ownership. It does not require creating any account via a terminal command.

For Docker Compose, this variable is required by default in `.env`. Never commit real setup codes, database credentials or user passwords into version control. If deploying with no code configured, ensure only a trusted person can reach the site until the first admin account has been claimed. The database uniqueness constraint prevents simultaneous signups from both becoming the initial owner; a signup that loses that race may receive HTTP 409 and should retry.

## Routes

- `/login.html` — sign in
- `/register.html` — web signup
- `GET /api/auth/csrf` — CSRF token for unauthenticated forms
- `GET /api/auth/setup-state` — `{ownerRegistration,setupTokenRequired,registrationEnabled}` booleans (no credentials returned)
- `POST /api/auth/register` — name, email, password, confirmPassword, optional setupToken; response includes email and saved server-decided role
- `/` — authenticated workspace

## Manual verification checklist

1. First startup shows **Started TaskyApplication** with no FIRST RUN/ADMIN_EMAIL error.
2. Visiting `/` while logged out redirects to login.
3. Signup shows initial-workspace owner notice when account database is empty.
4. Register first account → login → confirm user role Admin and no sample projects.
5. Register second account using a separate browser/private session → Member role, no existing project access.
6. Admin adds second account to a project → Member sees project and assigned work.
7. Verify existing task editing and status changes work, and My Tasks displays assigned/created tasks.
8. With a configured setup token, a wrong token must reject the **first** registration; the correct token permits it.
9. Stop/restart the application and verify both users can still sign in and records persist.
10. Run `mvn clean test` and `mvn clean package` before any hosting decision.
