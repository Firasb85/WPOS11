import { useQuery } from "@tanstack/react-query";
import { riskPredictionService } from "@/lib/services/supabase/risk-prediction.service";

export function useAtRiskEmployees() {
  return useQuery({
    queryKey: ["risk-prediction", "employees"],
    queryFn: () => riskPredictionService.getAtRiskEmployees(),
    staleTime: 60_000,
  });
}

export function useAtRiskDepartments() {
  return useQuery({
    queryKey: ["risk-prediction", "departments"],
    queryFn: () => riskPredictionService.getAtRiskDepartments(),
    staleTime: 60_000,
  });
}
