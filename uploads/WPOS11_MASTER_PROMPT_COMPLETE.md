# WPOS11 — MASTER IMPLEMENTATION PROMPT (All Phases)

**Scope:** Complete implementation from Phase A through Phase 5 (and beyond)  
**Duration:** 8-10 weeks (escalating complexity)  
**Team Size:** 1-2 developers (can parallelize Phase B with others)  
**Objective:** Transform WPOS11 from 9.5/10 to enterprise-grade platform with admin panel, advanced AI features, white-label support, and multi-tenant architecture  

---

# 📋 PROJECT PHASES OVERVIEW

```
Phase A: Fix to 10/10              (Days 1-1)      [5-6 hours]    ✅ READY
Phase B: Admin Panel               (Days 2-10)     [35-45 hours]  ✅ READY
Phase C: Testing & QA              (Days 11-13)    [15-20 hours]  📋 THIS PROMPT
Phase D: Deployment & Launch       (Days 14-15)    [10-15 hours]  📋 THIS PROMPT
Phase E: Advanced Features         (Weeks 4-5)     [30-40 hours]  📋 THIS PROMPT
Phase F: Multi-Tenant & Scale      (Weeks 6-7)     [40-50 hours]  📋 THIS PROMPT
Phase G: Enterprise Features       (Weeks 8-10)    [30-40 hours]  📋 THIS PROMPT
Phase H: Monitoring & Ops          (Ongoing)       [5-10 hrs/wk]  📋 THIS PROMPT

Total: 8-10 weeks | 180-220 hours | Production enterprise platform
```

---

# 🎯 PHASE A RECAP (Days 1-1 | 5-6 hours)

## Quick Reference: The 4 Gaps to Fix

### Gap 1: Accessibility (30 min)
```bash
# Add aria-labels to 24 icon-only buttons
grep -r "className.*hover" src/components/ | grep -E "Settings|Trash|Plus|X"
# For each: <button aria-label="Clear description">...</button>
npm run lint  # Verify: 0 errors
```

### Gap 2: Live Data (1 hour)
```bash
# Replace mock data in 3 pages with live queries
# Pages: command-center, competency, heatmaps
# Use hooks: useAuditLogs(), useCompetencyMatrix(), useRiskHeatmap()
npm run dev  # Verify: real data loads
```

### Gap 3: Service Tests (3 hours)
```bash
# Create unit tests for 12 services
# High priority: employees.service.ts, kpis.service.ts
# Medium: companies, branches, departments, teams
# Lower: kpi-categories, job-profiles, job-families, job-grades, competencies, permissions
npm run test:coverage  # Target: 90%+ coverage
```

### Gap 4: E2E Test (2 hours)
```bash
# Create diagnostic workflow E2E test
# File: src/e2e/diagnostic-workflow.spec.ts
# Paths: Create → Evidence → Diagnose → Approve → Report
npm run test:e2e -- diagnostic-workflow.spec.ts  # All 3 tests pass
```

**Verification:**
```bash
npm run typecheck     # 0 errors
npm run lint          # 0 errors
npm run test:all      # All passing
npm run build         # Success
git tag v2.0.0-beta   # Phase A complete
```

---

# 🛠️ PHASE B: ADMIN PANEL (Days 2-10 | 35-45 hours)

## 11 Major Admin Modules

### Module 1: Dashboard (Days 2, 4 hrs)
```typescript
// src/routes/admin/index.tsx
Features:
  ✅ Key metrics cards (users, diagnostics, health, pending)
  ✅ Quick action buttons
  ✅ Real-time activity feed
  ✅ System status indicator

Implementation:
  1. Create AdminLayout with sidebar (Pattern 7 from PART2)
  2. Build dashboard skeleton
  3. Query: adminService.getSystemMetrics()
  4. Refresh every 30 seconds (real-time)
  5. Test with real data
```

### Module 2: User Management (Days 4-5, 8 hrs)
```typescript
// src/routes/admin/users/
Files:
  - index.tsx           (user list with filters)
  - create.tsx          (create user form)
  - [id].tsx            (edit user form)
  - components/
    - UserTable.tsx     (sortable, paginated)
    - UserFilters.tsx   (multi-filter UI)
    - BulkUploadModal.tsx (CSV import)

Features:
  ✅ List with sorting & pagination
  ✅ Filters: status, role, department, search
  ✅ Create/edit user with validation
  ✅ Delete with confirmation
  ✅ Bulk upload via CSV
  ✅ Export user list
  ✅ Action history per user

Implementation Steps:
  1. Use Pattern 1 (admin page template) from PART2
  2. Use Pattern 2 (DataTable) for user list
  3. Use Pattern 3 (Filters) for multi-filter
  4. Use Pattern 4 (Create form) for user form
  5. Implement BulkUploadModal (copy from PART2)
  6. Add useUserManagement hook (Pattern 6)
  7. Test all CRUD operations
```

### Module 3: Organizations & Departments (Days 6, 6 hrs)
```typescript
// src/routes/admin/organizations/
// src/routes/admin/departments/

Features:
  ✅ Organization tree view
  ✅ Create/edit/delete organizations
  ✅ Department hierarchy (nested)
  ✅ Assign users to departments
  ✅ Department KPI targets
  ✅ Approval chain configuration

Implementation:
  1. Create OrgTree component (hierarchical view)
  2. Build org form (create/edit)
  3. Build department form (create/edit)
  4. Test tree navigation & CRUD
  5. Verify user assignments work
```

### Module 4: KPI Management (Days 7, 6 hrs)
```typescript
// src/routes/admin/kpis/

Features:
  ✅ KPI library with categories
  ✅ Create/edit/delete KPIs
  ✅ KPI templates by industry
  ✅ Usage tracking (which teams use which)
  ✅ KPI versioning (history)
  ✅ Import/export KPIs

Implementation:
  1. Build KPI list page (table with filters)
  2. Build KPI create/edit forms (Zod validation)
  3. Create KPI templates page
  4. Add KPI versioning (track changes)
  5. Implement import/export (CSV/JSON)
  6. Test all operations
```

### Module 5: Analytics Dashboard (Days 8, 5 hrs)
```typescript
// src/routes/admin/analytics/

Pages:
  - index.tsx           (System analytics)
  - diagnostics.tsx     (Diagnostic metrics)
  - performance.tsx     (Performance trends)
  - users.tsx           (User engagement)
  - system.tsx          (System health)

Features:
  ✅ System metrics (users, diagnostics, health)
  ✅ Diagnostic analytics (approval rate, avg time)
  ✅ Performance trends (30/90/365 days)
  ✅ Root cause distribution
  ✅ Diagnostic workflow funnel
  ✅ Department comparison
  ✅ Real-time updates

Charts:
  ✅ AreaChart: Diagnostics trend
  ✅ PieChart: Root cause distribution
  ✅ BarChart: Department performance
  ✅ LineChart: API response time
  ✅ FunnelChart: Workflow stages

Implementation:
  1. Create analyticsService with queries
  2. Build analytics pages with Recharts
  3. Add real-time subscriptions (Supabase Realtime)
  4. Implement date range filters
  5. Add export to PDF/Excel
  6. Optimize chart rendering
```

### Module 6: Settings & Configuration (Days 9, 4 hrs)
```typescript
// src/routes/admin/settings/

Tabs:
  ✅ General (org name, timezone, region)
  ✅ Security (password policy, 2FA, IP whitelist)
  ✅ Integrations (API keys, webhooks, OAuth)
  ✅ Notifications (email, Slack, Teams)
  ✅ Compliance (GDPR, ISO, data retention)
  ✅ Branding (logo, colors, domain)

Implementation:
  1. Create tabbed settings page
  2. Build forms per tab (with Zod validation)
  3. Implement settings service (read/write)
  4. Add integration testing (Slack, email, etc.)
  5. Verify settings persist & apply
```

### Module 7: Audit Logs (Days 9, 3 hrs)
```typescript
// src/routes/admin/audit-logs/

Features:
  ✅ Real-time log streaming
  ✅ Advanced filters (actor, action, resource, date)
  ✅ Full-text search
  ✅ Export (CSV, JSON, PDF)
  ✅ Log detail view with diffs
  ✅ Alert on suspicious activity
  ✅ Retention policy enforcement

Implementation:
  1. Build audit log table (use DataTable pattern)
  2. Create AuditFilters component
  3. Implement real-time subscription (Supabase)
  4. Add export functionality
  5. Detail view with before/after JSON diff
  6. Test filtering & search
```

### Module 8: System Health & Monitoring (Days 9-10, 3 hrs)
```typescript
// src/routes/admin/system/

Pages:
  - index.tsx       (System status)
  - database.tsx    (Database health)
  - cache.tsx       (Cache metrics)
  - jobs.tsx        (Background jobs)

Metrics:
  ✅ System status (Up/Degraded/Down)
  ✅ Database health (connections, slow queries, replication)
  ✅ API performance (response time, error rate)
  ✅ Cache stats (hit ratio, memory)
  ✅ Background job queue
  ✅ Server uptime %

Implementation:
  1. Create systemService (queries for metrics)
  2. Build system pages with charts
  3. Add real-time metrics polling
  4. Implement health checks
  5. Create alerts for issues
```

### Module 9: Diagnostic Management (Days 10, 3 hrs)
```typescript
// src/routes/admin/diagnostics/

Features:
  ✅ Pending diagnostics queue
  ✅ Bulk approve/reject
  ✅ Admin override capability
  ✅ Diagnostic rerun
  ✅ Version history
  ✅ Reassign to manager

Implementation:
  1. Build queue page (list pending)
  2. Implement approve/reject actions
  3. Add override modal
  4. Create diagnostic detail page
  5. Add version history viewer
```

### Module 10: Permissions & Roles (Days 10, 2 hrs)
```typescript
// src/routes/admin/permissions/

Features:
  ✅ Role matrix view (roles × permissions)
  ✅ Edit permissions per role
  ✅ Create custom roles
  ✅ Clone existing role
  ✅ Permission categories (users, KPIs, diagnostics, etc.)

Implementation:
  1. Create PermissionMatrix component
  2. Build role create/edit forms
  3. Test RBAC enforcement
  4. Verify RLS policies
```

### Module 11: Reports Builder (Days 10, 3 hrs)
```typescript
// src/routes/admin/reports/

Features:
  ✅ Drag-drop report builder (no-code)
  ✅ Pre-built templates (executive summary, diagnostics, compliance)
  ✅ Schedule reports (daily, weekly, monthly)
  ✅ Email delivery
  ✅ Export formats (PDF, Excel, HTML)

Implementation:
  1. Create ReportBuilder component
  2. Implement template selection
  3. Add scheduling UI
  4. Implement report generation
  5. Test email delivery
```

---

# ✅ PHASE C: TESTING & QA (Days 11-13 | 15-20 hours)

## Comprehensive Testing Strategy

### Unit Tests (Services)
```typescript
// All admin services need 90%+ coverage

Priority 1: Core Services (8 hours)
  ├─ adminService (all methods)
  ├─ usersService (CRUD, bulk ops)
  ├─ organizationsService
  ├─ kpisService
  └─ analyticsService

Priority 2: Supporting Services (6 hours)
  ├─ settingsService
  ├─ auditService
  ├─ systemService
  ├─ rbacService
  └─ reportService

Pattern:
```typescript
describe('AdminService', () => {
  it('should get system metrics', async () => {
    const metrics = await adminService.getSystemMetrics();
    expect(metrics).toHaveProperty('activeUsers');
    expect(metrics.activeUsers).toBeGreaterThanOrEqual(0);
  });

  it('should handle errors gracefully', async () => {
    vi.spyOn(supabase, 'from').mockRejectedValue(new Error('DB error'));
    await expect(adminService.getSystemMetrics()).rejects.toThrow();
  });
});
```

Run:
```bash
npm run test -- admin.service.test.ts
npm run test:coverage  # Target: 90%+
```

### Integration Tests (Admin Pages)
```typescript
// Test admin workflows end-to-end

Test Scenarios (4 hours):
  1. User Management Workflow
     ├─ Create user
     ├─ Edit user
     ├─ Delete user
     └─ Bulk upload users

  2. KPI Management Workflow
     ├─ Create KPI
     ├─ Apply to department
     └─ Track usage

  3. Settings Management
     ├─ Update general settings
     ├─ Change security policy
     └─ Configure integrations

  4. Analytics Dashboard
     ├─ Load metrics
     ├─ Filter data
     └─ Export report

Run:
```bash
npm run test -- admin.integration.test.ts
```

### E2E Tests (User Workflows)
```typescript
// Test complete admin workflows in browser

Test Scenarios (Playwright, 4 hours):
  1. Admin creates & manages users
  2. Admin views analytics dashboard
  3. Admin approves pending diagnostic
  4. Admin exports report
  5. Admin updates settings

File: src/e2e/admin-workflows.spec.ts

Pattern:
```typescript
test('admin should create user and verify in list', async ({ page }) => {
  await page.goto('/admin/users');
  await page.click('button:has-text("Create User")');
  
  // Fill form
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="full_name"]', 'Test User');
  await page.click('button:has-text("Create")');
  
  // Verify in list
  await expect(page.locator('text=test@example.com')).toBeVisible();
});
```

Run:
```bash
npm run test:e2e -- admin-workflows.spec.ts
```

### Performance Testing (3 hours)
```bash
# Test admin panel performance
npm run build              # Check bundle size
npm run preview            # Load test pages
# DevTools → Performance tab → Record

Metrics:
  ✅ Dashboard load: < 2s
  ✅ User list (1000 users): < 3s
  ✅ Analytics chart render: < 1s
  ✅ Bundle size increase: < 150KB
```

### Security Testing (2 hours)
```bash
# Verify security controls
✅ Non-admin users cannot access /admin
✅ RLS policies block unauthorized data access
✅ All inputs validated (Zod schemas)
✅ No hardcoded secrets in code
✅ API keys require authentication
✅ Audit logging captures all admin actions
✅ Sensitive data encrypted (passwords, tokens)
```

### Accessibility Testing (2 hours)
```bash
# Verify admin panel accessibility
npm run test:a11y        # Axe audit
# Check:
  ✅ All interactive elements keyboard accessible
  ✅ ARIA labels present
  ✅ Color contrast sufficient
  ✅ Screen reader friendly
```

---

# 🚀 PHASE D: DEPLOYMENT & LAUNCH (Days 14-15 | 10-15 hours)

## Staging Deployment (Day 14 | 6 hours)

### Pre-Deployment Checklist
```
Code Quality:
  ☑ All tests passing (unit + E2E)
  ☑ 0 type errors (npm run typecheck)
  ☑ 0 lint errors (npm run lint)
  ☑ Code reviewed & approved
  ☑ No console errors/warnings

Security:
  ☑ No hardcoded secrets
  ☑ RLS policies verified
  ☑ Admin access guarded
  ☑ Audit logging working
  ☑ Encryption enabled

Performance:
  ☑ Bundle < 1.5MB
  ☑ Lazy loading implemented
  ☑ Images optimized
  ☑ Database queries optimized
  ☑ Caching configured

Documentation:
  ☑ Admin panel guide written
  ☑ API docs updated
  ☑ Deployment runbook complete
  ☑ Troubleshooting guide included
```

### Staging Deployment Steps
```bash
# 1. Tag release
git tag -a v2.0.0 -m "WPOS11 v2.0: 10/10 + Enterprise Admin Panel"
git push origin v2.0.0

# 2. Deploy to staging
# (Your deployment process)
# Examples:
#   - Vercel: git push vercel main
#   - Railway: railway up
#   - Docker: docker build && docker push

# 3. Run smoke tests
npm run test:e2e -- admin-workflows.spec.ts
```

### Staging Verification (4 hours)
```
✅ Admin login works
✅ Dashboard loads with real data
✅ User management CRUD works
✅ Analytics display correctly
✅ Settings save & apply
✅ Audit logs record actions
✅ Real-time features functional
✅ No console errors
✅ Mobile responsive
✅ Performance acceptable (< 2s pages)
```

## Production Deployment (Day 15 | 8-10 hours)

### Production Checklist
```
Staging Verification:
  ☑ All staging tests passed
  ☑ Admin panel tested with real data
  ☑ Performance metrics acceptable
  ☑ Security audit passed
  ☑ Team sign-off obtained
  ☑ Customer notification sent
  ☑ Rollback plan documented
```

### Deployment Procedure
```bash
# 1. Pre-deployment backup
# Back up production database

# 2. Deploy code
# (Your deployment process)

# 3. Run migrations if needed
# (Any database schema changes)

# 4. Verify deployment
curl https://wpos.example.com/admin
# Should redirect to login

# 5. Smoke tests
npm run test:e2e -- admin-workflows.spec.ts --production
```

### Post-Deployment Monitoring (Ongoing)
```
First 24 hours:
  ✅ Monitor error logs (Sentry)
  ✅ Monitor performance (New Relic, Datadog)
  ✅ Check real-time metrics
  ✅ Review audit logs
  ✅ Collect user feedback
  ✅ Be ready to rollback

First 7 days:
  ✅ Gather analytics
  ✅ Optimize based on usage
  ✅ Fix any issues
  ✅ Update documentation
```

---

# 🔧 PHASE E: ADVANCED FEATURES (Weeks 4-5 | 30-40 hours)

## Feature 1: AI-Powered Insights Assistant (15-20 hours)

### Overview
Intelligent Q&A interface using Claude API to analyze WPOS data and answer business questions.

### Implementation

```typescript
// src/routes/admin/insights/index.tsx
import Anthropic from '@anthropic-ai/sdk';

export default function InsightsPage() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>();
  const [isLoading, setIsLoading] = useState(false);

  const handleAskQuestion = async (q: string) => {
    setIsLoading(true);
    
    // 1. Fetch relevant context from database
    const context = await getInsightsContext(q);
    
    // 2. Build prompt with context
    const systemPrompt = `You are a WPOS (Workforce Performance Operating System) intelligence assistant.
You help managers understand performance data.

Current data context:
${JSON.stringify(context, null, 2)}

Answer questions clearly and concisely. Provide actionable insights.`;

    // 3. Call Claude API
    const client = new Anthropic();
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        ...messages,
        { role: 'user', content: q }
      ]
    });

    // 4. Stream response
    const assistantMessage = response.content[0].type === 'text' 
      ? response.content[0].text 
      : '';

    setMessages([
      ...messages,
      { role: 'user', content: q },
      { role: 'assistant', content: assistantMessage }
    ]);

    setIsLoading(false);
  };

  const getInsightsContext = async (question: string) => {
    // Query relevant data based on question
    const metrics = await adminService.getSystemMetrics();
    const recentDiagnostics = await diagnosticsService.getRecent(10);
    const analytics = await analyticsService.getDiagnosticAnalytics();
    
    return {
      metrics,
      recentDiagnostics,
      analytics,
      timestamp: new Date().toISOString()
    };
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Insights Assistant</h1>
      
      <div className="bg-white rounded-lg border shadow-sm space-y-4 p-6">
        {/* Chat history */}
        <div className="space-y-4 h-96 overflow-y-auto">
          {messages?.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && <div className="text-gray-500">Thinking...</div>}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask about your workforce performance..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion(question)}
            className="flex-1 border rounded-lg px-4 py-2"
            disabled={isLoading}
          />
          <button
            onClick={() => handleAskQuestion(question)}
            isLoading={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Deployment Requirements
```
Environment Variables:
  ANTHROPIC_API_KEY=sk-ant-...    # From Anthropic console
  
Settings Configuration:
  - Enable "Insights Assistant" toggle in /admin/settings
  - Configure API key in admin settings
  - Set rate limits (questions/hour)
  - Configure allowed data access

Testing:
  - Test 10 different question types
  - Verify context accuracy
  - Test error handling (API failures)
  - Performance test (response time)
```

## Feature 2: Advanced Report Builder (10-15 hours)

### Features
```typescript
// src/routes/admin/reports/builder.tsx

✅ Drag-drop report sections
  ├─ KPI summary cards
  ├─ Trend charts
  ├─ Department comparison
  ├─ Diagnostic summary
  └─ Custom text blocks

✅ Scheduling
  ├─ One-time report
  ├─ Recurring (daily, weekly, monthly)
  ├─ Email delivery
  ├─ Save as template

✅ Export Formats
  ├─ PDF (via pdfkit or html2pdf)
  ├─ Excel (via SheetJS)
  ├─ HTML (for email)
  └─ Cloud storage (Google Drive, OneDrive)

✅ Pre-built Templates
  ├─ Executive Summary
  ├─ Diagnostic Pipeline Analysis
  ├─ Department Performance Report
  ├─ Compliance Report (ISO 27001)
  └─ Custom Industry Templates
```

Implementation:
```typescript
// 1. Create report builder UI
// 2. Implement report generation service
// 3. Add PDF/Excel export
// 4. Setup email scheduling
// 5. Test all export formats
```

## Feature 3: Workflow Automation (5-10 hours)

### Features
```
✅ Workflow Builder
  ├─ Visual workflow editor
  ├─ Drag-drop workflow steps
  ├─ Conditional logic (if/then)
  ├─ Actions: notify, create case, send email
  └─ Triggers: diagnostic approved, case created, intervention due

✅ Automation Rules
  ├─ If diagnostic approved → auto-create case
  ├─ If intervention due → send reminder
  ├─ If root cause X → assign to manager Y
  └─ Custom rules (visual editor)
```

---

# 🌐 PHASE F: MULTI-TENANT & SCALE (Weeks 6-7 | 40-50 hours)

## Architecture Shift to Multi-Tenant

### Current (Single-Tenant)
```
Database:
  ├─ organizations (1 per deployment)
  ├─ users
  ├─ diagnostics
  └─ audit_logs

RLS:
  user_id-based access control
```

### Target (Multi-Tenant)
```
Database:
  ├─ organizations (many)
  ├─ users (org-scoped)
  ├─ diagnostics (org-scoped)
  └─ audit_logs (org-scoped)

RLS:
  org_id + user_id based access control
  
Architecture:
  Shared database (single DB, org_id isolation)
  OR
  Separate schemas per org (PostgreSQL schemas)
  OR
  Separate databases per org (billing-aligned)
```

### Implementation (20-30 hours)

**Step 1: Schema Modifications (5 hours)**
```sql
-- Add org_id to all tables
ALTER TABLE users ADD COLUMN org_id UUID NOT NULL REFERENCES organizations(id);
ALTER TABLE diagnostics ADD COLUMN org_id UUID NOT NULL;
ALTER TABLE kpis ADD COLUMN org_id UUID NOT NULL;
ALTER TABLE audit_logs ADD COLUMN org_id UUID NOT NULL;

-- Create indexes
CREATE INDEX idx_users_org_id ON users(org_id);
CREATE INDEX idx_diagnostics_org_id ON diagnostics(org_id);

-- Update RLS policies
CREATE POLICY "org_isolation_users" ON users
  FOR SELECT USING (
    org_id = (SELECT org_id FROM users WHERE id = auth.uid())
  );

-- Similar for all tables
```

**Step 2: Application Changes (15-20 hours)**
```typescript
// 1. Add org context to auth
export interface AuthUser {
  id: string;
  email: string;
  role: string;
  org_id: string;  // NEW
}

// 2. Pass org_id to all queries
const { data } = await supabase
  .from('diagnostics')
  .select('*')
  .eq('org_id', user.org_id);

// 3. Update hooks
function useOrgContext() {
  const { user } = useAuth();
  return { org_id: user.org_id };
}

// 4. Test data isolation
// Verify: User A cannot see User B's data (different orgs)
```

**Step 3: Multi-Org Admin Features (5-10 hours)**
```typescript
// src/routes/admin/organizations/management.tsx
// Super-admin view of all organizations
// Manage org subscriptions, users, settings
```

### Testing Multi-Tenant (5 hours)
```bash
# Test org isolation
1. Create 2 organizations
2. Create users in each org
3. Verify data isolation (User A cannot see Org B data)
4. Test cross-org queries (should fail)
5. Test admin panel (should show only org data)
```

## Billing & Subscription Integration (10-15 hours)

### Features
```typescript
✅ Billing Dashboard
  ├─ Current plan
  ├─ Usage metrics
  ├─ Upcoming billing
  └─ Invoice history

✅ Plan Management
  ├─ Select plan (Starter, Professional, Enterprise)
  ├─ Upgrade/downgrade
  ├─ Annual vs monthly
  └─ Custom enterprise deals

✅ Payment Processing
  ├─ Stripe integration
  ├─ Credit card management
  ├─ Invoice generation
  └─ Automated dunning

✅ Usage Tracking
  ├─ Users count
  ├─ Diagnostics/month
  ├─ Storage usage
  └─ API calls
```

Implementation:
```typescript
// src/services/billing.service.ts
export const billingService = {
  async getCurrentPlan(org_id: string) {
    return supabase
      .from('organizations')
      .select('plan, plan_status, current_period_end')
      .eq('id', org_id)
      .single();
  },

  async upgradePlan(org_id: string, newPlan: string) {
    // Call Stripe API
    // Update org record
    // Log audit
  },

  async getUsageMetrics(org_id: string) {
    const users = await countUsers(org_id);
    const diagnostics = await countDiagnostics(org_id);
    const storage = await getStorageUsage(org_id);
    
    return { users, diagnostics, storage };
  },

  async checkPlanLimits(org_id: string) {
    const plan = await this.getCurrentPlan(org_id);
    const usage = await this.getUsageMetrics(org_id);
    
    // Check if usage exceeds plan limits
    if (usage.users > plan.user_limit) {
      return { allowed: false, reason: 'User limit exceeded' };
    }
    return { allowed: true };
  }
};
```

---

# 👥 PHASE G: ENTERPRISE FEATURES (Weeks 8-10 | 30-40 hours)

## Feature 1: White-Label Customization (15-20 hours)

### Features
```typescript
✅ Branding Customization
  ├─ Logo (light & dark mode)
  ├─ Primary color
  ├─ Logo on emails & PDFs
  ├─ Custom domain
  └─ Branded login page

✅ Customization Pages
  ├─ Privacy policy
  ├─ Terms of service
  ├─ Help documentation
  ├─ Support contact
  └─ Custom CSS (limited)

Implementation:
  1. Create branding table in DB
  2. Store org-specific branding
  3. Load branding in app layout
  4. Apply to all generated docs (PDF, email)
  5. Test all customizations
```

## Feature 2: Advanced RBAC (10-15 hours)

### Features
```
✅ Permission Granularity
  ├─ Department-level access
  ├─ Feature-level access
  ├─ Data field-level access
  └─ Time-based access (9-5 business hours only)

✅ Role Hierarchy
  ├─ Admin > CEO > Manager > User
  ├─ Department-scoped managers
  ├─ Delegation (manager A delegates to B)
  └─ Temporary elevated access
```

## Feature 3: Data Governance & Compliance (5-10 hours)

### Features
```
✅ GDPR Compliance
  ├─ Right to be forgotten (data deletion)
  ├─ Data export (all user data)
  ├─ Data retention policies
  ├─ Consent management
  └─ Privacy impact assessments

✅ Audit & Compliance
  ├─ Compliance dashboard
  ├─ Policy status
  ├─ Remediation tracking
  └─ Compliance reports (ISO, GDPR, HIPAA)
```

---

# 📊 PHASE H: MONITORING & OPERATIONS (Ongoing | 5-10 hrs/week)

## Monitoring Setup

### Error Tracking (Sentry)
```bash
# Setup
npm install --save @sentry/react @sentry/tracing

# Configuration
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.ENVIRONMENT,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter events if needed
    return event;
  }
});

# Alerts
- Error rate > 1% → Alert
- Specific error types → Custom alerts
```

### Performance Monitoring (New Relic / Datadog)
```
Track:
  ✅ Page load time (target: < 2s)
  ✅ API response time (target: < 500ms)
  ✅ Database query time (target: < 100ms)
  ✅ Memory usage
  ✅ CPU usage
  ✅ Disk I/O

Alerts:
  - Page load > 3s
  - API response > 1s
  - Error rate > 0.5%
  - Database down > 5 min
```

### Real-Time Metrics Dashboard
```typescript
// src/routes/admin/monitoring/index.tsx
// Display:
// ✅ Active users
// ✅ Requests/sec
// ✅ Error rate
// ✅ API latency
// ✅ Database health
// ✅ Cache hit ratio
```

## Operational Tasks

### Weekly
- [ ] Review error logs (Sentry)
- [ ] Check performance metrics (New Relic)
- [ ] Review audit logs for anomalies
- [ ] Backup verification
- [ ] User feedback review

### Monthly
- [ ] Security audit
- [ ] Performance optimization
- [ ] Dependency updates
- [ ] Documentation review
- [ ] Feature metrics analysis

### Quarterly
- [ ] Compliance review
- [ ] Capacity planning
- [ ] Disaster recovery drill
- [ ] Customer success review
- [ ] Roadmap planning

---

# 🎯 DEVELOPMENT EXECUTION PLAN

## Week 1-2: Phase A & B (55-65 hours)

**Day 1 (5-6 hrs):** Phase A - Reach 10/10
```bash
npm run test:all           # All tests pass
npm run build              # Build succeeds
git tag v2.0.0-beta       # Tag release
```

**Days 2-10 (35-45 hrs):** Phase B - Admin Panel
Follow WPOS11_MASTER_ROADMAP.md day-by-day timeline

**Day 11 (2-3 hrs):** Verification
```bash
npm run test:all           # All tests pass
npm run typecheck          # 0 errors
npm run lint               # 0 errors
```

## Week 2-3: Phase C (15-20 hours)

**Days 12-13:** Testing & QA
```
Unit tests: 8 hours
Integration tests: 4 hours
E2E tests: 4 hours
Performance tests: 3 hours
Security tests: 2 hours
```

## Week 3: Phase D (10-15 hours)

**Day 14:** Staging Deployment (6 hours)
**Day 15:** Production Deployment (8-10 hours)

## Weeks 4-5: Phase E (30-40 hours)

**Focus:** Advanced Features
```
Week 4:
  - Insights Assistant (15 hrs)
  - Report Builder (10 hrs)
Week 5:
  - Workflow Automation (5 hrs)
  - Bug fixes & polish (10 hrs)
```

## Weeks 6-7: Phase F (40-50 hours)

**Focus:** Multi-Tenant Architecture
```
Week 6:
  - Schema modifications (5 hrs)
  - App code changes (15 hrs)
  - Testing (5 hrs)
Week 7:
  - Billing integration (15 hrs)
  - Testing & deployment (10 hrs)
```

## Weeks 8-10: Phase G (30-40 hours)

**Focus:** Enterprise Features
```
Week 8:
  - White-label (15 hrs)
  - Advanced RBAC (10 hrs)
Week 9:
  - Data governance (10 hrs)
  - Testing (10 hrs)
Week 10:
  - Bug fixes (10 hrs)
  - Final polish (10 hrs)
```

## Ongoing: Phase H (5-10 hrs/week)

**Continuous:**
- Monitor production
- Fix issues
- Optimize performance
- Plan next features

---

# 📋 COMPLETE MASTER CHECKLIST

## Pre-Implementation
- [ ] All 9 WPOS11 documents reviewed
- [ ] Team assembled & scheduled
- [ ] Development environment ready
- [ ] Staging environment ready
- [ ] Production environment ready
- [ ] Monitoring tools setup (Sentry, New Relic)
- [ ] Git branching strategy defined
- [ ] Code review process defined
- [ ] Deployment process defined

## Phase A (Days 1-1)
- [ ] Gap 1: aria-labels added
- [ ] Gap 2: Live data queries
- [ ] Gap 3: Service tests (90%+ coverage)
- [ ] Gap 4: E2E diagnostic test
- [ ] All tests passing (150+)
- [ ] Commit & tag v2.0.0-beta

## Phase B (Days 2-10)
- [ ] Day 2-3: Admin foundation
- [ ] Day 4-5: User management
- [ ] Day 6: Organizations & departments
- [ ] Day 7: KPI management
- [ ] Day 8: Analytics dashboard
- [ ] Day 9: Settings & audit logs
- [ ] Day 10: Reports & polish
- [ ] All 11 modules complete

## Phase C (Days 11-13)
- [ ] Unit tests for all services
- [ ] Integration tests for workflows
- [ ] E2E tests for admin features
- [ ] Performance testing
- [ ] Security testing
- [ ] Accessibility testing

## Phase D (Days 14-15)
- [ ] Staging deployment successful
- [ ] Staging verification passed
- [ ] Production deployment successful
- [ ] Monitoring alerts configured
- [ ] Rollback plan tested

## Phase E (Weeks 4-5)
- [ ] Insights Assistant complete
- [ ] Report Builder complete
- [ ] Workflow Automation complete
- [ ] All features tested

## Phase F (Weeks 6-7)
- [ ] Multi-tenant schema changes
- [ ] Org isolation verified
- [ ] Billing integration complete
- [ ] Testing passed

## Phase G (Weeks 8-10)
- [ ] White-label customization
- [ ] Advanced RBAC
- [ ] Data governance
- [ ] All features tested & deployed

## Phase H (Ongoing)
- [ ] Monitoring setup
- [ ] Alert configuration
- [ ] Weekly operational tasks
- [ ] Performance optimization ongoing

---

# 🎉 SUCCESS CRITERIA

### Phase A Success
✅ Score: 9.5/10 → 10.0/10  
✅ All tests passing  
✅ 0 type/lint errors  

### Phase B Success
✅ 11 admin modules complete  
✅ 50+ admin pages  
✅ All CRUD working  
✅ Real-time features functional  

### Phase C Success
✅ 90%+ test coverage  
✅ All security checks pass  
✅ All performance targets met  

### Phase D Success
✅ Staging deployment successful  
✅ Production deployment successful  
✅ Monitoring active  
✅ Zero production issues (first week)  

### Phase E Success
✅ AI Insights Assistant working  
✅ Advanced reports generating  
✅ Workflow automation executing  

### Phase F Success
✅ Multi-tenant isolation verified  
✅ Org data completely isolated  
✅ Billing integration working  

### Phase G Success
✅ White-label customizable  
✅ Enterprise RBAC working  
✅ Compliance dashboard functional  

### Overall Success
✅ WPOS11 v3.0 at 10.0/10+  
✅ Enterprise-ready  
✅ Multi-tenant capable  
✅ AI-powered  
✅ Production stable  
✅ Ready for global scale  

---

# 🚀 FINAL ROADMAP SUMMARY

```
Week 1-2: Reach 10/10 + Build Admin Panel (60 hours)
Week 3: Test & Verify (20 hours)
Week 3-4: Deploy to Production (15 hours)
Week 4-5: Advanced Features - AI & Reporting (40 hours)
Week 6-7: Multi-Tenant Architecture (50 hours)
Week 8-10: Enterprise Features (40 hours)
Ongoing: Monitoring & Operations (5-10 hrs/week)

Total: ~320 hours over 8-10 weeks
Result: Enterprise-grade WPOS11 with advanced features
```

---

**You now have everything needed to build WPOS11 from 9.5/10 to an enterprise platform with advanced AI, white-label support, and multi-tenant architecture.**

**Start with Phase A (Day 1). Follow the timeline. Build incrementally. Test thoroughly. Deploy with confidence.** 🚀

---

*Master Prompt prepared: June 21, 2026*  
*Comprehensive: 7 phases + ongoing operations*  
*Complete: 320+ hours of detailed specifications*  
*Ready: Immediate implementation*
