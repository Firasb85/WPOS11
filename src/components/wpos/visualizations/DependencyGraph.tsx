import { ArrowDown, AlertTriangle, Shield } from "lucide-react";

interface GraphNode {
  id: string;
  name: string;
  riskLevel: string;
  criticality: string;
}
interface GraphEdge {
  from: string;
  to: string;
  type: string;
  criticality: string;
}
interface DependencyGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  currentLang?: "ar" | "en";
}

export function DependencyGraph({ nodes, edges, currentLang = "ar" }: DependencyGraphProps) {
  const getOutgoing = (nodeId: string) => edges.filter((e) => e.from === nodeId);
  return (
    <div className="space-y-4">
      {nodes.map((node) => {
        const outgoing = getOutgoing(node.id);
        return (
          <div key={node.id}>
            <div
              className={`p-3 rounded-lg border flex items-center gap-2 ${
                node.criticality === "critical"
                  ? "bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-800"
                  : node.riskLevel === "high"
                    ? "bg-orange-50 border-orange-300"
                    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              }`}
            >
              {node.riskLevel === "critical" || node.riskLevel === "high" ? (
                <AlertTriangle className="w-4 h-4 text-orange-500" />
              ) : (
                <Shield className="w-4 h-4 text-green-500" />
              )}
              <span className="text-sm font-medium">{node.name}</span>
              <span
                className={`ml-auto px-2 py-0.5 rounded text-xs font-medium ${
                  node.riskLevel === "critical"
                    ? "bg-red-200 text-red-800"
                    : node.riskLevel === "high"
                      ? "bg-orange-200 text-orange-800"
                      : node.riskLevel === "medium"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                }`}
              >
                {node.riskLevel}
              </span>
            </div>
            {outgoing.length > 0 && (
              <div className="ml-4 pl-4 border-l-2 border-gray-300 space-y-2 mt-2">
                {outgoing.map((edge, i) => {
                  const target = nodes.find((n) => n.id === edge.to);
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <ArrowDown className="w-3 h-3 text-gray-400 mt-1.5" />
                      <div className="p-2 rounded border text-xs bg-gray-50 dark:bg-gray-800/50">
                        <span className="font-medium">{target?.name || edge.to}</span>
                        <span className="text-gray-400 ml-1.5">
                          ({edge.type}, {edge.criticality})
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function CriticalPathChain({
  nodes,
  currentLang = "ar",
}: {
  nodes: GraphNode[];
  edges?: GraphEdge[];
  currentLang?: "ar" | "en";
}) {
  return (
    <div className="flex items-start gap-2 overflow-x-auto py-4">
      {nodes.map((node, i) => (
        <div key={node.id} className="flex items-center gap-2 shrink-0">
          <div
            className={`p-3 rounded-lg border text-center min-w-[120px] ${
              node.criticality === "critical"
                ? "border-red-300 bg-red-50"
                : node.riskLevel === "high"
                  ? "border-orange-300 bg-orange-50"
                  : "border-gray-200 bg-white dark:bg-gray-900"
            }`}
          >
            <p className="text-xs font-medium">{node.name}</p>
            <p className="text-[10px] text-gray-500 mt-0.5 capitalize">{node.riskLevel}</p>
          </div>
          {i < nodes.length - 1 && <ArrowDown className="w-4 h-4 text-gray-400 shrink-0" />}
        </div>
      ))}
    </div>
  );
}
