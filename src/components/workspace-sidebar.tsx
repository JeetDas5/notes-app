/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Search,
  Archive,
  Pin,
  MoreHorizontal,
  FileText,
  Users2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useSharedNotes, type SharedNote } from "@/hooks";
import { motion, AnimatePresence } from "framer-motion";

interface WorkspaceSidebarProps {
  notes: any[];
  isLoading: boolean;
  selectedNoteId?: string;
  onSelectNote?: (id: string) => void;
  onCreateNote?: () => void;
  onDeleteNote?: (id: string) => void;
  onShareNote?: (id: string) => void;
  onToggleArchive?: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  view: "all" | "archived" | "shared";
  onViewChange: (view: "all" | "archived" | "shared") => void;
}

export function WorkspaceSidebar({
  notes,
  isLoading,
  selectedNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  onShareNote,
  onToggleArchive,
  searchQuery,
  onSearchChange,
  view,
  onViewChange,
}: WorkspaceSidebarProps) {
  const { data: sharedNotesData, isLoading: isLoadingShared } =
    useSharedNotes();
  const sharedNotes = sharedNotesData?.data || [];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const filteredNotes = notes.filter((n: any) =>
    view === "archived" ? n.isArchived : !n.isArchived
  );

  const pinnedNotes = filteredNotes.filter((n: any) => n.isPinned);
  const unpinnedNotes = filteredNotes.filter((n: any) => !n.isPinned);

  const archivedCount = notes.filter((n: any) => n.isArchived).length;

  return (
    <div className="flex flex-col h-full bg-muted/20 dark:bg-card/40 backdrop-blur-xl border-r border-border/50 w-72 lg:w-80 shrink-0">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500 dark:text-white" />
            Notes
          </h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={onCreateNote}
            className="h-8 w-8 rounded-lg bg-accent/5 hover:bg-accent/10 text-accent transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-gray-500 dark:text-white" />
          </Button>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 dark:text-white group-focus-within:text-gray-500 transition-colors" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 pl-9 text-xs bg-background/50 border-border/50 focus-visible:ring-1 focus-visible:ring-accent/50 focus-visible:border-accent/50 transition-all rounded-lg"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3">
          {/* My Notes */}
          {view !== "shared" && (
            <>
              {isLoading ? (
                <div className="space-y-3 px-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-3/4 rounded" />
                      <Skeleton className="h-3 w-1/2 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {pinnedNotes.length > 0 && (
                    <div className="mb-6">
                      <p className="text-[10px] font-bold text-muted-foreground/60 px-2 mb-3 uppercase tracking-widest flex items-center gap-2">
                        <Pin className="w-2.5 h-2.5" /> Pinned
                      </p>
                      <div className="space-y-1">
                        {pinnedNotes.map((note: any) => (
                          <NoteItem
                            key={note.id}
                            note={note}
                            isSelected={selectedNoteId === note.id}
                            onSelect={() => onSelectNote?.(note.id)}
                            onDelete={() => onDeleteNote?.(note.id)}
                            onShare={() => onShareNote?.(note.id)}
                            onToggleArchive={() => onToggleArchive?.(note.id)}
                            formatTime={formatTime}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    {pinnedNotes.length > 0 && (
                      <p className="text-[10px] font-bold text-muted-foreground/60 px-2 mb-3 uppercase tracking-widest">
                        All Notes
                      </p>
                    )}
                    <div className="space-y-1">
                      {unpinnedNotes.map((note: any) => (
                        <NoteItem
                          key={note.id}
                          note={note}
                          isSelected={selectedNoteId === note.id}
                          onSelect={() => onSelectNote?.(note.id)}
                          onDelete={() => onDeleteNote?.(note.id)}
                          onShare={() => onShareNote?.(note.id)}
                          onToggleArchive={() => onToggleArchive?.(note.id)}
                          formatTime={formatTime}
                        />
                      ))}
                    </div>
                  </div>

                  {filteredNotes.length === 0 && (
                    <div className="text-center py-12 flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground/30 mb-3">
                        <Search className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">
                        {searchQuery
                          ? "No results found"
                          : view === "archived"
                          ? "No archived notes"
                          : "No notes yet"}
                      </p>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* Shared With Me */}
          {view === "shared" && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground/60 px-2 mb-3 uppercase tracking-widest flex items-center gap-2">
                <Users2 className="w-2.5 h-2.5" /> Shared with me
              </p>

              {isLoadingShared ? (
                <div className="space-y-3 px-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-3/4 rounded" />
                      <Skeleton className="h-3 w-1/2 rounded" />
                    </div>
                  ))}
                </div>
              ) : sharedNotes.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground/30 mb-3">
                    <Users2 className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    No notes shared with you yet
                  </p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">
                    Ask a note owner to invite you
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {sharedNotes.map((note: SharedNote, idx) => (
                    <motion.button
                      key={note.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => onSelectNote?.(note.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all relative group ${
                        selectedNoteId === note.id
                          ? "bg-accent border border-accent/20 shadow-sm"
                          : "hover:bg-muted/50 border border-transparent"
                      }`}
                    >
                      {selectedNoteId === note.id && (
                        <div className="absolute left-1 top-3 bottom-3 w-1 bg-accent rounded-full" />
                      )}
                      <div className="flex justify-between items-start mb-1">
                        <h4
                          className={`text-sm font-bold truncate pr-4 ${
                            selectedNoteId === note.id
                              ? "text-gray-500"
                              : "text-foreground"
                          }`}
                        >
                          {note.title || "Untitled Note"}
                        </h4>
                      </div>
                      <div className="flex justify-between items-end gap-2">
                        <p className="text-[11px] text-muted-foreground line-clamp-1 leading-relaxed">
                          {note.content || "No content yet"}
                        </p>
                        <span className="text-[10px] font-medium text-muted-foreground/60 whitespace-nowrap pt-0.5">
                          {formatTime(note.updatedAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide ${
                            note.collaboratorRole === "editor"
                              ? "bg-accent/10 text-accent"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {note.collaboratorRole}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Bottom nav */}
      <div className="p-3 border-t border-border/50">
        <div className="flex flex-col gap-1">
          <SidebarAction
            icon={FileText}
            label="My Notes"
            isActive={view === "all"}
            onClick={() => onViewChange("all")}
          />
          <SidebarAction
            icon={Archive}
            label="Archived"
            isActive={view === "archived"}
            count={archivedCount}
            onClick={() => onViewChange("archived")}
          />
          <SidebarAction
            icon={Users2}
            label="Shared with me"
            isActive={view === "shared"}
            count={sharedNotes.length}
            onClick={() => onViewChange("shared")}
          />
        </div>
      </div>
    </div>
  );
}

function NoteItem({
  note,
  isSelected,
  onSelect,
  onDelete,
  onShare,
  onToggleArchive,
  formatTime,
}: any) {
  return (
    <button
      onClick={onSelect}
      className={`w-full group text-left p-3 rounded-xl transition-all relative ${
        isSelected
          ? "bg-accent border border-accent/20 shadow-sm"
          : "hover:bg-muted/50 border border-transparent"
      }`}
    >
      {isSelected && (
        <div className="absolute left-1 top-3 bottom-3 w-1 bg-accent rounded-full" />
      )}
      <div className="flex justify-between items-start mb-1">
        <h4
          className={`text-sm font-bold truncate pr-4 ${
            isSelected ? "text-gray-500" : "text-foreground"
          }`}
        >
          {note.title || "Untitled Note"}
        </h4>
      </div>
      <div className="flex justify-between items-end gap-2">
        <p className="text-[11px] text-muted-foreground line-clamp-1 leading-relaxed">
          {note.content || "No content yet"}
        </p>
        <span className="text-[10px] font-medium text-muted-foreground/60 whitespace-nowrap pt-0.5">
          {formatTime(note.updatedAt)}
        </span>
      </div>

      <div className="absolute right-1 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-md hover:bg-muted"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              className="text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
            >
              Share Link
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onToggleArchive();
              }}
            >
              {note.isArchived ? "Unarchive" : "Archive"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </button>
  );
}

function SidebarAction({ icon: Icon, label, count, isActive, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all w-full ${
        isActive
          ? "bg-gray-200/50 dark:bg-accent text-gray-700 dark:text-white font-bold cursor-pointer"
          : "text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Icon
          className={`w-4 h-4 ${
            isActive ? "text-gray-500 dark:text-white" : ""
          }`}
        />
        <span className="text-xs">{label}</span>
      </div>
      {count > 0 && (
        <span className="text-[10px] font-bold bg-muted-foreground/10 px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
}
