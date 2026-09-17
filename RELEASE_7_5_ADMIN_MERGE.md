# Kirong AI 7.5 — Admin dashboard merged into 7.4 Accounts

Merged the standalone admin patch (`lib/admin.js`, `admin.html`, and
`api/sync.js`'s `?admin=1` addition) onto 7.4's real codebase — the
patch was built against a version of `api/sync.js` that predated 7.4's
CORS fix, so it needed re-applying by hand rather than a plain
overwrite. Diffed first, then added only the admin-specific lines
(import + the `?admin=1` block) into 7.4's actual `sync.js`, keeping
its CORS-first fix and `resolveIdentity` usage intact.

Verified: `identity.isAccount`/`identity.email` (what the admin block
checks) matches `resolveIdentity()`'s real return shape in this
codebase's `lib/device.js`, and `lib/admin.js`'s `users/` blob prefix
matches `lib/users.js`'s actual `pathForUser()`. Still 11 functions —
admin rides on the existing `sync.js` function, adds zero.

`admin.html` needs nothing added to `vercel.json` — it's a root-level
static file, served the same way `index.html` already is.

## Try it
`/admin.html` → sign in with an account whose email is in the
`ADMIN_EMAILS` env var (comma-separated) → live stats: plan split,
online-now/active-today/active-week, signups, today's usage, recently
active list. Non-admin accounts and guests get a 404, not a 403.

## Next
Per the blocker list — proposing we start with **#1, password
reset**, since it's the only one where a real user can end up
permanently locked out with no recovery path at all. Your call.
