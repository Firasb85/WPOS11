import { useState } from "react";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export interface Column<T = Record<string, unknown>> {
  key: string;
  label: string;
  labelAr?: string;
  sortable?: boolean;
  searchable?: boolean;
  /** Render callback receives the full row object */
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  searchable?: boolean;
  selectable?: boolean;
  pageSize?: number;
  currentLang?: string;
  onRowClick?: (row: T) => void;
  onSort?: (key: string, direction: "asc" | "desc") => void;
  onSearch?: (query: string) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading = false,
  searchable = true,
  selectable = false,
  onSort,
  onSearch,
  onSelectionChange,
  pagination,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    onSort?.(key, sortDirection === "asc" ? "desc" : "asc");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
      onSelectionChange?.([]);
    } else {
      const allIds = data.map((row) => row.id);
      setSelectedIds(allIds);
      onSelectionChange?.(allIds);
    }
  };

  const toggleSelect = (id: string) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter((sid) => sid !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelection);
    onSelectionChange?.(newSelection);
  };

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
          <label htmlFor="datatable-search" className="sr-only">
            Search
          </label>
          <Input
            id="datatable-search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.length === data.length && data.length > 0}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all rows"
                  />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead key={String(col.key)} className={col.width}>
                  <div
                    className={col.sortable ? "cursor-pointer flex items-center gap-2" : ""}
                    onClick={() => col.sortable && handleSort(String(col.key))}
                    role={col.sortable ? "button" : undefined}
                    tabIndex={col.sortable ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (col.sortable && (e.key === "Enter" || e.key === " ")) {
                        handleSort(String(col.key));
                      }
                    }}
                  >
                    {col.label}
                    {col.sortable && sortKey === String(col.key) && (
                      <>
                        {sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="text-center py-8"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="text-center py-8"
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(row.id)}
                        onCheckedChange={() => toggleSelect(row.id)}
                        aria-label={`Select row ${row.id}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
            {pagination.total}
          </span>
          <div className="space-x-2">
            <Button
              disabled={pagination.page === 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <Button
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
