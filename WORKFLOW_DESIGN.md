# WPOS Workflow Engine — Design & Architecture

## Overview

WPOS's core value proposition is the **Diagnostic Performance Workflow** — a systematic process to identify, diagnose, and resolve workforce performance issues. This document defines the complete workflow architecture.

---

## 1. Master Workflow: Performance Diagnostic Lifecycle

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  📊 DETECT   │───▶│  🔬 DIAGNOSE │───▶│  📋 PLAN     │───▶│  🎯 EXECUTE  │
│              │    │              │    │              │    │              │
│ KPI Snapshot │    │ Evidence     │    │ Case Created │    │ Intervention │
│ Gap Found    │    │ Collection   │    │ Action Plan  │    │ Running      │
│              │    │ Hypotheses   │    │ Approved     │    │              │
└──────────────┘    └──────┬───────┘    └──────────────┘    └──────┬───────┘
                          │                                        │
                    ┌──────▼───────┐                         ┌──────▼───────┐
                    │  👔 REVIEW   │                         │  📈 MONITOR  │
                    │              │                         │              │
                    │ Manager      │                         │ Follow-up    │
                    │ Approval     │                         │ KPI Re-check │
                    │              │                         │ Closure      │
                    └──────────────┘                         └──────────────┘
```

---

## 2. Workflow States (State Machine)

### 2.1 Diagnostic Report States
```
draft ──▶ evidence_collection ──▶ hypothesis_generation ──▶ under_review
                                                               │
                              ┌─────────────────────────────────┤
                              │                                 │
                              ▼                                 ▼
                         rejected ──▶ draft              approved ──▶ final
                    (back to analyst)                   (creates Case)
```

### 2.2 Case States
```
draft ──▶ open ──▶ under_investigation ──▶ action_planned ──▶ intervention_running
                                                                     │
                                                               ┌─────┤
                                                               │     │
                                                               ▼     ▼
                                                         monitoring  cancelled
                                                               │
                                                               ▼
                                                    ┌──────────┴──────────┐
                                                    │                     │
                                                    ▼                     ▼
                                               resolved              escalated
                                                    │               (re-open)
                                                    ▼
                                                 closed
```

### 2.3 Intervention States
```
planned ──▶ scheduled ──▶ in_progress ──▶ completed ──▶ evaluated
                │                              │
                ▼                              ▼
           cancelled                      failed ──▶ rescheduled
```

---

## 3. Detailed Workflow Steps

### Step 1: DETECT — Performance Gap Identification

**Trigger:** KPI snapshot shows actual < target (gap detected)

**Actors:** System (automated), Supervisor, Analyst

**Process:**
1. System runs scheduled KPI data collection
2. Compare actual vs. target for each employee/KPI combination
3. Calculate gap percentage and severity
4. Auto-flag employees with RED/YELLOW status
5. Notify supervisor of flagged employees
6. Supervisor can also manually flag performance concerns

**Data Flow:**
```
KPI Measurement → Performance Snapshot → Gap Calculation → Alert
```

**Outputs:**
- Performance Snapshot record (status: green/yellow/red)
- Notification to supervisor (if gap > threshold)
- Dashboard updated with gap data

---

### Step 2: EVIDENCE — Evidence Collection

**Trigger:** Supervisor/Analyst initiates investigation for flagged employee

**Actors:** Analyst, Supervisor, System

**Process:**
1. Analyst opens new diagnostic investigation
2. Collect evidence from multiple sources:
   - **Quantitative:** KPI data, attendance, output metrics
   - **Qualitative:** Manager observations, peer feedback
   - **Behavioral:** System logs, activity tracking
   - **Contextual:** Team changes, tool changes, policy changes
   - **Temporal:** 30/60/90 day trends
3. Each evidence item gets:
   - Reliability score (0-100)
   - Source verification
   - Date of observation
4. Evidence is tagged to the employee and investigation

**Data Flow:**
```
Multiple Sources → Evidence Records → Reliability Scoring → Evidence Summary
```

**Outputs:**
- Evidence records (typed, scored, verified)
- Evidence strength index (aggregate reliability)
- Evidence dashboard updated

---

### Step 3: DIAGNOSE — Hypothesis Generation

**Trigger:** Sufficient evidence collected (minimum threshold met)

**Actors:** System, Analyst

**Process:**
1. System analyzes collected evidence
2. Generates ranked hypotheses across 10 categories:
   - Skill Gap, Knowledge Gap, Process Issue, Tool Issue
   - Environmental, Resource, Management, Motivation
   - Workload, Policy
3. Each hypothesis includes:
   - Confidence score (0-100)
   - Supporting evidence (linked)
   - Contradicting evidence (linked)
   - Validation actions (recommended next steps)
4. Hypotheses ranked by confidence
5. Contradiction detection between evidence items
6. Analyst reviews and can modify/add hypotheses

**Data Flow:**
```
Evidence → Analysis Engine → Hypotheses → Ranking → Contradiction Check
```

**Outputs:**
- Diagnostic Report (draft status)
- Ranked hypotheses with confidence scores
- Contradiction report
- Maturity level assessment (1-5)

---

### Step 4: REVIEW — Manager Review & Approval

**Trigger:** Analyst submits diagnostic for review

**Actors:** Manager, Department Head

**Process:**
1. Manager receives notification of pending review
2. Manager reviews:
   - Evidence quality and completeness
   - Hypothesis reasonableness
   - Contradiction resolution
   - Recommended actions
3. Manager decision per hypothesis:
   - **Accept:** Agree with finding
   - **Reject:** Disagree (must provide reason)
   - **Modify:** Adjust hypothesis/confidence
4. Manager can add additional context
5. Overall decision:
   - **Approve:** Move to case creation
   - **Return:** Send back for more evidence/revision
   - **Escalate:** Escalate to department head

**Data Flow:**
```
Diagnostic Report → Manager Queue → Review → Decision → Status Update
```

**Approval Rules:**
- Single approver for standard cases
- Dual approval for critical/high-risk cases
- Department head approval for cross-department issues
- Auto-escalation after 5 business days without action

**Outputs:**
- Manager review record
- Approval/rejection with comments
- Updated diagnostic status
- Case creation (if approved)

---

### Step 5: PLAN — Case Creation & Action Planning

**Trigger:** Diagnostic report approved

**Actors:** Case Manager, HR, Supervisor

**Process:**
1. System auto-creates Case from approved diagnostic
2. Case populated with:
   - Employee and department info
   - Root cause category (from top hypothesis)
   - Priority level (from diagnostic maturity + confidence)
   - Related KPIs and processes
3. Case Manager assigns interventions:
   - Select from intervention library
   - Or create custom intervention
   - Set cost, duration, owner, due dates
4. Create action plan:
   - Break intervention into actionable steps
   - Assign owners per step
   - Set milestones and deadlines
5. Action plan requires approval from supervisor

**Data Flow:**
```
Approved Diagnostic → Case → Intervention Selection → Action Plan → Approval
```

**Outputs:**
- Case record (status: open)
- Linked intervention records
- Action plan with steps
- Timeline and milestones
- Notifications to all involved parties

---

### Step 6: EXECUTE — Intervention Execution

**Trigger:** Action plan approved

**Actors:** Intervention Owner, Employee, Supervisor

**Process:**
1. Intervention starts per schedule
2. Types of interventions:
   - **Training:** Enroll employee, track completion
   - **Coaching:** Schedule sessions, record notes
   - **Mentoring:** Pair with mentor, track meetings
   - **Process Redesign:** Modify process, retrain
   - **Tool Upgrade:** Deploy tools, train
   - **Other:** Custom actions
3. Track execution progress:
   - Step completion percentage
   - Time spent vs. planned
   - Cost tracking
   - Blockers and issues
4. Regular check-ins between employee and supervisor

**Data Flow:**
```
Action Plan → Scheduled Activities → Progress Tracking → Status Updates
```

**Outputs:**
- Intervention execution logs
- Progress updates (percentage, milestones)
- Cost tracking
- Issue/blocker reports

---

### Step 7: MONITOR — Follow-Up & Outcome Measurement

**Trigger:** Intervention completed (or at scheduled follow-up dates)

**Actors:** Supervisor, Analyst, System

**Process:**
1. Schedule follow-up measurements at 30/60/90 days
2. At each checkpoint:
   - Re-measure the original KPIs
   - Compare before/after values
   - Calculate improvement percentage
3. Follow-up assessment:
   - **Improvement:** KPI trending up → continue monitoring
   - **No Change:** KPI flat → evaluate intervention, consider alternatives
   - **Decline:** KPI worse → escalate, re-diagnose
4. If improved sufficiently:
   - Mark case as resolved
   - Record effectiveness metrics
   - Update intervention library with success data
5. If not improved:
   - Re-open investigation
   - Consider alternative root causes
   - New intervention cycle

**Data Flow:**
```
Follow-up Schedule → KPI Re-measurement → Comparison → Decision → Close/Re-open
```

**Closure Rules:**
- Minimum 2 follow-up check-ins before closure
- KPI must be in GREEN for 30 consecutive days
- Manager sign-off required for closure
- Auto-reopen if KPI drops within 90 days of closure

**Outputs:**
- Follow-up records with before/after metrics
- Improvement percentage
- Intervention effectiveness score
- Case closure (or re-escalation)
- Updated intervention library with outcome data

---

## 4. Workflow Permissions Matrix

| Action | Analyst | Supervisor | Manager | HR Director | Admin |
|--------|---------|------------|---------|-------------|-------|
| Create Diagnostic | ✅ | ✅ | ✅ | ✅ | ✅ |
| Collect Evidence | ✅ | ✅ | ❌ | ❌ | ✅ |
| Generate Hypotheses | ✅ | ❌ | ❌ | ❌ | ✅ |
| Submit for Review | ✅ | ✅ | ❌ | ❌ | ✅ |
| Approve Diagnostic | ❌ | ❌ | ✅ | ✅ | ✅ |
| Create Case | ❌ | ✅ | ✅ | ✅ | ✅ |
| Assign Intervention | ❌ | ✅ | ✅ | ✅ | ✅ |
| Execute Intervention | ✅ | ✅ | ❌ | ❌ | ✅ |
| Record Follow-up | ✅ | ✅ | ❌ | ❌ | ✅ |
| Close Case | ❌ | ❌ | ✅ | ✅ | ✅ |
| View All | ❌ | Team Only | Dept Only | All | All |

---

## 5. Notification Triggers

| Event | Recipients | Channel |
|-------|-----------|---------|
| KPI gap detected (RED) | Supervisor, Analyst | In-app, Email |
| Evidence threshold met | Analyst | In-app |
| Diagnostic submitted for review | Manager | In-app, Email |
| Diagnostic approved | Analyst, Supervisor | In-app |
| Diagnostic rejected | Analyst | In-app, Email |
| Case created | Case Manager, HR | In-app, Email |
| Action plan due in 3 days | Intervention Owner | In-app, Email |
| Action plan overdue | Intervention Owner, Supervisor | In-app, Email |
| Follow-up check-in due | Supervisor, Analyst | In-app |
| Case resolved | All involved parties | In-app |
| KPI re-drop after closure | Supervisor, Manager | In-app, Email |
| Approval pending > 3 days | Approver, Admin | In-app, Email |

---

## 6. Technical Implementation Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                           │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │ Diagnostic   │  │ Case         │  │ Intervention           │  │
│  │ Wizard       │  │ Manager      │  │ Tracker                │  │
│  │ (multi-step) │  │ (kanban)     │  │ (progress)             │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬───────────────┘  │
│         │                 │                    │                  │
│  ┌──────▼─────────────────▼────────────────────▼───────────────┐  │
│  │              React Query Mutations/Queries                   │  │
│  └──────┬──────────────────────────────────────────────────────┘  │
│         │                                                        │
├─────────┼────────────────────────────────────────────────────────┤
│         │            SERVER FUNCTIONS                             │
│  ┌──────▼──────────────────────────────────────────────────────┐  │
│  │  createServerFn('createDiagnostic')                          │  │
│  │  createServerFn('submitForReview')                            │  │
│  │  createServerFn('approveDiagnostic')                          │  │
│  │  createServerFn('createCase')                                 │  │
│  │  createServerFn('assignIntervention')                         │  │
│  │  createServerFn('recordFollowUp')                             │  │
│  │  createServerFn('closeCase')                                  │  │
│  └──────┬──────────────────────────────────────────────────────┘  │
│         │                                                        │
│  ┌──────▼──────────────────────────────────────────────────────┐  │
│  │  Workflow Engine (state machine)                              │  │
│  │  - Validates state transitions                                │  │
│  │  - Enforces permissions                                       │  │
│  │  - Triggers side effects (notifications, audit)               │  │
│  │  - Enforces business rules                                    │  │
│  └──────┬──────────────────────────────────────────────────────┘  │
│         │                                                        │
├─────────┼────────────────────────────────────────────────────────┤
│         │            DATABASE (Supabase/Neon)                     │
│  ┌──────▼──────────────────────────────────────────────────────┐  │
│  │  diagnostic_reports  │  cases  │  interventions              │  │
│  │  evidence            │  action_plans  │  follow_ups          │  │
│  │  hypotheses          │  root_causes   │  audit_logs          │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Supabase Realtime (live dashboard updates)                  │  │
│  │  Supabase Storage (evidence files, documents)                │  │
│  │  Supabase Auth (login, sessions, MFA)                        │  │
│  └─────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. Implementation Priority

### Sprint 1 (Week 1): Auth + Organization CRUD
- Login/Signup pages
- Auth enforcement on routes
- Organization CRUD (companies → branches → departments → teams → employees)
- First real data flowing through the app

### Sprint 2 (Week 2): KPI + Snapshot Pipeline
- KPI CRUD (categories, library)
- Performance snapshot creation
- Gap calculation engine
- Dashboard wired to real data

### Sprint 3 (Week 3): Evidence + Diagnostic Workflow
- Evidence submission form (with file upload)
- Diagnostic creation wizard (multi-step)
- Hypothesis generation logic
- Submit-for-review flow

### Sprint 4 (Week 4): Review + Case Flow
- Manager review/approval UI
- Case auto-creation from approved diagnostic
- Intervention selection from library
- Action plan builder

### Sprint 5 (Week 5): Execution + Follow-up
- Intervention tracking
- Follow-up scheduling
- Before/after KPI comparison
- Case closure flow

### Sprint 6 (Week 6): Polish + Deploy
- Real-time dashboard subscriptions
- Email notifications
- PDF/CSV export
- Full RBAC enforcement
- E2E tests
