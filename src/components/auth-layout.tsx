"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { NotebookPen } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between h-16 border-b border-border px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-accent-foreground shadow-lg shadow-accent/20 group-hover:rotate-6 transition-transform duration-300">
            <NotebookPen className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
            NotesAI
          </span>
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
