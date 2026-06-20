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

export function exportPilotResultsPDF(data: PilotResultsData): void {
  const now = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const improved = data.rows.filter((r) => r.deltaPct > 0).length;
  const declined = data.rows.filter((r) => r.deltaPct < 0).length;
  const avgDelta = data.rows.length
    ? data.rows.reduce((s, r) => s + r.deltaPct, 0) / data.rows.length
    : 0;

  const rowsHTML = data.rows
    .map(
      (r) => `
      <tr>
        <td>${sanitize(r.kpi)}</td>
        <td>${sanitize(r.employee)}</td>
        <td class="num">${sanitize(String(r.baseline))}</td>
        <td class="num">${sanitize(String(r.current))}</td>
        <td class="num ${r.deltaPct >= 0 ? "pos" : "neg"}">${r.deltaPct >= 0 ? "+" : ""}${sanitize(r.deltaPct.toFixed(1))}%</td>
        <td>${sanitize(r.range)}</td>
      </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Pilot Results — ${sanitize(data.orgName)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1a1a1a; padding: 40px; max-width: 900px; margin: 0 auto; }
    .cover { text-align: center; padding: 30px 0; border-bottom: 3px solid #2563eb; margin-bottom: 24px; }
    .cover h1 { font-size: 24px; color: #1e3a5f; }
    .cover .subtitle { color: #6b7280; margin-top: 6px; font-size: 13px; }
    .cover .org { font-size: 18px; font-weight: 600; color: #2563eb; margin-top: 10px; }
    .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
    .stat { padding: 14px; background: #f8fafc; border-radius: 8px; text-align: center; }
    .stat .v { font-size: 22px; font-weight: 700; color: #1e3a5f; }
    .stat .l { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #f1f5f9; padding: 10px 12px; text-align: left; font-weight: 600; color: #475569; border-bottom: 2px solid #e2e8f0; }
    td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; color: #374151; }
    td.num { text-align: right; font-variant-numeric: tabular-nums; }
    td.pos { color: #166534; font-weight: 600; }
    td.neg { color: #991b1b; font-weight: 600; }
    tr:nth-child(even) { background: #fafafa; }
    .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 11px; text-align: center; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="cover">
    <h1>Pilot Results — Before / After</h1>
    <p class="subtitle">Workforce Performance Operating System</p>
    <p class="org">${sanitize(data.orgName)}</p>
    <p style="color:#6b7280;font-size:12px;margin-top:6px;">Window: ${sanitize(data.pilotStart)} → ${sanitize(data.pilotEnd)}</p>
  </div>

  <div class="summary">
    <div class="stat"><div class="v">${data.rows.length}</div><div class="l">KPIs tracked</div></div>
    <div class="stat"><div class="v" style="color:#166534">${improved}</div><div class="l">Improved</div></div>
    <div class="stat"><div class="v" style="color:#991b1b">${declined}</div><div class="l">Declined</div></div>
    <div class="stat"><div class="v" style="color:${avgDelta >= 0 ? "#166534" : "#991b1b"}">${avgDelta >= 0 ? "+" : ""}${avgDelta.toFixed(1)}%</div><div class="l">Avg Δ</div></div>
  </div>

  <table>
    <thead>
      <tr><th>KPI</th><th>Employee</th><th>Baseline</th><th>Current</th><th>Δ%</th><th>Range</th></tr>
    </thead>
    <tbody>${rowsHTML}</tbody>
  </table>

  <p class="footer">Generated ${now} · WPOS Pilot Results</p>
  <script>window.print();</script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
