-- =====================================================
-- WPOS Migration 003: RLS Policies for ALL tables
-- Run AFTER migration 002. Safe to re-run.
-- =====================================================

DO $$
DECLARE
  t text;
  policy_name text;
BEGIN
  FOR t IN
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename NOT LIKE 'pg_%'
    AND tablename NOT LIKE 'schema_%'
  LOOP
    -- Enable RLS
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);

    -- Build policy name
    policy_name := 'Authenticated access on ' || t;

    -- Drop existing policy if it exists (any name pattern)
    BEGIN
      EXECUTE format('DROP POLICY IF EXISTS "Allow all for authenticated" ON %I', t);
      EXECUTE format('DROP POLICY IF EXISTS "Authenticated access on %1$I" ON %1$I', t);
      EXECUTE format('DROP POLICY IF EXISTS "Authenticated full access on %1$I" ON %1$I', t);
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;

    -- Create fresh policy
    BEGIN
      EXECUTE format(
        'CREATE POLICY "Authenticated access on %1$I" ON %1$I
         FOR ALL TO authenticated USING (true) WITH CHECK (true)',
        t
      );
    EXCEPTION WHEN duplicate_object THEN
      NULL; -- Already exists with this exact name
    END;
  END LOOP;
END
$$;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
