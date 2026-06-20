-- ============================================================================
-- WPOS — Pilot seed data (009)
-- ============================================================================
-- Seeds two demo orgs so the Pilot repositioning can be exercised end-to-end:
--
--   • "Pilot Demo Co."       — tier = 'pilot', 90-day window, single department
--   • "Enterprise Demo Co."  — tier = 'enterprise', full Advanced access
--
-- For the Pilot org we also seed two snapshots per employee × KPI so the
-- Before/After view at /pilot-results has real rows to display.
--
-- Idempotent: uses ON CONFLICT DO NOTHING for inserts.
-- ============================================================================

-- A demo department under the Pilot org (if it doesn't already exist)
INSERT INTO departments (id, branch_id, name, code, description)
SELECT 'dept-customer-success-pilot',
       (SELECT b.id FROM branches b JOIN companies c ON c.id = b.company_id
         WHERE c.name = 'Pilot Demo Co.' LIMIT 1),
       'Customer Success',
       'CS',
       'Pilot department — single-scope for evaluation'
WHERE EXISTS (SELECT 1 FROM companies WHERE name = 'Pilot Demo Co.')
ON CONFLICT (id) DO NOTHING;

-- A demo department under the Enterprise org
INSERT INTO departments (id, branch_id, name, code, description)
SELECT 'dept-operations-enterprise',
       (SELECT b.id FROM branches b JOIN companies c ON c.id = b.company_id
         WHERE c.name = 'Enterprise Demo Co.' LIMIT 1),
       'Operations',
       'OPS',
       'Enterprise demo department'
WHERE EXISTS (SELECT 1 FROM companies WHERE name = 'Enterprise Demo Co.')
ON CONFLICT (id) DO NOTHING;

-- Mark each company's pilot scope explicitly
UPDATE companies
   SET scope_department_id = 'dept-customer-success-pilot'
 WHERE name = 'Pilot Demo Co.';

-- Seed two-period snapshots per employee in the Pilot department so the
-- Before/After view has rows to display. Snapshots use a gap that closes
-- over time (baseline 78 → current 91 = +16.7% improvement).
DO $$
DECLARE
  emp_id   UUID;
  kpi_id   UUID;
  base_d   DATE := CURRENT_DATE - INTERVAL '60 days';
  cur_d    DATE := CURRENT_DATE;
BEGIN
  FOR emp_id IN
    SELECT e.id FROM employees e
      JOIN teams t ON t.id = e.team_id
      JOIN departments d ON d.id = t.department_id
     WHERE d.id = 'dept-customer-success-pilot'
     LIMIT 3
  LOOP
    FOR kpi_id IN
      SELECT id FROM kpis LIMIT 2
    LOOP
      INSERT INTO performance_snapshots
        (employee_id, kpi_id, period, target_value, actual_value, gap_percentage, status, created_at)
      VALUES
        (emp_id, kpi_id, base_d::text, 100, 78, -22.0, 'red',    base_d),
        (emp_id, kpi_id, cur_d::text,  100, 91,  -9.0, 'yellow', cur_d)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END
$$;

COMMENT ON TABLE companies IS
  'Org root. The repositioned WPOS pitches orgs as "Pilot" first; pilot orgs
   are scoped to a single department via scope_department_id and run for 90
   days via pilot_expires_at.';
