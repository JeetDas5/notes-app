export const queryKeys = {
  me: ["me"],

  notes: (query?: string, archived?: boolean, tag?: string) => ["notes", { query, archived, tag }],

  note: (id: string) => ["note", id],

  collaborators: (noteId: string) => ["collaborators", noteId],

  sharedNotes: ["shared-notes"],

  dashboard: ["dashboard"],
};
