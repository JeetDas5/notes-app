import db from "@/db";
import { users, notes, notesCollborator } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/user";

type Params = Promise<{ id: string }>;

export async function POST(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, role = "editor" } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { id: noteId } = await params;

    // Only note owner can invite collaborators
    const note = await db.query.notes.findFirst({
      where: and(eq(notes.id, noteId), eq(notes.userId, currentUser.userId)),
    });

    if (!note) {
      return NextResponse.json(
        { error: "Note not found or you don't have permission" },
        { status: 404 }
      );
    }

    const invitedUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!invitedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (invitedUser.id === currentUser.userId) {
      return NextResponse.json(
        { error: "You cannot invite yourself" },
        { status: 400 }
      );
    }

    // Check if already a collaborator
    const existing = await db.query.notesCollborator.findFirst({
      where: and(
        eq(notesCollborator.noteId, noteId),
        eq(notesCollborator.userId, invitedUser.id)
      ),
    });

    if (existing) {
      return NextResponse.json(
        { error: "User is already a collaborator" },
        { status: 409 }
      );
    }

    await db.insert(notesCollborator).values({
      noteId: note.id,
      userId: invitedUser.id,
      role: role === "viewer" ? "viewer" : "editor",
    });

    return NextResponse.json({
      success: true,
      message: "Collaborator added successfully",
      collaborator: {
        userId: invitedUser.id,
        name: invitedUser.name,
        email: invitedUser.email,
        role,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to add collaborator" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: noteId } = await params;

    // Check if user owns or collaborates on this note
    const note = await db.query.notes.findFirst({
      where: eq(notes.id, noteId),
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const isOwner = note.userId === currentUser.userId;
    const isCollaborator = !isOwner
      ? !!(await db.query.notesCollborator.findFirst({
          where: and(
            eq(notesCollborator.noteId, noteId),
            eq(notesCollborator.userId, currentUser.userId)
          ),
        }))
      : false;

    if (!isOwner && !isCollaborator) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const collaborators = await db.query.notesCollborator.findMany({
      where: eq(notesCollborator.noteId, noteId),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      collaborators,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to get collaborators" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
