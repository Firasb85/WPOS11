# WPOS — Workforce Performance Operating System

## App Concept

**WPOS** is an enterprise-grade workforce performance management platform that transforms how organizations detect, diagnose, and resolve employee performance issues. Instead of relying on annual reviews and gut feelings, WPOS provides a **continuous, evidence-based diagnostic workflow** — from detecting a KPI gap to implementing a targeted intervention and measuring the outcome.

### The Problem WPOS Solves

Most organizations discover performance problems too late. By the time a manager notices an employee is underperforming, the damage is already done — missed targets, customer complaints, team friction. Traditional HR systems track outcomes (KPIs) but don't explain **why** performance dropped or **what** to do about it.

**WPOS bridges the gap between "what happened" and "why it happened" and "what to fix."**

### The Core Innovation: Diagnostic Performance Workflow

```
DETECT → DIAGNOSE → DECIDE → ACT → MEASURE
   │         │          │        │        │
   │    Evidence     Manager    Case   Follow-up
   │    Collection   Approval   + Plan   30/60/90d
   │         │          │        │        │
  KPI     Root Cause   Approve  Assign   KPI
  Gap     Hypotheses   /Reject  Training  Re-check
  Found   Generated            /Coaching
```

Unlike tools that just measure performance, WPOS uses a **structured Diagnostic Engine** that:
1. Collects multi-source evidence (quantitative, qualitative, behavioral, contextual)
2. Generates ranked root-cause hypotheses with confidence scores
3. Detects contradictions between evidence items
4. Predicts future KPI breaches before they happen
5. Recommends targeted interventions based on the root cause

---

## Target Users

| Role | How They Use WPOS |
|------|------------------|
| **CEO / C-Suite** | Executive dashboards, at-risk department alerts, strategic analytics |
| **HR Director** | Workforce-wide diagnostics, intervention effectiveness, competency gaps |
| **Department Manager** | Team performance monitoring, diagnostic approvals, case management |
| **Supervisor** | Team member KPI tracking, evidence collection, follow-up |
| **Analyst** | Diagnostic investigations, evidence analysis, hypothesis generation |
| **System Admin** | User management, roles, audit logs, system configuration |

---

## Complete Feature List

### Module 1: Authentication & Access Control
| Feature | Description |
|---------|-------------|
| Email/Password Login | Supabase Auth with session management |
| Account Registration | Self-service signup with email confirmation |
| Role-Based Access (RBAC) | 4 roles: ADMIN, CEO, MANAGER, USER with 20 permission codes |
| Permission Guards | 9 sensitive pages restricted to ADMIN/CEO |
| Session Management | JWT-based, auto-refresh, SSR-safe |
| Secure Logout | Clears session and redirects |

### Module 2: Organization Management
| Feature | Description |
|---------|-------------|
| Company CRUD | Create, list, soft-delete companies |
| Branch Management | Link branches to companies with location data |
| Department CRUD | Nested under branches, manager assignment |
| Team Management | Groups within departments |
| Employee Registry | Full employee profiles with team/department assignment |
| Org Hierarchy View | Interactive tree visualization (company → branch → dept → team → employee) |
| Paginated Search | Server-side search across employee name, code, email |

### Module 3: Job Architecture
| Feature | Description |
|---------|-------------|
| Job Families | Groupings like Engineering, Sales, Finance |
| Job Grades | Levels with salary bands |
| Job Profiles | Role templates with required competencies |
| Job Definitions | Specific positions linked to profiles and employees |

### Module 4: Competency Framework
| Feature | Description |
|---------|-------------|
| Competency Library | Define competencies with bilingual names (EN/AR), codes, categories |
| 4 Category Types | Skill, Knowledge, Behavior, Attitude |
| Proficiency Levels | 5-level scale with behavioral indicators |
| Employee Assessments | Record current vs required competency levels |
| Gap Analysis | Visual gap identification per employee |
| Competency Heatmap | Grid showing gaps across employees × competencies |

### Module 5: Process Architecture
| Feature | Description |
|---------|-------------|
| Process Library | Business processes with risk level and criticality |
| Process Steps | Ordered steps with duration, tools, common errors |
| Dependency Mapping | Process-to-process dependency visualization |
| Process Intelligence | Dashboard with risk and efficiency metrics |

### Module 6: KPI Management
| Feature | Description |
|---------|-------------|
| KPI Categories | Groupings for organizing indicators |
| KPI Library | Define KPIs with target, unit, frequency, direction |
| KPI Tree | Hierarchical parent-child KPI relationships |
| KPI Dependency | Cross-KPI impact mapping |

### Module 7: Performance Snapshots (Gap Detection)
| Feature | Description |
|---------|-------------|
| Snapshot Recording | Select employee + KPI → enter target & actual values |
| **Live Gap Calculator** | Real-time computation: gap value, gap %, auto-status (🟢🟡🔴) |
| Auto-Status Assignment | GREEN (≥0%), YELLOW (0 to -10%), RED (<-10%) |
| **Sparkline Trends** | Toggle inline SVG sparklines per employee/KPI pair |
| **3-Period Downtrend Detection** | Auto-flags KPIs declining for 3+ consecutive periods |
| Downtrend Filter | One-click filter to show only declining KPIs |
| Snapshot History | Full list with employee, KPI, gap, status from Supabase |

### Module 8: Evidence Collection
| Feature | Description |
|---------|-------------|
| Evidence Submission | Form with 6 types: Quantitative, Qualitative, Behavioral, System Generated, Contextual, Temporal |
| Reliability Scoring | High / Medium / Low per evidence item |
| Source Tracking | Where the evidence came from (system, manager, survey) |
| Evidence Library | Searchable list with type/reliability badges |
| **Evidence Impact Scorer** | 0-10 impact score per item based on keyword analysis (18 keywords × 6 themes), evidence type weight, reliability bonus, depth bonus |
| **Impact Sorting** | Sort evidence by impact score ascending/descending |
| **Theme Tags** | Auto-detected themes: performance, trend, quality, skill, attendance, workload |
| **Correlation Heatmap** | 6×6 SVG matrix showing co-occurrence patterns between evidence types using keyword theme analysis |

### Module 9: Diagnostic Engine (Core Innovation)
| Feature | Description |
|---------|-------------|
| **Guided Diagnostic Wizard** | 4-step modal: Employee → Evidence → Categories → Review & Generate |
| Underperformer Highlighting | RED-flagged employees shown first with KPI gap details |
| Multi-Evidence Attachment | Add/remove evidence items inline during wizard |
| 10 Root Cause Categories | Skill Gap, Knowledge Gap, Process Issue, Tool Issue, Environmental, Resource, Management, Motivation, Workload, Policy |
| **Visual Category Selector** | Emoji-icon grid with multi-select checkmarks |
| **Hypothesis Generation Engine** | Analyzes evidence descriptions for keywords, scores 10 categories, ranks top 5 by confidence |
| Maturity Level | Auto-calculated 1-5 based on evidence count |
| Diagnostic Reports | List with status, maturity badge, confidence %, date |
| **Bulk PDF Export** | Checkbox selection → combined PDF with cover page, hypotheses tables |
| Report Detail View | Full report with status bar, hypotheses, supporting evidence tags |

### Module 10: Manager Review & Approval
| Feature | Description |
|---------|-------------|
| Submit for Review | Analyst submits diagnostic → status changes to "Under Review" |
| Approve | Manager approves → enables case creation |
| Reject with Reason | Manager rejects with explanation → returns to Draft |
| Reviewer Tracking | Records who reviewed, when, and decision |
| Manager Review Notes | Displayed on report when present |

### Module 11: Case Management
| Feature | Description |
|---------|-------------|
| **Auto-Create from Diagnostic** | One-click creates case from approved diagnostic |
| Auto-Priority | Critical (≥80% confidence), High (≥60%), Medium (≥30%), Low (<30%) |
| Root Cause Linking | Top hypothesis category becomes case root cause |
| Case Number Generation | Sequential CAS-YYYY-NNNN format |
| Status Transitions | Open → Investigate → Action Planned → Monitoring → Resolved |
| Case Dashboard | Live metrics by status and priority |

### Module 12: Intervention Tracking
| Feature | Description |
|---------|-------------|
| Intervention Library | Reusable templates: Training, Coaching, Mentoring, Process Redesign, Tool Upgrade |
| Bilingual Names | EN + AR names per intervention |
| Case Assignment | Link interventions to specific cases |
| Action Plans | Numbered action items with owners and deadlines |
| Follow-Up Scheduling | 30/60/90-day check-ins with before/after KPI comparison |

### Module 13: Proactive Risk Prediction
| Feature | Description |
|---------|-------------|
| **Breach Probability Algorithm** | 3-factor model: Gap Severity (0-40) + Trend Direction (0-30) + Consecutive RED (0-30) |
| **At-Risk Badges** | Inline badges showing probability % + trend arrow (↗↘→) |
| **At-Risk Employee Panel** | Sorted list with department, KPI, gap, probability |
| **At-Risk Department Panel** | Aggregated department-level risk view |
| Risk Levels | Critical (≥75%), High (≥50%), Medium (≥30%), Low (≥20%) |
| **Dashboard Integration** | Panels on CEO, Department, and Supervisor dashboards |

### Module 14: Peer Comparison
| Feature | Description |
|---------|-------------|
| **Employee vs Department Average** | Table comparing per-KPI actual vs team/department peers |
| Peer Discovery | Auto-finds employees in same team/department |
| Difference Highlighting | Green ↗ for above peers, Red ↘ for below |
| Peer Count | Shows "(N peers)" for transparency |

### Module 15: Dashboards (All Live Data)
| Feature | Description |
|---------|-------------|
| CEO Dashboard | Total employees, departments, performance index, KPI status, diagnostics pipeline, system summary |
| Department Dashboard | Per-department performance breakdown with employee counts and KPI status |
| Supervisor Dashboard | Team member list with KPI health indicators |
| Competency Dashboard | Competency heatmap and gap analysis |
| Diagnostic Intelligence | Combined analytics: root causes, peer comparison, evidence analysis, heatmap |
| Process Intelligence | Process risk and dependency visualization |
| **Real-Time Updates** | Supabase Realtime subscriptions on 5 key tables — dashboard auto-refreshes on any data change |

### Module 16: Analytics
| Feature | Description |
|---------|-------------|
| Root Cause Distribution | Bar chart from real diagnostic hypotheses |
| Competency Trends | Gap analysis over time |
| Evidence Quality | Distribution by type and reliability |

### Module 17: Reports & Export
| Feature | Description |
|---------|-------------|
| CSV Export | Employees, Companies, KPIs, Diagnostics, Dashboard Summary |
| JSON Export | Full data dumps for integration |
| **PDF Export** | Professional executive review format with combined multi-report output |
| Enterprise Reports | Aggregated organizational reports |

### Module 18: Administration
| Feature | Description |
|---------|-------------|
| User Management | Employee list with status (RBAC protected) |
| Role Management | View roles and permissions |
| **Audit Log Filtering** | 5 filter types: action, entity, user, date range, full-text search |
| Audit Log Export | CSV export of filtered results |
| System Settings | Configuration panel |
| Security Settings | Authentication, MFA, session controls |
| API Key Management | Key lifecycle (RBAC protected) |

### Module 19: Advanced Tools
| Feature | Description |
|---------|-------------|
| Rules Engine | Business rule configuration |
| Form Builder | Custom form design |
| Data Lineage | Data flow tracking |
| Workflow Studio | Workflow automation design |
| Digital Twin | Organization modeling |
| Strategy | Strategic planning and balanced scorecard |
| Portfolio | Project and initiative management |
| Benchmarks | Industry comparison |
| Data Catalog | Metadata repository |
| Simulations | What-if scenarios |
| Command Center | Operational overview (RBAC protected) |
| Documents | Document management |
| Notifications | Alert management |

### Module 20: Platform & Infrastructure
| Feature | Description |
|---------|-------------|
| Bilingual UI | Full English/Arabic with RTL support |
| Dark Mode | Persistent (localStorage) |
| Mobile Responsive | Sidebar auto-closes on navigation |
| Toast Notifications | Success/error feedback on 16 CRUD pages |
| Error Boundaries | React ErrorBoundary + 403/404/500 pages |
| Form Validation | Zod schemas for 7 entity types |
| Environment Validation | Client + server env validation with SSR-safe fallbacks |
| Monitoring | Sentry + OpenTelemetry stubs (activate with DSN) |
| Audit Trail | Structured logger + audit service (DB + fallback) |
| Translation Dictionary | 161-line i18n system with `tr()` helper |
| **66 Unit Tests** | RBAC, schemas, services, export, logger, analytics |
| **10 E2E Tests** | Auth flow, navigation, diagnostic workflow |
| **Security Hardened** | RLS, RBAC, no secrets in code, no console.log |
| **Performance Optimized** | 257 chunks, vendor splitting, React Query caching, Realtime push |

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, TailwindCSS 4 |
| **Routing** | TanStack Router (file-based, 93 routes) |
| **State** | TanStack React Query (70+ hooks, 16 hook files) |
| **UI Components** | shadcn/ui + 72 custom components |
| **Backend** | Supabase (Auth, Database, Realtime, Storage) |
| **Database** | PostgreSQL (36 tables, 54 FKs, 30 indexes) |
| **ORM** | Drizzle ORM (schema definitions) |
| **Build** | Vite 7 + TanStack Start (SSR) |
| **Validation** | Zod (env + form schemas) |
| **Testing** | Vitest (unit) + Playwright (E2E) |
| **Monitoring** | Sentry + OpenTelemetry (stubs) |
| **Export** | CSV, JSON, PDF (browser-native) |
| **i18n** | Custom provider (EN/AR + RTL) |

---

## Metrics Summary

```
Pages:              93 route files (86 live data, 3 redirects)
Supabase Services:  18
React Query Hooks:  70+ across 16 files
Database Tables:    36 (28 queried directly)
Unit Tests:         66 (12 test files)
E2E Tests:          10 (3 spec files)
Lines of Code:      32,714
Build Time:         ~12 seconds (client + SSR)
```
