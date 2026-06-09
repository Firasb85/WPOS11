import { useState } from "react";
import { ChevronDown, ChevronRight} from "lucide-react";

interface KpiNode {
  kpi: {
    id: string;
    name: string;
    code: string;
    currentValue?: number;
    targetValue?: number;
    status?: string;
  };
  children: KpiNode[];
  impactWeight: number;
}

interface KpiTreeViewProps {
  tree: KpiNode;
  currentLang?: "ar" | "en";
}

function KpiTreeNode({
  node,
  currentLang = "ar",
  depth = 0,
}: {
  node: KpiNode;
  currentLang?: "ar" | "en";
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children.length > 0;

  return (
    <div className={`${depth > 0 ? "ml-6" : ""}`}>
      <div
        className={`flex items-center gap-2 p-3 rounded-lg border ${depth === 0 ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-blue-300"} mb-2 cursor-pointer transition-all`}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          <button className="p-0.5 hover:bg-white/50 rounded">
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}
        <div className="flex-1">
          <span className="text-sm font-medium">{node.kpi.name}</span>
          <span className="text-xs font-mono text-gray-400 ml-2">{node.kpi.code}</span>
        </div>
        <div className="flex items-center gap-3">
          {node.kpi.currentValue !== undefined && (
            <span
              className={`text-sm font-bold ${node.kpi.status === "red" ? "text-red-600" : node.kpi.status === "yellow" ? "text-yellow-600" : "text-green-600"}`}
            >
              {node.kpi.currentValue}
            </span>
          )}
          {node.kpi.targetValue !== undefined && (
            <span className="text-xs text-gray-400">/ {node.kpi.targetValue}</span>
          )}
          {node.kpi.status && (
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium border ${node.kpi.status === "red" ? "text-red-600 bg-red-50 border-red-200" : node.kpi.status === "yellow" ? "text-yellow-600 bg-yellow-50 border-yellow-200" : "text-green-600 bg-green-50 border-green-200"}`}
            >
              {node.kpi.status}
            </span>
          )}
        </div>
      </div>
      {hasChildren && expanded && (
        <div className="space-y-1 ml-4">
          {node.children.map((child, i) => (
            <KpiTreeNode key={i} node={child} currentLang={currentLang} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function KpiTreeView({ tree, currentLang = "ar" }: KpiTreeViewProps) {
  return (
    <div className="py-2">
      <KpiTreeNode node={tree} currentLang={currentLang} />
    </div>
  );
}
