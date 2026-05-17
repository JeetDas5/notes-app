"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib";
import { queryKeys } from "@/lib/query-keys";

interface InviteCollaboratorData {
  email: string;
  role?: "editor" | "viewer";
}

export function useInviteCollaborator(noteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InviteCollaboratorData) => {
      const response = await axiosInstance.post<{
        success: boolean;
        message: string;
        collaborator: {
          userId: string;
          name: string;
          email: string;
          role: string;
        };
      }>(`/api/notes/${noteId}/collaborators`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.collaborators(noteId),
      });
    },
  });
}

export function useRemoveCollaborator(noteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await axiosInstance.delete<{
        success: boolean;
        message: string;
      }>(`/api/notes/${noteId}/collaborators/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.collaborators(noteId),
      });
    },
  });
}
