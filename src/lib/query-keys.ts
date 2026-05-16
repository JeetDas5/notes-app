export const queryKeys = {
  me: ["me"],

  notes: (query?: string, archived?: boolean) => ["notes", { query, archived }],

  note: (id: string) => ["note", id],

  dashboard: ["dashboard"],
};
