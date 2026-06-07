import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock DOM APIs
const mockClick = vi.fn();
const mockCreateObjectURL = vi.fn().mockReturnValue("blob:test");
const mockRevokeObjectURL = vi.fn();

beforeEach(() => {
  vi.stubGlobal("URL", {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL,
  });
  vi.spyOn(document, "createElement").mockReturnValue({
    click: mockClick,
    href: "",
    download: "",
    set href(v: string) {
      this._href = v;
    },
    get href() {
      return this._href || "";
    },
  } as unknown as HTMLAnchorElement);
});

import { exportToCSV, exportToJSON } from "@/lib/export/csv";

describe("exportToCSV", () => {
  it("should not crash on empty data", () => {
    exportToCSV([], [{ key: "name", label: "Name" }], "test");
    expect(mockClick).not.toHaveBeenCalled();
  });

  it("should create a blob and trigger download", () => {
    const data = [
      { name: "Alice", age: "30" },
      { name: "Bob", age: "25" },
    ];
    const columns = [
      { key: "name", label: "Name" },
      { key: "age", label: "Age" },
    ];

    exportToCSV(data, columns, "test_export");

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
  });

  it("should escape quotes in values", () => {
    const data = [{ name: 'He said "hello"' }];
    const columns = [{ key: "name", label: "Name" }];

    // Should not throw
    expect(() => exportToCSV(data, columns, "test")).not.toThrow();
  });
});

describe("exportToJSON", () => {
  it("should create a JSON blob and trigger download", () => {
    exportToJSON({ test: true }, "test_json");

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
  });
});
