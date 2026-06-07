import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "~/components/wpos/PageHeader";
import { Card } from "~/components/wpos/Card";
import { useState } from "react";
import {
  Building2,
  GitBranch,
  Building,
  Users,
  UserCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/organization/hierarchy")({
  component: HierarchyPage,
});

interface OrgNode {
  type: string;
  name: string;
  subtitle?: string;
  badge?: string;
  children?: OrgNode[];
}

const icons: Record<string, React.ReactNode> = {
  company: <Building2 className="w-5 h-5 text-blue-600" />,
  branch: <GitBranch className="w-5 h-5 text-indigo-600" />,
  department: <Building className="w-5 h-5 text-purple-600" />,
  team: <Users className="w-5 h-5 text-orange-600" />,
  employee: <UserCircle className="w-5 h-5 text-green-600" />,
};

const colors: Record<string, string> = {
  company: "bg-blue-50 border-blue-200",
  branch: "bg-indigo-50 border-indigo-200",
  department: "bg-purple-50 border-purple-200",
  team: "bg-orange-50 border-orange-200",
  employee: "bg-green-50 border-green-200",
};

function Node({ node, depth = 0 }: { node: OrgNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = (node.children?.length ?? 0) > 0;

  return (
    <div style={{ marginLeft: depth > 0 ? "24px" : 0 }}>
      <div
        className={`flex items-center gap-2 p-3 rounded-lg border ${colors[node.type] || "bg-gray-50 border-gray-200"} mb-2 cursor-pointer`}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren &&
          (expanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          ))}
        {icons[node.type]}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{node.name}</p>
          {node.subtitle && (
            <p className="text-xs text-gray-500">{node.subtitle}</p>
          )}
        </div>
        {node.badge && (
          <span className="text-xs text-gray-400">{node.badge}</span>
        )}
      </div>
      {hasChildren && expanded && (
        <div className="space-y-1">
          {node.children!.map((c, i) => (
            <Node key={i} node={c} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function HierarchyPage() {
  const tree: OrgNode = {
    type: "company",
    name: "Acme Corporation",
    children: [
      {
        type: "branch",
        name: "Riyadh HQ",
        children: [
          {
            type: "department",
            name: "Operations",
            subtitle: "Khalid Al-Saud",
            children: [
              {
                type: "team",
                name: "Alpha Team",
                subtitle: "Ahmad Khalid",
                badge: "8 members",
                children: [
                  {
                    type: "employee",
                    name: "Ahmad Khalid",
                    subtitle: "Senior Analyst",
                  },
                  {
                    type: "employee",
                    name: "Omar Hassan",
                    subtitle: "Junior Analyst",
                  },
                ],
              },
              {
                type: "team",
                name: "Beta Team",
                subtitle: "Layla Ibrahim",
                badge: "6 members",
                children: [
                  {
                    type: "employee",
                    name: "Layla Ibrahim",
                    subtitle: "Analyst",
                  },
                ],
              },
            ],
          },
          {
            type: "department",
            name: "Human Resources",
            subtitle: "Nora Al-Faisal",
          },
          { type: "department", name: "IT", subtitle: "Saud Al-Ghamdi" },
        ],
      },
      {
        type: "branch",
        name: "Jeddah Branch",
        children: [
          {
            type: "department",
            name: "Finance",
            subtitle: "Fahad Al-Otaibi",
          },
        ],
      },
    ],
  };

  return (
    <div>
      <PageHeader
        title="Organization Hierarchy"
        description="Visualize the organizational structure"
      />
      <Card>
        <Node node={tree} />
      </Card>
    </div>
  );
}
