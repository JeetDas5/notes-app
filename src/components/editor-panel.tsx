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
  CloudUpload,
  Tag,
  X,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { debounce } from "lodash";

interface EditorPanelProps {
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
  onSave?: (title: string, content: string, tags: string[]) => void;
  noteId?: string;
}

export function EditorPanel({
  initialTitle = "",
  initialContent = "",
  initialTags = [],
  onSave,
  noteId,
}: EditorPanelProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState("");

  const { mutate: updateNote, isPending: isSaving } = useUpdateNote(
    noteId || ""
  );

  useEffect(() => {
    if (initialTitle !== title) {
      setTitle(initialTitle);
    }
  }, [initialTitle]);

  const debouncedSave = useCallback(
    debounce((newTitle: string, newContent: string, newTags: string[]) => {
      if (!noteId) return;
      updateNote({ title: newTitle, content: newContent, tags: newTags });
    }, 2000),
    [noteId, updateNote]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedSave(newTitle, content, tags);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    debouncedSave(title, newContent, tags);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        const newTags = [...tags, newTag];
        setTags(newTags);
        debouncedSave(title, content, newTags);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((t) => t !== tagToRemove);
    setTags(newTags);
    debouncedSave(title, content, newTags);
  };

  const handleManualSave = () => {
    if (!noteId) return;
    updateNote(
      { title, content, tags },
      {
        onSuccess: () => {
          toast.success("Note saved manually");
          onSave?.(title, content, tags);
        },
      }
    );
  };

  return (
    <div className="flex flex-col h-full bg-background/50">
      <div className="flex items-center justify-end p-3 border-b border-border/50 bg-background/40 backdrop-blur-md">
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

      <div className="flex-1 overflow-hidden flex flex-col py-4 px-5 max-w-4xl mx-auto w-full">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Note Title"
          className="text-3xl font-bold bg-transparent border-0 focus-visible:ring-0 px-0 mb-2 placeholder:text-muted-foreground/50"
        />

        <div className="flex flex-wrap gap-2 mb-6 items-center">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/30 text-muted-foreground">
            <Tag className="w-3.5 h-3.5" />
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tag..."
              className="bg-transparent border-none focus:ring-0 text-xs w-20 placeholder:text-muted-foreground/40 p-0.5"
            />
          </div>
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-accent/10 text-gray-500 text-xs font-bold uppercase tracking-wider group"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing your masterpiece..."
          className="flex-1 resize-none bg-transparent font-sans text-base leading-relaxed p-2 border-0 focus-visible:ring-0 placeholder:text-muted-foreground/30 selection:bg-accent/20"
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
