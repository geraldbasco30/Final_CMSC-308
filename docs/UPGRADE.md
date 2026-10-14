# Tasky v2.7 — Safe upgrade without losing your work

1. Stop your Tasky server with `Ctrl+C`.
2. Back up the **entire** existing `Tasky/backend/data/` folder with Spring Boot stopped.
3. Extract `Tasky_v2_7_Upgrade_Files_Preserve_Database.zip` into a temporary folder.
4. Merge the extracted `Tasky/` contents into your **current** `Tasky/` root; replace matching files. **Do not replace or remove `backend/data/`.**
5. In VS Code open the same `Tasky/backend` and run:

   ```powershell
   mvn clean test
   mvn spring-boot:run
   ```

   If Maven is missing from PATH but installed in your known location, use:
   ```powershell
   & "C:\DevTools\apache-maven-3.10.0\bin\mvn.cmd" clean test
   & "C:\DevTools\apache-maven-3.10.0\bin\mvn.cmd" spring-boot:run
   ```
6. Open `http://localhost:8080`, press `Ctrl+F5` to load the new `?v=2.7.0` JavaScript/CSS files.
7. Test Project → Reports, workspace Analytics, Overview, and existing tasks with multiple registered accounts.

**No first-run.bat, new administrator account, database reset, or migration is needed.**

The full ZIP is also available. If you extract it to a new directory, it uses a **different** relative H2 database path. Copy the old `backend/data` folder with the app stopped if you want to preserve accounts, projects, tasks and comments.

See `docs/REPORTS_RENDER_FIX_V2_7.md` for the reproduced failure and exact changes. This is a development release candidate; a Java Maven integration run and live production security testing are still required.
