-- ============================================================================
-- WPOS — Pilot Tier (008)
-- ============================================================================
-- Adds the `pilot` org tier (alongside starter/professional/enterprise/unlimited)
-- and supporting fields for the repositioned Pilot-first go-to-market.
--
-- Pilot orgs are scoped to a single department and have a 90-day evaluation
-- window. The UI filters "Advanced" modules for them automatically.
--
-- Safe to run on an existing DB (all operations are IF NOT EXISTS / DEFAULT).
-- ============================================================================

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS tier                varchar(20)  NOT NULL DEFAULT 'professional',
  ADD COLUMN IF NOT EXISTS pilot_expires_at   timestamptz,
  ADD COLUMN IF NOT EXISTS scope_department_id uuid REFERENCES departments(id);

-- Constraint: tier must be one of the allowed values.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'companies_tier_check'
  ) THEN
    ALTER TABLE companies
      ADD CONSTRAINT companies_tier_check
      CHECK (tier IN ('pilot', 'starter', 'professional', 'enterprise', 'unlimited'));
  END IF;
END $$;

-- Index for fast tier-based queries (e.g. "list all pilot orgs expiring soon").
CREATE INDEX IF NOT EXISTS idx_companies_tier ON companies(tier);
CREATE INDEX IF NOT EXISTS idx_companies_pilot_expires_at
  ON companies(pilot_expires_at)
  WHERE tier = 'pilot';

-- Backfill: tag the existing seed orgs so the migration is non-destructive.
UPDATE companies SET tier = 'professional' WHERE tier IS NULL;

-- Demo seed (idempotent):
--   - Pilot org  → single department scope, 90-day window starting today
--   - Enterprise demo org → no expiry, full access
INSERT INTO companies (id, name, tier, pilot_expires_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Pilot Demo Co.',    'pilot',     NOW() + INTERVAL '90 days'),
  ('22222222-2222-2222-2222-222222222222', 'Enterprise Demo Co.', 'enterprise', NULL)
ON CONFLICT (id) DO UPDATE
  SET tier              = EXCLUDED.tier,
      pilot_expires_at  = EXCLUDED.pilot_expires_at;

-- A view that the dashboard / banner / sidebar can read directly,
-- so we don't need a roundtrip through the API for tier metadata.
CREATE OR REPLACE VIEW v_company_tier AS
SELECT
  c.id,
  c.name,
  c.tier,
  c.pilot_expires_at,
  c.scope_department_id,
  CASE WHEN c.tier = 'pilot' THEN TRUE ELSE FALSE END                        AS is_pilot,
  CASE
    WHEN c.tier = 'pilot' AND c.pilot_expires_at IS NOT NULL
    THEN GREATEST(0, EXTRACT(DAY FROM (c.pilot_expires_at - NOW()))::int)
    ELSE NULL
  END                                                                        AS pilot_days_remaining,
  CASE
    WHEN c.tier = 'pilot'
     AND c.pilot_expires_at IS NOT NULL
     AND c.pilot_expires_at < NOW() + INTERVAL '14 days'
    THEN TRUE
    ELSE FALSE
  END                                                                        AS pilot_expiring_soon
FROM companies c
WHERE c.deleted_at IS NULL;

COMMENT ON COLUMN companies.tier IS
  'Org tier. One of: pilot | starter | professional | enterprise | unlimited. Pilot orgs are scoped to a single department and have a 90-day evaluation window.';
COMMENT ON COLUMN companies.pilot_expires_at IS
  'When the pilot tier expires. NULL for non-pilot tiers. Drives the banner reminder in the dashboard.';
COMMENT ON COLUMN companies.scope_department_id IS
  'For pilot orgs: the single department the org is scoped to. NULL for non-pilot tiers.';
