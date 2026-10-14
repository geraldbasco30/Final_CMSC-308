# Tasky v2.5 — Startup and task workflow diagnosis

## Verified in this release environment

- Frontend JavaScript syntax and regression tests: passed.
- First-owner and later-member browser registration smoke tests: passed.
- Simulated `/api/bootstrap` HTTP 500: app displays error and Retry.
- Simulated Done → To Do followed by new To Do creation: passed.
- New Java integration test covers completion clearing and fresh To Do creation, **not run in this environment** because Maven/dependencies are unavailable.

## How to test with the real Java backend (Windows VS Code)

Open the *same existing Tasky/backend* folder containing your previous database (or migrate its `data` folder after stopping the server).

```powershell
mvn clean test
mvn spring-boot:run
```

Navigate to `http://localhost:8080` and sign in. Open F12 → Network:

- Check that `/js/app.js?v=2.5.0` is HTTP 200.
- `/api/bootstrap` returning 200 indicates the workspace loaded. 401 indicates a missing/expired login. 500 indicates a server failure requiring Java logs.
- Test creating a task in To Do, moving it to Done, back to To Do, then creating another To Do task. Reload to ensure persistence.

For a real Java exception, rerun in a PowerShell terminal (inside `backend`):

```powershell
mvn spring-boot:run *> tasky-error.log
Select-String -Path .\tasky-error.log -Pattern 'Caused by:|Exception|APPLICATION FAILED' -Context 2,5 | Select-Object -First 50
```

Never send credentials, private tokens, or full database files in a public chat. No destructive reset is required for this patch.

## Safety

No schema or database reset is part of this release. The `backend/data` folder is NEVER included in downloadable archives. Always stop the server and back up `backend/data` before updating. Do not expose an empty public workspace without configuring `TASKY_OWNER_SETUP_TOKEN`.
