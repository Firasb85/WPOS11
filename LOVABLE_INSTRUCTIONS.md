# 🔧 Fix Login: Switch Lovable's Supabase Integration

## The Problem
Lovable's built-in Supabase integration is connected to an **old/dead project**.
The test users exist in the **new** project (`nsbmrtohkdttsufxwzdi`), but
Lovable's preview connects to the old one — so login always fails.

## How to Fix (2 minutes)

### Option A: Switch Supabase in Lovable (Recommended)
1. Open your project in **Lovable**
2. Click the **Supabase icon** (green) in the left sidebar
3. Click **"Disconnect"** to remove the old Supabase integration
4. Click **"Connect"** and enter the new project details:
   - **Project URL:** `https://nsbmrtohkdttsufxwzdi.supabase.co`
   - **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zYm1ydG9oa2R0dHN1Znh3emRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTkxNTIsImV4cCI6MjA5NjQzNTE1Mn0.mrjM5EWl_BAAjM8u7mY4nxOLVyTNEnt3ST3k8gl7I8w`
   - **Service Role Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zYm1ydG9oa2R0dHN1Znh3emRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDg1OTE1MiwiZXhwIjoyMDk2NDM1MTUyfQ.HXe6dSh9fASSuRkp6cr44HRLs3puy5b5Gx4XgR-y8hI`
5. Wait for the preview to rebuild
6. Login with: `admin@wpos.com` / `Password123!`

### Option B: Tell Lovable AI Chat
Paste this into Lovable's AI chat:

```
Switch the Supabase connection to this project:
- URL: https://nsbmrtohkdttsufxwzdi.supabase.co
- Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zYm1ydG9oa2R0dHN1Znh3emRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTkxNTIsImV4cCI6MjA5NjQzNTE1Mn0.mrjM5EWl_BAAjM8u7mY4nxOLVyTNEnt3ST3k8gl7I8w
- Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zYm1ydG9oa2R0dHN1Znh3emRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDg1OTE1MiwiZXhwIjoyMDk2NDM1MTUyfQ.HXe6dSh9fASSuRkp6cr44HRLs3puy5b5Gx4XgR-y8hI
```

## Test Accounts (all use password: Password123!)
| Email | Role |
|-------|------|
| admin@wpos.com | ADMIN |
| ceo@wpos.com | CEO |
| manager@wpos.com | MANAGER |
| supervisor@wpos.com | MANAGER |
| analyst@wpos.com | USER |
| user@wpos.com | USER |
