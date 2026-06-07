-- =====================================================
-- WPOS Migration 003: RLS Policies for ALL tables
-- Run this in Supabase SQL Editor AFTER enabling auth
-- =====================================================

-- Enable RLS on all core tables (if not already)
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
    -- Create a permissive policy for authenticated users
    -- In production, tighten these per role
    BEGIN
      EXECUTE format(
        'CREATE POLICY "Authenticated full access on %1$I" ON %1$I
         FOR ALL TO authenticated USING (true) WITH CHECK (true)',
        t
      );
    EXCEPTION WHEN duplicate_object THEN
      NULL; -- Policy already exists
    END;
  END LOOP;
END
$$;

-- Grant usage to authenticated role
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
