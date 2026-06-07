import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsService } from "@/lib/services/supabase/jobs.service";
import type { Database } from "@/integrations/supabase/types";

export function useJobFamilies() {
  return useQuery({ queryKey: ["job-families"], queryFn: () => jobsService.listFamilies() });
}
export function useCreateJobFamily() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (i: Database["public"]["Tables"]["job_families"]["Insert"]) =>
      jobsService.createFamily(i),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["job-families"] }),
  });
}
export function useDeleteJobFamily() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobsService.deleteFamily(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["job-families"] }),
  });
}
export function useJobGrades() {
  return useQuery({ queryKey: ["job-grades"], queryFn: () => jobsService.listGrades() });
}
export function useCreateJobGrade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (i: Database["public"]["Tables"]["job_grades"]["Insert"]) =>
      jobsService.createGrade(i),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["job-grades"] }),
  });
}
export function useDeleteJobGrade() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobsService.deleteGrade(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["job-grades"] }),
  });
}
export function useJobs() {
  return useQuery({ queryKey: ["jobs"], queryFn: () => jobsService.listJobs() });
}
export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (i: Database["public"]["Tables"]["jobs"]["Insert"]) => jobsService.createJob(i),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}
export function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => jobsService.deleteJob(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}
