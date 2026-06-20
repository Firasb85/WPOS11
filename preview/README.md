# Standalone HTML Previews

This directory contains self-contained HTML previews of polished UI
artifacts. Each file bakes in realistic sample data so you can review
the design without running the app.

## Files

| File | What it previews | Source |
|---|---|---|
| `pilot-results.html` | Pilot Results PDF (sales artifact) | `src/lib/export/pdf.ts → exportPilotResultsPDF` |
| `dashboard-ceo.html` | CEO Dashboard with polished `StatsCard` + `KpiStatusBar` + insights card | `src/routes/_authenticated/dashboard/ceo.tsx` |

## Previewing locally

```bash
open preview/pilot-results.html      # macOS
xdg-open preview/dashboard-ceo.html
start preview/dashboard-ceo.html    # Windows
```

To save as PDF: print dialog → "Save as PDF" → enable
**Background graphics** (Chrome hides gradients/colors without it).

## Sample data

Both previews use realistic Pilot-tier data for "Pilot Demo Co. ·
Customer Success" — mirrors the data seeded by `009_pilot_seed.sql`.

