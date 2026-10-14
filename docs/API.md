# Tasky REST API (Release 2)

**Base:** `/api`, same origin as the Tasky browser app. All endpoints except `/api/auth/csrf` require a Spring Security authenticated session. Mutations require the anti-CSRF token returned by the CSRF endpoint in `X-XSRF-TOKEN`.

## Authentication
| Method | Path | Notes |
|---|---|---|
| `GET` | `/api/auth/csrf` | Returns `{token, headerName}`; public |
| `POST` | `/login` | HTML form fields `username`, `password`, `_csrf` |
| `POST` | `/logout` | Requires CSRF header |

## Account
| Method | Path | Body |
|---|---|---|
| `POST` | `/api/account/password` | `{currentPassword,newPassword}` (12+ char new password) |

## Workspace
| Method | Path | Notes |
|---|---|---|
| `GET` | `/api/bootstrap` | Authorized snapshot: `me`, `projects`, `members`, `memberships`, `tasks`, `activities`, `comments` |

## Reports
| Method | Path | Notes |
|---|---|---|
| `GET` | `/api/reports/activity` | All authorized activity entries, used for full CSV export |

## Projects
| Method | Path | JSON body |
|---|---|---|
| `POST` | `/api/projects` | `name`, `key`, `description`, `status`, `color`, `startDate`, `targetDate` |
| `PATCH` | `/api/projects/{id}` | Editable subset: `name`, `description`, `status`, `color`, `startDate`, `targetDate`, `leadId` |
| `PUT` | `/api/projects/{id}/members` | `{ "memberIds": ["account-id-1", "account-id-2"] }` |

Project status: `PLANNING`, `ACTIVE`, `ON_HOLD`, `COMPLETED`. Project keys must be unique, 2–10 uppercase letters/numbers starting with a letter. The lead is automatically included in membership changes.

## Tasks
| Method | Path | JSON body |
|---|---|---|
| `POST` | `/api/tasks` | `projectId`, `title`, optional `description`, `status`, `priority`, `category`, `dueDate`, `assigneeId` |
| `PATCH` | `/api/tasks/{id}` | Any editable task field (except key and project ID) |
| `PATCH` | `/api/tasks/{id}/status` | `{ "status": "IN_PROGRESS" }` |
| `DELETE` | `/api/tasks/{id}` | Manager/project lead only |
| `POST` | `/api/tasks/{id}/comments` | `{ "body": "Reviewed and approved" }` |

Allowed task statuses: `TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`. Priorities: `LOW`, `MEDIUM`, `HIGH`, `URGENT`. Dates use ISO-8601 `YYYY-MM-DD` or JSON `null` for blank dates. Assignee ID must identify a member of the corresponding project.

## Members
| Method | Path | JSON body |
|---|---|---|
| `POST` | `/api/members` | `name`, `email`, `password` (≥12 chars), `title`, `role`, `color` |
| `PATCH` | `/api/members/{id}` | `name`, `title`, optionally `role` (admin only), `enabled` |

Workspace roles: `ADMIN`, `MANAGER`, `MEMBER`. `enabled` is a JSON boolean.

## Examples
```bash
# After signing in through the browser, use its authenticated session cookie
# and a matching CSRF header. This shows a request body, not a standalone login:
curl -X POST http://localhost:8080/api/tasks \
  -H 'Content-Type: application/json' \
  -H 'Cookie: JSESSIONID=YOUR_SESSION' \
  -H 'X-XSRF-TOKEN: YOUR_CSRF_TOKEN' \
  --data '{"projectId":"YOUR_PROJECT_ID","title":"Prepare kickoff", "status":"TODO", "priority":"HIGH"}'
```

Success returns the created/updated entity as a safe JSON object (no password hashes). Errors return `{ "error": "reason" }` with an appropriate 400/403/404/409 status. Unexpected server errors are logged server-side.

## Backward compatibility
v1 has no API version prefix yet; add `/api/v2` with compatibility tests when the API becomes public. Current browser uses relative API URLs and can be deployed under the same host.

**Additional endpoint:** `DELETE /api/projects/{id}` — irreversible deletion of project and dependent data, allowed to administrators, managers and the project lead.

**Optimistic concurrency:** `PATCH /api/tasks/{id}` and `/status` accept optional `version`; stale versions return 409.


## Tasky 2.3 account registration

`GET /api/auth/csrf` — public, returns `{ "token": "...", "headerName": "X-XSRF-TOKEN" }`.

`POST /api/auth/register` — public **with CSRF**, JSON body `name`, `email`, `password`, `confirmPassword`. Returns HTTP 201 and a confirmation message/email; creates a restricted MEMBER account. Errors: 400 validation, 409 duplicate email, 403 registration disabled. No privileged roles accepted. Existing Spring Security form login remains `POST /login`.

Full flow, example request, and permission details: `docs/REGISTRATION_AND_ACCOUNTS.md`.


## v2.6 self-service endpoints

- `POST /api/projects`: any **authenticated, enabled** account can create its own project. The requester automatically becomes the project lead and its initial member; no administrator approval is required.
- `POST /api/projects/{id}/members/invite` with `{"email":"registered@company.com"}`: the lead of that project (or a workspace administrator/manager) can add an already registered, enabled account to the project. Requires an authenticated session and CSRF token. Users cannot invite people to projects they do not manage.
- `POST /api/tasks`: any user who already belongs to the specified project can create work in it. Newly registered users can create their own projects first.

The `MEMBER` workspace role is retained when somebody creates a project. It does not grant permission to access unrelated projects, modify global roles, or manage other accounts.
