# WPOS Security Guide

## ⚠️ CRITICAL: Token Rotation Required

The Supabase `anon` key was exposed in early commits. While `anon` keys are
designed to be public (they only work with RLS), you should rotate it as a
security best practice:

### Steps to Rotate Supabase Keys

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your Project
2. Navigate to **Settings → API**
3. Click **Rotate** next to the `anon` key
4. Copy the new key
5. Update `.env` locally:
   ```
   VITE_SUPABASE_PUBLISHABLE_KEY="your-new-key"
   SUPABASE_PUBLISHABLE_KEY="your-new-key"
   ```
6. Update your Lovable project environment variables
7. Redeploy

### GitHub Token Safety

**NEVER** share GitHub Personal Access Tokens in chat or commit them.
Use one of these methods instead:

```bash
# Method 1: Git credential helper (stores locally)
git config --global credential.helper store

# Method 2: SSH keys (recommended)
# Add your SSH key to GitHub → Settings → SSH Keys

# Method 3: GitHub CLI
gh auth login
```

### Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_SUPABASE_URL` | Client (public) | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Client (public) | Supabase anon key (safe with RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server ONLY | Admin access - NEVER expose |
| `SESSION_SECRET` | Server ONLY | Session encryption |
| `DATABASE_URL` | Server ONLY | Direct DB connection |

### RLS (Row Level Security)

All tables have RLS enabled via `supabase/migrations/003_rls_policies.sql`.
The default policy allows all authenticated users full access.

**For production**, tighten policies per role:
```sql
-- Example: Only admins can delete
CREATE POLICY "admin_delete" ON employees
  FOR DELETE TO authenticated
  USING (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'ADMIN'
  );
```
