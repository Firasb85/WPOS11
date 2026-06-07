-- =====================================================
-- WPOS — SINGLE FILE TO RUN IN SUPABASE SQL EDITOR
-- This combines all migrations. Safe to re-run.
-- =====================================================

-- ─── 1. Create Cases & Interventions Tables ────────────

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

-- ─── 2. Indexes ────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_cases_employee ON cases(employee_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_case_interventions_case ON case_interventions(case_id);
CREATE INDEX IF NOT EXISTS idx_action_plans_case ON action_plans(case_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_case ON follow_ups(case_id);

-- ─── 3. Enable RLS + Policies on ALL tables ────────────

DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename NOT LIKE 'pg_%'
    AND tablename NOT LIKE 'schema_%'
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);

    -- Drop any existing policy variants
    BEGIN
      EXECUTE format('DROP POLICY IF EXISTS "Allow all for authenticated" ON %I', t);
      EXECUTE format('DROP POLICY IF EXISTS "Authenticated access on %1$I" ON %1$I', t);
      EXECUTE format('DROP POLICY IF EXISTS "Authenticated full access on %1$I" ON %1$I', t);
    EXCEPTION WHEN OTHERS THEN NULL;
    END;

    -- Create policy
    BEGIN
      EXECUTE format(
        'CREATE POLICY "Authenticated access on %1$I" ON %1$I
         FOR ALL TO authenticated USING (true) WITH CHECK (true)',
        t
      );
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
  END LOOP;
END
$$;

-- ─── 4. Grant Permissions ──────────────────────────────

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- ✅ DONE! All tables, indexes, RLS, and policies created.
-- =====================================================
