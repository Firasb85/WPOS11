/**
 * PDF Export Utility — generates a printable HTML document
 * that opens in a new tab for Print-to-PDF.
 * No external PDF library required.
 */

export interface DiagnosticExportData {
  title: string;
  employee: string;
  department: string;
  status: string;
  maturity: number;
  confidence: number;
  date: string;
  summary?: string;
  hypotheses: {
    rank: number;
    category: string;
    hypothesis: string;
    confidence: number;
  }[];
}

/**
 * Sanitize string for safe HTML injection.
 * Prevents XSS in PDF export.
 */
function sanitize(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function exportDiagnosticsPDF(
  reports: DiagnosticExportData[],
  title = "Diagnostic Reports — Executive Review",
): void {
  const now = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const reportsHTML = reports
    .map(
      (r, idx) => `
    <div class="report ${idx > 0 ? "page-break" : ""}">
      <div class="report-header">
        <h2>${sanitize(String(r.title))}</h2>
        <div class="meta-grid">
          <div class="meta"><span class="label">Employee:</span> ${sanitize(String(r.employee))}</div>
          <div class="meta"><span class="label">Department:</span> ${sanitize(String(r.department))}</div>
          <div class="meta"><span class="label">Status:</span> <span class="badge badge-${sanitize(String(r.status))}">${r.status.replace("_", " ")}</span></div>
          <div class="meta"><span class="label">Maturity:</span> Level ${sanitize(String(r.maturity))}/5</div>
          <div class="meta"><span class="label">Confidence:</span> ${sanitize(String(r.confidence))}%</div>
          <div class="meta"><span class="label">Date:</span> ${sanitize(String(r.date))}</div>
        </div>
      </div>
      ${r.summary ? `<div class="section"><h3>Performance Summary</h3><p>${sanitize(String(r.summary))}</p></div>` : ""}
      ${
        r.hypotheses.length > 0
          ? `<div class="section"><h3>Diagnostic Hypotheses</h3>
          <table>
            <thead><tr><th>#</th><th>Category</th><th>Hypothesis</th><th>Confidence</th></tr></thead>
            <tbody>${r.hypotheses.map((h) => `<tr><td>${sanitize(String(h.rank))}</td><td>${h.category.replace("_", " ")}</td><td>${sanitize(String(h.hypothesis))}</td><td><strong>${sanitize(String(h.confidence))}%</strong></td></tr>`).join("")}</tbody>
          </table></div>`
          : ""
      }
    </div>`,
    )
    .join("\n");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1a1a1a; padding: 40px; max-width: 900px; margin: 0 auto; }
    .cover { text-align: center; padding: 60px 0; border-bottom: 3px solid #2563eb; margin-bottom: 40px; }
    .cover h1 { font-size: 28px; color: #1e3a5f; }
    .cover .subtitle { color: #6b7280; margin-top: 8px; font-size: 14px; }
    .cover .date { color: #9ca3af; margin-top: 16px; font-size: 12px; }
    .cover .count { display: inline-block; margin-top: 16px; padding: 6px 20px; background: #eff6ff; color: #2563eb; border-radius: 20px; font-weight: 600; font-size: 13px; }
    .report { margin-bottom: 40px; padding-bottom: 30px; border-bottom: 1px solid #e5e7eb; }
    .report-header { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 16px; }
    .report-header h2 { font-size: 18px; color: #1e3a5f; margin-bottom: 12px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .meta { font-size: 12px; color: #4b5563; }
    .meta .label { font-weight: 600; color: #374151; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; text-transform: capitalize; }
    .badge-draft { background: #fef3c7; color: #92400e; }
    .badge-under_review { background: #ffedd5; color: #9a3412; }
    .badge-approved { background: #dcfce7; color: #166534; }
    .badge-final { background: #dbeafe; color: #1e40af; }
    .section { margin-top: 16px; }
    .section h3 { font-size: 14px; color: #374151; margin-bottom: 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
    .section p { font-size: 13px; color: #4b5563; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 8px; }
    th { background: #f1f5f9; padding: 8px 12px; text-align: left; font-weight: 600; color: #475569; border-bottom: 2px solid #e2e8f0; }
    td { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; color: #374151; }
    tr:nth-child(even) { background: #fafafa; }
    .page-break { page-break-before: always; }
    @media print { body { padding: 20px; } .cover { padding: 40px 0; } }
  </style>
</head>
<body>
  <div class="cover">
    <h1>WPOS — ${title}</h1>
    <p class="subtitle">Workforce Performance Operating System</p>
    <p class="date">Generated: ${now}</p>
    <p class="count">${reports.length} Report${reports.length !== 1 ? "s" : ""}</p>
  </div>
  ${reportsHTML}
  <script>window.print();</script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

/**
 * Pilot Results — Before/After summary PDF.
 * One-page artifact for the Pilot sales motion:
 * baseline → current → % improvement per KPI, with summary stats.
 */
export interface PilotResultsData {
  orgName: string;
  pilotStart: string;
  pilotEnd: string;
  rows: {
    kpi: string;
    employee: string;
    baseline: number;
    current: number;
    deltaPct: number;
    range: string;
  }[];
}

/**
 * WPOS logo (inline SVG, no external assets).
 * Stylised "W" mark on a rounded indigo square.
 */
function wposLogoSVG(): string {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" aria-label="WPOS">
    <defs>
      <linearGradient id="wposg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#4f46e5"/>
        <stop offset="100%" stop-color="#1e3a8a"/>
      </linearGradient>
    </defs>
    <rect width="40" height="40" rx="9" fill="url(#wposg)"/>
    <path d="M9 11 L14.5 28 L20 17 L25.5 28 L31 11" stroke="white" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

export function exportPilotResultsPDF(data: PilotResultsData): void {
  const now = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const improved = data.rows.filter((r) => r.deltaPct > 0).length;
  const declined = data.rows.filter((r) => r.deltaPct < 0).length;
  const flat = data.rows.length - improved - declined;
  const avgDelta = data.rows.length
    ? data.rows.reduce((s, r) => s + r.deltaPct, 0) / data.rows.length
    : 0;

  // Top performer = row with the largest positive delta
  const topPerformer = data.rows
    .filter((r) => r.deltaPct > 0)
    .sort((a, b) => b.deltaPct - a.deltaPct)[0];
  const worstDecline = data.rows
    .filter((r) => r.deltaPct < 0)
    .sort((a, b) => a.deltaPct - b.deltaPct)[0];

  /**
   * Build a horizontal bar visualisation of each row's improvement.
   * The bar shows the ratio of current to baseline, with a tick
   * at the baseline so the viewer can see exactly where it started.
   */
  const maxAbs = Math.max(
    1,
    ...data.rows.map((r) => Math.max(Math.abs(r.baseline), Math.abs(r.current))),
  );
  const rowsHTML = data.rows
    .map((r) => {
      const baseW = (Math.abs(r.baseline) / maxAbs) * 100;
      const curW = (Math.abs(r.current) / maxAbs) * 100;
      const baseClr = "#94a3b8";
      const curClr = r.deltaPct >= 0 ? "#10b981" : "#ef4444";
      return `
      <tr>
        <td>
          <div class="kpi-name">${sanitize(r.kpi)}</div>
          <div class="emp-name">${sanitize(r.employee)}</div>
        </td>
        <td class="num">${sanitize(r.baseline.toFixed(1))}</td>
        <td class="num">${sanitize(r.current.toFixed(1))}</td>
        <td>
          <div class="bar-track">
            <div class="bar-baseline" style="width:${baseW}%"></div>
            <div class="bar-current" style="width:${curW}%; background:${curClr}"></div>
          </div>
          <div class="bar-labels">
            <span style="color:${baseClr}">baseline</span>
            <span style="color:${curClr}">current</span>
          </div>
        </td>
        <td class="num ${r.deltaPct >= 0 ? "pos" : "neg"}">
          ${r.deltaPct >= 0 ? "+" : ""}${sanitize(r.deltaPct.toFixed(1))}%
        </td>
        <td class="range">${sanitize(r.range)}</td>
      </tr>`;
    })
    .join("");

  const topPerformerHTML = topPerformer
    ? `
      <div class="callout callout--success">
        <div class="callout-label">Top improvement</div>
        <div class="callout-kpi">${sanitize(topPerformer.kpi)}</div>
        <div class="callout-delta">+${sanitize(topPerformer.deltaPct.toFixed(1))}%</div>
        <div class="callout-sub">${sanitize(topPerformer.employee)} · ${sanitize(topPerformer.range)}</div>
      </div>`
    : "";

  const declineHTML = worstDecline
    ? `
      <div class="callout callout--warn">
        <div class="callout-label">Needs attention</div>
        <div class="callout-kpi">${sanitize(worstDecline.kpi)}</div>
        <div class="callout-delta">${sanitize(worstDecline.deltaPct.toFixed(1))}%</div>
        <div class="callout-sub">${sanitize(worstDecline.employee)} · ${sanitize(worstDecline.range)}</div>
      </div>`
    : "";

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Pilot Results — ${sanitize(data.orgName)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: A4; margin: 18mm; }
    body {
      font-family: 'Helvetica Neue', 'Segoe UI', system-ui, -apple-system, sans-serif;
      color: #0f172a;
      padding: 0;
      max-width: 760px;
      margin: 0 auto;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── Cover ────────────────────────────────────────────────── */
    .cover {
      padding: 32px 0 24px 0;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 28px;
    }
    .cover-top {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 20px;
    }
    .logo-row { display: flex; align-items: center; gap: 10px; }
    .wordmark {
      font-size: 13px; font-weight: 700; letter-spacing: 0.16em;
      color: #1e3a8a; text-transform: uppercase;
    }
    .cover-meta { font-size: 11px; color: #64748b; text-align: right; }
    .cover-meta .stamp {
      display: inline-block; padding: 3px 10px; border-radius: 999px;
      background: #eef2ff; color: #4338ca; font-weight: 600;
      font-size: 10px; letter-spacing: 0.05em; text-transform: uppercase;
      margin-top: 6px;
    }
    .cover h1 {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-size: 36px; font-weight: 700; color: #0f172a;
      line-height: 1.15; margin-bottom: 10px;
    }
    .cover .org {
      font-size: 16px; font-weight: 600; color: #4338ca;
      margin-bottom: 4px;
    }
    .cover .tagline {
      font-family: 'Georgia', 'Times New Roman', serif;
      font-style: italic; font-size: 14px; color: #475569;
      margin-top: 6px;
    }
    .cover .window {
      display: inline-block; margin-top: 14px; padding: 5px 12px;
      background: #f1f5f9; border-radius: 6px; font-size: 11px;
      color: #475569; font-variant-numeric: tabular-nums;
    }
    .gradient-rule {
      height: 4px; background: linear-gradient(90deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%);
      border-radius: 2px; margin-top: 18px;
    }

    /* ── Summary stat row ──────────────────────────────────────── */
    .summary {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
      margin-bottom: 22px;
    }
    .stat {
      padding: 14px 12px;
      background: #f8fafc; border: 1px solid #e2e8f0;
      border-radius: 8px; text-align: center;
    }
    .stat .v {
      font-size: 26px; font-weight: 700; color: #0f172a;
      font-variant-numeric: tabular-nums; line-height: 1.1;
    }
    .stat .l {
      font-size: 10px; color: #64748b;
      text-transform: uppercase; letter-spacing: 0.08em;
      margin-top: 6px; font-weight: 600;
    }
    .stat--accent .v { color: #4338ca; }

    /* ── Callouts (top performer / needs attention) ────────────── */
    .callouts {
      display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
      margin-bottom: 24px;
    }
    .callout {
      padding: 14px 16px; border-radius: 8px; border: 1px solid;
    }
    .callout--success {
      background: #f0fdf4; border-color: #86efac;
    }
    .callout--warn {
      background: #fef2f2; border-color: #fca5a5;
    }
    .callout-label {
      font-size: 10px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: #15803d; margin-bottom: 4px;
    }
    .callout--warn .callout-label { color: #b91c1c; }
    .callout-kpi {
      font-size: 15px; font-weight: 700; color: #0f172a;
      margin-bottom: 4px;
    }
    .callout-delta {
      font-size: 28px; font-weight: 700; color: #15803d;
      font-variant-numeric: tabular-nums; line-height: 1;
      margin-bottom: 4px;
    }
    .callout--warn .callout-delta { color: #b91c1c; }
    .callout-sub { font-size: 11px; color: #475569; }

    /* ── Detail table ──────────────────────────────────────────── */
    .section-title {
      font-size: 11px; font-weight: 700; color: #1e3a8a;
      text-transform: uppercase; letter-spacing: 0.1em;
      margin-bottom: 10px;
    }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    thead th {
      background: #1e3a8a; color: white;
      padding: 10px 12px; text-align: left; font-weight: 600;
      font-size: 11px; letter-spacing: 0.04em; text-transform: uppercase;
    }
    thead th:first-child { border-top-left-radius: 6px; }
    thead th:last-child { border-top-right-radius: 6px; }
    tbody td {
      padding: 12px; border-bottom: 1px solid #e2e8f0;
      color: #1e293b; vertical-align: middle;
    }
    tbody tr:nth-child(even) td { background: #fafbfc; }
    .kpi-name { font-weight: 600; color: #0f172a; }
    .emp-name { font-size: 11px; color: #64748b; margin-top: 2px; }
    .num { text-align: right; font-variant-numeric: tabular-nums; font-weight: 500; }
    .pos { color: #15803d; font-weight: 700; }
    .neg { color: #b91c1c; font-weight: 700; }
    .range { font-size: 11px; color: #64748b; }
    .bar-track {
      position: relative; height: 8px; background: #f1f5f9;
      border-radius: 4px; overflow: hidden; min-width: 120px;
    }
    .bar-baseline {
      position: absolute; top: 0; left: 0; height: 100%;
      background: #cbd5e1; border-radius: 4px 0 0 4px;
    }
    .bar-current {
      position: absolute; top: 0; left: 0; height: 100%;
      border-radius: 4px;
    }
    .bar-labels {
      display: flex; justify-content: space-between;
      font-size: 9px; margin-top: 3px; text-transform: uppercase;
      letter-spacing: 0.05em; font-weight: 600;
    }

    /* ── Methodology + footer ──────────────────────────────────── */
    .methodology {
      margin-top: 28px; padding: 14px 16px;
      background: #f8fafc; border-left: 3px solid #4f46e5;
      border-radius: 0 6px 6px 0;
      font-size: 11px; color: #475569; line-height: 1.6;
    }
    .methodology strong { color: #1e3a8a; }
    .footer {
      margin-top: 22px; padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      color: #94a3b8; font-size: 10px; text-align: center;
      letter-spacing: 0.04em;
    }
    .footer .brand { color: #4338ca; font-weight: 600; }

    @media print {
      body { padding: 0; }
      .stat, .callout, .methodology { break-inside: avoid; }
      tr { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <!-- ── Cover ─────────────────────────────────────────────── -->
  <div class="cover">
    <div class="cover-top">
      <div class="logo-row">
        ${wposLogoSVG()}
        <div class="wordmark">WPOS</div>
      </div>
      <div class="cover-meta">
        Workforce Performance Operating System
        <div class="stamp">Pilot Results</div>
      </div>
    </div>

    <h1>Pilot Results —<br/>Before &amp; After</h1>
    <div class="org">${sanitize(data.orgName)}</div>
    <div class="tagline">Workforce performance, explainable.</div>
    <div class="window">
      Pilot window: ${sanitize(data.pilotStart)} &rarr; ${sanitize(data.pilotEnd)}
    </div>
    <div class="gradient-rule"></div>
  </div>

  <!-- ── Summary stats ──────────────────────────────────────── -->
  <div class="summary">
    <div class="stat stat--accent">
      <div class="v">${data.rows.length}</div>
      <div class="l">KPIs Tracked</div>
    </div>
    <div class="stat">
      <div class="v" style="color:#15803d">${improved}</div>
      <div class="l">Improved</div>
    </div>
    <div class="stat">
      <div class="v" style="color:#b91c1c">${declined}</div>
      <div class="l">Declined</div>
    </div>
    <div class="stat">
      <div class="v" style="color:${avgDelta >= 0 ? "#15803d" : "#b91c1c"}">
        ${avgDelta >= 0 ? "+" : ""}${avgDelta.toFixed(1)}%
      </div>
      <div class="l">Avg &Delta;</div>
    </div>
  </div>

  <!-- ── Callouts ───────────────────────────────────────────── -->
  ${topPerformer || declineHTML ? `
  <div class="callouts">
    ${topPerformerHTML}
    ${declineHTML}
  </div>
  ` : ""}

  <!-- ── Detail table ───────────────────────────────────────── -->
  <div class="section-title">Per-KPI Performance</div>
  <table>
    <thead>
      <tr>
        <th style="width:32%">KPI / Employee</th>
        <th style="width:8%" class="num">Baseline</th>
        <th style="width:8%" class="num">Current</th>
        <th style="width:30%">Trajectory</th>
        <th style="width:10%" class="num">&Delta;%</th>
        <th style="width:12%">Window</th>
      </tr>
    </thead>
    <tbody>${rowsHTML}</tbody>
  </table>

  <!-- ── Methodology ────────────────────────────────────────── -->
  <div class="methodology">
    <strong>Methodology.</strong> Each row compares the earliest and latest
    performance snapshot for one employee &times; KPI pair within the pilot
    window. Improvement is calculated as
    <em>(current &minus; baseline) &divide; baseline</em>. Reliability
    weights and confidence scoring follow WPOS&rsquo;s deterministic,
    explainable diagnostic rules &mdash; every score traces back to the
    evidence items that contributed.
  </div>

  <!-- ── Footer ─────────────────────────────────────────────── -->
  <p class="footer">
    <span class="brand">WPOS</span> &middot; Pilot Results &middot;
    Generated ${now} &middot; Confidential
  </p>

  <script>window.print();</script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
