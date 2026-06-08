-- =====================================================
-- WPOS FULL DATABASE SCHEMA
-- Run this in a NEW Supabase project's SQL Editor
-- Creates ALL 36 tables from scratch.
-- =====================================================

-- ─── RBAC ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(200) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  module VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  avatar_url TEXT,
  role_id UUID NOT NULL REFERENCES roles(id),
  is_active BOOLEAN DEFAULT true,
  language VARCHAR(10) DEFAULT 'ar',
  theme VARCHAR(20) DEFAULT 'light',
  last_login_at TIMESTAMPTZ,
  password_changed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  is_revoked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,
  description TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── ORGANIZATION ──────────────────────────────────
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255),
  registration_number VARCHAR(100),
  tax_number VARCHAR(100),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  description TEXT,
  manager_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  leader_id UUID,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ─── JOB ARCHITECTURE ──────────────────────────────
CREATE TABLE IF NOT EXISTS job_families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  code VARCHAR(50),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS job_grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  code VARCHAR(50),
  level INTEGER NOT NULL,
  description TEXT,
  salary_min DECIMAL(12,2),
  salary_max DECIMAL(12,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS job_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  family_id UUID REFERENCES job_families(id),
  grade_id UUID REFERENCES job_grades(id),
  description TEXT,
  requirements TEXT,
  skills JSONB,
  certifications JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  job_profile_id UUID NOT NULL REFERENCES job_profiles(id),
  employee_id UUID,
  status VARCHAR(50) DEFAULT 'active',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_code VARCHAR(50),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  arabic_first_name VARCHAR(100),
  arabic_last_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  hire_date DATE,
  employment_status VARCHAR(50) DEFAULT 'active',
  job_id UUID,
  team_id UUID REFERENCES teams(id),
  manager_id UUID,
  user_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ─── COMPETENCY ────────────────────────────────────
CREATE TABLE IF NOT EXISTS competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competency_code VARCHAR(100) NOT NULL,
  competency_name_en VARCHAR(255) NOT NULL,
  competency_name_ar VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS competency_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competency_id UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
  level_number INTEGER NOT NULL,
  level_name VARCHAR(100) NOT NULL,
  behavioral_indicators JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS job_competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  competency_id UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
  required_level INTEGER NOT NULL,
  importance_weight DECIMAL(5,2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS employee_competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  competency_id UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
  current_level INTEGER NOT NULL,
  assessment_date DATE NOT NULL,
  assessed_by UUID,
  notes TEXT,
  evidence_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── PROCESSES ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  description TEXT,
  owner_id UUID,
  department_id UUID REFERENCES departments(id),
  risk_level VARCHAR(20) DEFAULT 'medium',
  criticality VARCHAR(20) DEFAULT 'medium',
  documentation_url TEXT,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id UUID NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  expected_duration VARCHAR(50),
  required_tools JSONB,
  common_errors JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS process_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id UUID NOT NULL REFERENCES processes(id),
  depends_on_process_id UUID NOT NULL REFERENCES processes(id),
  dependency_type VARCHAR(50) DEFAULT 'sequential',
  criticality VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS process_step_competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_step_id UUID NOT NULL REFERENCES process_steps(id) ON DELETE CASCADE,
  competency_id UUID NOT NULL REFERENCES competencies(id),
  required_level INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── KPIs ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kpi_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  category_id UUID REFERENCES kpi_categories(id),
  target_value DECIMAL(12,2),
  unit VARCHAR(50),
  measurement_frequency VARCHAR(50) NOT NULL DEFAULT 'monthly',
  is_higher_better BOOLEAN DEFAULT true,
  warning_threshold DECIMAL(12,2),
  critical_threshold DECIMAL(12,2),
  owner_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kpi_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_kpi_id UUID NOT NULL REFERENCES kpis(id),
  child_kpi_id UUID NOT NULL REFERENCES kpis(id),
  relationship_type VARCHAR(50) DEFAULT 'drives',
  impact_weight DECIMAL(5,2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── PERFORMANCE SNAPSHOTS ─────────────────────────
CREATE TABLE IF NOT EXISTS performance_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id),
  kpi_id UUID REFERENCES kpis(id),
  period VARCHAR(20),
  target_value DECIMAL(12,2),
  actual_value DECIMAL(12,2),
  gap_value DECIMAL(12,2),
  gap_percentage DECIMAL(8,2),
  status VARCHAR(20) DEFAULT 'green',
  trend VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── EVIDENCE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id),
  evidence_type VARCHAR(50) NOT NULL,
  source VARCHAR(255) NOT NULL,
  source_date TIMESTAMPTZ,
  description TEXT NOT NULL,
  reliability VARCHAR(20) DEFAULT 'medium',
  reliability_score DECIMAL(5,2),
  confidence_weight DECIMAL(5,2),
  verification_status VARCHAR(50) DEFAULT 'unverified',
  verified_by UUID,
  verification_date TIMESTAMPTZ,
  file_url TEXT,
  supporting_value JSONB,
  snapshot_id UUID REFERENCES performance_snapshots(id),
  submitted_by UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ─── DIAGNOSTICS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS diagnostic_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  employee_id UUID REFERENCES employees(id),
  department_id UUID REFERENCES departments(id),
  team_id UUID REFERENCES teams(id),
  status VARCHAR(50) DEFAULT 'draft',
  maturity_level INTEGER DEFAULT 1,
  confidence_score DECIMAL(5,2),
  evidence_score DECIMAL(5,2),
  evidence_summary TEXT,
  performance_summary TEXT,
  risk_assessment TEXT,
  manager_review TEXT,
  final_diagnosis TEXT,
  historical_alignment_score DECIMAL(5,2),
  validation_status VARCHAR(50),
  is_manager_reviewed BOOLEAN DEFAULT false,
  is_final BOOLEAN DEFAULT false,
  generated_by UUID,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS diagnostic_hypotheses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES diagnostic_reports(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  hypothesis TEXT NOT NULL,
  confidence_score DECIMAL(5,2),
  evidence_score DECIMAL(5,2),
  evidence_strength_index DECIMAL(5,2),
  supporting_evidence JSONB,
  contradicting_evidence JSONB,
  validation_actions JSONB,
  validation_status VARCHAR(50) DEFAULT 'pending',
  validation_notes TEXT,
  validated_at TIMESTAMPTZ,
  rank_order INTEGER,
  reasoning TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── CASES & INTERVENTIONS ─────────────────────────
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number VARCHAR(50) NOT NULL UNIQUE,
  diagnostic_report_id UUID REFERENCES diagnostic_reports(id),
  employee_id UUID NOT NULL REFERENCES employees(id),
  department_id UUID REFERENCES departments(id),
  manager_id UUID,
  root_cause_category VARCHAR(100),
  root_cause_code VARCHAR(100),
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'open',
  description TEXT,
  due_date TIMESTAMPTZ,
  closure_date TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name_ar VARCHAR(255),
  name_en VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  typical_cost DECIMAL(12,2),
  typical_duration VARCHAR(50),
  expected_outcome TEXT,
  success_metrics JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS case_interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  intervention_id UUID REFERENCES interventions(id),
  custom_description TEXT,
  cost DECIMAL(12,2),
  duration VARCHAR(50),
  owner_id UUID,
  status VARCHAR(50) DEFAULT 'planned',
  outcome TEXT,
  effectiveness_score INTEGER,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS action_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  action_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  owner_id UUID,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status VARCHAR(50) DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  result TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  follow_up_type VARCHAR(50) NOT NULL,
  check_in_date TIMESTAMPTZ NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  result VARCHAR(50),
  kpi_value_before DECIMAL(12,2),
  kpi_value_after DECIMAL(12,2),
  improvement_pct DECIMAL(8,2),
  notes TEXT,
  conducted_by UUID,
  conducted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── INDEXES ───────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_employees_team ON employees(team_id);
CREATE INDEX IF NOT EXISTS idx_employees_active ON employees(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_snapshots_employee ON performance_snapshots(employee_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_kpi ON performance_snapshots(kpi_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_status ON performance_snapshots(status);
CREATE INDEX IF NOT EXISTS idx_evidence_employee ON evidence(employee_id);
CREATE INDEX IF NOT EXISTS idx_diag_employee ON diagnostic_reports(employee_id);
CREATE INDEX IF NOT EXISTS idx_diag_status ON diagnostic_reports(status);
CREATE INDEX IF NOT EXISTS idx_hypotheses_report ON diagnostic_hypotheses(report_id);
CREATE INDEX IF NOT EXISTS idx_cases_employee ON cases(employee_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);

-- ─── ENABLE RLS ON ALL TABLES ──────────────────────
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE 'pg_%'
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
  END LOOP;
END $$;

-- ─── DEFAULT POLICIES (authenticated access) ───────
-- These allow any authenticated user to use the app.
-- For production security, run 006_secure_rls.sql after this.
DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE 'pg_%'
  LOOP
    BEGIN
      EXECUTE format(
        'CREATE POLICY "auth_access_%1$s" ON %1$I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t
      );
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
  END LOOP;
END $$;

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ─── SEED DEFAULT ROLES ────────────────────────────
INSERT INTO roles (name, description, is_system) VALUES
  ('Super Admin', 'Full system access', true),
  ('Organization Admin', 'Company-level access', true),
  ('HR Director', 'HR operations', true),
  ('Department Manager', 'Department operations', true),
  ('Supervisor', 'Team management', true),
  ('Analyst', 'Read and analyze', true)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- ✅ DONE — 36 tables created with indexes, RLS, and seed roles.
-- Next: Run 006_secure_rls.sql for production security policies.
-- =====================================================
