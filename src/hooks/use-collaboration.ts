"use client";

import { useEffect, useRef, useCallback } from "react";
import { connectSocket, getSocket } from "@/socket/client";
import { useCollaborationStore, CollaboratorUser } from "@/store";

interface UseCollaborationOptions {
  noteId: string | undefined;
  userId: string | undefined;
  userName: string | undefined;
  userEmail: string | undefined;
  onRemoteUpdate?: (data: {
    title?: string;
    content?: string;
    senderId: string;
  }) => void;
}

export function useCollaboration({
  noteId,
  userId,
  userName,
  userEmail,
  onRemoteUpdate,
}: UseCollaborationOptions) {
  const {
    setConnected,
    setActiveUsers,
    setCurrentNoteId,
    currentNoteId,
  } = useCollaborationStore();

  const prevNoteIdRef = useRef<string | undefined>(undefined);

  // Initialize and connect socket
  useEffect(() => {
    const socket = connectSocket();

    const handleConnect = () => {
      setConnected(true);
    };

    const handleDisconnect = () => {
      setConnected(false);
      setActiveUsers([]);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (socket.connected) {
      setConnected(true);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [setConnected, setActiveUsers]);

  // Join/leave rooms as noteId changes
  useEffect(() => {
    if (!noteId || !userId) return;

    const socket = getSocket();

    // Leave previous room
    if (prevNoteIdRef.current && prevNoteIdRef.current !== noteId) {
      socket.emit("leave-note", { noteId: prevNoteIdRef.current });
    }

    // Join new room
    socket.emit("join-note", {
      noteId,
      userId,
      name: userName,
      email: userEmail,
    });

    setCurrentNoteId(noteId);
    prevNoteIdRef.current = noteId;

    return () => {
      socket.emit("leave-note", { noteId });
      setCurrentNoteId(null);
      setActiveUsers([]);
    };
  }, [noteId, userId, userName, userEmail, setCurrentNoteId, setActiveUsers]);

  // Listen for room user updates
  useEffect(() => {
    const socket = getSocket();

    const handleRoomUsers = ({
      noteId: roomNoteId,
      users,
    }: {
      noteId: string;
      users: CollaboratorUser[];
    }) => {
      if (roomNoteId === noteId) {
        setActiveUsers(users);
      }
    };

    socket.on("room-users", handleRoomUsers);

    return () => {
      socket.off("room-users", handleRoomUsers);
    };
  }, [noteId, setActiveUsers]);

  // Listen for remote note updates
  useEffect(() => {
    const socket = getSocket();

    const handleNoteUpdated = (data: {
      noteId: string;
      title?: string;
      content?: string;
      senderId: string;
    }) => {
      if (data.noteId === noteId && data.senderId !== userId) {
        onRemoteUpdate?.({ title: data.title, content: data.content, senderId: data.senderId });
      }
    };

    socket.on("note-updated", handleNoteUpdated);

    return () => {
      socket.off("note-updated", handleNoteUpdated);
    };
  }, [noteId, userId, onRemoteUpdate]);

  // Emit content changes
  const emitContentChange = useCallback(
    (title: string, content: string) => {
      if (!noteId || !userId) return;
      const socket = getSocket();
      socket.emit("note-content-change", {
        noteId,
        title,
        content,
        senderId: userId,
      });
    },
    [noteId, userId]
  );

  return { emitContentChange };
}
