## Polish GuidedDiagnosticWizard: Step 2 & Step 3

This continues the visual and UX polish started in commit `e0e4c6b`.

### Changes

**Step 2 — Attach Evidence**
- Redesigned the evidence form into a clean, bordered card
- Evidence list now uses premium card-style items (consistent with Step 1 employee cards)
- Reliability now shown as color-coded badges:
  - **High** → emerald
  - **Medium** → amber  
  - **Low** → slate
- Added "Clear all" action
- Improved empty state with icon and helpful guidance
- Better spacing, hover states, and responsive layout

**Step 3 — Select Categories**
- New KPI-style summary metrics row with three beautiful gradient cards:
  - Total Points
  - Keyword Matches
  - Categories Scored
- Category cards received richer styling and clearer visual states (selected, recommended, unmatched)
- Improved icon container treatment and selection indicators
- Explainability panel header now shows an "Explainable" badge
- Minor copy & layout refinements

### Files Changed
- `src/components/diagnostics/GuidedDiagnosticWizard.tsx`

### Related
- Follows `e0e4c6b` (Step 1 polish)

---

**Ready for review & merge** ✅

This is a pure UI/UX improvement with no data or backend changes.