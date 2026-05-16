"use client";

import { axiosInstance, queryKeys } from "@/lib";
import { useQuery } from "@tanstack/react-query";

export function useNotes({
  query,
  archived,
}: {
  query?: string;
  archived?: boolean;
}) {
  const params = new URLSearchParams();

  if (query) {
    params.set("query", query);
  }

  if (archived) {
    params.set("archived", "true");
  }

  return useQuery({
    queryKey: queryKeys.notes(query, archived),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: any[] }>(
        `/api/notes?${params.toString()}`
      );
      return response.data;
    },
  });
}

