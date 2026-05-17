"use client";

import Link from "next/link";
import { NotebookPen } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GithubIcon,
  Linkedin01Icon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center gap-12 mb-12">
          <div className="">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground group-hover:rotate-6 transition-transform">
                <NotebookPen className="w-4 h-4" />
              </div>
              <span className="font-bold text-xl tracking-tight">NotesAI</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
              The intelligent note-taking platform for modern teams. Write,
              collaborate, and organize with AI-powered tools.
            </p>
            <div className="flex items-center gap-4">
              <SocialLink
                href="https://x.com/I_am_Jeet5"
                icon={NewTwitterIcon}
              />
              <SocialLink
                href="https://github.com/JeetDas5"
                icon={GithubIcon}
              />
              <SocialLink
                href="https://www.linkedin.com/in/jeet-das-7633a52ab/"
                icon={Linkedin01Icon}
              />
            </div>
          </div>

          <div className="md:mr-4">
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">
              Product
            </h4>
            <ul className="space-y-4">
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="https://github.com/JeetDas5/notes-app">
                Documentation
              </FooterLink>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-left md:items-center gap-4">
          <p className="text-sm text-muted-foreground font-medium">
            © {currentYear} All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground font-medium">
            Built by
            <span className="text-sm text-accent-foreground font-medium ml-2 hover:underline">
              <Link
                href="https://github.com/JeetDas5"
                target="_blank"
                rel="noopener noreferrer"
              >
                Jeet Das
              </Link>
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Crafted with passion for better productivity.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm text-muted-foreground hover:text-black/80 dark:hover:text-white/80 transition-colors font-medium"
      >
        {children}
      </Link>
    </li>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SocialLink({ href, icon: Icon }: { href: string; icon: any }) {
  return (
    <Link
      href={href}
      className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
    >
      <HugeiconsIcon icon={Icon} size={18} />
    </Link>
  );
}
