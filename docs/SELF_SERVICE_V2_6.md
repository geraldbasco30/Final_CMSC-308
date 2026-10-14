# Tasky v2.6 — Account-created project workflow

1. Any visitor registers with full name, email and a strong password, then signs in. The initial workspace owner is ADMIN, later signups are MEMBER.
2. If the signed-in user has no projects, Overview shows a **Create your first project** button, My Tasks shows **Create project**, and trying to create a task takes them to the project form.
3. All active registered accounts can `POST /api/projects` and become the new project LEAD and first project member. A MEMBER's global role is not elevated.
4. They can `POST /api/tasks`, `PATCH /api/tasks/{id}`, `PATCH /api/tasks/{id}/status`, and manage that project's settings. My Tasks includes tasks assigned to or created by their account.
5. Project leads can `POST /api/projects/{id}/members/invite` with JSON `{"email":"teammate@example.com"}` to add existing registered accounts to only that project.
6. User-access controls continue to deny other members visibility into private projects, tasks, project membership, and changes; project invitation requires lead access (or elevated global role).
7. Project creation keys must be globally unique. A duplicate returns HTTP 409, and the user can choose another key.

To verify locally: `mvn clean test` (in `backend`) and `node tests/self-service-smoke.mjs` (from Tasky root), then browser-test two regular member accounts. Preserve the existing `backend/data` folder on upgrades.
