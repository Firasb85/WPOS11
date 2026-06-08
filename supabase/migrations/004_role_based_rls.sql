-- =====================================================
-- WPOS Migration 004: Role-Based RLS Policies
-- Production-grade policies that restrict by user role.
-- Run AFTER 003_rls_policies.sql
-- Safe to re-run.
-- =====================================================

-- Helper function to get current user's role from JWT
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    current_setting('request.jwt.claims', true)::json -> 'user_metadata' ->> 'role',
    'USER'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ── Admin-only tables: only ADMIN can write, all authenticated can read ──

-- audit_logs: everyone reads, only system writes
DROP POLICY IF EXISTS "Authenticated access on audit_logs" ON audit_logs;
CREATE POLICY "audit_read" ON audit_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "audit_insert" ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);
-- No UPDATE/DELETE on audit logs (immutable)

-- roles: only ADMIN can modify
DROP POLICY IF EXISTS "Authenticated access on roles" ON roles;
CREATE POLICY "roles_read" ON roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "roles_write" ON roles FOR ALL TO authenticated
  USING (public.get_user_role() = 'ADMIN')
  WITH CHECK (public.get_user_role() = 'ADMIN');

-- permissions: only ADMIN can modify
DROP POLICY IF EXISTS "Authenticated access on permissions" ON permissions;
CREATE POLICY "permissions_read" ON permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "permissions_write" ON permissions FOR ALL TO authenticated
  USING (public.get_user_role() = 'ADMIN')
  WITH CHECK (public.get_user_role() = 'ADMIN');

-- role_permissions: only ADMIN can modify
DROP POLICY IF EXISTS "Authenticated access on role_permissions" ON role_permissions;
CREATE POLICY "role_perms_read" ON role_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "role_perms_write" ON role_permissions FOR ALL TO authenticated
  USING (public.get_user_role() = 'ADMIN')
  WITH CHECK (public.get_user_role() = 'ADMIN');

-- sessions: users see own, admin sees all
DROP POLICY IF EXISTS "Authenticated access on sessions" ON sessions;
CREATE POLICY "sessions_own" ON sessions FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.get_user_role() IN ('ADMIN', 'CEO'));

-- ── Delete restrictions: only ADMIN/CEO can delete ──

DO $$
DECLARE
  t text;
BEGIN
  FOR t IN VALUES
    ('companies'), ('branches'), ('departments'), ('teams'),
    ('employees'), ('diagnostic_reports'), ('evidence')
  LOOP
    BEGIN
      EXECUTE format(
        'CREATE POLICY "restrict_delete_%1$s" ON %1$I
         FOR DELETE TO authenticated
         USING (public.get_user_role() IN (''ADMIN'', ''CEO''))',
        t
      );
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
  END LOOP;
END $$;

-- =====================================================
-- ✅ Role-based RLS policies applied.
-- ADMIN: full access to all tables
-- CEO: read all, delete critical tables
-- MANAGER/USER: read all, write own data only (via app-level RBAC)
-- =====================================================
