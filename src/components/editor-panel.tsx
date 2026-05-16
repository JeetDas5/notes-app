"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useUpdateNote } from "@/hooks";
import {
  Bold,
  Italic,
  Underline,
  List,
  Sparkles,
  Save,
  CheckCircle2,
  CloudUpload,
} from "lucide-react";
import { toast } from "sonner";
import { debounce } from "lodash";

interface EditorPanelProps {
  initialTitle?: string;
  initialContent?: string;
  onSave?: (title: string, content: string) => void;
  noteId?: string;
}

export function EditorPanel({
  initialTitle = "",
  initialContent = "",
  onSave,
  noteId,
}: EditorPanelProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const { mutate: updateNote, isPending: isSaving } = useUpdateNote(
    noteId || ""
  );

  useEffect(() => {
    if (initialTitle !== title) {
      setTitle(initialTitle);
    }
  }, [initialTitle]);

  const debouncedSave = useCallback(
    debounce((newTitle: string, newContent: string) => {
      if (!noteId) return;
      updateNote({ title: newTitle, content: newContent });
    }, 2000),
    [noteId, updateNote]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedSave(newTitle, content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    debouncedSave(title, newContent);
  };

  const handleManualSave = () => {
    if (!noteId) return;
    updateNote(
      { title, content },
      {
        onSuccess: () => {
          toast.success("Note saved manually");
          onSave?.(title, content);
        },
      }
    );
  };

  return (
    <div className="flex flex-col h-full bg-background/50">
      <div className="flex items-center justify-between p-3 border-b border-border/50 bg-background/40 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <ToolbarButton icon={Bold} />
          <ToolbarButton icon={Italic} />
          <ToolbarButton icon={Underline} />
          <div className="w-px h-4 bg-border/50 mx-1.5" />
          <ToolbarButton icon={List} />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs font-bold gap-2 text-accent hover:bg-accent/10 hover:text-accent"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Format
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            {isSaving ? (
              <>
                <CloudUpload className="w-3 h-3 animate-pulse" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                Saved
              </>
            )}
          </div>
          <Button
            size="sm"
            className="h-8 bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-sm"
            onClick={handleManualSave}
            disabled={isSaving || !noteId}
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Save
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col p-6 max-w-4xl mx-auto w-full">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Note Title"
          className="text-3xl font-bold bg-transparent border-0 focus-visible:ring-0 px-0 mb-4 placeholder:text-muted-foreground/50"
        />
        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing your masterpiece..."
          className="flex-1 resize-none bg-transparent font-sans text-base leading-relaxed p-0 border-0 focus-visible:ring-0 placeholder:text-muted-foreground/30 selection:bg-accent/20"
        />
      </div>
    </div>
  );
}

function ToolbarButton({ icon: Icon, onClick }: any) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
      onClick={onClick}
    >
      <Icon className="w-3.5 h-3.5" />
    </Button>
  );
}
