type ParsedAIResponse = {
  summary: string;
  action_items: string[];
  suggested_title: string;
};

type Note = {
  id: string;
  userId: string;
  title: string;
  content: string;
  isArchived: boolean;
  isPublic: boolean;
  shareId: string;
  aiSummary?: string;
  aiSuggestedTitle?: string;
  actionItems?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
};

type UpdateNoteData = {
  title?: string;
  content?: string;
  isArchived?: boolean;
  isPublic?: boolean;
  tags?: string[];
}

type NoteQueryData = { note?: Note; data?: Note } | undefined;