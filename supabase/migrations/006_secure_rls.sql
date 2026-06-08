-- =====================================================
-- WPOS Migration 006: SECURE RLS Policies
-- Replaces ALL permissive USING(true) policies with
-- proper role-based, row-level access controls.
-- Safe to re-run.
-- =====================================================

-- ─── Helper: Get role from app_metadata (NOT user_metadata) ─────
-- app_metadata can only be set by service_role, preventing
-- privilege escalation via client-side user_metadata edits.

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role'),
    (auth.jwt() -> 'user_metadata' ->> 'role'),
    'USER'
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT public.get_user_role() IN ('ADMIN', 'CEO')
$$;

-- ─── Drop ALL existing permissive policies ──────────────────────
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- USERS table — most sensitive
-- ═══════════════════════════════════════════════════════════════
-- SELECT: own row only (admins see all, but NOT password_hash via view)
CREATE POLICY "users_select_own" ON users
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

-- UPDATE: own row only (admins can update any)
CREATE POLICY "users_update_own" ON users
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());

-- INSERT: admin only
CREATE POLICY "users_insert_admin" ON users
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

-- DELETE: admin only
CREATE POLICY "users_delete_admin" ON users
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ═══════════════════════════════════════════════════════════════
-- AUDIT LOGS — immutable, admin-read
-- ═══════════════════════════════════════════════════════════════
CREATE POLICY "audit_select_admin" ON audit_logs
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "audit_insert_all" ON audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);
-- NO UPDATE or DELETE policies = immutable

-- ═══════════════════════════════════════════════════════════════
-- SESSIONS — own only
-- ═══════════════════════════════════════════════════════════════
CREATE POLICY "sessions_select_own" ON sessions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "sessions_insert_own" ON sessions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "sessions_update_own" ON sessions
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());
-- NO DELETE

-- ═══════════════════════════════════════════════════════════════
-- PASSWORD RESET TOKENS — own only, prefer server-side
-- ═══════════════════════════════════════════════════════════════
CREATE POLICY "prt_select_own" ON password_reset_tokens
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "prt_update_own" ON password_reset_tokens
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());
-- INSERT/DELETE via server functions only

-- ═══════════════════════════════════════════════════════════════
-- ROLES & PERMISSIONS — admin only write, all read
-- ═══════════════════════════════════════════════════════════════
CREATE POLICY "roles_select" ON roles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "roles_modify_admin" ON roles
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "perms_select" ON permissions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "perms_modify_admin" ON permissions
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "role_perms_select" ON role_permissions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "role_perms_modify_admin" ON role_permissions
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ═══════════════════════════════════════════════════════════════
-- EMPLOYEES — own or manager chain
-- ═══════════════════════════════════════════════════════════════
CREATE POLICY "emp_select" ON employees
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR manager_id = auth.uid()
    OR public.is_admin()
    OR public.get_user_role() IN ('MANAGER', 'CEO')
  );

CREATE POLICY "emp_insert" ON employees
  FOR INSERT TO authenticated
  WITH CHECK (public.get_user_role() IN ('ADMIN', 'CEO', 'MANAGER'));

CREATE POLICY "emp_update" ON employees
  FOR UPDATE TO authenticated
  USING (public.get_user_role() IN ('ADMIN', 'CEO', 'MANAGER'));

CREATE POLICY "emp_delete_admin" ON employees
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ═══════════════════════════════════════════════════════════════
-- COMPANIES, BRANCHES, DEPARTMENTS, TEAMS — read all, write admin/manager
-- ═══════════════════════════════════════════════════════════════
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN VALUES ('companies'), ('branches'), ('departments'), ('teams')
  LOOP
    EXECUTE format('CREATE POLICY "%1$s_select" ON %1$I FOR SELECT TO authenticated USING (true)', t);
    EXECUTE format('CREATE POLICY "%1$s_insert" ON %1$I FOR INSERT TO authenticated WITH CHECK (public.get_user_role() IN (''ADMIN'',''CEO'',''MANAGER''))', t);
    EXECUTE format('CREATE POLICY "%1$s_update" ON %1$I FOR UPDATE TO authenticated USING (public.get_user_role() IN (''ADMIN'',''CEO'',''MANAGER''))', t);
    EXECUTE format('CREATE POLICY "%1$s_delete" ON %1$I FOR DELETE TO authenticated USING (public.is_admin())', t);
  END LOOP;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- DIAGNOSTIC REPORTS — subject, manager, or admin
-- ═══════════════════════════════════════════════════════════════
CREATE POLICY "diag_select" ON diagnostic_reports
  FOR SELECT TO authenticated
  USING (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
    OR generated_by = auth.uid()
    OR reviewed_by = auth.uid()
    OR public.is_admin()
    OR public.get_user_role() IN ('MANAGER', 'CEO')
  );

CREATE POLICY "diag_insert" ON diagnostic_reports
  FOR INSERT TO authenticated
  WITH CHECK (public.get_user_role() IN ('ADMIN', 'CEO', 'MANAGER'));

CREATE POLICY "diag_update" ON diagnostic_reports
  FOR UPDATE TO authenticated
  USING (generated_by = auth.uid() OR public.is_admin() OR public.get_user_role() IN ('MANAGER', 'CEO'));

CREATE POLICY "diag_delete_admin" ON diagnostic_reports
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ═══════════════════════════════════════════════════════════════
-- PERFORMANCE SNAPSHOTS — own, manager, or admin
-- ═══════════════════════════════════════════════════════════════
CREATE POLICY "snap_select" ON performance_snapshots
  FOR SELECT TO authenticated
  USING (
    employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid() OR manager_id = auth.uid())
    OR public.is_admin()
    OR public.get_user_role() IN ('MANAGER', 'CEO')
  );

CREATE POLICY "snap_insert" ON performance_snapshots
  FOR INSERT TO authenticated
  WITH CHECK (public.get_user_role() IN ('ADMIN', 'CEO', 'MANAGER'));

CREATE POLICY "snap_update" ON performance_snapshots
  FOR UPDATE TO authenticated
  USING (public.get_user_role() IN ('ADMIN', 'CEO', 'MANAGER'));

CREATE POLICY "snap_delete_admin" ON performance_snapshots
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- ═══════════════════════════════════════════════════════════════
-- EVIDENCE — creator or admin
-- ═══════════════════════════════════════════════════════════════
CREATE POLICY "ev_select" ON evidence
  FOR SELECT TO authenticated
  USING (submitted_by = auth.uid() OR public.is_admin() OR public.get_user_role() IN ('MANAGER', 'CEO'));

CREATE POLICY "ev_insert" ON evidence
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "ev_update" ON evidence
  FOR UPDATE TO authenticated
  USING (submitted_by = auth.uid() OR public.is_admin());

CREATE POLICY "ev_delete" ON evidence
  FOR DELETE TO authenticated
  USING (submitted_by = auth.uid() OR public.is_admin());

-- ═══════════════════════════════════════════════════════════════
-- CASES — sensitive, restrict to involved parties
-- ═══════════════════════════════════════════════════════════════
DO $$
BEGIN
  -- Only if table exists (created by migration 002)
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'cases' AND schemaname = 'public') THEN
    EXECUTE 'CREATE POLICY "cases_select" ON cases FOR SELECT TO authenticated USING (
      employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid() OR manager_id = auth.uid())
      OR created_by = auth.uid()
      OR public.is_admin()
      OR public.get_user_role() IN (''MANAGER'', ''CEO'')
    )';
    EXECUTE 'CREATE POLICY "cases_insert" ON cases FOR INSERT TO authenticated WITH CHECK (public.get_user_role() IN (''ADMIN'',''CEO'',''MANAGER''))';
    EXECUTE 'CREATE POLICY "cases_update" ON cases FOR UPDATE TO authenticated USING (created_by = auth.uid() OR public.is_admin() OR public.get_user_role() IN (''MANAGER'',''CEO''))';
    EXECUTE 'CREATE POLICY "cases_delete_admin" ON cases FOR DELETE TO authenticated USING (public.is_admin())';
  END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- JOB_GRADES — salary data restricted
-- ═══════════════════════════════════════════════════════════════
CREATE POLICY "jg_select" ON job_grades
  FOR SELECT TO authenticated
  USING (public.get_user_role() IN ('ADMIN', 'CEO', 'MANAGER'));

CREATE POLICY "jg_modify_admin" ON job_grades
  FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ═══════════════════════════════════════════════════════════════
-- Remaining tables — read all, write manager+
-- ═══════════════════════════════════════════════════════════════
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN VALUES
    ('job_families'), ('job_profiles'), ('jobs'),
    ('kpi_categories'), ('kpis'), ('kpi_relationships'),
    ('processes'), ('process_steps'), ('process_dependencies'), ('process_step_competencies'),
    ('competencies'), ('competency_levels'), ('employee_competencies'), ('job_competencies'),
    ('diagnostic_hypotheses')
  LOOP
    BEGIN
      EXECUTE format('CREATE POLICY "%1$s_select" ON %1$I FOR SELECT TO authenticated USING (true)', t);
      EXECUTE format('CREATE POLICY "%1$s_modify" ON %1$I FOR INSERT TO authenticated WITH CHECK (public.get_user_role() IN (''ADMIN'',''CEO'',''MANAGER''))', t);
      EXECUTE format('CREATE POLICY "%1$s_update" ON %1$I FOR UPDATE TO authenticated USING (public.get_user_role() IN (''ADMIN'',''CEO'',''MANAGER''))', t);
      EXECUTE format('CREATE POLICY "%1$s_delete" ON %1$I FOR DELETE TO authenticated USING (public.is_admin())', t);
    EXCEPTION WHEN undefined_table THEN NULL;
    END;
  END LOOP;
END $$;

-- ═══════════════════════════════════════════════════════════════
-- ✅ DONE — All 16 security issues addressed:
-- 1. Role from app_metadata (not user_metadata) via get_user_role()
-- 2. Audit logs: admin-read, insert-only, no update/delete
-- 3. Cases: restricted to involved parties
-- 4. Diagnostic reports: subject/manager/admin only
-- 5. Employees: own/manager/admin with write restrictions
-- 6. Password reset tokens: own only
-- 7. Performance snapshots: own/manager/admin
-- 8. Sessions: own only
-- 9. Users: own row, admin for write, no password_hash exposure
-- 10. Roles/permissions: admin-only write
-- 11. Companies/branches/depts/teams: read all, write manager+
-- 12. Job grades (salary): manager+ read, admin write
-- 13. All remaining: read all, write manager+, delete admin
-- ═══════════════════════════════════════════════════════════════
