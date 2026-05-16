"use client";

import { axiosInstance } from "@/lib";
import { useMutation } from "@tanstack/react-query";

export function useGenerateAI() {
  return useMutation({
    mutationFn: async (noteId: string) => {
      const response = await axiosInstance.post("/api/ai/generate", { noteId });
      return response.data;
    },

  });
}
