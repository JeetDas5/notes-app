"use client";

import { axiosInstance, queryKeys } from "@/lib";
import { useQuery } from "@tanstack/react-query";

export function useNotes({
  query,
  archived,
  tag,
}: {
  query?: string;
  archived?: boolean;
  tag?: string;
}) {
  const params = new URLSearchParams();

  if (query) {
    params.set("query", query);
  }

  if (archived) {
    params.set("archived", "true");
  }
  if (tag) {
    params.set("tag", tag);
  }

  return useQuery({
    queryKey: queryKeys.notes(query, archived, tag),
    queryFn: async () => {
      const response = await axiosInstance.get<{ data: any[] }>(
        `/api/notes?${params.toString()}`
      );
      return response.data;
    },
  });
}

