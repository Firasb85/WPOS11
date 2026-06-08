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
