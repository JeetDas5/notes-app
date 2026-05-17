import { create } from "zustand";

export interface CollaboratorUser {
  socketId: string;
  userId: string;
  name: string;
  email: string;
  color: string;
  cursor?: number;
}

interface CollaborationState {
  // Socket connection
  isConnected: boolean;

  // Active users in current note room
  activeUsers: CollaboratorUser[];

  // Current note being collaborated on
  currentNoteId: string | null;

  // Pending remote update (to apply to editor without re-triggering emit)
  pendingRemoteUpdate: {
    title?: string;
    content?: string;
    senderId?: string;
  } | null;

  // Actions
  setConnected: (connected: boolean) => void;
  setActiveUsers: (users: CollaboratorUser[]) => void;
  setCurrentNoteId: (noteId: string | null) => void;
  setPendingRemoteUpdate: (
    update: { title?: string; content?: string; senderId?: string } | null
  ) => void;
  clearPendingRemoteUpdate: () => void;
  reset: () => void;
}

export const useCollaborationStore = create<CollaborationState>()((set) => ({
  isConnected: false,
  activeUsers: [],
  currentNoteId: null,
  pendingRemoteUpdate: null,

  setConnected: (connected) => set({ isConnected: connected }),
  setActiveUsers: (users) => set({ activeUsers: users }),
  setCurrentNoteId: (noteId) => set({ currentNoteId: noteId }),
  setPendingRemoteUpdate: (update) => set({ pendingRemoteUpdate: update }),
  clearPendingRemoteUpdate: () => set({ pendingRemoteUpdate: null }),
  reset: () =>
    set({
      isConnected: false,
      activeUsers: [],
      currentNoteId: null,
      pendingRemoteUpdate: null,
    }),
}));
