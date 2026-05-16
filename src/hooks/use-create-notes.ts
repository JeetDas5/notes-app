"use client";

import { api } from "@/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { title?: string; content?: string }) =>
      api("/api/notes", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    },
  });
}
