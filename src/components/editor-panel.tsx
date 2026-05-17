"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useUpdateNote, useCollaboration, useCurrentUser } from "@/hooks";
import {
  Save,
  CloudUpload,
  Tag,
  X,
  CheckCircle2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { debounce } from "lodash";
import { motion, AnimatePresence } from "framer-motion";

interface EditorPanelProps {
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
  onSave?: (title: string, content: string, tags: string[]) => void;
  noteId?: string;
  readOnly?: boolean;
}

export function EditorPanel({
  initialTitle = "",
  initialContent = "",
  initialTags = [],
  onSave,
  noteId,
  readOnly = false,
}: EditorPanelProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState("");
  const [remoteTypingUser, setRemoteTypingUser] = useState<string | null>(null);
  const remoteTypingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: userData } = useCurrentUser();
  const userId = userData?.user?.id;
  const userName = userData?.user?.name;
  const userEmail = userData?.user?.email;

  const { mutate: updateNote, isPending: isSaving } = useUpdateNote(noteId || "");

  // Sync when note changes externally (switching notes)
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setTags(initialTags);
  }, [noteId]);

  // Debounced save to database
  const debouncedSave = useCallback(
    debounce((newTitle: string, newContent: string, newTags: string[]) => {
      if (!noteId) return;
      updateNote({ title: newTitle, content: newContent, tags: newTags });
    }, 2000),
    [noteId, updateNote]
  );

  // Real-time collaboration
  const { emitContentChange } = useCollaboration({
    noteId,
    userId,
    userName,
    userEmail,
    onRemoteUpdate: useCallback(
      (data: { title?: string; content?: string; senderId: string }) => {
        if (data.title !== undefined) {
          setTitle(data.title);
        }
        if (data.content !== undefined) {
          setContent(data.content);
        }
        // Show typing indicator
        setRemoteTypingUser(data.senderId);
        if (remoteTypingTimeout.current) {
          clearTimeout(remoteTypingTimeout.current);
        }
        remoteTypingTimeout.current = setTimeout(() => {
          setRemoteTypingUser(null);
        }, 2500);
      },
      []
    ),
  });

  // Debounced emit to other collaborators
  const debouncedEmit = useCallback(
    debounce((newTitle: string, newContent: string) => {
      emitContentChange(newTitle, newContent);
    }, 150),
    [emitContentChange]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedSave(newTitle, content, tags);
    debouncedEmit(newTitle, content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;
    const newContent = e.target.value;
    setContent(newContent);
    debouncedSave(title, newContent, tags);
    debouncedEmit(title, newContent);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (readOnly) return;
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
          toast.success("Note saved");
          onSave?.(title, content, tags);
        },
      }
    );
  };

  return (
    <div className="flex flex-col h-full bg-background/50 relative">
      {/* View-only banner */}
      {readOnly && (
        <div className="flex items-center justify-center gap-2 py-2 px-4 bg-amber-500/10 border-b border-amber-500/20 text-amber-600 dark:text-amber-400">
          <Eye className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-widest">
            View Only — you have read access to this note
          </span>
        </div>
      )}

      {/* Editor toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border/50 bg-background/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {/* Remote typing indicator */}
          <AnimatePresence>
            {remoteTypingUser && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="flex items-center gap-1.5 text-[10px] font-bold text-accent/80 px-2 py-1 rounded-full bg-accent/10"
              >
                <span className="flex gap-0.5 items-center h-3">
                  <span className="w-1 h-1 rounded-full bg-accent animate-bounce" />
                  <span className="w-1 h-1 rounded-full bg-accent animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1 h-1 rounded-full bg-accent animate-bounce [animation-delay:0.3s]" />
                </span>
                Someone is typing
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3">
          {!readOnly && (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Editor body */}
      <div className="flex-1 overflow-hidden flex flex-col py-4 px-5 max-w-4xl mx-auto w-full">
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder="Note Title"
          readOnly={readOnly}
          disabled={readOnly}
          className={`text-3xl font-bold bg-transparent border-0 focus-visible:ring-0 px-0 mb-2 placeholder:text-muted-foreground/50 ${
            readOnly ? "cursor-default select-text opacity-90" : ""
          }`}
        />

        <div className="flex flex-wrap gap-2 mb-6 items-center">
          {!readOnly && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/30 text-muted-foreground">
              <Tag className="w-3.5 h-3.5" />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag..."
                className="bg-transparent border-none focus:ring-0 text-xs w-20 placeholder:text-muted-foreground/40 p-0.5 outline-none"
              />
            </div>
          )}
          <AnimatePresence>
            {tags.map((tag) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-accent/10 text-gray-500 text-xs font-bold uppercase tracking-wider group"
              >
                {tag}
                {!readOnly && (
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-foreground transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder={readOnly ? "" : "Start typing your masterpiece..."}
          readOnly={readOnly}
          disabled={readOnly}
          className={`flex-1 resize-none bg-transparent font-sans text-base leading-relaxed p-2 border-0 focus-visible:ring-0 placeholder:text-muted-foreground/30 selection:bg-accent/20 ${
            readOnly ? "cursor-default" : ""
          }`}
        />
      </div>
    </div>
  );
}
