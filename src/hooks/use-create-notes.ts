"use client";

import { axiosInstance } from "@/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title?: string; content?: string; tags?: string[] }) => {
      const response = await axiosInstance.post("/api/notes", data);
      return response.data;
    },


    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    },
  });
}
