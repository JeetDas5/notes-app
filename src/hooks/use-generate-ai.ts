"use client";

import { axiosInstance, queryKeys } from "@/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useGenerateAI() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId: string) => {
      const response = await axiosInstance.post("/api/ai/generate", { noteId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.aiCount });
    },
  });
}
