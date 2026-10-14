# Tasky v2.3 Change Log

**Base:** complete Tasky v2.2 Hibernate relationship fix; preserved all previous files and features.

## New
- Public, CSRF-protected self-registration: `POST /api/auth/register`.
- Java registration request DTO and transactional registration service.
- Unique case-insensitive emails, password confirmation, BCrypt password hashes, role always `MEMBER`.
- Registration feature flag: `TASKY_REGISTRATION_ENABLED`.
- Responsive branded `/register.html` with validation and clear error handling.
- Login-page create-account link and registration-success message.
- Empty-project message that explains how a new Member gets project access.
- Java integration regression tests and dependency-free Node signup wiring test.
- Updated account and upgrade instructions, API documentation and QA checklist.

## Files changed or added
- `backend/src/main/java/com/tasky/app/api/RegistrationRequest.java` (new)
- `backend/src/main/java/com/tasky/app/api/RegistrationController.java` (new)
- `backend/src/main/java/com/tasky/app/service/RegistrationService.java` (new)
- `backend/src/main/java/com/tasky/app/config/SecurityConfig.java`
- `backend/src/main/resources/application.yml`
- `backend/src/main/resources/static/register.html` (new)
- `backend/src/main/resources/static/login.html`
- `backend/src/main/resources/static/js/registration.js` (new)
- `backend/src/main/resources/static/js/login.js` (new)
- `backend/src/main/resources/static/js/app.js`
- `backend/src/main/resources/static/css/style.css`
- `backend/src/test/java/com/tasky/app/TaskyServiceIntegrationTest.java`
- `tests/registration-smoke.mjs` (new)
- `backend/pom.xml` (version bumped to 2.3.0)
- `README.md`, `.env.example`, `docs/API.md`, `docs/QA_CHECKLIST.md`, `docs/REGISTRATION_AND_ACCOUNTS.md` (new)

## Database
No migrations or column changes required; new accounts are inserted into the existing `accounts` table. Preserve your existing `backend/data` directory when updating.

## Verification note
Node tests and static checks passed in this build environment. Full Maven/JUnit/H2 build must be run on a local machine with Maven and its Spring dependencies. Public launch additionally requires HTTPS, proper database backups, anti-abuse controls and a security review.
