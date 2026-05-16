import db from "@/db";
import { notes } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Calendar, NotebookPen, Clock, Share2 } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function SharedNotePage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;

  const note = await db.query.notes.findFirst({
    where: and(eq(notes.shareId, shareId), eq(notes.isPublic, true)),
  });

  if (!note) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 -z-10 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-accent/5 blur-[120px] -z-10 rounded-full" />

      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground shadow-lg shadow-accent/20 group-hover:rotate-6 transition-transform">
              <NotebookPen className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
              NotesAI
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent border border-accent/20 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
              <Share2 className="w-3 h-3" /> Shared Publicly
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 py-12">
        <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-2xl overflow-hidden rounded-3xl">
          <div className="p-8 sm:p-12">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-muted/50 text-[11px] font-bold uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(note.updatedAt)}
                  </div>
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-muted/50 text-[11px] font-bold uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    Last Updated
                  </div>
                </div>

                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
                  {note.title}
                </h1>
              </div>

              <div className="h-px w-full bg-linear-to-r from-border/50 via-border to-border/50 my-4" />

              <div className="max-w-none">
                <div className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap font-medium">
                  {note.content || "No content provided."}
                </div>
              </div>

              {note.aiSummary && (
                <div className="mt-4 p-6 rounded-2xl bg-accent/5 border border-accent/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Share2 className="w-12 h-12 text-accent" />
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-widest text-accent mb-3 flex items-center gap-2">
                    <NotebookPen className="w-4 h-4" /> AI Summary
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed relative z-10 font-medium">
                    {note.aiSummary}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm font-medium mb-4">
            Powered by NotesAI — Capture your thoughts with AI.
          </p>
          <Link href="/signup">
            <button className="px-6 py-2.5 rounded-full bg-foreground text-background font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-foreground/10">
              Get Started for Free
            </button>
          </Link>
        </div>
      </main>

      <footer className="py-8 border-t border-border/50 bg-background/40">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            &copy; {new Date().getFullYear()} NotesAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
