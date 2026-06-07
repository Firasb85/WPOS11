-- =====================================================
-- WPOS Migration 002: Cases, Interventions, Follow-ups
-- Run this in Supabase SQL Editor
-- =====================================================

-- Cases table
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

-- Interventions library
CREATE TABLE IF NOT EXISTS interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50),
  name_ar VARCHAR(255),
  name_en VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- training, coaching, mentoring, process_redesign, tool_upgrade, other
  description TEXT,
  typical_cost DECIMAL(12,2),
  typical_duration VARCHAR(50),
  expected_outcome TEXT,
  success_metrics JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Case-Intervention junction
CREATE TABLE IF NOT EXISTS case_interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  intervention_id UUID REFERENCES interventions(id),
  custom_description TEXT,
  cost DECIMAL(12,2),
  duration VARCHAR(50),
  owner_id UUID,
  status VARCHAR(50) DEFAULT 'planned', -- planned, scheduled, in_progress, completed, failed, cancelled
  outcome TEXT,
  effectiveness_score INTEGER,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Action Plans
CREATE TABLE IF NOT EXISTS action_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  action_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  owner_id UUID,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  progress INTEGER DEFAULT 0,
  result TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Follow-ups
CREATE TABLE IF NOT EXISTS follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  follow_up_type VARCHAR(50) NOT NULL, -- 30_day, 60_day, 90_day, ad_hoc
  check_in_date TIMESTAMPTZ NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, missed
  result VARCHAR(50), -- improvement, no_change, decline
  kpi_value_before DECIMAL(12,2),
  kpi_value_after DECIMAL(12,2),
  improvement_pct DECIMAL(8,2),
  notes TEXT,
  conducted_by UUID,
  conducted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read/write (adjust for your RLS needs)
CREATE POLICY "Allow all for authenticated" ON cases FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON interventions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON case_interventions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON action_plans FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON follow_ups FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cases_employee ON cases(employee_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_case_interventions_case ON case_interventions(case_id);
CREATE INDEX IF NOT EXISTS idx_action_plans_case ON action_plans(case_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_case ON follow_ups(case_id);
