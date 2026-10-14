# Tasky testing

Run automated UI smoke tests:
```bash
node tests/ui-smoke.mjs
```

Backend automated tests (requires JDK 21 and Maven with dependency access):
```bash
cd backend
mvn clean test
mvn clean package
```

Release criteria and manual QA: see `docs/RELEASE_CHECKLIST.md`.

Note: UI smoke test replaces the HTTP service with a deterministic mock. It does not validate Java compilation or real database behavior.


### Multiple-account regression (2.3)

- [ ] Open `/register.html` while logged out; CSRF token loads and Create account becomes enabled.
- [ ] Register two distinct emails and sign in separately with each account.
- [ ] Check email case-insensitive duplicate returns a friendly conflict (no account duplicated).
- [ ] Check mismatched and short passwords cannot register.
- [ ] Confirm registered accounts are MEMBER, not ADMIN/MANAGER.
- [ ] Confirm new account cannot read private projects until added by a lead/administrator.
- [ ] Add Member via Manage team; confirm assigned task is available under My Tasks.
- [ ] Check existing administrator login and saved projects/tasks still work.
- [ ] Verify `TASKY_REGISTRATION_ENABLED=false` blocks new registration while existing sign-in works.
