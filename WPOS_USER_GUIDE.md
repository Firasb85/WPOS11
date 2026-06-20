# WPOS — User Accounts, Roles & Demo Workflow Guide

## 📋 All Test Accounts (Password: `Password123!`)

| # | Email | Role | Name | Simulates |
|---|-------|------|------|-----------|
| 1 | `admin@wpos.com` | **ADMIN** | Ahmad Ali | System Administrator — IT/HR admin who configures the platform |
| 2 | `ceo@wpos.com` | **CEO** | Khalid Al-Saud | Chief Executive — Reads all data, reviews strategic insights |
| 3 | `manager@wpos.com` | **MANAGER** | Nora Al-Faisal | Department Manager — Runs diagnostics, manages cases for her team |
| 4 | `supervisor@wpos.com` | **MANAGER** | Omar Hassan | Team Supervisor — Front-line leader, submits evidence, follows up |
| 5 | `analyst@wpos.com` | **USER** | Layla Ibrahim | HR Analyst — Views KPIs and evidence, limited write access |
| 6 | `user@wpos.com` | **USER** | Fahad Al-Otaibi | Regular Employee — Self-service view of own KPIs |

---

## 🔐 Role Permission Matrix

### UI-Level Access (Pages)

| Module / Page | ADMIN | CEO | MANAGER | USER | Why |
|--------------|:-----:|:---:|:-------:|:----:|-----|
| **CEO Dashboard** | ✅ | ✅ | ✅ | ✅ | Overview for everyone; data depth varies by role |
| **Supervisor Dashboard** | ✅ | ✅ | ✅ | ❌ | Only team leaders and above see team-level metrics |
| **Department Dashboard** | ✅ | ✅ | ✅ | ❌ | Department-level aggregation for managers+ |
| **Executive Dashboard** | ✅ | ✅ | ❌ | ❌ | Strategic view — C-suite only |
| **Organization** (Companies, Branches, Departments, Teams, Employees) | ✅ | ✅ | ✅ | ❌ | Managers need to see org structure; users see only own record |
| **KPIs** (Library, Categories, Tree, Dependencies) | ✅ | ✅ | ✅ | ✅ | Everyone can view KPI definitions |
| **Snapshots** (Performance Data) | ✅ | ✅ | ✅ | ❌ | Sensitive performance data — manager+ only |
| **New Snapshot** | ✅ | ❌ | ✅ | ❌ | Only admin/managers enter performance data |
| **Evidence** (View) | ✅ | ✅ | ✅ | ✅ | Users can view evidence about themselves |
| **New Evidence** | ✅ | ✅ | ✅ | ❌ | Submitting evidence is a management function |
| **Diagnostics** (Reports, Root Cause) | ✅ | ✅ | ✅ | ❌ | Core diagnostic workflow — manager+ |
| **New Diagnostic** | ✅ | ❌ | ✅ | ❌ | Only admin/managers initiate diagnostics |
| **Diagnostic Intelligence Dashboard** | ✅ | ✅ | ✅ | ❌ | AI-driven insights about performance gaps |
| **Cases** (View, Details, Root Causes) | ✅ | ✅ | ✅ | ❌ | Case management — manager+ |
| **Interventions** (View, Effectiveness) | ✅ | ✅ | ✅ | ❌ | Intervention tracking — manager+ |
| **Action Plans** | ✅ | ✅ | ✅ | ❌ | Remediation plans — manager+ |
| **Follow-ups** | ✅ | ✅ | ✅ | ❌ | Post-intervention check-ins — manager+ |
| **Analytics** (Root Cause, Competency Trends, Evidence Quality) | ✅ | ✅ | ✅ | ❌ | Advanced analytics — manager+ |
| **Reports** (Diagnostics, Enterprise, Export) | ✅ | ✅ | ✅ | ❌ | Report generation — manager+ |
| **Processes** (Library, Steps, Dependencies) | ✅ | ✅ | ✅ | ❌ | Process intelligence — manager+ |
| **Process Engineering / Mining** | ✅ | ✅ | ✅ | ❌ | Process optimization — manager+ |
| **Competency** (Framework, Gaps) | ✅ | ✅ | ✅ | ❌ | Competency management — manager+ |
| **Jobs** (List, Families, Grades, Profiles) | ✅ | ✅ | ✅ | ❌ | Job architecture — manager+ |
| **Risk** (Dashboard, Heatmaps) | ✅ | ✅ | ✅ | ❌ | Risk prediction — manager+ |
| **Benchmarks** | ✅ | ✅ | ✅ | ❌ | Peer comparison — manager+ |
| **Admin Panel** (Users) | ✅ | ✅ | ❌ | ❌ | User management — admin/CEO only |
| **Admin Panel** (Roles & Permissions) | ✅ | ✅ | ❌ | ❌ | RBAC configuration — admin/CEO only |
| **Admin Panel** (Audit Log) | ✅ | ✅ | ❌ | ❌ | Security audit trail — admin/CEO only |
| **Admin Panel** (Security) | ✅ | ✅ | ❌ | ❌ | MFA, sessions, rate limits — admin/CEO only |
| **Admin Panel** (Settings) | ✅ | ✅ | ❌ | ❌ | System configuration — admin/CEO only |
| **API Keys** | ✅ | ✅ | ❌ | ❌ | Integration management — admin/CEO only |
| **Insights Assistant** | ✅ | ✅ | ✅ | ❌ | Q&A over your data — manager+ |
| **Command Center** | ✅ | ✅ | ✅ | ❌ | Operational overview — manager+ |
| **Notifications** | ✅ | ✅ | ✅ | ✅ | Everyone gets notifications |

### Database-Level Access (RLS Policies)

| Data Table | ADMIN | CEO | MANAGER | USER |
|-----------|:-----:|:---:|:-------:|:----:|
| employees | Read/Write/Delete all | Read all | Read all, Write | Own record only |
| performance_snapshots | Full CRUD | Read all | Read/Write | ❌ No access |
| evidence | Full CRUD | Read all | Read/Write, Delete own | Read own |
| diagnostic_reports | Full CRUD | Read all | Read/Write own | ❌ No access |
| cases | Full CRUD | Read all | Read/Write own | ❌ No access |
| audit_logs | Read all | Read all | ❌ No access | ❌ No access |
| companies/branches/depts/teams | Full CRUD | Read/Write | Read/Write | Read only |
| kpis/kpi_categories | Full CRUD | Read/Write | Read/Write | Read only |
| job_grades (salary data) | Full CRUD | Read | Read | ❌ No access |
| interventions/action_plans/follow_ups | Full CRUD | Read/Write | Read/Write | Read only |

---

## 🎬 Demo Workflow — Step by Step

### The Story
> **Ahmad Khalid (EMP-001)** in Alpha Team has a **declining Customer Satisfaction Score** — dropped from 92% → 85% → 78% over 3 months. The system detects this as a RED alert with a downtrend. The organization needs to diagnose why, create a case, intervene, and follow up.

---

### 🔴 ACT 1 — Detection (Login as: `ceo@wpos.com`)
**Purpose:** Show how leadership sees problems surfacing automatically.

| Step | Navigate To | What You See | What It Proves |
|------|------------|-------------|----------------|
| 1 | `/dashboard/ceo` | CEO Dashboard with KPI summary cards | Real-time data aggregation across the org |
| 2 | Look at dashboard | RED/YELLOW/GREEN status indicators | Automatic RAG (Red-Amber-Green) classification |
| 3 | Look at "At Risk" panel | Ahmad Khalid flagged with ⚠️ At-Risk badge | **Proactive Risk Prediction** — system detects 3-period declining CSAT |
| 4 | Look at sparklines | Ahmad's line trending ↘ downward | **Sparkline Trend Detection** — visual 3-period decline |
| 5 | `/executive` | Executive strategic overview | C-level strategic insight aggregation |
| 6 | `/analytics` | Root cause analytics | Cross-organizational pattern detection |

**Key Talking Points:**
- "The CEO didn't have to ask — the system surfaced the problem automatically"
- "At-Risk badges use a breach-probability algorithm, not just simple thresholds"
- "This is predictive, not reactive — the system warns before targets are missed"

---

### 🟡 ACT 2 — Evidence Collection (Login as: `manager@wpos.com`)
**Purpose:** Show how a manager gathers multi-source evidence before diagnosing.

| Step | Navigate To | What You See | What It Proves |
|------|------------|-------------|----------------|
| 1 | `/dashboard/supervisor` | Supervisor Dashboard — team-level view | Role-based dashboard — different view than CEO |
| 2 | `/snapshots` | 10 performance snapshots with status colors | Time-series performance tracking |
| 3 | `/evidence` | 8 evidence items across multiple types | Multi-source evidence: quantitative, qualitative, behavioral, contextual |
| 4 | `/evidence/new` | Evidence submission form | Manager can submit new evidence (CRM data, observations, attendance) |
| 5 | `/evidence/dashboards` | Evidence quality analytics | Evidence reliability scoring |

**Key Talking Points:**
- "Evidence comes from 5 sources: CRM (quantitative), manager observation (qualitative), attendance system (behavioral), HR records (contextual), audit system (system-generated)"
- "Each evidence item has a reliability score — high/medium/low"
- "This builds the evidentiary foundation before any diagnosis happens"

---

### 🔵 ACT 3 — Diagnosis (Login as: `manager@wpos.com`)
**Purpose:** The core diagnostic workflow — the heart of WPOS.

| Step | Navigate To | What You See | What It Proves |
|------|------------|-------------|----------------|
| 1 | `/diagnostics/new` | **Guided Diagnostic Wizard** (4-step modal) | Structured methodology, not guesswork |
| 2 | Wizard Step 1 | Select employee (Ahmad) + KPI (CSAT) | Links diagnosis to specific performance gap |
| 3 | Wizard Step 2 | System pulls related evidence automatically | **Evidence Correlation** — AI finds relevant evidence |
| 4 | Wizard Step 3 | Root cause hypothesis generation | **5 Why / Fishbone** methodology built in |
| 5 | Wizard Step 4 | Confidence scoring + final diagnosis | Statistical confidence, not opinion |
| 6 | `/diagnostics/root-cause` | Root cause categorization | Systematic root cause taxonomy |
| 7 | `/dashboards/diagnostic-intelligence` | Diagnostic intelligence | Pattern recognition across all diagnostics |

**Key Talking Points:**
- "The wizard ensures no diagnostic shortcuts — every step is mandatory"
- "Root causes are categorized: Skill Gap, Process Failure, Tool Deficiency, Motivation, External Factor"
- "Confidence score tells you how reliable the diagnosis is"
- "The system correlates evidence impact — which evidence most strongly supports each hypothesis"

---

### 🟢 ACT 4 — Case & Intervention (Login as: `manager@wpos.com`)
**Purpose:** Show how diagnosis leads to structured action.

| Step | Navigate To | What You See | What It Proves |
|------|------------|-------------|----------------|
| 1 | `/cases` | Cases list with status (Open/In Progress/Closed) | Case management lifecycle |
| 2 | `/cases/root-causes` | Root cause distribution analysis | Which root causes are most common across the org |
| 3 | `/interventions` | 6 intervention types available | Structured intervention library |
| 4 | `/interventions/effectiveness` | Intervention effectiveness tracking | ROI measurement on interventions |
| 5 | `/action-plans` | Action plans linked to cases | Concrete steps with owners, dates, progress |
| 6 | `/follow-up` | Follow-up check-ins | Post-intervention monitoring |

**Key Talking Points:**
- "Every case traces back to a diagnostic report — full audit trail"
- "Interventions are reusable: training, coaching, mentoring, process redesign, tool upgrade"
- "Action plans have owners, deadlines, and progress tracking"
- "Follow-ups measure whether the intervention actually worked"

---

### 🔒 ACT 5 — Administration (Login as: `admin@wpos.com`)
**Purpose:** Show enterprise governance and security.

| Step | Navigate To | What You See | What It Proves |
|------|------------|-------------|----------------|
| 1 | `/admin` | Admin dashboard with system metrics | Full platform visibility |
| 2 | `/admin/users` | User management panel | User provisioning and role assignment |
| 3 | `/admin/roles` | Roles & Permissions configuration | Granular RBAC — 20 permission codes |
| 4 | `/admin/audit` | Audit log with 5 filters | Complete audit trail — who did what, when |
| 5 | `/admin/security` | MFA, session management, rate limiting | Enterprise security controls |
| 6 | `/admin/settings` | System configuration | Feature flags, data retention, GDPR |
| 7 | `/api-keys` | API key management | Integration/automation support |

**Key Talking Points:**
- "Full RBAC with 4 roles and 20 granular permissions"
- "Audit log captures every action — required for compliance (ISO, SOC2)"
- "MFA support, session security, rate limiting — enterprise-grade"
- "GDPR compliance built in — data export, deletion requests, consent management"

---

### 👁️ ACT 6 — Employee Self-Service (Login as: `user@wpos.com`)
**Purpose:** Show what a regular employee sees — limited but useful.

| Step | Navigate To | What You See | What It Proves |
|------|------------|-------------|----------------|
| 1 | `/dashboard/ceo` | Dashboard (limited data — can't see other employees) | Role-based data filtering at DB level |
| 2 | `/kpis` | KPI definitions (read-only) | Transparency — employees know what they're measured on |
| 3 | `/admin` | **403 Forbidden** page | PermissionGuard blocks unauthorized access |
| 4 | Try `/snapshots` | Empty — RLS blocks access | Database-level security, not just UI hiding |

**Key Talking Points:**
- "Security is enforced at 3 levels: UI (PermissionGuard), API (middleware), Database (RLS)"
- "Even if someone manipulates the URL, RLS returns zero rows"
- "Employees can see KPI definitions for transparency, but not other people's scores"

---

## 🏗️ WPOS Platform Architecture (for demo context)

```
┌─────────────────────────────────────────────────────────────────┐
│                     WPOS WORKFLOW ENGINE                         │
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │  DETECT   │───▶│ EVIDENCE │───▶│ DIAGNOSE │───▶│  REVIEW  │  │
│  │           │    │          │    │          │    │          │  │
│  │ KPI gaps  │    │ Collect  │    │ Guided   │    │ Manager  │  │
│  │ Sparkline │    │ 5 types  │    │ 4-step   │    │ approval │  │
│  │ At-Risk   │    │ Score    │    │ wizard   │    │          │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│       │                                                │        │
│       │          ┌──────────┐    ┌──────────┐          │        │
│       └─────────▶│   CASE   │───▶│INTERVENE │──────────┘        │
│                  │          │    │          │                    │
│                  │ Track    │    │ Training │    ┌──────────┐   │
│                  │ Assign   │    │ Coaching │───▶│FOLLOW-UP │   │
│                  │ Priority │    │ Redesign │    │          │   │
│                  └──────────┘    └──────────┘    │ Measure  │   │
│                                                  │ Compare  │   │
│                                                  │ Close     │   │
│                                                  └──────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Seed Data Summary (what's in the database)

| Entity | Count | Examples |
|--------|-------|---------|
| Companies | 3 | Acme Corporation, Gulf Enterprises, Nexus Industries |
| Branches | 3 | Riyadh HQ, Jeddah Branch, Gulf HQ |
| Departments | 5 | Operations, HR, IT, Finance, Sales |
| Teams | 5 | Alpha, Beta, HR Core, DevOps, Sales Team 1 |
| Employees | 8 | Ahmad Khalid (EMP-001) through Fatima Zahra (EMP-008) |
| KPI Categories | 4 | Sales, Customer Satisfaction, Ops Efficiency, Employee Dev |
| KPIs | 6 | Revenue, CSAT, On-Time Delivery, Efficiency, Error Rate, Training |
| Snapshots | 10 | 🟢 3 Green, 🟡 3 Yellow, 🔴 4 Red |
| Evidence | 8 | CRM data, manager observations, attendance, client feedback |
| Competencies | 5 | Data Analysis, Leadership, Communication, Problem Solving, Customer Focus |
| Processes | 4 | Onboarding, Invoice Processing, Support Ticket, Software Deployment |
| Interventions | 6 | CRM Training, Coaching, Mentoring, Process Redesign, Tool Upgrade, Time Mgmt |
| Job Families | 5 | Engineering, Operations, Sales, HR, Finance |
| Job Grades | 5 | Junior (G1) → Director (G5) with salary bands |

### Key Data Scenarios

| Employee | KPI | Status | Story |
|----------|-----|--------|-------|
| Ahmad Khalid (EMP-001) | CSAT | 🔴 RED (78%) | **3-month decline**: 92% → 85% → 78%. Triggers sparkline downtrend + At-Risk badge. **Best candidate for full demo workflow.** |
| Ahmad Khalid (EMP-001) | Production Efficiency | 🟡 YELLOW (88%) | Secondary issue — shows multi-KPI decline pattern |
| Layla Ibrahim (EMP-002) | Production Efficiency | 🔴 RED (72%) | Severe gap — 20% below target. Evidence: output dropped, quality defects up |
| Sara Mohammed (EMP-006) | Revenue Target | 🔴 RED (65K vs 100K) | Sales underperformance — pipeline dropped 40% |
| Omar Hassan (EMP-003) | On-Time Delivery | 🟡 YELLOW (91%) | Moderate gap — 7% below target |
| Omar Hassan (EMP-003) | Error Rate | 🔴 RED (5% vs 2%) | Error spike in Invoice Verification step |
| Nadia Karim (EMP-004) | CSAT | 🟢 GREEN (97%) | Strong performer — good benchmark comparison |
| Hussein Ali (EMP-005) | Production Efficiency | 🟢 GREEN (93%) | Strong performer |
