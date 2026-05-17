"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGenerateAI, useUpdateNote } from "@/hooks";
import { BrainCircuit, Bot, Zap, X, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AIPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  noteId?: string;
}

export function AIPanel({ isOpen = true, onClose, noteId }: AIPanelProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [suggestedTitle, setSuggestedTitle] = useState<string | null>(null);
  const { mutate: generateAI, isPending: isLoading } = useGenerateAI();
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote(
    noteId || ""
  );

  useEffect(() => {
    setSummary(null);
    setSuggestedTitle(null);
  }, [noteId]);

  const handleSummarize = () => {
    if (!noteId || isLoading) return;

    generateAI(noteId, {
      onSuccess: (data) => {
        setSummary(data.data.summary);
        setSuggestedTitle(
          data.data.suggested_title || data.data.aiSuggestedTitle
        );
      },
    });
  };

  const handleApplyTitle = () => {
    if (!suggestedTitle || !noteId) return;
    updateNote({ title: suggestedTitle });
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full bg-card/40 backdrop-blur-2xl border-l border-border/50 w-80 lg:w-96 shrink-0 shadow-2xl">
      <div className="p-4 border-b border-border/50 bg-background/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center shadow-inner shrink-0">
            <BrainCircuit className="w-5 h-5 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm tracking-tight">AI Insights</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
              Note Summarizer
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all shrink-0 cursor-pointer"
              aria-label="Close AI panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6 flex flex-col h-full">
          {!summary && !isLoading && (
            <div className="text-center py-10 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center opacity-50">
                <Bot className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground max-w-[200px]">
                Generate a quick summary of your note to grasp the key concepts.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center py-10">
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-1.5 items-center h-5">
                  <span className="w-2 h-2 rounded-full bg-accent animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0.4s]" />
                </div>
                <p className="text-xs text-muted-foreground font-medium animate-pulse">
                  Analyzing your note...
                </p>
              </div>
            </div>
          )}

          <AnimatePresence>
            {summary && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {suggestedTitle && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-accent" />
                      <h4 className="font-bold text-sm">Suggested Title</h4>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/5 border border-accent/10">
                      <span
                        className="text-sm font-semibold flex-1 truncate"
                        title={suggestedTitle}
                      >
                        {suggestedTitle}
                      </span>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleApplyTitle}
                        disabled={isUpdating}
                        className="h-7 text-[10px] uppercase tracking-wider font-bold"
                      >
                        {isUpdating ? "..." : "Apply"}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" />
                    <h4 className="font-bold text-sm">Summary</h4>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 text-sm leading-relaxed text-foreground shadow-sm">
                    {summary}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <div className="p-4 bg-background/20 border-t border-border/50">
        <Button
          onClick={handleSummarize}
          disabled={isLoading || !noteId}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-sm h-10"
        >
          <Zap className="w-4 h-4 mr-2" />
          {isLoading ? "Summarizing..." : "Summarize Note"}
        </Button>
      </div>
    </div>
  );
}

// Collapsable AI sidepanel
export function AIOpenTab({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1.5 w-9 h-full bg-card/30 border-l border-border/50 hover:bg-accent/10 hover:border-accent/30 transition-all group shrink-0 cursor-pointer"
      aria-label="Open AI panel"
    >
      <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground group-hover:text-black dark:group-hover:text-white transition-colors" />
      <span
        className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-black dark:group-hover:text-white transition-colors"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        AI
      </span>
      <BrainCircuit className="w-3.5 h-3.5 text-muted-foreground group-hover:text-black dark:group-hover:text-white transition-colors" />
    </button>
  );
}
