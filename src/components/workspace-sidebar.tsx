"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotes } from "@/hooks";
import {
  Plus,
  Search,
  Trash2,
  Users,
  Pin,
  MoreHorizontal,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface WorkspaceSidebarProps {
  selectedNoteId?: string;
  onSelectNote?: (id: string) => void;
  onCreateNote?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function WorkspaceSidebar({
  selectedNoteId,
  onSelectNote,
  onCreateNote,
  searchQuery,
  onSearchChange,
}: WorkspaceSidebarProps) {
  const { data: notesData, isLoading } = useNotes({ query: searchQuery });
  const notes = notesData?.data || [];

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

  const pinnedNotes = notes.filter((n: any) => n.isPinned);
  const unpinnedNotes = notes.filter((n: any) => !n.isPinned);

  return (
    <div className="flex flex-col h-full bg-muted/20 dark:bg-card/40 backdrop-blur-xl border-r border-border/50 w-72 lg:w-80 shrink-0">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            Notes
          </h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={onCreateNote}
            className="h-8 w-8 rounded-lg bg-accent/5 hover:bg-accent/10 text-accent transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-accent transition-colors" />
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
                      formatTime={formatTime}
                    />
                  ))}
                </div>
              </div>

              {notes.length === 0 && (
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground/30 mb-3">
                    <Search className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {searchQuery ? "No results found" : "No notes yet"}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border/50">
        <div className="flex flex-col gap-1">
          <SidebarAction icon={Trash2} label="Trash" count={0} />
          <SidebarAction icon={Users} label="Shared" count={0} />
        </div>
      </div>
    </div>
  );
}

function NoteItem({ note, isSelected, onSelect, formatTime }: any) {
  return (
    <button
      onClick={onSelect}
      className={`w-full group text-left p-3 rounded-xl transition-all relative ${
        isSelected
          ? "bg-accent/[0.08] border border-accent/20 shadow-sm"
          : "hover:bg-muted/50 border border-transparent"
      }`}
    >
      {isSelected && (
        <div className="absolute left-1 top-3 bottom-3 w-1 bg-accent rounded-full" />
      )}
      <div className="flex justify-between items-start mb-1">
        <h4
          className={`text-sm font-bold truncate pr-4 ${
            isSelected ? "text-accent" : "text-foreground"
          }`}
        >
          {note.title || "Untitled Note"}
        </h4>
        <span className="text-[10px] font-medium text-muted-foreground/60 whitespace-nowrap pt-0.5">
          {formatTime(note.updatedAt)}
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground line-clamp-1 leading-relaxed">
        {note.content || "No content yet"}
      </p>

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
            <DropdownMenuItem className="text-xs">Pin Note</DropdownMenuItem>
            <DropdownMenuItem className="text-xs">Duplicate</DropdownMenuItem>
            <DropdownMenuItem className="text-xs text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </button>
  );
}

function SidebarAction({ icon: Icon, label, count }: any) {
  return (
    <button className="flex items-center justify-between px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all w-full">
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-semibold">{label}</span>
      </div>
      {count > 0 && (
        <span className="text-[10px] font-bold bg-muted-foreground/10 px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
}

