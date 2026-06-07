import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { DataTable, Column } from "~/components/wpos/DataTable";
import { useEmployees } from "~/lib/hooks/useEmployees";
// Employee type — matches the shape returned by employeeService
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/organization/employees")({
  component: EmployeesPage,
});

function EmployeesPage() {
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 20,
    search: "",
  });

  const { data, isLoading } = useEmployees(filters);

  const columns: Column<{ id: string; [key: string]: unknown }>[] = [
    { key: "firstName", label: "First Name", sortable: true, searchable: true },
    { key: "lastName", label: "Last Name", sortable: true, searchable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "employmentStatus", label: "Status", sortable: true },
    { key: "departmentName", label: "Department", sortable: true },
    {
      key: "id",
      label: "Actions",
      render: (id) => (
        <a href={`/organization/employees/${id}`} className="text-blue-600 hover:underline">
          View
        </a>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Employees" description="Manage your workforce" />

      <DataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        searchable
        onSearch={(query) => setFilters({ ...filters, search: query, page: 1 })}
        onSort={(key, direction) => console.log("Sort:", key, direction)}
        pagination={{
          total: data?.total || 0,
          page: filters.page,
          pageSize: filters.pageSize,
          onPageChange: (page) => setFilters({ ...filters, page }),
        }}
      />
    </div>
  );
}
