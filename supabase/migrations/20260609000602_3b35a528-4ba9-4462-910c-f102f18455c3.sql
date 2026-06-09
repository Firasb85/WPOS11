
-- 1) get_user_role(): remove user_metadata fallback (user-editable).
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role'),
    'USER'
  )
$$;

-- 2) Lock down EXECUTE on SECURITY DEFINER helpers to authenticated only.
REVOKE EXECUTE ON FUNCTION public.get_user_role() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_user_role() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 3) audit_logs: remove client INSERT. Writes go through service role only.
DROP POLICY IF EXISTS audit_insert_all ON public.audit_logs;

-- 4) evidence: restrict INSERT to manager/admin/CEO and force submitted_by = auth.uid().
DROP POLICY IF EXISTS ev_insert ON public.evidence;
CREATE POLICY ev_insert ON public.evidence
  FOR INSERT TO authenticated
  WITH CHECK (
    submitted_by = auth.uid()
    AND public.get_user_role() IN ('ADMIN', 'CEO', 'MANAGER')
  );

-- 5) users: hide password_hash from authenticated; restrict self-update columns.
REVOKE SELECT (password_hash) ON public.users FROM authenticated;

CREATE OR REPLACE FUNCTION public.users_prevent_sensitive_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    IF NEW.password_hash IS DISTINCT FROM OLD.password_hash
       OR NEW.role_id IS DISTINCT FROM OLD.role_id
       OR NEW.email IS DISTINCT FROM OLD.email
       OR NEW.is_active IS DISTINCT FROM OLD.is_active THEN
      RAISE EXCEPTION 'Not allowed to update protected user columns';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_users_prevent_sensitive_update ON public.users;
CREATE TRIGGER trg_users_prevent_sensitive_update
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.users_prevent_sensitive_update();

-- 6) password_reset_tokens: add DELETE policy; block client INSERT.
DROP POLICY IF EXISTS prt_delete_own ON public.password_reset_tokens;
CREATE POLICY prt_delete_own ON public.password_reset_tokens
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS prt_insert_none ON public.password_reset_tokens;
CREATE POLICY prt_insert_none ON public.password_reset_tokens
  FOR INSERT TO authenticated
  WITH CHECK (false);
