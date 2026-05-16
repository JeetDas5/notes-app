"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { NotebookPen } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-accent-foreground shadow-lg shadow-accent/20 group-hover:rotate-6 transition-transform duration-300">
              <NotebookPen className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
              NotesAI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#faq">FAQ</NavLink>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" asChild className="font-semibold px-4">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-5 shadow-lg shadow-accent/10"
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
            <Button size="sm" asChild className="sm:hidden bg-accent font-bold">
              <Link href="/signup">Start</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
    >
      {children}
      <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
    </Link>
  );
}
