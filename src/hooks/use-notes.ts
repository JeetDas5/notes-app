"use client";

import { api, queryKeys } from "@/lib";
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
    queryFn: () => api<{ notes: Note[] }>(`/api/notes?${params.toString()}`),
  });
}
