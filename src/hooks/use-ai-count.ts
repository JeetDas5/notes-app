"use client";

import { axiosInstance, queryKeys } from "@/lib";
import { useQuery } from "@tanstack/react-query";

export function useAICount() {
  return useQuery({
    queryKey: queryKeys.aiCount,
    queryFn: async () => {
      const response = await axiosInstance.get<{ count: number }>("/api/ai/count");
      return response.data;
    },
  });
}
