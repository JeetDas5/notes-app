"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { WorkspaceHeader } from "@/components/workspace-header";
import { WorkspaceSidebar } from "@/components/workspace-sidebar";
import { EditorPanel } from "@/components/editor-panel";
import { AIPanel } from "@/components/ai-panel";
import { useNotes, useCreateNote, useDebounce, useDeleteNote, useUpdateNoteStatus } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { CreateNoteDialog } from "@/components/create-note-dialog";
import { toast } from "sonner";
import { useNotesStore } from "@/store";

export function NotesWorkspace() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  const {
    selectedNoteId,
    setSelectedNoteId,
    searchQuery,
    setSearchQuery,
    view,
    setView,
    showAIPanel,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
  } = useNotesStore();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: notesData, isLoading: isNotesLoading } = useNotes({
    query: debouncedSearchQuery,
    archived: view === "archived",
  });
  const { mutate: createNote, isPending: isCreateNotePending } = useCreateNote();
  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: updateNoteStatus } = useUpdateNoteStatus();

  const notes = notesData?.data || [];

  // Update selected note when URL param changes
  useEffect(() => {
    if (id) {
      setSelectedNoteId(id);
    }
  }, [id]);

  // Handle initial selection if no ID in URL
  useEffect(() => {
    if (notes.length > 0 && !selectedNoteId && !searchQuery && !id) {
      setSelectedNoteId(notes[0].id);
      router.replace(`/notes/${notes[0].id}`);
    }
  }, [notes, selectedNoteId, searchQuery, id, router]);

  const selectedNote = notes.find((n: any) => n.id === selectedNoteId);

  const handleCreateNote = () => {
    setIsCreateDialogOpen(true);
  };

  const handleConfirmCreate = (title: string, content: string, tags: string[]) => {
    createNote({ title, content, tags }, {
      onSuccess: (data) => {
        setSelectedNoteId(data.data.id);
        setIsCreateDialogOpen(false);
        router.push(`/notes/${data.data.id}`);
      }
    });
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
    const note = notes.find((n: any) => n.id === noteId);
    if (!note) return;

    if (!note.isPublic) {
      updateNoteStatus({ id: noteId, data: { isPublic: true } });
    }

    const url = `${window.location.origin}/share/${note.shareId}`;
    navigator.clipboard.writeText(url);
    toast.success("Public link copied to clipboard");
  };

  const handleToggleArchive = (noteId: string) => {
    const note = notes.find((n: any) => n.id === noteId);
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

  return (
    <div className="flex h-screen flex-col bg-background">
      <WorkspaceHeader
        noteTitle={selectedNote?.title || "No Note Selected"}
      />

      <div className="flex flex-1 overflow-hidden">
        <WorkspaceSidebar
          notes={notes}
          isLoading={isNotesLoading}
          selectedNoteId={selectedNoteId}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote}
          onDeleteNote={handleDeleteNote}
          onShareNote={handleShareNote}
          onToggleArchive={handleToggleArchive}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          view={view}
          onViewChange={setView}
        />

        <div className="flex-1 flex flex-col min-w-0 bg-background/50 dark:bg-background/20">
          {selectedNote ? (
            <EditorPanel
              key={selectedNote.id}
              initialTitle={selectedNote.title || ""}
              initialContent={selectedNote.content || ""}
              initialTags={selectedNote.noteTags?.map((nt: any) => nt.tag?.name) || []}
              noteId={selectedNote.id}
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

        {showAIPanel && selectedNote && (
          <AIPanel 
            isOpen={showAIPanel} 
            noteId={selectedNote.id}
          />
        )}
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
