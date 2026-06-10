# WPOS Preview Mode — Supabase Environment Setup

## Required Environment Variables

The preview needs these Supabase credentials to function. They must be
set in your hosting platform's environment configuration (Lovable Cloud,
Vercel, Netlify, etc.).

### Client-side (Vite — `VITE_` prefix)

```env
VITE_SUPABASE_URL=https://nsbmrtohkdttsufxwzdi.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zYm1ydG9oa2R0dHN1Znh3emRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTkxNTIsImV4cCI6MjA5NjQzNTE1Mn0.mrjM5EWl_BAAjM8u7mY4nxOLVyTNEnt3ST3k8gl7I8w
VITE_SUPABASE_PROJECT_ID=nsbmrtohkdttsufxwzdi
```

### Server-side (SSR / Nitro)

```env
SUPABASE_URL=https://nsbmrtohkdttsufxwzdi.supabase.co
SUPABASE_PUBLISHABLE_KEY=<same as VITE_SUPABASE_PUBLISHABLE_KEY>
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zYm1ydG9oa2R0dHN1Znh3emRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDg1OTE1MiwiZXhwIjoyMDk2NDM1MTUyfQ.HXe6dSh9fASSuRkp6cr44HRLs3puy5b5Gx4XgR-y8hI
```

> **Note:** `src/integrations/supabase/client.ts` has hardcoded fallback
> credentials for the canonical project. If env vars are missing or point
> to a different project, the app automatically uses the hardcoded values.

## Test Accounts

All accounts use password: **`Password123!`**

| Email              | Role    | Default Dashboard       |
|--------------------|---------|------------------------|
| admin@wpos.com     | ADMIN   | /dashboard/ceo         |
| ceo@wpos.com       | CEO     | /dashboard/ceo         |
| manager@wpos.com   | MANAGER | /dashboard/department  |
| user@wpos.com      | USER    | /dashboard/ceo         |

## How the Auth Flow Works

1. User enters credentials on `/login`
2. `supabase.auth.signInWithPassword()` authenticates via Supabase Auth
3. On success, `useAuth()` reads `app_metadata.role` (server-controlled)
4. `_authenticated.tsx` layout redirects to role-appropriate dashboard
5. Sidebar filters navigation items based on role
6. RLS policies enforce data access at the database level

## Debugging Auth Issues

The login page includes a **Debug Log** (click "Auth Debug Log" at the
bottom of the sign-in card). It shows:

- Which Supabase project the app is connecting to
- The exact error message from Supabase
- HTTP status codes and error codes
- Session token prefix (for verification)

## Lovable-specific Notes

- Lovable manages its own hidden `.env` — it may override your env vars
- `src/integrations/supabase/client.ts` has hardcoded credentials that
  bypass `.env` overrides — this is intentional
- If Lovable connects a different Supabase project via its UI, the
  hardcoded values in `client.ts` take precedence
