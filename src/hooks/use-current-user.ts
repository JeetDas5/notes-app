"use client";

import { axiosInstance, queryKeys } from "@/lib";
import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async () => {
      const response = await axiosInstance.get<{
        user: {
          id: string;
          name: string;
          email: string;
        };
      }>("/api/auth/me");
      return response.data;
    },
    retry: false,
  });
}

