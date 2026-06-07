/**
 * WPOS Drizzle ORM Schema
 * Maps SQL migrations to type-safe Drizzle table definitions.
 * Generated from migrations/001_schema.sql through 007_final_enterprise.sql
 */
import {
  pgTable, uuid, varchar, text, boolean, timestamp, integer,
  decimal, jsonb, unique, index,
} from 'drizzle-orm/pg-core';

// ─── CORE RBAC ────────────────────────────────────────────────────────────────

export const roles = pgTable('roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  isSystem: boolean('is_system').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const permissions = pgTable('permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 200 }).notNull().unique(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  module: varchar('module', { length: 100 }).notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const rolePermissions = pgTable('role_permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  roleId: uuid('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  permissionId: uuid('permission_id').notNull().references(() => permissions.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, t => ({ uniq: unique().on(t.roleId, t.permissionId) }));

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  avatarUrl: text('avatar_url'),
  roleId: uuid('role_id').notNull().references(() => roles.id),
  isActive: boolean('is_active').default(true),
  language: varchar('language', { length: 10 }).default('ar'),
  theme: varchar('theme', { length: 20 }).default('light'),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  passwordChangedAt: timestamp('password_changed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 500 }).notNull().unique(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  isRevoked: boolean('is_revoked').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 100 }).notNull(),
  entityId: uuid('entity_id'),
  description: text('description'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, t => ({ idxUserId: index('idx_audit_user').on(t.userId), idxEntity: index('idx_audit_entity').on(t.entityType, t.entityId) }));

// ─── ORGANIZATION ─────────────────────────────────────────────────────────────

export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  legalName: varchar('legal_name', { length: 255 }),
  registrationNumber: varchar('registration_number', { length: 100 }),
  taxNumber: varchar('tax_number', { length: 100 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  country: varchar('country', { length: 100 }),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  website: varchar('website', { length: 255 }),
  logoUrl: text('logo_url'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const branches = pgTable('branches', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyId: uuid('company_id').notNull().references(() => companies.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  country: varchar('country', { length: 100 }),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const departments = pgTable('departments', {
  id: uuid('id').primaryKey().defaultRandom(),
  branchId: uuid('branch_id').notNull().references(() => branches.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }),
  description: text('description'),
  managerId: uuid('manager_id').references(() => users.id),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  departmentId: uuid('department_id').notNull().references(() => departments.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }),
  leaderId: uuid('leader_id').references(() => users.id),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// ─── JOB ARCHITECTURE ─────────────────────────────────────────────────────────

export const jobFamilies = pgTable('job_families', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  nameAr: varchar('name_ar', { length: 255 }),
  code: varchar('code', { length: 50 }),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const jobGrades = pgTable('job_grades', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  nameAr: varchar('name_ar', { length: 255 }),
  code: varchar('code', { length: 50 }),
  level: integer('level').notNull(),
  salaryMin: decimal('salary_min', { precision: 12, scale: 2 }),
  salaryMax: decimal('salary_max', { precision: 12, scale: 2 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id').references(() => jobFamilies.id),
  gradeId: uuid('grade_id').references(() => jobGrades.id),
  title: varchar('title', { length: 255 }).notNull(),
  titleAr: varchar('title_ar', { length: 255 }),
  code: varchar('code', { length: 50 }),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const employees = pgTable('employees', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  teamId: uuid('team_id').references(() => teams.id),
  jobId: uuid('job_id').references(() => jobs.id),
  employeeNumber: varchar('employee_number', { length: 50 }),
  hireDate: timestamp('hire_date', { withTimezone: true }),
  isActive: boolean('is_active').default(true),
  supervisorId: uuid('supervisor_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, t => ({ idxTeam: index('idx_emp_team').on(t.teamId), idxSupervisor: index('idx_emp_supervisor').on(t.supervisorId) }));

// ─── KPIs ─────────────────────────────────────────────────────────────────────

export const kpiCategories = pgTable('kpi_categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  nameAr: varchar('name_ar', { length: 255 }),
  code: varchar('code', { length: 50 }),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const kpis = pgTable('kpis', {
  id: uuid('id').primaryKey().defaultRandom(),
  categoryId: uuid('category_id').references(() => kpiCategories.id),
  parentKpiId: uuid('parent_kpi_id'),
  name: varchar('name', { length: 255 }).notNull(),
  nameAr: varchar('name_ar', { length: 255 }),
  code: varchar('code', { length: 50 }),
  description: text('description'),
  unit: varchar('unit', { length: 50 }),
  targetValue: decimal('target_value', { precision: 12, scale: 4 }),
  warningThreshold: decimal('warning_threshold', { precision: 5, scale: 2 }),
  criticalThreshold: decimal('critical_threshold', { precision: 5, scale: 2 }),
  weight: decimal('weight', { precision: 5, scale: 2 }),
  ownerId: uuid('owner_id').references(() => users.id),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const performanceSnapshots = pgTable('performance_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  employeeId: uuid('employee_id').notNull().references(() => employees.id),
  kpiId: uuid('kpi_id').notNull().references(() => kpis.id),
  period: varchar('period', { length: 20 }).notNull(),
  targetValue: decimal('target_value', { precision: 12, scale: 4 }),
  actualValue: decimal('actual_value', { precision: 12, scale: 4 }),
  gapPercentage: decimal('gap_percentage', { precision: 7, scale: 2 }),
  status: varchar('status', { length: 20 }).default('yellow'), // green | yellow | red
  notes: text('notes'),
  recordedBy: uuid('recorded_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, t => ({ idxEmployee: index('idx_snap_employee').on(t.employeeId), idxKpi: index('idx_snap_kpi').on(t.kpiId), idxStatus: index('idx_snap_status').on(t.status) }));

// ─── EVIDENCE ─────────────────────────────────────────────────────────────────

export const evidence = pgTable('evidence', {
  id: uuid('id').primaryKey().defaultRandom(),
  employeeId: uuid('employee_id').references(() => employees.id),
  evidenceType: varchar('evidence_type', { length: 50 }).notNull(), // quantitative | qualitative | observational | system
  source: varchar('source', { length: 255 }).notNull(),
  description: text('description'),
  attachmentUrl: text('attachment_url'),
  reliability: varchar('reliability', { length: 20 }).default('medium'), // high | medium | low
  validatedBy: uuid('validated_by').references(() => users.id),
  validatedAt: timestamp('validated_at', { withTimezone: true }),
  submittedBy: uuid('submitted_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, t => ({ idxEmployee: index('idx_ev_employee').on(t.employeeId), idxType: index('idx_ev_type').on(t.evidenceType) }));

// ─── DIAGNOSTICS ──────────────────────────────────────────────────────────────

export const diagnosticReports = pgTable('diagnostic_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  employeeId: uuid('employee_id').notNull().references(() => employees.id),
  title: varchar('title', { length: 500 }).notNull(),
  performanceSummary: text('performance_summary'),
  evidenceSummary: text('evidence_summary'),
  status: varchar('status', { length: 50 }).default('draft'), // draft | under_review | approved | rejected
  generatedBy: uuid('generated_by').references(() => users.id),
  reviewedBy: uuid('reviewed_by').references(() => users.id),
  approvedBy: uuid('approved_by').references(() => users.id),
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, t => ({ idxEmployee: index('idx_diag_employee').on(t.employeeId), idxStatus: index('idx_diag_status').on(t.status) }));

export const diagnosticHypotheses = pgTable('diagnostic_hypotheses', {
  id: uuid('id').primaryKey().defaultRandom(),
  reportId: uuid('report_id').notNull().references(() => diagnosticReports.id, { onDelete: 'cascade' }),
  category: varchar('category', { length: 100 }).notNull(),
  hypothesis: text('hypothesis').notNull(),
  confidenceScore: decimal('confidence_score', { precision: 5, scale: 2 }),
  supportingEvidence: jsonb('supporting_evidence'),
  contradictingEvidence: jsonb('contradicting_evidence'),
  validationActions: jsonb('validation_actions'),
  rankOrder: integer('rank_order'),
  reasoning: text('reasoning'),
  validatedBy: uuid('validated_by').references(() => users.id),
  validatedAt: timestamp('validated_at', { withTimezone: true }),
  isConfirmed: boolean('is_confirmed'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, t => ({ idxReport: index('idx_hyp_report').on(t.reportId) }));

// ─── CASES ────────────────────────────────────────────────────────────────────

export const cases = pgTable('cases', {
  id: uuid('id').primaryKey().defaultRandom(),
  caseNumber: varchar('case_number', { length: 50 }).notNull().unique(),
  diagnosticReportId: uuid('diagnostic_report_id').references(() => diagnosticReports.id),
  employeeId: uuid('employee_id').notNull().references(() => employees.id),
  departmentId: uuid('department_id').references(() => departments.id),
  managerId: uuid('manager_id').references(() => users.id),
  rootCauseCategory: varchar('root_cause_category', { length: 100 }),
  priority: varchar('priority', { length: 20 }).default('medium'), // low | medium | high | critical
  status: varchar('status', { length: 50 }).default('open'), // open | under_investigation | action_planned | monitoring | resolved | closed
  description: text('description'),
  createdBy: uuid('created_by').references(() => users.id),
  closureDate: timestamp('closure_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, t => ({ idxEmployee: index('idx_case_employee').on(t.employeeId), idxStatus: index('idx_case_status').on(t.status) }));

export const rootCauses = pgTable('root_causes', {
  id: uuid('id').primaryKey().defaultRandom(),
  category: varchar('category', { length: 100 }).notNull(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  nameEn: varchar('name_en', { length: 255 }).notNull(),
  nameAr: varchar('name_ar', { length: 255 }),
  description: text('description'),
  typicalInterventions: jsonb('typical_interventions'),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ─── MULTI-TENANT SAAS (006) ──────────────────────────────────────────────────

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  domain: varchar('domain', { length: 255 }),
  logoUrl: text('logo_url'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id),
  name: varchar('name', { length: 255 }).notNull(),
  keyHash: varchar('key_hash', { length: 500 }).notNull().unique(),
  prefix: varchar('prefix', { length: 20 }).notNull(),
  scopes: jsonb('scopes'),
  isActive: boolean('is_active').default(true),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
  createdBy: uuid('created_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// ─── ENTERPRISE (007) ─────────────────────────────────────────────────────────

export const riskRegisters = pgTable('risk_registers', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 500 }).notNull(),
  category: varchar('category', { length: 100 }),
  description: text('description'),
  likelihood: integer('likelihood'), // 1-5
  impact: integer('impact'), // 1-5
  riskScore: integer('risk_score'),
  status: varchar('status', { length: 50 }).default('open'),
  ownerId: uuid('owner_id').references(() => users.id),
  mitigationPlan: text('mitigation_plan'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const maturityAssessments = pgTable('maturity_assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  departmentId: uuid('department_id').references(() => departments.id),
  overallLevel: integer('overall_level'), // 1-5
  assessedBy: uuid('assessed_by').references(() => users.id),
  notes: text('notes'),
  assessedAt: timestamp('assessed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const notificationTemplates = pgTable('notification_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  channel: varchar('channel', { length: 50 }).notNull(), // email | in_app | sms | whatsapp
  subject: varchar('subject', { length: 500 }),
  bodyTemplate: text('body_template'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ─── TYPE EXPORTS ─────────────────────────────────────────────────────────────

export type DbRole = typeof roles.$inferSelect;
export type DbUser = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type DbCompany = typeof companies.$inferSelect;
export type DbBranch = typeof branches.$inferSelect;
export type DbDepartment = typeof departments.$inferSelect;
export type DbTeam = typeof teams.$inferSelect;
export type DbEmployee = typeof employees.$inferSelect;
export type DbKpi = typeof kpis.$inferSelect;
export type DbPerformanceSnapshot = typeof performanceSnapshots.$inferSelect;
export type DbEvidence = typeof evidence.$inferSelect;
export type DbDiagnosticReport = typeof diagnosticReports.$inferSelect;
export type DbDiagnosticHypothesis = typeof diagnosticHypotheses.$inferSelect;
export type Case = typeof cases.$inferSelect;
export type RootCause = typeof rootCauses.$inferSelect;
export type Tenant = typeof tenants.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
export type RiskRegister = typeof riskRegisters.$inferSelect;
