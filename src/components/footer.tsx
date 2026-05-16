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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-12">
          <div className="col-span-2 lg:col-span-2">
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
              <SocialLink href="#" icon={NewTwitterIcon} />
              <SocialLink href="#" icon={GithubIcon} />
              <SocialLink href="#" icon={Linkedin01Icon} />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">
              Product
            </h4>
            <ul className="space-y-4">
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#pricing">Pricing</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6">
              Legal
            </h4>
            <ul className="space-y-4">
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground font-medium">
            © {currentYear} NotesAI Inc. All rights reserved.
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
