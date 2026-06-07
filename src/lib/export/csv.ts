/**
 * CSV Export Utility.
 * Generates CSV from data arrays and triggers browser download.
 */

export function exportToCSV(
  data: Record<string, unknown>[],
  columns: { key: string; label: string }[],
  filename: string,
): void {
  if (data.length === 0) return;

  // Header row
  const header = columns.map((c) => `"${c.label}"`).join(",");

  // Data rows
  const rows = data.map((row) =>
    columns
      .map((c) => {
        const val = row[c.key];
        const str = val == null ? "" : String(val);
        // Escape quotes in CSV
        return `"${str.replace(/"/g, '""')}"`;
      })
      .join(","),
  );

  const csv = [header, ...rows].join("\n");
  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Export data as JSON file.
 */
export function exportToJSON(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}
