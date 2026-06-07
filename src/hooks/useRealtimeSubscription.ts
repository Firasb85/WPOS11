import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Subscribe to real-time changes on a Supabase table.
 * Automatically invalidates React Query caches when data changes.
 *
 * Usage:
 *   useRealtimeSubscription("performance_snapshots", ["snapshots", "dashboard"]);
 */
export function useRealtimeSubscription(table: string, queryKeysToInvalidate: string[][]) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel(`realtime_${table}`)
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT, UPDATE, DELETE
          schema: "public",
          table,
        },
        () => {
          // Invalidate all related query keys on any change
          for (const key of queryKeysToInvalidate) {
            queryClient.invalidateQueries({ queryKey: key });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, queryClient, queryKeysToInvalidate]);
}

/**
 * Pre-configured subscription for the CEO Dashboard.
 * Listens to key tables and refreshes dashboard metrics.
 */
export function useDashboardRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const tables = [
      "employees",
      "performance_snapshots",
      "diagnostic_reports",
      "evidence",
      "cases",
    ];

    const channels = tables.map((table) =>
      supabase
        .channel(`dashboard_${table}`)
        .on("postgres_changes", { event: "*", schema: "public", table }, () => {
          queryClient.invalidateQueries({
            queryKey: ["dashboard"],
          });
        })
        .subscribe(),
    );

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, [queryClient]);
}
