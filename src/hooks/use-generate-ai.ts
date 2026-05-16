"use client";

import { api } from "@/lib";
import { useMutation } from "@tanstack/react-query";

export function useGenerateAI() {
  return useMutation({
    mutationFn: (noteId: string) =>
      api("/api/ai/generate", {
        method: "POST",

        body: JSON.stringify({
          noteId,
        }),
      }),
  });
}
