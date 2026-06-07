import { useMutation } from "@tanstack/react-query";
import type { CreateDiagnosticInput } from "~/lib/schemas/diagnostic.schema";

export function useCreateDiagnostic() {
  return useMutation({
    mutationFn: async (input: CreateDiagnosticInput) => {
      // Stub — wire to backend when ready.
      return { id: crypto.randomUUID(), ...input };
    },
  });
}
