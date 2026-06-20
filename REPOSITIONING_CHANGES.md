# WPOS — Repositioning Changes (Pilot-first, no "AI" framing)

**Scope:** 8 coordinated changes. Mostly copy/framing + one new route + a schema
migration for Pilot tier + feature flag for Advanced modules. No functional
breakage.

**Strategy:** One pass per change. Each change tracked separately with a
files-touched list at the bottom of this document.

---

## Change 1 — Remove "AI" framing from UI/copy

Replacements (case-sensitive, applied per context):

| Current | Replacement |
|---|---|
| `AI-powered` | `structured` (when describing capabilities) / `explainable` (when describing scoring) |
| `AI diagnostic`, `AI Engine`, `AI-powered diagnostic` | `Diagnostic Engine` / `Diagnostic Reasoning` |
| `AI-generated hypothesis` | `system-generated hypothesis` / `scored hypothesis` |
| `AI Assistant` (module label) | `Insights Assistant` / `Q&A Assistant` |
| `WPOS AI` (header label) | `WPOS Insights` |
| `AI Capabilities` | `Insights Capabilities` |
| Anywhere a confidence score / hypothesis is shown | add a `"Why this score?"` or `"Show evidence"` affordance (also covered in Change 2) |

**Backend files that LOOK like AI but aren't** — flagging for the user:

1. **`src/lib/services/supabase/diagnostics.service.ts`** — the
   `generateHypotheses` function is **keyword-rule-based scoring** (counts
   occurrences of "skill", "training", "process", etc. in evidence text and
   adds a random 5–20 base). It is NOT an AI model. We are renaming the public
   label to "Diagnostic Reasoning" but the file is left functionally unchanged —
   this is intentional. A future change can swap in real scoring later.

2. **`src/lib/ai/insights-engine.ts`** — already a pure SQL query + rules
   pattern matcher (no LLM). File kept under `lib/ai/` to avoid scope creep —
   we are only updating user-visible copy.

3. **`src/lib/ai/ml-predictions.ts`** — actually statistical regression (linear
   regression + EMA + z-score). No LLM. Same — kept as-is, only UI copy
   changes.

4. **`src/lib/ai/openai-client.ts`** — the only real AI hookup (OpenAI gpt-4o-
   mini + local fallback). Renamed references in user-facing copy; the API
   itself is preserved so it can be flipped on later when orgs upgrade to a
   tier that warrants it.

These four items are the **deep-rework items** the user asked us to flag.

---

## Change 2 — Explainability UI in Diagnostic Engine (Step 3)

Wizard Step 3 (`GuidedDiagnosticWizard.tsx`) currently shows category buttons.
Add an **expandable panel** below the grid:

> **View scoring breakdown** ▾

When expanded, shows a table per selected category:

| Evidence item | Theme match | Points contributed |
|---|---|---|
| `Missed 3 training sessions last month` | `skill` / `training` | +15 |
| `New POS rollout without documented SOP` | `process` | +15 |

Points are computed transparently from the same logic in `diagnostics.service.ts`
(`categoryScores`). When the wizard moves to Step 4, the breakdown is also
attached to the request so the report page can re-render it.

---

## Change 3 — Manager-approval emphasis on Step 4

Step 4 review screen currently shows a flat summary panel. We are:

- Adding a **prominent** "Manager Approval" callout card (border, icon, copy).
- Adding the safety framing copy: *"Final diagnosis requires human approval
  before becoming a case. No case, intervention, or HR record is created until
  a manager signs off."*

---

## Change 4 — Core vs Advanced module grouping

Each nav item gets a new optional `section?: "core" | "advanced"` field. We
add a `section` to every existing item, plus a feature flag
`ENABLE_ADVANCED_MODULES` (default `false` — so demos / pilots start in
Core-only mode).

**Core section** (always visible):

- Dashboards
- KPI Management (KPIs)
- Performance Snapshots
- Evidence Collection
- **Diagnostic Engine** ← was "Diagnostics"
- Case Management
- Interventions
- Follow-Up Tracking

**Advanced section** (collapsed, hidden when flag is `false`):

- Job Architecture
- Process Architecture
- Process Engineering
- Competency Framework
- Maturity
- Workforce Risk
- Knowledge Graph
- **Insights Assistant** ← was "AI Assistant"
- Analytics
- Reports
- Strategy / Portfolio / Benchmarks / Digital Twin / Simulations / Rules Engine
  / Workflow Studio / Data Catalog / Command Center / Documents / SaaS / Onboarding
  / Process Mining

Sidebar rendering: Core section header bar, then Advanced section header bar
with an "Advanced" sub-header in muted text (only if flag is on).

---

## Change 5 — Pilot org tier

**New schema fields** (added in a new migration `008_pilot_tier.sql`):

```sql
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS tier            varchar(20)  NOT NULL DEFAULT 'professional',
  ADD COLUMN IF NOT EXISTS pilot_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS scope_department_id uuid REFERENCES departments(id);
```

Allowed `tier` values: `starter` | `professional` | `enterprise` | `unlimited`
| `pilot`.

**Pilot behaviour** (enforced in UI + RLS-friendly hint in service layer):

- `scope_department_id` is set → only data for that department is reachable
- All Advanced module links are hidden in nav regardless of the global flag
- Banner reminder in `DashboardLayout` if `pilot_expires_at < today + 14 days`

Org settings page (`/admin/settings`) gains a "Plan" section with tier
selector + date picker for `pilot_expires_at`.

---

## Change 6 — Pilot Results / Before-After view

New route: `/pilot-results` (also linkable from `/follow-up` for non-pilot
orgs as a "Results" tab).

Page reads:
- baseline snapshots (first snapshot per employee × KPI within the pilot
  window)
- current snapshots (latest snapshot per employee × KPI within the pilot
  window)
- computes `% improvement = (current - baseline) / baseline`

Renders a polished table:
| KPI | Baseline | Current | Δ% | Range |

Plus a **Download PDF** button that calls the browser print API (the project
already has `useReactToPrint` patterns in `src/lib/export/` — checked).

---

## Change 7 — Demo accounts / seed data

Update `supabase/migrations/RUN_THIS.sql`:

- Existing seed orgs are tagged `tier = 'pilot'`.
- One new "full platform" org added tagged `tier = 'enterprise'` for advanced
  demos.
- README "Test Accounts" section gets a `demo@pilot.wpos` account + an
  `admin@enterprise.wpos` account.

---

## Change 8 — Docs / README pass

`README.md`, `WPOS_FULL_CONCEPT.md`, `WORKFLOW_DESIGN.md`, `WORKFLOW_STEPS.md`,
`WPOS_USER_GUIDE.md`, `APP_CONCEPT.md`, `LOVABLE_INSTRUCTIONS.md`,
`PREVIEW_SETUP.md`, `SUPABASE_MIGRATION_GUIDE.md` — lead paragraph rewritten
to anchor on the **Core 6 diagnostic workflow**:

> KPI → Snapshot → Evidence → Diagnostic → Case → Intervention → Follow-up

22-module framing becomes "Advanced (feature-flagged)" framing.

---

## Files touched — running inventory

(Filled in as each change completes. See bottom of this document for the
final tally.)
