-- =====================================================
-- WPOS Migration 005: Performance Indexes
-- Recommended indexes based on query patterns.
-- Safe to re-run.
-- =====================================================

-- Employees — queried by team frequently
CREATE INDEX IF NOT EXISTS idx_employees_team ON employees(team_id);
CREATE INDEX IF NOT EXISTS idx_employees_active ON employees(is_active) WHERE is_active = true;

-- Performance Snapshots — queried by employee and KPI
CREATE INDEX IF NOT EXISTS idx_snapshots_employee ON performance_snapshots(employee_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_kpi ON performance_snapshots(kpi_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_status ON performance_snapshots(status);
CREATE INDEX IF NOT EXISTS idx_snapshots_created ON performance_snapshots(created_at DESC);

-- Evidence — queried by employee
CREATE INDEX IF NOT EXISTS idx_evidence_employee ON evidence(employee_id);
CREATE INDEX IF NOT EXISTS idx_evidence_type ON evidence(evidence_type);

-- Diagnostic Reports — queried by employee and status
CREATE INDEX IF NOT EXISTS idx_diag_employee ON diagnostic_reports(employee_id);
CREATE INDEX IF NOT EXISTS idx_diag_status ON diagnostic_reports(status);
CREATE INDEX IF NOT EXISTS idx_diag_created ON diagnostic_reports(created_at DESC);

-- Diagnostic Hypotheses — queried by report
CREATE INDEX IF NOT EXISTS idx_hypotheses_report ON diagnostic_hypotheses(report_id);
CREATE INDEX IF NOT EXISTS idx_hypotheses_rank ON diagnostic_hypotheses(rank_order);

-- KPIs — queried by category
CREATE INDEX IF NOT EXISTS idx_kpis_category ON kpis(category_id);

-- Departments — queried by branch
CREATE INDEX IF NOT EXISTS idx_departments_branch ON departments(branch_id);

-- Teams — queried by department
CREATE INDEX IF NOT EXISTS idx_teams_department ON teams(department_id);

-- Branches — queried by company
CREATE INDEX IF NOT EXISTS idx_branches_company ON branches(company_id);

-- Audit Logs — queried by date and action
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type);
