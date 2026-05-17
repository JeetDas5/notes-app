export interface Tag {
  id: string;
  name: string;
}

export interface NoteTag {
  noteId: string;
  tagId: string;
  tag?: Tag;
}

export interface CollaboratorUser {
  id: string;
  name: string;
  email: string;
}

export interface Collaborator {
  noteId: string;
  userId: string;
  role: "editor" | "viewer";
  createdAt: string;
  updatedAt: string;
  user?: CollaboratorUser;
}

export interface Note {
  id: string;
  userId: string;
  title: string | null;
  content: string | null;
  isArchived: boolean | null;
  isPublic: boolean | null;
  shareId: string | null;
  aiSummary: string | null;
  aiSuggestedTitle: string | null;
  actionItems: string | null;
  createdAt: string;
  updatedAt: string;
  noteTags?: NoteTag[];
  collaborators?: Collaborator[];
  isPinned?: boolean;
  role?: "editor" | "viewer";
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  isArchived?: boolean;
  isPublic?: boolean;
  tags?: string[];
}

export type NoteQueryData = { note?: Note; data?: Note } | undefined;
