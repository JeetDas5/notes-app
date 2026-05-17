// Custom Next.js server with Socket.io for realtime collaboration
import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  // Track active users per note room
  /** @type {Map<string, Map<string, { userId: string; name: string; email: string; color: string; cursor?: number }>>} */
  const noteRooms = new Map();

  const USER_COLORS = [
    "#6366f1", // indigo
    "#f59e0b", // amber
    "#10b981", // emerald
    "#ef4444", // red
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#f97316", // orange
    "#ec4899", // pink
  ];

  function getColorForUser(index) {
    return USER_COLORS[index % USER_COLORS.length];
  }

  io.on("connection", (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // User joins a note room
    socket.on("join-note", ({ noteId, userId, name, email }) => {
      if (!noteId || !userId) return;

      socket.join(noteId);

      // Track this user in the room
      if (!noteRooms.has(noteId)) {
        noteRooms.set(noteId, new Map());
      }

      const room = noteRooms.get(noteId);
      const colorIndex = room.size;

      room.set(socket.id, {
        userId,
        name: name || email?.split("@")[0] || "User",
        email: email || "",
        color: getColorForUser(colorIndex),
      });

      // Notify everyone in room about updated user list
      const users = Array.from(room.entries()).map(([sid, u]) => ({
        socketId: sid,
        ...u,
      }));

      io.to(noteId).emit("room-users", { noteId, users });

      console.log(
        `[Socket.io] User ${name} joined note room: ${noteId}. Total: ${room.size}`
      );
    });

    // User is editing — broadcast content change to other collaborators
    socket.on(
      "note-content-change",
      ({ noteId, title, content, senderId }) => {
        if (!noteId) return;
        // Broadcast to everyone in the room EXCEPT the sender
        socket.to(noteId).emit("note-updated", { noteId, title, content, senderId });
      }
    );

    // Cursor position update
    socket.on("cursor-update", ({ noteId, position, userId }) => {
      if (!noteId) return;
      const room = noteRooms.get(noteId);
      if (room && room.has(socket.id)) {
        room.get(socket.id).cursor = position;
      }
      socket.to(noteId).emit("cursor-moved", { socketId: socket.id, position, userId });
    });

    // User leaves a note room explicitly
    socket.on("leave-note", ({ noteId }) => {
      if (!noteId) return;
      socket.leave(noteId);

      const room = noteRooms.get(noteId);
      if (room) {
        room.delete(socket.id);
        if (room.size === 0) {
          noteRooms.delete(noteId);
        } else {
          const users = Array.from(room.entries()).map(([sid, u]) => ({
            socketId: sid,
            ...u,
          }));
          io.to(noteId).emit("room-users", { noteId, users });
        }
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);

      // Remove from all rooms
      for (const [noteId, room] of noteRooms.entries()) {
        if (room.has(socket.id)) {
          room.delete(socket.id);
          if (room.size === 0) {
            noteRooms.delete(noteId);
          } else {
            const users = Array.from(room.entries()).map(([sid, u]) => ({
              socketId: sid,
              ...u,
            }));
            io.to(noteId).emit("room-users", { noteId, users });
          }
        }
      }
    });
  });

  httpServer.once("error", (err) => {
    console.error(err);
    process.exit(1);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Socket.io server running`);
  });
});
