"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLogout, useCurrentUser } from "@/hooks";
import {
  LogOut,
  NotebookPen,
  LayoutDashboard,
  ChevronDown,
  UserPlus,
} from "lucide-react";
import { ActiveCollaboratorsBar } from "./active-collaborators-bar";
import { InviteCollaboratorDialog } from "./invite-collaborator-dialog";

interface WorkspaceHeaderProps {
  noteTitle?: string;
  noteId?: string;
  isOwner?: boolean;
  collaboratorRole?: "editor" | "viewer" | null;
}

export function WorkspaceHeader({
  noteTitle = "Untitled Note",
  noteId,
  isOwner = false,
  collaboratorRole = null,
}: WorkspaceHeaderProps) {
  const { data: userData } = useCurrentUser();
  const { mutate: logout } = useLogout();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const user = userData?.user;
  const userInitials = (user?.name || user?.email || "U")
    .split("@")[0]
    .split(".")
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <>
      <header className="flex items-center justify-between h-14 border-b border-border/50 px-4 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-2 group shrink-0">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-accent-foreground shadow-lg shadow-accent/20 group-hover:rotate-6 transition-transform">
              <NotebookPen className="w-3.5 h-3.5" />
            </div>
          </Link>
          <div className="h-4 w-px bg-border/50 hidden sm:block shrink-0" />
          <h1 className="text-sm font-bold truncate max-w-[150px] sm:max-w-sm">
            {noteTitle}
          </h1>
          {/* Role badge — shown to non-owners when a note is open */}
          {noteId && !isOwner && collaboratorRole && (
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border ${
                collaboratorRole === "editor"
                  ? "bg-accent/10 text-accent border-accent/20"
                  : "bg-amber-500/10 text-amber-500 border-amber-500/20"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  collaboratorRole === "editor" ? "bg-accent" : "bg-amber-500"
                }`}
              />
              {collaboratorRole === "editor" ? "Editor" : "Viewer"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 ml-4">
          {/* Live collaborators */}
          {noteId && user?.id && (
            <ActiveCollaboratorsBar currentUserId={user.id} />
          )}

          {/* Invite button — only for owners */}
          {noteId && isOwner && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 rounded-lg border-border/50 text-xs font-bold px-3 hover:bg-accent/10 hover:border-accent/30 hover:text-accent transition-all hidden sm:flex"
              onClick={() => setIsInviteOpen(true)}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite</span>
            </Button>
          )}

          <ThemeToggle />
          <div className="h-4 w-px bg-border/50" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-muted/50 rounded-lg pl-1 pr-2 py-1 transition-all outline-none border border-transparent focus:border-accent/20">
                <Avatar className="h-7 w-7 border border-border/50">
                  <AvatarFallback className="bg-accent/10 text-gray-500 text-[10px] font-bold uppercase">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 p-1.5 rounded-xl border-border/50 shadow-2xl"
            >
              <div className="px-2 py-2 mb-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  Signed in as
                </p>
                <p className="text-sm font-bold truncate">{user?.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-border/50" />

              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2.5 py-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold">Dashboard</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-border/50" />

              <DropdownMenuItem
                onClick={() => logout()}
                className="rounded-lg cursor-pointer py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs font-bold">Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Invite Dialog */}
      {noteId && (
        <InviteCollaboratorDialog
          isOpen={isInviteOpen}
          onClose={() => setIsInviteOpen(false)}
          noteId={noteId}
          noteTitle={noteTitle}
          isOwner={isOwner}
        />
      )}
    </>
  );
}
