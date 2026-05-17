"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib";
import { UpdateNoteData } from "@/types";

export function useUpdateNoteStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateNoteData }) => {
      const response = await axiosInstance.patch(`/api/notes/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    },
  });
}
