"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  useInviteCollaborator,
  useRemoveCollaborator,
  useCollaborators,
  type Collaborator,
} from "@/hooks";
import { toast } from "sonner";
import {
  UserPlus,
  Mail,
  Trash2,
  Shield,
  Loader2,
  Users,
  Copy,
  Check,
} from "lucide-react";

interface InviteCollaboratorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  noteId: string;
  noteTitle: string;
  isOwner: boolean;
}

export function InviteCollaboratorDialog({
  isOpen,
  onClose,
  noteId,
  noteTitle,
  isOwner,
}: InviteCollaboratorDialogProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("editor");
  const [copied, setCopied] = useState(false);

  const { data: collaboratorsData, isLoading: isLoadingCollaborators } =
    useCollaborators(noteId);
  const { mutate: inviteCollaborator, isPending: isInviting } =
    useInviteCollaborator(noteId);
  const { mutate: removeCollaborator, isPending: isRemoving } =
    useRemoveCollaborator(noteId);

  const collaborators = collaboratorsData?.collaborators || [];

  const handleInvite = () => {
    if (!email.trim()) return;
    inviteCollaborator(
      { email: email.trim(), role },
      {
        onSuccess: (data) => {
          toast.success(`${data.collaborator.name} added as ${role}`);
          setEmail("");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to add collaborator");
        },
      }
    );
  };

  const handleRemove = (collaborator: Collaborator) => {
    removeCollaborator(collaborator.userId, {
      onSuccess: () => {
        toast.success(`${collaborator.user.name} removed`);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to remove collaborator");
      },
    });
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Link copied to clipboard");
  };

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden rounded-2xl border-border/50 shadow-2xl">
        <div className="px-6 pt-6 pb-4 bg-linear-to-br from-accent/10 via-background to-background border-b border-border/40">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">
                  Collaborate
                </DialogTitle>
                <p className="text-[11px] text-muted-foreground truncate max-w-[280px]">
                  {noteTitle}
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5">
          {/* Invite section — only for owner */}
          {isOwner && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Invite people
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                    className="pl-9 h-10 text-sm bg-muted/30 border-border/50 focus-visible:ring-accent/30 rounded-xl"
                  />
                </div>
                <div className="flex gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setRole(role === "editor" ? "viewer" : "editor")
                    }
                    className="h-10 px-3 rounded-xl text-xs font-bold border-border/50 gap-1.5"
                  >
                    {role === "editor" ? (
                      <>
                        <Shield className="w-3 h-3 text-white" />
                        Editor
                      </>
                    ) : (
                      <>
                        <Shield className="w-3 h-3 text-gray-500" />
                        Viewer
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleInvite}
                    disabled={!email.trim() || isInviting}
                    className="h-10 px-4 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-bold cursor-pointer"
                  >
                    {isInviting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <UserPlus className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Collaborators list */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                People with access
              </p>
              {collaborators.length > 0 && (
                <span className="text-[10px] font-bold text-muted-foreground/60 bg-muted/50 px-2 py-0.5 rounded-full">
                  {collaborators.length}{" "}
                  {collaborators.length === 1 ? "person" : "people"}
                </span>
              )}
            </div>

            {isLoadingCollaborators ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 animate-pulse"
                  >
                    <div className="w-8 h-8 rounded-full bg-muted/50" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-muted/50 rounded w-1/3" />
                      <div className="h-2.5 bg-muted/30 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : collaborators.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No collaborators yet</p>
              </div>
            ) : (
              <AnimatePresence>
                <div className="space-y-1.5">
                  {collaborators.map((c) => (
                    <motion.div
                      key={c.userId}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors group"
                    >
                      <Avatar className="h-8 w-8 border border-border/40">
                        <AvatarFallback className="text-[10px] font-bold bg-accent/10 text-accent">
                          {getInitials(c.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {c.user.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {c.user.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                            c.role === "editor"
                              ? "bg-accent/10 text-white"
                              : "bg-muted text-gray-500"
                          }`}
                        >
                          {c.role}
                        </span>
                        {isOwner && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleRemove(c)}
                            disabled={isRemoving}
                          >
                            {isRemoving ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>

          {/* Copy link */}
          <div className="pt-2 border-t border-border/40">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="w-full h-9 rounded-xl border-border/50 text-xs font-semibold gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy note link
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
