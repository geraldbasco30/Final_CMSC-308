# Tasky v2.2 — Identified lazy-entity-ID bug

## Findings from the actual v2.1 Java source

In `TaskyService.allowedTask()` the old code loaded a `TaskItem` through JPA, then immediately used `t.project.id` to check project access. `t.project` has `@ManyToOne(fetch=FetchType.LAZY)`. A Hibernate proxy of `Project` can know its ID internally while the inherited public `id` field is null. Calling `projects.findById(null)` then fails and can surface as a 500 from both `/api/tasks/{id}` and `/api/tasks/{id}/status`.

The response mapper similarly read `t.creator.id` and `t.assignee.id`, risking a missing `creatorId`/`assigneeId` in `/api/bootstrap` even for correctly stored tasks. `My Tasks` depends on those IDs matching the current account, which explains the discrepancy between the project board and the My Tasks page.

This is **a concrete unsafe code path identified through source inspection**. The user's server stack trace for the 500 has not yet been examined, so the exact exception thrown by their installation is still unconfirmed.

## Code changes

- Introduce a `JPA PersistenceUnitUtil.getIdentifier(relation)` helper and replace all 33 direct reads of `.project.id`, `.creator.id`, `.assignee.id`, `.lead.id`, `.account.id`, `.actor.id`, `.author.id` and `.task.id` on JPA associations.
- Ensure `manageProject()` resolves the Project before reading its `lead` field when permissions need to be checked for a non-admin project lead.
- Ensure task assignment membership checks work when passed a lazy Project reference.
- Add a regression test that does `EntityManager.flush(); EntityManager.clear();` after creating a task, then updates status, edits its assignment and loads a fresh workspace snapshot to verify the saved creator and assignee IDs.

## Safe update to a running installation (Windows VS Code)

1. Stop the running Java server using Ctrl+C.
2. Back up the whole existing Tasky directory, especially `backend/data/tasky.mv.db` and any related DB files. **Do not reset or delete it.**
3. Extract the `Tasky_v2_2_Only_Fixed_Files.zip` archive and copy files into the same relative paths in the existing Tasky folder (replace when Windows prompts). The patch deliberately contains no database files.
4. Inside the existing `backend` folder run:

   ```powershell
   mvn clean test
   mvn spring-boot:run
   ```

5. Reload with Ctrl+F5. The existing tasks should persist. Move ASG-101 into In Progress, edit its title or priority, save and refresh, then check My Tasks for work created/assigned to the logged-in account.

## If any 500 remains

Capture the **first** `Caused by:` section and the ~15 following lines from the VS Code Spring Boot terminal. Copy it without passwords, tokens, cookies or personal data. The browser 500 banner alone does not show the underlying Java exception.

## Verification

- JavaScript syntax check: PASS (Node 22).
- Bundled frontend smoke suite: PASS (Node 22).
- Source scan: PASS; no remaining direct `relation.id` reads on lazy association variables in `TaskyService`.
- Maven `mvn clean test`: NOT RUN in this environment (Maven/dependencies unavailable). Must be run on your computer.
