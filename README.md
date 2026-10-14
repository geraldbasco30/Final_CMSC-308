# Tasky v2.7 — Reliable Project Reports and Workspace Rendering

Tasky is a Java 21 / Spring Boot 4.1.1 project and task management web application with an original Jira-inspired UI, Kanban drag-and-drop, projects, teams, task tracking, comments, activity history, reports, and exports. The complete Java backend and frontend are included. No sample projects, fake accounts, or preview-only fallback are included.

## v2.7 — Project Reports JavaScript crash fixed

- Source-identified and locally reproduced `Cannot read properties of null (reading 'split')` on the `#project/.../project-reports` route: `workloadChart()` directly split a member name even when the field was null or blank. Reports now safely derive a display name from the supplied name or email, with a final fallback of "Unnamed member".
- The same name-handling fix now applies to the dashboard, workload list, avatars, selectors and member labels.
- Startup errors distinguish **a failed server request** from **a page rendering failure**. A browser render error no longer falsely reports an Internet/server outage, and offers a link back to Overview.
- Additional bootstrap response validation and resilient route parsing. Frontend assets are cache-busted to v2.7.0.
- No database schema changes and no data reset. The report crash was reproduced with a valid HTTP response containing a null member name, then verified fixed with a regression test.
- The full Java/Spring Boot build has not been independently run in the packaging environment; run `mvn clean test` on your computer before deployment.

## Existing v2.6 features — no project approval required

**Every registered account can immediately create its own projects and tasks.** Accounts still have distinct MEMBER, MANAGER, and ADMIN workspace roles, but project creation is no longer reserved for workspace administrators. A new user signs in, clicks **Create your first project**, becomes that project's **Lead**, then creates and assigns tasks in its Kanban board. Nothing needs to be approved by an administrator.

- **My Tasks with no projects** offers **Create project** rather than a task form with an empty project selector.
- **Project lead** can manage their project's settings, team, and tasks, without globally promoting the member to Administrator.
- **Add teammate by email** in Manage team: if the teammate has registered already, the project lead can grant access to **that project only**, without administrator approval. Unregistered users need to register first.
- **Separation**: newly registered members cannot browse or edit other users' projects just because they can create their own.
- **No database reset or schema changes** for this update; your existing accounts, tasks, projects, and passwords stay in the same H2 database.
- **Project key input** now generates valid suggestions for single-word names as well as multiword names.

## Fixes in v2.5

- **Workspace loading:** server requests now have clear timeouts and error/retry screens. An independent HTML fallback catches missing or broken JavaScript modules instead of displaying “Setting up your workspace…” indefinitely.
- **Fresh browser assets:** the main CSS and JavaScript URLs are versioned to prevent stale v2.4 bundles from continuing after an update.
- **Task creation:** JPA now uses the saved/managed task returned by the repository when creating a record (important with application-assigned UUIDs).
- **Task workflow regression checks:** added cases for Done → To Do, completion-date reset, and creating a fresh To Do task after existing work is completed.
- **No changes to account setup:** continue to register/login in the browser; no first-run administrator BAT process.

**Diagnosis note:** We did not have your server's Java stack trace for the failed task action. These fixes improve the identified risk paths and error visibility, but do **not** prove your specific HTTP error is resolved. Run `mvn clean test` and, if an error remains, send the first `Caused by:` message from the Spring Boot terminal (do not include passwords).

## What was introduced in v2.4

**You no longer need to run `first-run.bat`, supply an admin email/password in the terminal, or edit Java configuration before starting a new workspace.** Tasky now starts with an empty database. Open the website, click **Create an account**, and register normally:

- **First account in an empty database:** automatically becomes the **workspace Administrator** so it can create projects and assign teams.
- **All later self-registrations:** become **Members**, can create their own projects and tasks immediately, and can access someone else’s projects only when invited by that project’s lead.
- **Existing Tasky databases:** accounts, roles, passwords, projects, tasks and memberships are retained. The first-account flow does not run if accounts already exist.
- Passwords are BCrypt-hashed, unique emails are enforced, CSRF protection is on, and the server determines roles (the browser cannot submit a role).
- Initial administrator registration can be protected by an optional private setup code for hosted deployments.

## Requirements

- Java JDK 21 (Java 25 may also work; the target is 21)
- Apache Maven 3.9 or newer
- Windows 10/11, Linux or macOS
- PostgreSQL and HTTPS reverse proxy for a genuine multi-user production deployment

## Quick start in VS Code (Windows)

1. Extract the full ZIP and open the `Tasky` folder in VS Code.
2. Open an integrated terminal in **`Tasky/backend`**, the folder containing `pom.xml`.
3. Run:

   ```powershell
   mvn clean test
   mvn spring-boot:run
   ```

   Or from the **`Tasky`** root folder, run `./run-tasky.bat` in PowerShell as `.\run-tasky.bat`.
4. Once you see `Started TaskyApplication`, visit **http://localhost:8080**.
5. Click **Create an account**. The **first** registered account becomes the administrator automatically. Use a unique password of 12–120 characters (maximum 72 UTF-8 bytes).
6. You'll be redirected to the login page. Sign in with the same email and password.
7. Any registered user can create their own project immediately. To collaborate, open **Manage team** in your own project and add a registered teammate by email.

**No `first-run.bat` step.** The old file remains only as a harmless backward-compatible alias for `run-tasky.bat`; it no longer asks for credentials.

## Existing installations — preserve your data

Your H2 database is stored at **`backend/data/tasky.mv.db`** relative to the backend directory where the app runs. Tasky does not include your existing database in this ZIP.

- **Recommended:** stop the old app, back up your old `backend/data` directory, and copy the updated *source files* into the same Tasky folder, without deleting the database.
- **If using the full ZIP in a newly extracted directory:** stop both Tasky instances, copy the entire old `backend/data` directory into the NEW `Tasky/backend/data`, and then launch the new app. Never copy the database while the application is running.
- Changing folders without migrating the `data` directory creates a different blank H2 workspace. Your old tasks aren't deleted; they're in the previous folder's database.
- Do **not** use `reset-local-workspace.bat` unless you explicitly intend to remove all local records. Back up data first.

## Security: first account ownership

On a **new empty database**, the first person to register becomes administrator. **Do not expose a brand-new unclaimed workspace to the public Internet:** another person could register first and take ownership.

For hosted deployments, set a long random **`TASKY_OWNER_SETUP_TOKEN`** before startup. The register page will then display a **Workspace setup code** field for the initial account. No terminal-based account creation is required. The token is validated server-side and is never returned to the browser. Existing accounts do not require this code to sign in. Docker Compose requires this setup token by default; local Windows development works without it.

After claiming the first admin account, optionally set `TASKY_REGISTRATION_ENABLED=false` to disable open self-registration. Use HTTPS and `COOKIE_SECURE=true` in production.

## Project features

| Module | Implemented workflows |
| --- | --- |
| Project management | Create, edit, lead transfer, manage members, status, dates, delete |
| Tasks and Kanban | Create/edit/delete, assignees, priority, category, deadline, comments, drag-and-drop, workflow statuses |
| Team | Multiple independent logins, role assignment, account enable/disable, project memberships |
| Tracking | Creator/assignee tracking, audit activity, overdue/completed work, task history |
| Analytics and reports | Overview cards, workload, statuses, progress, activity and CSV export |

## Directory structure

```text
Tasky/
  backend/
    pom.xml
    src/main/java/com/tasky/app/       # backend, authorization, API, persistence
    src/main/resources/application.yml  # configuration
    src/main/resources/static/          # production frontend
    src/test/java/com/tasky/app/        # Java integration tests
    data/                                # generated locally, DO NOT DELETE if you need data
  run-tasky.bat                          # starts Java app without a CLI account setup
  docs/                                  # API, upgrade, registration, release notes
  tests/                                 # frontend smoke tests
```

## Tests

From `Tasky/backend`:

```powershell
mvn clean test
mvn clean package
mvn spring-boot:run
```

From `Tasky` root (requires Node.js for these optional standalone frontend checks):

```powershell
node tests/registration-smoke.mjs
node tests/first-owner-smoke.mjs
node tests/ui-smoke.mjs
node tests/self-service-smoke.mjs
node tests/startup-errors-smoke.mjs
node tests/reports-null-name-smoke.mjs
node tests/workspace-render-resilience-smoke.mjs
```

Java integration tests cover registration, first owner, self-service member projects, teammate invitations, and project isolation. **The full Maven/Java integration suite has not been executed in this packaging environment**; run it on your local machine and report compiler or runtime exceptions before treating this as a deployment-ready build. Frontend tests and static source/package checks were run during packaging.

## For production deployment

This is a **release candidate, not independently audited production software**. Before publishing to the Internet, finish: PostgreSQL migration/backup testing; HTTPS with secure session cookies; reliable DB schema migration; login/registration rate limits; email verification/password recovery; monitoring and deployment smoke tests; penetration/security review. See `docs/RELEASE_CHECKLIST.md` and `docs/WEB_FIRST_RUN.md`.
