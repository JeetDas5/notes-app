"use client";

import { axiosInstance } from "@/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/api/notes/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
      toast.success("Note deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete note");
    },
  });
}
