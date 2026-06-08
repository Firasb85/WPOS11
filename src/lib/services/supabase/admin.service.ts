import { supabase } from "@/integrations/supabase/client";

export const adminService = {
  // ── Audit Logs ──
  async listAuditLogs(limit = 100) {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  },

  // ── Roles ──
  async listRoles() {
    const { data, error } = await supabase.from("roles").select("*").order("name");
    if (error) throw error;
    return data ?? [];
  },

  // ── Permissions ──
  async listPermissions() {
    const { data, error } = await supabase.from("permissions").select("*").order("module");
    if (error) throw error;
    return data ?? [];
  },

  // ── Role Permissions ──
  async listRolePermissions(roleId?: string) {
    let query = supabase
      .from("role_permissions")
      .select("*, roles(name), permissions(code, name, module)");
    if (roleId) query = query.eq("role_id", roleId);
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  // ── Users (Supabase auth.users via employees link) ──
  async listUsers() {
    const { data, error } = await supabase
      .from("users")
      .select(
        "id, email, first_name, last_name, is_active, role_id, language, last_login_at, created_at",
      )
      .is("deleted_at", null)
      .order("first_name");
    if (error) throw error;
    return data ?? [];
  },

  // ── Sessions ──
  async listActiveSessions() {
    const { data, error } = await supabase
      .from("sessions")
      .select("id, user_id, ip_address, created_at, expires_at, is_revoked")
      .eq("is_revoked", false)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    return data ?? [];
  },

  // ── Job Profiles ──
  async listJobProfiles() {
    const { data, error } = await supabase
      .from("job_profiles")
      .select("*, job_families(name), job_grades(name)")
      .is("deleted_at", null)
      .order("title");
    if (error) throw error;
    return data ?? [];
  },

  // ── KPI Relationships ──
  async listKpiRelationships() {
    const { data, error } = await supabase
      .from("kpi_relationships")
      .select(
        "*, parent:kpis!kpi_relationships_parent_kpi_id_fkey(name, code), child:kpis!kpi_relationships_child_kpi_id_fkey(name, code)",
      )
      .order("created_at");
    if (error) throw error;
    return data ?? [];
  },

  // ── Process Dependencies ──
  async listProcessDependencies() {
    const { data, error } = await supabase
      .from("process_dependencies")
      .select(
        "*, process:processes!process_dependencies_process_id_fkey(name), depends_on:processes!process_dependencies_depends_on_process_id_fkey(name)",
      )
      .order("created_at");
    if (error) throw error;
    return data ?? [];
  },

  // ── Competency Levels ──
  async listCompetencyLevels(competencyId?: string) {
    let query = supabase
      .from("competency_levels")
      .select("*, competencies(competency_name_en)")
      .order("level_number");
    if (competencyId) query = query.eq("competency_id", competencyId);
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },
};
