# WPOS — Supabase Migration Guide

## Goal: Move from Lovable Cloud's Supabase to YOUR OWN Supabase project

---

## Step 1: Create a New Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** → sign in with GitHub
3. Click **"New Project"**
4. Fill in:
   - **Name:** `wpos-production`
   - **Database Password:** (save this somewhere safe!)
   - **Region:** Choose the closest to your users
5. Click **"Create new project"**
6. Wait ~2 minutes for it to provision

---

## Step 2: Get Your New Supabase Keys

1. In your new project, go to **Settings → API**
2. Copy these values:

| Key | Where to find |
|-----|---------------|
| **Project URL** | `https://YOUR_PROJECT_ID.supabase.co` |
| **anon (public) key** | Under "Project API keys" → `anon` `public` |
| **service_role key** | Under "Project API keys" → `service_role` (keep secret!) |
| **Project ID** | The part before `.supabase.co` in the URL |

---

## Step 3: Create the Database Schema

1. In your new Supabase project, go to **SQL Editor**
2. Click **"New Query"**
3. Go to GitHub: `https://github.com/Firasb85/WPOS11/blob/main/supabase/migrations/000_full_schema.sql`
4. Click **"Raw"** → Select All (Ctrl+A) → Copy (Ctrl+C)
5. Paste into Supabase SQL Editor → Click **"Run"**
6. You should see: `Success. No rows returned`

This creates all 36 tables, indexes, RLS policies, and seed roles.

---

## Step 4: (Optional) Apply Secure RLS Policies

For production security:
1. In SQL Editor → New Query
2. Go to GitHub: `https://github.com/Firasb85/WPOS11/blob/main/supabase/migrations/006_secure_rls.sql`
3. Click **"Raw"** → Copy → Paste → Run

---

## Step 5: Enable Email Auth

1. Go to **Authentication → Providers**
2. Make sure **Email** is **enabled**
3. Go to **Authentication → URL Configuration**
4. Set **Site URL** to your app URL (e.g., `https://your-app.lovableproject.com`)
5. (Optional) Go to **Authentication → Email Templates** and customize

---

## Step 6: Connect WPOS to Your New Supabase

### Option A: In Lovable Cloud

1. Open your Lovable project
2. Go to **Settings** (or Supabase icon in sidebar)
3. Look for **"Disconnect Supabase"** or **"Change Supabase connection"**
4. Enter your new project's:
   - **URL:** `https://YOUR_PROJECT_ID.supabase.co`
   - **Anon Key:** your new anon key
5. Save

### Option B: Via Environment Variables

If deploying outside Lovable (Vercel, Netlify, etc.):

Create a `.env` file with:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-new-anon-key
VITE_SUPABASE_PROJECT_ID=YOUR_PROJECT_ID

SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-new-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_PROJECT_ID=YOUR_PROJECT_ID
```

### Option C: Update in Lovable's Supabase Panel

1. In Lovable, click the **database icon** (🗄️) in the sidebar
2. Click **"Connect to Supabase"** or **"Change connection"**
3. Enter your new project URL and anon key

---

## Step 7: Verify the Connection

After connecting:
1. Open the app → you should see the login page
2. Create a new account (email + password)
3. After login, go to **Organization → Companies**
4. Click **"Add Company"** → fill in details → click **"Create"**
5. Check your Supabase project → **Table Editor → companies** → the record should be there

---

## Step 8: Set User Roles (Admin Setup)

After your first user signs up, make them an admin:

1. Go to your Supabase project → **SQL Editor**
2. Run:
```sql
-- Replace 'your@email.com' with your actual email
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "ADMIN"}'::jsonb
WHERE email = 'your@email.com';
```
3. Log out and log back in — you now have ADMIN access

---

## Step 9: Regenerate TypeScript Types (Optional)

If you want the Supabase types to match your new project exactly:

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login:
```bash
supabase login
```

3. Generate types:
```bash
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts
```

---

## Architecture After Migration

```
┌─────────────────────────────────┐
│  YOUR APP (Lovable/Vercel)      │
│  React + TanStack Router        │
│                                  │
│  src/integrations/supabase/     │
│    client.ts → YOUR Supabase    │
│                                  │
│  .env:                           │
│    VITE_SUPABASE_URL=your-url   │
│    VITE_SUPABASE_KEY=your-key   │
└──────────────┬──────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────┐
│  YOUR SUPABASE PROJECT          │
│  (supabase.com dashboard)       │
│                                  │
│  Auth: Email/Password + MFA     │
│  Database: 36 tables            │
│  RLS: Secure policies           │
│  Storage: Evidence files        │
│  Realtime: Dashboard updates    │
└─────────────────────────────────┘
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Invalid API key" | Check that the anon key matches (not service_role key) |
| "relation does not exist" | Run `000_full_schema.sql` in SQL Editor |
| "new row violates RLS" | Check that you're logged in and have the right role |
| "CORS error" | Add your app URL to Supabase → Settings → API → Additional Redirect URLs |
| Empty dashboard | Data is in the new project — you need to add data through the app |
| Login doesn't work | Enable Email provider in Authentication → Providers |
