"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib";

export interface SharedNote {
  id: string;
  userId: string;
  title: string | null;
  content: string | null;
  isArchived: boolean | null;
  isPublic: boolean | null;
  shareId: string | null;
  createdAt: string;
  updatedAt: string;
  collaboratorRole: "editor" | "viewer";
  isShared: true;
  noteTags: { tag: { id: string; name: string } }[];
}

export function useSharedNotes() {
  return useQuery({
    queryKey: ["shared-notes"],
    queryFn: async () => {
      const response = await axiosInstance.get<{
        message: string;
        data: SharedNote[];
      }>("/api/notes/shared");
      return response.data;
    },
    staleTime: 60_000,
  });
}
