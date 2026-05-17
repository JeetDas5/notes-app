import { create } from "zustand";

interface DashboardState {
  searchQuery: string;
  selectedTag: string | null;

  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  searchQuery: "",
  selectedTag: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedTag: (tag) => set({ selectedTag: tag }),
}));
