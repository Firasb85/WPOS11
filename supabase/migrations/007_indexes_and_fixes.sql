-- =====================================================
-- WPOS Migration 007: Performance Indexes + Fixes
-- Run in Supabase SQL Editor → https://supabase.com/dashboard
-- Safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE)
-- =====================================================

-- ─── Performance Indexes ────────────────────────────────────
-- These accelerate the most common queries in the app.

CREATE INDEX IF NOT EXISTS idx_employees_team_id ON employees(team_id);
CREATE INDEX IF NOT EXISTS idx_employees_employment_status ON employees(employment_status);
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_manager_id ON employees(manager_id);
CREATE INDEX IF NOT EXISTS idx_employees_job_id ON employees(job_id);
CREATE INDEX IF NOT EXISTS idx_employees_is_active ON employees(is_active);

CREATE INDEX IF NOT EXISTS idx_performance_snapshots_employee_id ON performance_snapshots(employee_id);
CREATE INDEX IF NOT EXISTS idx_performance_snapshots_kpi_id ON performance_snapshots(kpi_id);
CREATE INDEX IF NOT EXISTS idx_performance_snapshots_period ON performance_snapshots(period);
CREATE INDEX IF NOT EXISTS idx_performance_snapshots_status ON performance_snapshots(status);
CREATE INDEX IF NOT EXISTS idx_performance_snapshots_emp_period ON performance_snapshots(employee_id, period);

CREATE INDEX IF NOT EXISTS idx_evidence_employee_id ON evidence(employee_id);
CREATE INDEX IF NOT EXISTS idx_evidence_type ON evidence(evidence_type);
CREATE INDEX IF NOT EXISTS idx_evidence_submitted_by ON evidence(submitted_by);

CREATE INDEX IF NOT EXISTS idx_kpis_category_id ON kpis(category_id);
CREATE INDEX IF NOT EXISTS idx_teams_department_id ON teams(department_id);
CREATE INDEX IF NOT EXISTS idx_departments_branch_id ON departments(branch_id);
CREATE INDEX IF NOT EXISTS idx_branches_company_id ON branches(company_id);

CREATE INDEX IF NOT EXISTS idx_diagnostic_reports_employee_id ON diagnostic_reports(employee_id);
CREATE INDEX IF NOT EXISTS idx_cases_employee_id ON cases(employee_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_follow_ups_case_id ON follow_ups(case_id);
CREATE INDEX IF NOT EXISTS idx_action_plans_case_id ON action_plans(case_id);

CREATE INDEX IF NOT EXISTS idx_process_steps_process_id ON process_steps(process_id);
CREATE INDEX IF NOT EXISTS idx_jobs_family_id ON jobs(family_id);
CREATE INDEX IF NOT EXISTS idx_jobs_grade_id ON jobs(grade_id);
CREATE INDEX IF NOT EXISTS idx_job_profiles_job_id ON job_profiles(job_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ─── Composite indexes for common dashboard queries ─────────
CREATE INDEX IF NOT EXISTS idx_snapshots_status_period ON performance_snapshots(status, period DESC);
CREATE INDEX IF NOT EXISTS idx_evidence_emp_type ON evidence(employee_id, evidence_type);

-- ═══════════════════════════════════════════════════════════════
-- ✅ DONE — 30 performance indexes created.
-- ═══════════════════════════════════════════════════════════════
