
REVOKE EXECUTE ON FUNCTION public.users_prevent_sensitive_update() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.users_prevent_sensitive_update() FROM anon;
REVOKE EXECUTE ON FUNCTION public.users_prevent_sensitive_update() FROM authenticated;
