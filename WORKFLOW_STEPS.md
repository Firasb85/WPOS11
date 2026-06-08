# WPOS — Complete Workflow Step-by-Step Guide

## How the System Works End-to-End

```
┌─────────┐   ┌──────────┐   ┌───────────┐   ┌─────────┐   ┌──────────┐
│  SETUP  │──▶│ MEASURE  │──▶│ DIAGNOSE  │──▶│  CASE   │──▶│ RESOLVE  │
│         │   │          │   │           │   │         │   │          │
│ Org     │   │ KPIs     │   │ Evidence  │   │ Auto-   │   │ Intervene│
│ Jobs    │   │ Snapshot │   │ Hypotheses│   │ created │   │ Follow-up│
│ People  │   │ Gap calc │   │ Review    │   │ Planned │   │ Close    │
└─────────┘   └──────────┘   └───────────┘   └─────────┘   └──────────┘
```

---

## PHASE 1: SYSTEM SETUP

### Step 1.1 — Create Account & Login
```
Page: /login
```
1. Open the application URL
2. Click **"Create one"** to switch to signup mode
3. Enter your **email** and **password** (min 6 characters)
4. Click **"Create Account"**
5. If email confirmation is enabled:
   - Check your email → click confirmation link
   - Return to login → enter credentials → click **"Sign In"**
6. If auto-confirmed: you're redirected to the CEO Dashboard

---

### Step 1.2 — Set Up Organization Structure
```
Path: Organization → Companies → Branches → Departments → Teams
```

**Step 1.2.1 — Add Company**
```
Page: /organization/companies
```
1. Click **"Add Company"** button (top right)
2. Fill in the form:
   - **Name** (required): e.g., "Acme Corporation"
   - **Legal Name**: e.g., "Acme Corp Ltd"
   - **City**: e.g., "Riyadh"
   - **Country**: e.g., "Saudi Arabia"
   - **Email**: e.g., "info@acme.com"
   - **Phone**: e.g., "+966-11-1234567"
3. Click **"Create"**
4. Company appears in the data table below

**Step 1.2.2 — Add Branch**
```
Page: /organization/branches
```
1. Click **"Add Branch"**
2. Select the **Company** from the dropdown (created in 1.2.1)
3. Fill in **Name** (e.g., "Riyadh HQ"), **Code**, **City**
4. Click **"Create"**

**Step 1.2.3 — Add Department**
```
Page: /organization/departments
```
1. Click **"Add Department"**
2. Select the **Branch** from the dropdown
3. Fill in **Name** (e.g., "Operations"), **Code**, **Description**
4. Click **"Create"**

**Step 1.2.4 — Add Team**
```
Page: /organization/teams
```
1. Click **"Add Team"**
2. Select the **Department** from the dropdown
3. Fill in **Name** (e.g., "Alpha Team"), **Code**
4. Click **"Create"**

---

### Step 1.3 — Add Employees
```
Page: /organization/employees
```
1. Click **"Add Employee"**
2. Fill in the form:
   - **First Name** (required): e.g., "Ahmad"
   - **Last Name** (required): e.g., "Khalid"
   - **Employee Code**: e.g., "EMP-001"
   - **Email**: e.g., "ahmad@acme.com"
   - **Phone**: e.g., "+966-50-1234567"
   - **Team**: select from dropdown
3. Click **"Create"**
4. Repeat for all employees
5. Use the **search bar** to find employees by name, email, or code
6. Use **pagination** at the bottom for large lists

---

### Step 1.4 — Set Up Job Architecture
```
Pages: /jobs/families → /jobs/grades → /jobs/list
```

**Step 1.4.1 — Add Job Families**
```
Page: /jobs/families
```
1. Click **"Add Family"**
2. Enter **Name** (e.g., "Engineering"), **Code** (e.g., "ENG"), **Description**
3. Click **"Create"**

**Step 1.4.2 — Add Job Grades**
```
Page: /jobs/grades
```
1. Click **"Add Grade"**
2. Enter **Name** (e.g., "Senior"), **Code** (e.g., "G5"), **Level** (1-10), **Description**
3. Click **"Create"**

---

### Step 1.5 — Define Competencies
```
Page: /competency
```
1. Click **"Add Competency"**
2. Fill in:
   - **Code**: e.g., "COMP-001"
   - **Name (EN)**: e.g., "Data Analysis"
   - **Name (AR)**: e.g., "تحليل البيانات"
   - **Category**: Skill / Knowledge / Behavior / Attitude
   - **Description**: what this competency entails
3. Click **"Create"**

---

## PHASE 2: KPI MEASUREMENT

### Step 2.1 — Define KPI Categories
```
Page: /kpis/categories
```
1. Click **"Add Category"**
2. Enter **Name** (e.g., "Sales Performance"), **Code** (e.g., "SALES"), **Description**
3. Click **"Create"**

---

### Step 2.2 — Create KPIs
```
Page: /kpis/library
```
1. Click **"Add KPI"**
2. Fill in the form:
   - **Name** (required): e.g., "Customer Satisfaction Score"
   - **Code** (required): e.g., "KPI-CSAT-001"
   - **Category**: select from dropdown (created in 2.1)
   - **Target Value**: e.g., "95"
   - **Unit**: e.g., "%"
   - **Frequency**: Daily / Weekly / Monthly / Quarterly / Annually
3. Click **"Create"**
4. The KPI appears in the library table

---

### Step 2.3 — Record Performance Snapshot (Gap Detection)
```
Page: /snapshots/new
```

**This is where performance gaps are detected:**

1. Click **"Record Snapshot"** from the snapshots page or navigate to `/snapshots/new`
2. Fill in the form:
   - **Employee**: select from dropdown (e.g., "Ahmad Khalid")
   - **KPI**: select from dropdown (e.g., "Customer Satisfaction Score")
   - **Period**: select month (e.g., "2026-06")
   - **Target Value**: e.g., "95"
   - **Actual Value**: e.g., "78"
3. **Watch the live Gap Calculator** on the right:
   ```
   Target:  95
   Actual:  78
   Gap:     -17
   Gap %:   -17.9%
   Status:  🔴 RED
   ```
4. Click **"Save Snapshot"**
5. The system automatically:
   - Calculates gap value and percentage
   - Assigns status: GREEN (≥0%), YELLOW (0 to -10%), RED (<-10%)
   - Stores in the performance_snapshots table

6. View all snapshots at `/snapshots` — showing employee, KPI, gap, and status

---

## PHASE 3: DIAGNOSTIC INVESTIGATION

### Step 3.1 — Create Diagnostic Report
```
Page: /diagnostics/new
```

**3-Step Wizard:**

**STEP 1 — Report Details:**
1. Navigate to `/diagnostics/new`
2. See the **3-step progress bar** at the top
3. Fill in:
   - **Title** (required, min 5 chars): e.g., "Ahmad Khalid — Sales Performance Gap"
   - **Employee**: select from dropdown → "Ahmad Khalid"
   - **Department**: select from dropdown → "Operations"
   - **Performance Summary**: describe the observed issue
     e.g., "Customer satisfaction has dropped from 95% to 78% over the past quarter. Multiple customer complaints received about response times."
4. Click **"Next: Collect Evidence"**

**STEP 2 — Collect Evidence:**
5. On the left panel, add evidence items:
   - **Evidence Type**: select one:
     - Quantitative (numbers, metrics)
     - Qualitative (observations, feedback)
     - Behavioral (patterns, actions)
     - System Generated (from tools/systems)
     - Contextual (environment, changes)
     - Temporal (time-based trends)
   - **Source**: where the evidence comes from
     e.g., "CRM System", "Manager Observation", "Customer Survey"
   - **Description**: detailed evidence
     e.g., "Customer response time increased from 2h to 6h average. Training records show no advanced CRM training completed in past 12 months."
   - **Reliability**: High / Medium / Low
6. Click **"Add Evidence"**
7. See the evidence appear on the right panel with type badges
8. **Add at least 2 evidence items** for meaningful analysis
9. Click **"Next: Generate Hypotheses"**

**STEP 3 — Generate Hypotheses:**
10. See the summary: "The system will analyze X evidence items..."
11. Click **"Generate Hypotheses"**
12. The system:
    - Scans all evidence descriptions for keywords
    - Checks performance snapshots for gap severity
    - Scores 10 root cause categories:
      - Skill Gap, Knowledge Gap, Process Issue, Tool Issue
      - Environmental, Resource, Management, Motivation
      - Workload, Policy
    - Ranks the top 5 by confidence score
    - Calculates maturity level (1-3 based on evidence count)
13. You're redirected to the **diagnostics list** page

---

### Step 3.2 — View Diagnostic Report
```
Page: /diagnostics/report/{id}
```
1. From the diagnostics list, click the **eye icon** on a report
2. See the **Status Bar** showing:
   - Current status (Draft / Under Review / Approved)
   - Maturity level badge
   - Confidence score percentage
   - Employee and department
3. See **Performance Summary** section
4. See **Diagnostic Hypotheses** ranked by confidence:
   ```
   1. Skill Gap — 78% confidence
      "Employee may lack specific technical skills..."
      Supporting Evidence: "No CRM training", "Low QA scores"

   2. Process Issue — 65% confidence
      "Existing business processes may be inefficient..."

   3. Knowledge Gap — 52% confidence
      "Insufficient domain knowledge..."
   ```

---

### Step 3.3 — Submit for Manager Review
```
Page: /diagnostics/report/{id}
```
1. On the report detail page, click **"Submit for Review"**
2. Status changes from "Draft" → **"Under Review"**
3. Manager receives notification (when notification system is active)

---

### Step 3.4 — Manager Reviews & Decides
```
Page: /diagnostics/report/{id}
```

**Option A — Approve:**
1. Manager opens the report
2. Reviews hypotheses, evidence, and confidence scores
3. Clicks **"Approve"** (green button)
4. Status changes to **"Approved"**
5. A **"Create Case"** button appears

**Option B — Reject:**
1. Manager clicks **"Reject"** (red button)
2. A text field appears: "Explain why this report is being rejected..."
3. Manager types reason, e.g., "Need more behavioral evidence before concluding skill gap."
4. Clicks **"Confirm Reject"**
5. Status returns to **"Draft"**
6. The rejection reason is displayed on the report
7. Analyst can revise and resubmit

---

## PHASE 4: CASE MANAGEMENT

### Step 4.1 — Create Case from Approved Diagnostic
```
Page: /diagnostics/report/{id} → auto-redirect to /cases
```
1. On the **approved** diagnostic report, click **"Create Case"**
2. The system **automatically**:
   - Creates a new case with generated number (e.g., CAS-2026-0001)
   - Links to the diagnostic report
   - Copies employee and department info
   - Sets **root cause** from the top-ranked hypothesis
   - Sets **priority** based on confidence score:
     - ≥80% confidence → **Critical**
     - ≥60% confidence → **High**
     - ≥30% confidence → **Medium**
     - <30% confidence → **Low**
   - Auto-generates description
   - Marks the diagnostic report as **"Final"**
3. You're redirected to the **Cases list** page

---

### Step 4.2 — Manage Case Lifecycle
```
Page: /cases
```
1. See all cases in the data table with:
   - Case number, employee, department
   - Root cause category (from diagnosis)
   - Priority badge (Critical/High/Medium/Low)
   - Status badge
2. **Status transitions** available via buttons:
   - **Open** → click **"Investigate"** → status becomes "Under Investigation"
   - **Monitoring** → click **"Resolve"** → status becomes "Resolved" (closure date set)

---

### Step 4.3 — Set Up Interventions
```
Page: /interventions
```
1. Click **"Add Intervention"**
2. Fill in:
   - **Name (EN)**: e.g., "Advanced CRM Training"
   - **Name (AR)**: e.g., "تدريب CRM متقدم"
   - **Type**: Training / Coaching / Mentoring / Process Redesign / Tool Upgrade / Other
   - **Description**: what this intervention involves
3. Click **"Create"**
4. Interventions are now available for assignment to cases

---

## PHASE 5: MONITORING & DASHBOARDS

### Step 5.1 — CEO Dashboard (Real-time)
```
Page: /dashboard/ceo
```
**What you see (all LIVE from Supabase):**
- **Total Employees**: count from employees table
- **Departments**: count from departments table
- **Performance Index**: calculated from snapshot statuses
  - Formula: (green + yellow×0.5) / total × 100
- **Critical KPIs**: count of RED snapshots
- **KPI Status Overview**: green/yellow/red distribution
- **Diagnostics Overview**: total, draft, under review, approved, avg maturity
- **System Summary**: evidence count, active KPIs, total snapshots

**Real-time updates**: Dashboard auto-refreshes when ANY data changes in:
employees, performance_snapshots, diagnostic_reports, evidence, cases

---

### Step 5.2 — Department Dashboard
```
Page: /dashboard/department
```
- Performance breakdown per department
- Employee count per department
- KPI status (green/yellow/red) per department
- Performance progress bars

---

### Step 5.3 — Supervisor Dashboard
```
Page: /dashboard/supervisor
```
- Team member list with KPI health indicators
- Snapshot count per employee
- Issues flagged (RED status employees)

---

### Step 5.4 — Export Data
```
Page: /reports/export
```
1. See available exports with **live record counts**
2. For each dataset (Employees, Companies, KPIs, Diagnostics, Dashboard):
   - Click **"CSV"** to download as spreadsheet
   - Click **"JSON"** to download as data file
3. Files are auto-named with date: `employees_2026-06-08.csv`

---

## COMPLETE WORKFLOW — QUICK REFERENCE

```
1. LOGIN        → /login
2. ADD COMPANY  → /organization/companies → "Add Company"
3. ADD BRANCH   → /organization/branches → "Add Branch" → select company
4. ADD DEPT     → /organization/departments → "Add Department" → select branch
5. ADD TEAM     → /organization/teams → "Add Team" → select department
6. ADD EMPLOYEE → /organization/employees → "Add Employee" → select team
7. ADD KPI CAT  → /kpis/categories → "Add Category"
8. ADD KPI      → /kpis/library → "Add KPI" → select category, set target
9. MEASURE      → /snapshots/new → select employee + KPI → enter actual → SAVE
                   (gap auto-calculated, status auto-assigned)
10. IF GAP RED  → /diagnostics/new →
                   Step 1: title, employee, summary
                   Step 2: add evidence items (≥2)
                   Step 3: generate hypotheses → top 5 ranked
11. SUBMIT      → /diagnostics/report/{id} → "Submit for Review"
12. APPROVE     → Manager clicks "Approve" (or "Reject" with reason)
13. CREATE CASE → Click "Create Case" → auto-generates with priority
14. TRACK       → /cases → "Investigate" → "Resolve"
15. ADD INTERV  → /interventions → "Add Intervention"
16. MONITOR     → /dashboard/ceo → real-time overview
17. EXPORT      → /reports/export → CSV or JSON
```

---

## NAVIGATION MAP

| Sidebar Section | Pages | What You Do There |
|----------------|-------|-------------------|
| **Dashboards** | CEO, Department, Supervisor | Monitor performance (live data) |
| **Organization** | Companies, Branches, Departments, Teams, Employees, Hierarchy | Set up org structure + add people |
| **Job Architecture** | Families, Grades, Jobs | Define job categories and levels |
| **Competency** | Library, Framework, Gaps | Define competency models |
| **KPIs** | Categories, Library, Tree, Dependency | Define performance indicators |
| **Snapshots** | List, New | Record KPI measurements (gap detection) |
| **Evidence** | Library, Submit, Dashboard | Collect performance evidence |
| **Diagnostics** | List, New, Dashboard, Root Cause, Report | Run diagnostic investigations |
| **Cases** | List, Dashboard, Root Causes | Track performance cases |
| **Interventions** | Library, Effectiveness | Define and track interventions |
| **Analytics** | Root Cause, Competency Trends, Evidence Quality | Analyze patterns |
| **Reports** | Overview, Enterprise, Export | Generate and download reports |
| **Admin** | Users, Roles, Audit, Settings, Security | System administration |
