"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { axiosInstance } from "@/lib";
import { Note, UpdateNoteData, NoteQueryData } from "@/types";

export function useUpdateNote(noteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateNoteData) => {
      const response = await axiosInstance.patch<{
        message?: string;
        data: Note;
      }>(`/api/notes/${noteId}`, data);
      return response.data;
    },

    onMutate: async (newData: UpdateNoteData) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.note(noteId) });

      const previousNote = queryClient.getQueryData<NoteQueryData>(
        queryKeys.note(noteId)
      );

      queryClient.setQueryData(queryKeys.note(noteId), (old: NoteQueryData) => {
        if (!old) return old;

        if (old.note) {
          return { ...old, note: { ...old.note, ...newData } };
        }

        return { ...old, data: { ...old.data!, ...newData } };
      });

      return { previousNote };
    },

    onError: (_, __, context: { previousNote: NoteQueryData } | undefined) => {
      queryClient.setQueryData(queryKeys.note(noteId), context?.previousNote);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.note(noteId),
      });

      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    },
  });
}
