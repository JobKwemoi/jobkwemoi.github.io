# RELEASE 7.4 — Accounts + Bug Fixes

## Part 1 — Bugs found and fixed

### 1. CORS blocked the identity header (real, silent data loss)
`lib/http.js`'s `cors()` advertised `X-Kirong-User-Id` in
`Access-Control-Allow-Headers`, but `app.js` sends `X-Kirong-Device`
(see its `headers()` helper). On any cross-origin deployment the
preflight rejected the request before it reached a handler, and every
such caller silently fell back to the `anonymous` identity — i.e. lost
access to their own workspace.

Fixed: both header names are now allowed, plus
`Access-Control-Allow-Credentials` (required for the session cookie
added in Part 2).

### 2. `/api/health` bypassed CORS entirely
`api/sync.js` called `healthCheck()` *before* `cors()`, so the health
response carried no CORS headers, no `Content-Type`, and answered
`OPTIONS` preflights with 405 instead of 204.

Fixed: `cors()` now runs first for every path, health included.

### 3. Comments claimed vercel.json rewrites that don't exist
`api/memory.js` and `api/agent.js` both documented rewrites for
`/api/memory-insight`, `/api/project-memory`, `/api/user` and
`/api/custom-agents`. None of those exist in `vercel.json` — only
`/api/health` and `/api/payment-callback` do. The app works because
`app.js` calls the `?scope=` / `?resource=` URLs directly, but the
comments would mislead the next person editing this code.

Fixed: comments now state the real situation (those old paths are dead
and 404).

## Part 2 — Optional email/password accounts

Guest device identity still works exactly as before and remains the
default. Accounts are additive.

### The key design decision
An account does **not** get a fresh storage namespace. At signup, the
caller's current guest device id is recorded as the account's
`storageId`, and every logged-in request resolves to that same id.

- Work already done as a guest simply becomes the account's work —
  no migration pass, no blob copying, no half-moved state
- Signing in on a second device resolves to the same `storageId`,
  which is the actual point of having an account

Stated cost, not hidden: signing up *from* device B does not absorb
device B's prior guest data. Only the signup device's history is
adopted.

### New files
- **`lib/accounts.js`** — account + session store on Vercel Blob.
  - Passwords hashed with node's built-in `scrypt` (no new dependency)
  - Sessions are random 32-byte tokens; only a SHA-256 hash is stored,
    so a leaked blob listing can't be replayed as a login
  - The email never appears in a blob path, only its hash
  - Brute-force braking: 8 failed attempts → 15-minute lockout,
    tracked on the account record (per-IP counters are useless across
    serverless instances)
  - "No such account" and "wrong password" return identical text, with
    a decoy hash on the miss so response timing doesn't leak which
    emails are registered
- **`api/auth.js`** — `?action=` routed: `me` / `signup` / `login` /
  `logout` / `password`. This is the 11th serverless function, still
  under the Hobby-plan cap of 12.

### Changed
- **`lib/device.js`** — adds `resolveIdentity(req)`: prefers a valid
  session, falls back to the guest id. An expired or broken session is
  not an error; it degrades to guest rather than locking someone out.
  `getDeviceId()` stays synchronous and guest-only.
- **All 11 API handlers** now resolve identity via `resolveIdentity`.
- **`app.js` / `index.html` / `style.css`** — account badge in the
  sidebar, sign-in / create-account modal, session token handling.

### Cookie vs Bearer
The session is set as an `HttpOnly` cookie (page JS, and therefore any
XSS, can't read it). The token is *also* returned in the response body
for one specific reason: the app is embedded in a cross-site iframe on
the portfolio, where a `SameSite=Lax` cookie is not sent at all. There
the client keeps the token and sends `Authorization: Bearer <token>`.
Same-origin use should prefer the cookie.

### Bug avoided while building this
The local chat cache in `localStorage` is not namespaced by identity,
and `syncRemote()` *merges* remote into local rather than replacing it.
Without clearing that cache on identity change, the previous identity's
chats would be merged into — and then uploaded to — the new account.
`reloadWorkspaceForIdentity()` clears it first.

### Not included (deliberately, so it isn't assumed)
- No password reset / email verification — there's no email sending in
  this codebase yet
- Changing a password does not revoke other devices' sessions; that
  needs a per-account session index this build doesn't have
- No OAuth/social login
