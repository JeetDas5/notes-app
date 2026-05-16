"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CreateNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, content: string, tags: string[]) => void;
  isCreating: boolean;
}

export function CreateNoteDialog({ isOpen, onClose, onCreate, isCreating }: CreateNoteDialogProps) {
  const [title, setTitle] = useState("New Note");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle("New Note");
      setContent("");
      setTags("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
    onCreate(title, content, tagsArray);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
          <DialogDescription>
            Give your new note a title and some initial content.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-semibold bg-background/50"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Start typing your masterpiece..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="resize-none h-32 bg-background/50"
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-background/50 text-xs"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !title.trim()} className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-sm">
              {isCreating ? "Creating..." : "Create Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
