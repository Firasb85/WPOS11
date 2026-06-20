# WPOS — Workforce Performance Operating System

**Pilot-first.** Continuous, evidence-backed workforce performance management for Gulf/MENA enterprises.

---

## What it does

WPOS turns fragmented KPI trackers and annual reviews into a **continuous 7-step diagnostic workflow** — from detecting a performance gap to measuring whether the intervention worked.

The Core 6:

1. **KPI Management** — define & organize KPIs
2. **Performance Snapshots** — record point-in-time measurements
3. **Evidence Collection** — attach multi-source evidence to performance signals
4. **Diagnostic Engine** — scored, explainable root-cause hypotheses (every score shows the evidence that contributed)
5. **Case Management** — track issues through to resolution
6. **Interventions + Follow-Up** — targeted actions + 30/60/90-day measurement

A 7th step, **Manager Approval**, sits between Diagnostic and Case: no case, intervention, or HR record is created until a manager signs off. This is a designed safety feature, not an incidental workflow gate.

> **One-line pitch:** WPOS tells you WHO is underperforming, WHY it's happening, and WHAT to do about it — with evidence and explainable scoring, before it's too late.

---

## How it's sold

**Pilot-first.** Every prospect starts with a 90-day evaluation scoped to a single department and the Core 6 only. The Before/After Pilot Results PDF is the artifact the sales motion depends on.

| Tier | Scope | Includes |
|------|-------|----------|
| **Pilot** | 1 department, 90-day window, Core 6 only | KPI / Snapshot / Evidence / Diagnostic / Case / Intervention / Follow-Up / Pilot Results |
| **Starter** | Up to 500 employees | Core workflow + 3 dashboards |
| **Professional** | 501–2,000 employees | Full platform, Insights Assistant, HR integrations |
| **Enterprise** | 2,001–10,000 employees | + Advanced tools (Digital Twin, Simulations, Rules Engine, Workflow Studio) |
| **Unlimited** | 10,000+ | Custom / white-label / multi-tenant |

---

## What's "explainable" about the scoring

The Diagnostic Engine is **deterministic and transparent**, not a black-box model:

- Each root-cause category has a known set of keyword matches.
- Each piece of evidence is scored by its keyword matches, weighted by reliability (high/medium/low).
- The user can expand a **"View scoring breakdown"** panel to see exactly which evidence items contributed how many points to each category.
- Each persisted hypothesis on the report page exposes a **"Why this score?"** affordance showing the same logic.

When the optional Insights Assistant is configured with an OpenAI key, it adds free-form Q&A over the same data — but no scoring anywhere in the platform depends on it.

---

## Quick start

```bash
npm install
npm run dev        # Vite dev server
npm run build      # Production build
npm run test       # Vitest unit tests
npm run test:e2e   # Playwright E2E
```

Copy `.env.example` → `.env` and fill in your Supabase credentials.

### Demo accounts

Password is `Password123!` for all.

| Role | Email | Org tier | What you see |
|------|-------|----------|-------------|
| **Pilot** (default) | `demo@pilot.wpos.com` | `pilot` | Core 6 only, 1 department, Advanced modules hidden |
| Admin | `admin@wpos.com` | `enterprise` | Full platform — all 95 pages |
| CEO | `ceo@wpos.com` | `enterprise` | Executive dashboards |
| Manager | `manager@wpos.com` | `enterprise` | Diagnostic workflow |
| User | `user@wpos.com` | `enterprise` | Limited view |

---

## Architecture at a glance

- **Frontend** — React 19 + TypeScript + Tailwind 4, TanStack Router, 95 routes, full RTL Arabic/English
- **Backend** — Supabase (PostgreSQL + Auth + Realtime), 36 tables, 55 RLS policies
- **State** — TanStack React Query (70+ hooks across 17 files)
- **Auth** — Supabase Auth + MFA (TOTP), AES-256-GCM field-level encryption
- **Compliance** — ISO 27001 (12/12 Annex A controls), GDPR (Art 15/17/20/25/30/32/33)

See `WPOS_FULL_CONCEPT.md` for the complete narrative, `WORKFLOW_DESIGN.md` for the diagnostic workflow details, and `SECURITY_AUDIT_REPORT.md` for compliance details.

---

## Recent updates

- **Repositioning (current):** Pilot-first go-to-market. Core 6 workflow framing. "AI" framing removed from UI in favor of "explainable" / "structured" / "Insights Assistant". Manager Approval step is now a designed safety feature. Diagnostic scoring is fully explainable.
- **Production readiness (88%):** No critical gaps. Full bilingual coverage. Full dark mode. 146 tests across 27 files.

See `REPOSITIONING_CHANGES.md` for the full list of changes from the repositioning pass and `GAP_ANALYSIS_DEEP.md` for the latest gap analysis.
