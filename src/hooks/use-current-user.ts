"use client";

import { api, queryKeys } from "@/lib";
import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.me,

    queryFn: () =>
      api<{
        user: {
          id: string;
          name: string;
          email: string;
        };
      }>("/api/auth/me"),
  });
}
