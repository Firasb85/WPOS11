import { useQuery } from "@tanstack/react-query";
import { generateInsights } from "@/lib/ai/insights-engine";

export function useAIInsights() {
  return useQuery({
    queryKey: ["ai-insights"],
    queryFn: () => generateInsights(),
    staleTime: 5 * 60 * 1000, // 5 min
    refetchOnWindowFocus: false,
  });
}
