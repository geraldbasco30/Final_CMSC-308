# Tasky release gate — REQUIRED before public launch

## Code and integration
- [ ] `cd backend && mvn clean test` completes successfully on a clean checkout.
- [ ] `mvn clean package` builds a runnable JAR with JDK 21.
- [ ] Clean first run bootstraps only one administrator, zero projects and zero tasks.
- [ ] Test project create/edit/delete (deletion confirmed with project key), roles, memberships and task access.
- [ ] Test task creation/update/drag/drop, status history, comments, assignee changes, overdue calculations, CSV exports.
- [ ] Test admin/manager/member access rules, disable and re-enable, own password changes and logout.
- [ ] Test disconnected frontend: must show connection failure, never sample data.
- [ ] Run browser tests on desktop, tablet and mobile; verify keyboard accessibility.

## Deployment and protection
- [ ] HTTPS is enforced; reverse proxy configured; `COOKIE_SECURE=true`.
- [ ] PostgreSQL used with automated backups and verified restoration.
- [ ] Replace Hibernate `ddl-auto: update` with schema migrations for production.
- [ ] Harden passwords, plan user invites/password recovery and add login rate limiting.
- [ ] Review administrator and project permissions for all API endpoints.
- [ ] Validate concurrency, error handling, audit coverage, and high-volume performance.
- [ ] Run dependency CVE audit, security headers/CSP review and a penetration test.
- [ ] Implement health checks, error monitoring, and alerts.
- [ ] Review privacy/data protection, record retention, terms, and operational support.

**Current status:** Development/release candidate; not certified ready for unsupervised public launch.
