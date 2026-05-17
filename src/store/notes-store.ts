import { create } from "zustand";

interface NotesState {
  selectedNoteId: string | undefined;
  searchQuery: string;
  view: "all" | "archived";
  showAIPanel: boolean;
  isCreateDialogOpen: boolean;

  setSelectedNoteId: (id: string | undefined) => void;
  setSearchQuery: (query: string) => void;
  setView: (view: "all" | "archived") => void;
  setShowAIPanel: (show: boolean) => void;
  setIsCreateDialogOpen: (open: boolean) => void;
}

export const useNotesStore = create<NotesState>()((set) => ({
  selectedNoteId: undefined,
  searchQuery: "",
  view: "all",
  showAIPanel: true,
  isCreateDialogOpen: false,

  setSelectedNoteId: (id) => set({ selectedNoteId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setView: (view) => set({ view }),
  setShowAIPanel: (show) => set({ showAIPanel: show }),
  setIsCreateDialogOpen: (open) => set({ isCreateDialogOpen: open }),
}));
