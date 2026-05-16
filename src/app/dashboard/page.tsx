"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser, useNotes, useDebounce } from "@/hooks";
import { Input } from "@/components/ui/input";
import {
  Plus,
  FileText,
  Users,
  Clock,
  Search,
  ChevronRight,
  NotebookPen,
  Tag,
} from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { data: userData, isLoading: isUserLoading } = useCurrentUser();
  const { data: notesData, isLoading: isNotesLoading } = useNotes({
    query: debouncedSearchQuery,
    tag: selectedTag || undefined,
  });

  const { data: allNotesData } = useNotes({});
  const allNotes = allNotesData?.data || [];

  const tagCounts = allNotes.reduce((acc: Record<string, number>, note: any) => {
    note.noteTags?.forEach((nt: any) => {
      const tagName = nt.tag?.name;
      if (tagName) {
        acc[tagName] = (acc[tagName] || 0) + 1;
      }
    });
    return acc;
  }, {});

  const mostUsedTags = Object.entries(tagCounts)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 10);

  const user = userData?.user;
  const notes = notesData?.data || [];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if ((isUserLoading || isNotesLoading) && !notesData && !searchQuery && !selectedTag) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground shadow-lg shadow-accent/20 group-hover:rotate-6 transition-transform">
                <NotebookPen className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
                NotesAI
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-0.5 rounded-full bg-muted/50 border border-border/50 focus-within:ring-1 focus-within:ring-accent/50 transition-all">
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 w-28 md:w-40 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-xs p-0"
                />
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
              <ThemeToggle />
              <div className="h-4 w-px bg-border/50" />
              <Avatar className="h-8 w-8 border border-border/50">
                <AvatarFallback className="bg-accent/10 text-accent text-xs font-bold uppercase">
                  {user?.name?.[0] || user?.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Dashboard
            </h2>
            <p className="text-muted-foreground mt-1">
              Welcome back,{" "}
              <span className="text-foreground font-medium">
                {user?.name || user?.email?.split("@")[0]}
              </span>
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-95"
            >
              <Link href="/notes" className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Create Note
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          <StatCard
            title="Total Notes"
            value={notes.length}
            icon={FileText}
            description="Across all your projects"
            delay={0.1}
          />
          <StatCard
            title="Team Activity"
            value="Active"
            icon={Users}
            description="Collaborating with 5+ members"
            delay={0.2}
          />
          <StatCard
            title="Recent Edits"
            value={
              notes.filter(
                (n: any) =>
                  new Date(n.updatedAt).getTime() > Date.now() - 86400000 * 7
              ).length
            }
            icon={Clock}
            description="Modified this week"
            delay={0.3}
          />
        </div>

        {mostUsedTags.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">
                Most Used Tags
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(null)}
                className={`rounded-full px-4 h-8 text-xs font-bold transition-all ${
                  selectedTag === null
                    ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                    : "border-border/50 hover:bg-accent/5 hover:border-accent/50"
                }`}
              >
                All Notes
              </Button>
              {mostUsedTags.map(([tag]: any) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`rounded-full px-4 h-8 text-xs font-bold transition-all ${
                    selectedTag === tag
                      ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                      : "border-border/50 hover:bg-accent/5 hover:border-accent/50"
                  }`}
                >
                  #{tag}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : selectedTag
                ? `Notes tagged with "#${selectedTag}"`
                : "Recent Notes"}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-muted-foreground hover:text-foreground"
            >
              <Link
                href="/notes"
                className="flex items-center gap-1 text-xs uppercase tracking-widest font-bold"
              >
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </Button>
          </div>

          {notes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {notes.slice(0, 6).map((note: any, idx: number) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <Link href={`/notes/${note.id}`} className="block group">
                    <Card className="h-full p-6 border-border/50 bg-card/40 hover:bg-accent/2 hover:border-gray-500 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-accent/5 group">
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:scale-110 transition-transform duration-300">
                              <FileText className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                              {formatDate(note.updatedAt)}
                            </span>
                          </div>
                          <h4 className="font-bold text-lg mb-2 group-hover:text-gray-500 transition-colors line-clamp-1">
                            {note.title}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {note.content || "No content yet..."}
                          </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {note.noteTags?.slice(0, 2).map((nt: any) => (
                              <span
                                key={nt.tag?.id}
                                className="px-1.5 py-0.5 rounded-md bg-accent/10 text-accent text-[9px] font-bold uppercase tracking-wider"
                              >
                                {nt.tag?.name}
                              </span>
                            ))}
                            {note.noteTags?.length > 2 && (
                              <span className="text-[9px] font-bold text-muted-foreground/60 pt-0.5">
                                +{note.noteTags.length - 2}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            EDIT NOW <ChevronRight className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-dashed border-border/50 bg-muted/20"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/5 flex items-center justify-center text-accent/20 mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-2">
                {searchQuery ? "No results found" : "No notes yet"}
              </h4>
              <p className="text-muted-foreground max-w-xs mb-8">
                {searchQuery
                  ? `We couldn't find any notes matching "${searchQuery}". Try a different search term.`
                  : selectedTag
                  ? `No notes found with the tag "#${selectedTag}".`
                  : "Create your first AI-powered note to start organizing your thoughts more effectively."}
              </p>
              <Button
                asChild
                className="bg-accent text-accent-foreground font-bold"
              >
                <Link href="/notes">Create your first note</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, description, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="p-6 border-border/50 bg-card/40 backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
          <Icon className="w-16 h-16" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              {title}
            </div>
            <div className="text-2xl font-bold tracking-tight">{value}</div>
          </div>
        </div>
        <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
          {description}
        </div>
      </Card>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-12 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-40" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
