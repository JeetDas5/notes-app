"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib";
import { queryKeys } from "@/lib/query-keys";

export interface Collaborator {
  noteId: string;
  userId: string;
  role: "editor" | "viewer";
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export function useCollaborators(noteId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.collaborators(noteId || ""),
    queryFn: async () => {
      const response = await axiosInstance.get<{
        success: boolean;
        collaborators: Collaborator[];
      }>(`/api/notes/${noteId}/collaborators`);
      return response.data;
    },
    enabled: !!noteId,
    staleTime: 30_000,
  });
}
