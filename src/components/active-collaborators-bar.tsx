"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCollaborationStore, type CollaboratorUser } from "@/store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Wifi, WifiOff } from "lucide-react";

interface ActiveCollaboratorsBarProps {
  currentUserId: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0] || "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ActiveCollaboratorsBar({
  currentUserId,
}: ActiveCollaboratorsBarProps) {
  const { activeUsers, isConnected } = useCollaborationStore();

  // Others in the room (exclude self)
  const others = activeUsers.filter((u) => u.userId !== currentUserId);

  if (activeUsers.length === 0 && isConnected) return null;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-2">
        {/* Connection status dot */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                isConnected
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {isConnected ? (
                <Wifi className="w-2.5 h-2.5" />
              ) : (
                <WifiOff className="w-2.5 h-2.5" />
              )}
              <span className="hidden sm:inline">
                {isConnected ? "Live" : "Offline"}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {isConnected
              ? `${activeUsers.length} ${activeUsers.length === 1 ? "person" : "people"} in this note`
              : "Connecting to collaboration server..."}
          </TooltipContent>
        </Tooltip>

        {/* Stacked avatars for other active users */}
        <AnimatePresence>
          {others.length > 0 && (
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {others.slice(0, 4).map((user, idx) => (
                  <motion.div
                    key={user.socketId}
                    initial={{ opacity: 0, scale: 0.5, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: -10 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar
                          className="h-7 w-7 border-2 border-background cursor-default shadow-sm"
                          style={{ borderColor: user.color + "40" }}
                        >
                          <AvatarFallback
                            className="text-[9px] font-bold text-white"
                            style={{ backgroundColor: user.color }}
                          >
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs">
                        <span className="font-semibold">{user.name}</span>
                        <span className="text-muted-foreground ml-1">
                          is editing
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  </motion.div>
                ))}
              </div>
              {others.length > 4 && (
                <div className="ml-1 text-[10px] font-bold text-muted-foreground">
                  +{others.length - 4}
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
