-- =====================================================
-- WPOS Migration 006: SECURE RLS Policies
-- SAFE VERSION — skips tables that don't exist.
-- Replaces permissive USING(true) policies.
-- Safe to re-run.
-- =====================================================

-- ─── Helper Functions ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role'),
    (auth.jwt() -> 'user_metadata' ->> 'role'),
    'USER'
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT public.get_user_role() IN ('ADMIN', 'CEO')
$$;

-- ─── Drop ALL existing permissive policies ──────────────────
DO $$
DECLARE pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- ─── Apply policies ONLY to tables that exist ───────────────
DO $$
DECLARE
  t TEXT;
BEGIN

  -- ══ AUDIT LOGS — immutable, admin-read ══
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename='audit_logs' AND schemaname='public') THEN
    EXECUTE 'CREATE POLICY "audit_select_admin" ON audit_logs FOR SELECT TO authenticated USING (public.is_admin())';
    EXECUTE 'CREATE POLICY "audit_insert_all" ON audit_logs FOR INSERT TO authenticated WITH CHECK (true)';
  END IF;

  -- ══ SESSIONS — own only ══
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename='sessions' AND schemaname='public') THEN
    EXECUTE 'CREATE POLICY "sessions_select_own" ON sessions FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin())';
    EXECUTE 'CREATE POLICY "sessions_insert_own" ON sessions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid())';
    EXECUTE 'CREATE POLICY "sessions_update_own" ON sessions FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.is_admin())';
  END IF;

  -- ══ PASSWORD RESET TOKENS — own only ══
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename='password_reset_tokens' AND schemaname='public') THEN
    EXECUTE 'CREATE POLICY "prt_select_own" ON password_reset_tokens FOR SELECT TO authenticated USING (user_id = auth.uid())';
    EXECUTE 'CREATE POLICY "prt_update_own" ON password_reset_tokens FOR UPDATE TO authenticated USING (user_id = auth.uid())';
  END IF;

  -- ══ USERS — own row only (if table exists) ══
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename='users' AND schemaname='public') THEN
    EXECUTE 'CREATE POLICY "users_select_own" ON users FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_admin())';
    EXECUTE 'CREATE POLICY "users_update_own" ON users FOR UPDATE TO authenticated USING (id = auth.uid() OR public.is_admin()) WITH CHECK (id = auth.uid() OR public.is_admin())';
    EXECUTE 'CREATE POLICY "users_insert_admin" ON users FOR INSERT TO authenticated WITH CHECK (public.is_admin())';
    EXECUTE 'CREATE POLICY "users_delete_admin" ON users FOR DELETE TO authenticated USING (public.is_admin())';
  END IF;

  -- ══ ROLES & PERMISSIONS — read all, write admin only ══
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename='roles' AND schemaname='public') THEN
    EXECUTE 'CREATE POLICY "roles_select" ON roles FOR SELECT TO authenticated USING (true)';
    EXECUTE 'CREATE POLICY "roles_modify_admin" ON roles FOR INSERT TO authenticated WITH CHECK (public.is_admin())';
    EXECUTE 'CREATE POLICY "roles_update_admin" ON roles FOR UPDATE TO authenticated USING (public.is_admin())';
    EXECUTE 'CREATE POLICY "roles_delete_admin" ON roles FOR DELETE TO authenticated USING (public.is_admin())';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename='permissions' AND schemaname='public') THEN
    EXECUTE 'CREATE POLICY "perms_select" ON permissions FOR SELECT TO authenticated USING (true)';
    EXECUTE 'CREATE POLICY "perms_modify_admin" ON permissions FOR INSERT TO authenticated WITH CHECK (public.is_admin())';
    EXECUTE 'CREATE POLICY "perms_update_admin" ON permissions FOR UPDATE TO authenticated USING (public.is_admin())';
    EXECUTE 'CREATE POLICY "perms_delete_admin" ON permissions FOR DELETE TO authenticated USING (public.is_admin())';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename='role_permissions' AND schemaname='public') THEN
    EXECUTE 'CREATE POLICY "rp_select" ON role_permissions FOR SELECT TO authenticated USING (true)';
    EXECUTE 'CREATE POLICY "rp_modify_admin" ON role_permissions FOR INSERT TO authenticated WITH CHECK (public.is_admin())';
    EXECUTE 'CREATE POLICY "rp_update_admin" ON role_permissions FOR UPDATE TO authenticated USING (public.is_admin())';
    EXECUTE 'CREATE POLICY "rp_delete_admin" ON role_permissions FOR DELETE TO authenticated USING (public.is_admin())';
  END IF;

  -- ══ EMPLOYEES — own/manager/admin ══
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename='employees' AND schemaname='public') THEN
    EXECUTE 'CREATE POLICY "emp_select" ON employees FOR SELECT TO authenticated USING (user_id = auth.uid() OR manager_id = auth.uid() OR public.is_admin() OR public.get_user_role() IN (''MANAGER'',''CEO''))';
    EXECUTE 'CREATE POLICY "emp_insert" ON employees FOR INSERT TO authenticated WITH CHECK (public.get_user_role() IN (''ADMIN'',''CEO'',''MANAGER''))';
    EXECUTE 'CREATE POLICY "emp_update" ON employees FOR UPDATE TO authenticated USING (public.get_user_role() IN (''ADMIN'',''CEO'',''MANAGER''))';
    EXECUTE 'CREATE POLICY "emp_delete" ON employees FOR DELETE TO authenticated USING (public.is_admin())';
  END IF;

  -- ══ DIAGNOSTIC REPORTS — subject/manager/admin ══
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename='diagnostic_reports' AND schemaname='public') THEN
    EXECUTE 'CREATE POLICY "diag_select" ON diagnostic_reports FOR SELECT TO authenticated USING (generated_by = auth.uid() OR reviewed_by = auth.uid() OR public.is_admin() OR public.get_user_role() IN (''MANAGER'',''CEO''))';
    EXECUTE 'CREATE POLICY "diag_insert" ON diagnostic_reports FOR INSERT TO authenticated WITH CHECK (public.get_user_role() IN (''ADMIN'',''CEO'',''MANAGER''))';
    EXECUTE 'CREATE POLICY "diag_update" ON diagnostic_reports FOR UPDATE TO authenticated USING (generated_by = auth.uid() OR public.is_admin() OR public.get_user_role() IN (''MANAGER'',''CEO''))';
    EXECUTE 'CREATE POLICY "diag_delete" ON diagnostic_reports FOR DELETE TO authenticated USING (public.is_admin())';
  END IF;

  -- ══ PERFORMANCE SNAPSHOTS — manager/admin ══
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename='performance_snapshots' AND schemaname='public') THEN
    EXECUTE 'CREATE POLICY "snap_select" ON performance_snapshots FOR SELECT TO authenticated USING (public.get_user_role() IN (''ADMIN'',''CEO'',''MANAGER'') OR public.is_admin())';
    EXECUTE 'CREATE POLICY "snap_insert" ON performance_snapshots FOR INSERT TO authenticated WITH CHECK (public.get_user_role() IN (''ADMIN'',''CEO'',''MANAGER''))';
    EXECUTE 'CREATE POLICY "snap_update" ON performance_snapshots FOR UPDATE TO authenticated USING (public.get_user_role() IN (''ADMIN'',''CEO'',''MANAGER''))';
    EXECUTE 'CREATE POLICY "snap_delete" ON performance_snapshots FOR DELETE TO authenticated USING (public.is_admin())';
  END IF;

  -- ══ EVIDENCE — creator/admin ══
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename='evidence' AND schemaname='public') THEN
    EXECUTE 'CREATE POLICY "ev_select" ON evidence FOR SELECT TO authenticated USING (submitted_by = auth.uid() OR public.is_admin() OR public.get_user_role() IN (''MANAGER'',''CEO''))';
    EXECUTE 'CREATE POLICY "ev_insert" ON evidence FOR INSERT TO authenticated WITH CHECK (true)';
    EXECUTE 'CREATE POLICY "ev_update" ON evidence FOR UPDATE TO authenticated USING (submitted_by = auth.uid() OR public.is_admin())';
    EXECUTE 'CREATE POLICY "ev_delete" ON evidence FOR DELETE TO authenticated USING (submitted_by = auth.uid() OR public.is_admin())';
  END IF;

  -- ══ CASES — involved parties ══
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename='cases' AND schemaname='public') THEN
    EXECUTE 'CREATE POLICY "cases_select" ON cases FOR SELECT TO authenticated USING (created_by = auth.uid() OR public.is_admin() OR public.get_user_role() IN (''MANAGER'',''CEO''))';
    EXECUTE 'CREATE POLICY "cases_insert" ON cases FOR INSERT TO authenticated WITH CHECK (public.get_user_role() IN (''ADMIN'',''CEO'',''MANAGER''))';
    EXECUTE 'CREATE POLICY "cases_update" ON cases FOR UPDATE TO authenticated USING (created_by = auth.uid() OR public.is_admin() OR public.get_user_role() IN (''MANAGER'',''CEO''))';
    EXECUTE 'CREATE POLICY "cases_delete" ON cases FOR DELETE TO authenticated USING (public.is_admin())';
  END IF;

  -- ══ JOB GRADES — salary restricted ══
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename='job_grades' AND schemaname='public') THEN
    EXECUTE 'CREATE POLICY "jg_select" ON job_grades FOR SELECT TO authenticated USING (public.get_user_role() IN (''ADMIN'',''CEO'',''MANAGER''))';
    EXECUTE 'CREATE POLICY "jg_insert" ON job_grades FOR INSERT TO authenticated WITH CHECK (public.is_admin())';
    EXECUTE 'CREATE POLICY "jg_update" ON job_grades FOR UPDATE TO authenticated USING (public.is_admin())';
    EXECUTE 'CREATE POLICY "jg_delete" ON job_grades FOR DELETE TO authenticated USING (public.is_admin())';
  END IF;

  -- ══ ORG TABLES — read all, write manager+ ══
  FOR t IN VALUES ('companies'),('branches'),('departments'),('teams')
  LOOP
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename=t AND schemaname='public') THEN
      EXECUTE format('CREATE POLICY "%1$s_select" ON %1$I FOR SELECT TO authenticated USING (true)', t);
      EXECUTE format('CREATE POLICY "%1$s_insert" ON %1$I FOR INSERT TO authenticated WITH CHECK (public.get_user_role() IN (''ADMIN'',''CEO'',''MANAGER''))', t);
      EXECUTE format('CREATE POLICY "%1$s_update" ON %1$I FOR UPDATE TO authenticated USING (public.get_user_role() IN (''ADMIN'',''CEO'',''MANAGER''))', t);
      EXECUTE format('CREATE POLICY "%1$s_delete" ON %1$I FOR DELETE TO authenticated USING (public.is_admin())', t);
    END IF;
  END LOOP;

  -- ══ REMAINING TABLES — read all, write manager+, delete admin ══
  FOR t IN VALUES
    ('job_families'),('job_profiles'),('jobs'),
    ('kpi_categories'),('kpis'),('kpi_relationships'),
    ('processes'),('process_steps'),('process_dependencies'),('process_step_competencies'),
    ('competencies'),('competency_levels'),('employee_competencies'),('job_competencies'),
    ('diagnostic_hypotheses'),
    ('interventions'),('case_interventions'),('action_plans'),('follow_ups')
  LOOP
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename=t AND schemaname='public') THEN
      EXECUTE format('CREATE POLICY "%1$s_select" ON %1$I FOR SELECT TO authenticated USING (true)', t);
      EXECUTE format('CREATE POLICY "%1$s_insert" ON %1$I FOR INSERT TO authenticated WITH CHECK (public.get_user_role() IN (''ADMIN'',''CEO'',''MANAGER''))', t);
      EXECUTE format('CREATE POLICY "%1$s_update" ON %1$I FOR UPDATE TO authenticated USING (public.get_user_role() IN (''ADMIN'',''CEO'',''MANAGER''))', t);
      EXECUTE format('CREATE POLICY "%1$s_delete" ON %1$I FOR DELETE TO authenticated USING (public.is_admin())', t);
    END IF;
  END LOOP;

END $$;

-- ═══════════════════════════════════════════════════════════════
-- ✅ DONE — Secure RLS applied to all existing tables.
-- Tables that don't exist are safely skipped.
-- ═══════════════════════════════════════════════════════════════
