"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { WorkspaceHeader } from "@/components/workspace-header";
import { WorkspaceSidebar } from "@/components/workspace-sidebar";
import { EditorPanel } from "@/components/editor-panel";
import { AIPanel, AIOpenTab } from "@/components/ai-panel";
import {
  useNotes,
  useCreateNote,
  useDebounce,
  useDeleteNote,
  useUpdateNoteStatus,
  useCurrentUser,
  useSharedNotes,
  type SharedNote,
} from "@/hooks";

import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { CreateNoteDialog } from "@/components/create-note-dialog";
import { toast } from "sonner";
import { useNotesStore } from "@/store";
import { Note } from "@/types";

export function NotesWorkspace() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const { data: userData } = useCurrentUser();
  const currentUserId = userData?.user?.id;

  const {
    selectedNoteId,
    setSelectedNoteId,
    searchQuery,
    setSearchQuery,
    view,
    setView,
    showAIPanel,
    setShowAIPanel,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
  } = useNotesStore();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: notesData, isLoading: isNotesLoading } = useNotes({
    query: debouncedSearchQuery,
    archived: view === "archived",
  });
  const { data: sharedNotesData, isLoading: isLoadingShared } =
    useSharedNotes();
  const { mutate: createNote, isPending: isCreateNotePending } =
    useCreateNote();
  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: updateNoteStatus } = useUpdateNoteStatus();

  const ownNotes = notesData?.data || [];
  const sharedNotes = sharedNotesData?.data || [];

  const allNotes = [...ownNotes, ...sharedNotes];

  useEffect(() => {
    if (id) {
      setSelectedNoteId(id);
    }
  }, [id]);

  useEffect(() => {
    if (ownNotes.length > 0 && !selectedNoteId && !searchQuery && !id) {
      setSelectedNoteId(ownNotes[0].id);
      router.replace(`/notes/${ownNotes[0].id}`);
    }
  }, [ownNotes, selectedNoteId, searchQuery, id, router]);

  const selectedNote = allNotes.find(
    (n: Note | SharedNote) => n.id === selectedNoteId
  ) as Note | SharedNote | undefined;

  const isOwner = selectedNote ? selectedNote.userId === currentUserId : false;

  const sharedNote = sharedNotes.find(
    (n: SharedNote) => n.id === selectedNoteId
  );
  const collaboratorRole: "editor" | "viewer" | null = isOwner
    ? null
    : sharedNote
    ? (sharedNote.collaboratorRole as "editor" | "viewer")
    : null;

  const isReadOnly = !isOwner && collaboratorRole === "viewer";

  const isAllLoading = isNotesLoading || isLoadingShared;

  useEffect(() => {
    if (!isAllLoading && selectedNoteId && !selectedNote) {
      toast.error("Note not found");
      setSelectedNoteId(undefined);
      router.replace("/notes");
    }
  }, [isAllLoading, selectedNoteId, selectedNote, router, setSelectedNoteId]);

  const handleCreateNote = () => {
    setIsCreateDialogOpen(true);
  };

  const handleConfirmCreate = (
    title: string,
    content: string,
    tags: string[]
  ) => {
    createNote(
      { title, content, tags },
      {
        onSuccess: (data) => {
          setSelectedNoteId(data.data.id);
          setIsCreateDialogOpen(false);
          router.push(`/notes/${data.data.id}`);
        },
      }
    );
  };

  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    router.push(`/notes/${noteId}`);
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId, {
      onSuccess: () => {
        if (selectedNoteId === noteId) {
          setSelectedNoteId(undefined);
          router.push("/notes");
        }
      },
    });
  };

  const handleShareNote = (noteId: string) => {
    const note = ownNotes.find((n: Note) => n.id === noteId);
    if (!note) return;

    if (!note.isPublic) {
      updateNoteStatus({ id: noteId, data: { isPublic: true } });
    }

    const url = `${window.location.origin}/share/${note.shareId}`;
    navigator.clipboard.writeText(url);
    toast.success("Public link copied to clipboard");
  };

  const handleToggleArchive = (noteId: string) => {
    const note = ownNotes.find((n: Note) => n.id === noteId);
    if (!note) return;

    updateNoteStatus(
      { id: noteId, data: { isArchived: !note.isArchived } },
      {
        onSuccess: () => {
          toast.success(note.isArchived ? "Note unarchived" : "Note archived");
        },
      }
    );
  };

  if (isNotesLoading && !notesData && !searchQuery) {
    return <NotesSkeleton />;
  }

  const sidebarNotes = view === "shared" ? [] : ownNotes;

  return (
    <div className="flex h-screen flex-col bg-background">
      <WorkspaceHeader
        noteTitle={selectedNote?.title || "No Note Selected"}
        noteId={selectedNoteId}
        isOwner={isOwner}
        collaboratorRole={collaboratorRole}
      />

      <div className="flex flex-1 overflow-hidden">
        <WorkspaceSidebar
          notes={sidebarNotes}
          isLoading={isNotesLoading}
          selectedNoteId={selectedNoteId}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote}
          onDeleteNote={handleDeleteNote}
          onShareNote={handleShareNote}
          onToggleArchive={handleToggleArchive}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          view={view as "all" | "archived" | "shared"}
          onViewChange={(v) => setView(v as "all" | "archived")}
        />

        <div className="flex-1 flex flex-col min-w-0 bg-background/50 dark:bg-background/20">
          {selectedNote ? (
            <EditorPanel
              key={selectedNote.id}
              initialTitle={selectedNote.title || ""}
              initialContent={selectedNote.content || ""}
              initialTags={
                selectedNote.noteTags
                  ?.map((nt) => nt.tag?.name)
                  .filter((name): name is string => !!name) || []
              }
              noteId={selectedNote.id}
              readOnly={isReadOnly}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 opacity-50">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-foreground/70">
                {selectedNoteId ? "Loading note..." : "No note selected"}
              </h3>
              <p className="max-w-xs mt-2 text-sm">
                {selectedNoteId
                  ? "We're just fetching your new note."
                  : "Select a note from the sidebar or create a new one to start your masterpiece."}
              </p>
            </div>
          )}
        </div>

        {/* AI Panel — show panel or collapsed tab */}
        {selectedNote &&
          (showAIPanel ? (
            <AIPanel
              isOpen={true}
              onClose={() => setShowAIPanel(false)}
              noteId={selectedNote.id}
            />
          ) : (
            <AIOpenTab onClick={() => setShowAIPanel(true)} />
          ))}
      </div>

      <CreateNoteDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onCreate={handleConfirmCreate}
        isCreating={isCreateNotePending}
      />
    </div>
  );
}

function NotesSkeleton() {
  return (
    <div className="flex h-screen flex-col">
      <Skeleton className="h-14 w-full" />
      <div className="flex flex-1 overflow-hidden">
        <Skeleton className="h-full w-80 shrink-0" />
        <div className="flex-1 p-8 space-y-6">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-[600px] w-full" />
        </div>
        <Skeleton className="h-full w-80 shrink-0" />
      </div>
    </div>
  );
}
