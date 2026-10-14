# Tasky v2.1 — Kanban and My Tasks patch

## What changed

1. **My Tasks** now includes tasks created by the current user as well as tasks assigned to them, including older unassigned tasks. Tasks created by a user but assigned to a colleague are labeled **Created by me**.
2. **My Tasks filters** include All my work, Assigned to me, Created by me, Unassigned (created by me), Open, and the four statuses.
3. The task creation form opened from **My Tasks** automatically selects the signed-in user as assignee when they belong to the selected project. Creating tasks from the project board still permits unassigned or delegated work.
4. Drag-and-drop now uses an isolated server-side status update with a database flush before writing the activity log, plus duplicate-request prevention in the browser.
5. Concurrent task revisions produce **409 Conflict** rather than an unexplained 500, with a reload and a helpful message in the UI.
6. Regression tests added for drag-and-drop versions, task creator visibility, and My Tasks UI.

## Important limitation

The exact cause of a reported **HTTP 500** cannot be confirmed from the browser message alone. This patch addresses task-transition persistence and optimistic-lock error handling. If a status change still fails, copy the **first `Caused by:` and the surrounding 15–30 lines** from the Spring Boot terminal (do not include passwords or tokens). We can then correct the specific remaining backend exception.

## Apply to an EXISTING Tasky project (keep existing data)

1. Stop Tasky (`Ctrl + C`).
2. Back up your existing Tasky directory. Especially preserve `backend/data/tasky.mv.db` and related files.
3. Extract the `Tasky_v2_1_Task_Workflow_Fixes_Complete_Source.zip` archive to a separate directory.
4. Copy **the following four updated files** from the extracted `Tasky` folder to their same locations in your existing Tasky folder, replacing the old versions:

   - `backend/src/main/java/com/tasky/app/service/TaskyService.java`
   - `backend/src/main/java/com/tasky/app/api/ApiExceptionHandler.java`
   - `backend/src/main/resources/static/js/app.js`
   - `backend/src/main/resources/static/css/style.css`

   Optional for developers: copy the updated `backend/src/test/java/com/tasky/app/TaskyServiceIntegrationTest.java` as well.
5. Do **not** copy or delete database files. This release archive does not contain your H2 database.
6. Reopen VS Code and run the below commands inside your existing `backend` directory:

   ```powershell
   mvn clean test
   mvn spring-boot:run
   ```

7. Refresh the browser with **Ctrl + F5** after the Java server is running.

## Manual verification

- Create a project and add a member; create a task assigned to the member; check **My Tasks** as the creator (it should be displayed and labeled Created by me).
- Create an unassigned task; it should appear in My Tasks as Created by me.
- Create a task directly from My Tasks; your account should be the default assignee if you're a member of that project.
- On a board, move a card To Do → In Progress → Review → Done and verify the status persists after browser refresh.
- Set a task status to Done and verify the completion timestamp in a report; move it back and verify it is reopened.
- Verify another user's assignments only appear as your work if you created those tasks.

## Test status

JavaScript syntax and the project-local dependency-free UI smoke suite passed during packaging. This environment does not have Maven or a populated Maven dependency cache, so **Spring Boot compilation and live database integration tests still require running on your computer**. Do not treat a test mock as evidence that an HTTP 500 has been eliminated on your machine.
